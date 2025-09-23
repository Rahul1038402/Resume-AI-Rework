import os
import re
import json
import cohere
import fitz  # PyMuPDF
from docx import Document
from typing import Dict, List, Any, Optional
import time
from dotenv import load_dotenv

load_dotenv()

# Timeout configurations based on analysis complexity
TIMEOUT_CONFIG = {
    "basic_extraction": 25,     # Skills, projects only
    "full_analysis": 35,        # With metrics, scoring
    "job_matching": 45,         # With job comparison
    "complex_analysis": 60,     # Everything + recommendations
}

# Model configurations for speed vs quality tradeoff
MODELS_BY_SPEED = [
    "command-r-08-2024",        # Faster, good quality
    "command-r-plus-08-2024",   # Slower, best quality
]

def get_optimal_timeout(has_job_info: bool, include_recommendations: bool, prompt_length: int) -> int:
    """Calculate optimal timeout based on analysis complexity and prompt length."""
    
    # Base timeout selection
    if include_recommendations and has_job_info:
        base_timeout = TIMEOUT_CONFIG["complex_analysis"]
    elif has_job_info:
        base_timeout = TIMEOUT_CONFIG["job_matching"]
    elif include_recommendations:
        base_timeout = TIMEOUT_CONFIG["full_analysis"]
    else:
        base_timeout = TIMEOUT_CONFIG["basic_extraction"]
    
    # Adjust for prompt length
    if prompt_length > 8000:
        base_timeout += 15
    elif prompt_length > 5000:
        base_timeout += 10
    elif prompt_length > 3000:
        base_timeout += 5
    
    return min(base_timeout, 90)  # Cap at 90 seconds

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract plain text from a PDF resume."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text

def extract_text_from_docx(docx_path: str) -> str:
    """Extract plain text from a DOCX resume."""
    doc = Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

def preprocess_for_speed(resume_text: str, max_length: int = 3000) -> str:
    """Clean and optimize resume text for faster processing."""
    
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', resume_text).strip()
    
    # Remove less important sections for speed
    sections_to_minimize = [
        r'(?i)references?:.*?(?=\n[A-Z][a-z]+:|$)',
        r'(?i)hobbies?.*?(?=\n[A-Z][a-z]+:|$)',
        r'(?i)interests?.*?(?=\n[A-Z][a-z]+:|$)',
        r'(?i)personal\s+information.*?(?=\n[A-Z][a-z]+:|$)',
    ]
    
    for pattern in sections_to_minimize:
        text = re.sub(pattern, '', text, flags=re.DOTALL)
    
    # Intelligent truncation
    if len(text) <= max_length:
        return text
    
    # Try to keep important sections
    important_keywords = ['project', 'experience', 'skill', 'education', 'work', 'technical']
    
    # Find the last occurrence of important keywords within the limit
    truncated = text[:max_length]
    best_cut = max_length
    
    for keyword in important_keywords:
        last_occurrence = truncated.lower().rfind(keyword)
        if last_occurrence > max_length * 0.7:  # Within last 30%
            sentence_end = truncated.find('.', last_occurrence)
            if sentence_end != -1 and sentence_end < best_cut:
                best_cut = sentence_end + 1
    
    return text[:best_cut].strip() + "..."

def create_optimized_prompt(resume_text: str, job_title: str = None, job_description: str = None) -> str:
    """Create a streamlined, fast-processing prompt with complete response structure."""
    
    # Optimize resume text length
    resume_text = preprocess_for_speed(resume_text, 2500)
    
    # Base comprehensive prompt with all required fields
    base_prompt = f"""Analyze this resume and return ONLY valid JSON:

RESUME:
{resume_text}

JSON Structure (return ALL these fields):
{{
    "skills": ["skill1", "skill2"],
    "projects": ["Project 1", "Project 2"],
    "projects_with_skills": {{"Project Name": ["tech1", "tech2"]}},
    "quantifiable_impacts": {{"Project Name": ["metric with numbers"]}},
    "relevant_projects": ["relevant project names"],
    "analysis": {{
        "total_skills_found": 0,
        "total_projects": 0,
        "relevant_projects": 0,
        "skills_with_metrics": 0,
        "achieved_score": 0,
        "max_possible_score": 100
    }}
}}

Rules:
- Extract only explicitly mentioned technical skills
- Include projects with clear technology stacks
- Only include metrics with actual numbers/percentages
- Score: project relevance (40%) + quantifiable metrics (30%) + total skills (30%)
- Return valid JSON only, no explanations"""

    # Add comprehensive job matching if provided
    if job_title:
        job_section = f"""

JOB: {job_title}"""
        
        if job_description:
            # Truncate job description aggressively for speed
            job_desc = preprocess_for_speed(job_description, 1000)
            job_section += f"""
DESCRIPTION: {job_desc}

Based on this job description, extract required skills and analyze match."""
        else:
            job_section += f"""

Analyze what skills are typically required for {job_title} role based on industry standards."""
        
        # Add ALL missing fields from old logic
        job_section += f"""

Add these additional fields to JSON:
{{
    "job_match": {{
        "job_title": "{job_title}",
        "required_skills": ["skill1", "skill2"],
        "matched_skills": ["matched1", "matched2"],
        "missing_skills": ["missing1", "missing2"],
        "extra_skills": ["bonus1", "bonus2"],
        "skill_match_score": 85,
        "avg_project_relevance": 75,
        "overall_relevance_score": 80,
        "overall_fit": "Strong Fit",
        "project_relevance": {{
            "Project Name": {{
                "skills": ["tech1", "tech2"],
                "matched_skills": ["matched1"],
                "matched_skills_count": 1,
                "relevance_score": 80,
                "relevance_label": "Highly Relevant"
            }}
        }}
    }},
    "target_job": "{job_title}",
    "score": 85,
    "matched_skills": {{"React": 0.9, "Python": 0.8}},
    "missing_skills": {{"Docker": 0.7, "AWS": 0.8}},
    "recommendations": [
        "Learn missing skills: [specific skills]",
        "Strengthen projects with [specific improvements]",
        "Focus on [domain-specific advice]"
    ]
}}

Scoring Guidelines:
- Strong Fit (80-100): High skill match + relevant projects + quantifiable impact
- Moderate Fit (50-79): Good skill match OR good projects OR good metrics  
- Weak Fit (0-49): Low skill match AND limited relevant experience

Project Relevance:
- "Highly Relevant" (80-100): 3+ matching core skills
- "Somewhat Relevant" (40-79): 1-2 transferable skills
- "Not Relevant" (0-39): Skills don't align with job requirements"""
        
        base_prompt += job_section
    
    return base_prompt

def call_cohere_with_progressive_timeout(prompt: str, analysis_type: str = "basic") -> str:
    """Call Cohere with progressive timeout strategy and version detection."""
    
    # Calculate optimal timeout
    has_job_info = "JOB:" in prompt
    include_recommendations = "recommendations" in prompt
    optimal_timeout = get_optimal_timeout(has_job_info, include_recommendations, len(prompt))
    
    # Progressive timeouts: try fast first, then optimal, then extended
    timeouts = [
        min(20, optimal_timeout - 10),  # Quick attempt
        optimal_timeout,                 # Optimal timeout
        min(optimal_timeout + 20, 90)   # Extended timeout
    ]
    
    last_error = None
    
    for i, timeout_val in enumerate(timeouts):
        try:
            print(f"Attempt {i+1}: {timeout_val}s timeout...")
            start_time = time.time()
            
            # Try faster model first, then fallback to better model
            model = MODELS_BY_SPEED[0] if i == 0 else MODELS_BY_SPEED[1]
            
            # Create client with specific timeout
            client = cohere.Client(
                api_key=os.environ.get('COHERE_API_KEY'),
                timeout=timeout_val
            )
            
            # Try different API methods based on SDK version
            response_text = None
            
            # Try v5+ syntax first (message parameter)
            try:
                response = client.chat(
                    model=model,
                    message=prompt,
                    temperature=0.0,
                    max_tokens=2000,  # Increased for complete response
                )
                response_text = response.text
            
            except TypeError as te:
                if "unexpected keyword argument 'message'" in str(te):
                    # Try v4 syntax (messages parameter)
                    print("Using v4 syntax with messages parameter...")
                    response = client.chat(
                        model=model,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.0,
                        max_tokens=2000,
                    )
                    response_text = response.message.content
                else:
                    raise te
            
            except AttributeError as ae:
                if "chat" in str(ae):
                    # Fall back to generate API
                    print("Chat API not available, using generate API...")
                    response = client.generate(
                        model="command-r-plus",
                        prompt=prompt,
                        max_tokens=2000,
                        temperature=0.0,
                    )
                    response_text = response.generations[0].text
                else:
                    raise ae
            
            if response_text:
                elapsed = time.time() - start_time
                print(f"✓ Success in {elapsed:.1f}s using {model}")
                return response_text
            
        except Exception as e:
            last_error = e
            error_msg = str(e).lower()
            
            print(f"✗ Attempt {i+1} failed: {error_msg[:100]}...")
            
            # Only retry on timeout/rate limit errors
            if any(keyword in error_msg for keyword in ["timeout", "rate limit", "connection"]):
                if i < len(timeouts) - 1:
                    print(f"Retrying with longer timeout...")
                    time.sleep(2)
                    continue
            
            # For other errors, don't retry
            break
    
    # If all attempts failed
    raise Exception(f"API call failed after {len(timeouts)} attempts. Last error: {str(last_error)}")

def parse_cohere_response(response_text: str) -> Dict[str, Any]:
    """Parse and validate Cohere's JSON response with complete field validation."""
    try:
        response_text = response_text.strip()
        
        # Find JSON bounds more reliably
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start == -1 or json_end == 0:
            raise ValueError("No JSON object found")
        
        json_str = response_text[json_start:json_end]
        result = json.loads(json_str)
        
        # Validate and ensure ALL required fields from old logic
        required_fields = {
            "skills": [],
            "projects": [],
            "projects_with_skills": {},
            "quantifiable_impacts": {},
            "relevant_projects": [],
            "analysis": {
                "total_skills_found": 0,
                "total_projects": 0,
                "relevant_projects": 0,
                "skills_with_metrics": 0,
                "achieved_score": 0,
                "max_possible_score": 100
            }
        }
        
        for field, default_value in required_fields.items():
            if field not in result:
                result[field] = default_value
        
        # Ensure relevant_projects is populated if missing
        if not result.get("relevant_projects"):
            result["relevant_projects"] = result.get("projects", [])
        
        # Update analysis counts to match actual data
        if "analysis" in result:
            analysis = result["analysis"]
            analysis["total_skills_found"] = len(result.get("skills", []))
            analysis["total_projects"] = len(result.get("projects", []))
            analysis["relevant_projects"] = len(result.get("relevant_projects", []))
            analysis["skills_with_metrics"] = len(result.get("quantifiable_impacts", {}))
            
            # Recalculate score if missing or zero
            if analysis.get("achieved_score", 0) == 0:
                total_projects = analysis["total_projects"]
                if total_projects > 0:
                    # Use the same scoring logic as old version
                    project_score = (analysis["relevant_projects"] / total_projects) * 40
                    metrics_score = min((analysis["skills_with_metrics"] / total_projects) * 30, 30)
                    skills_score = min((analysis["total_skills_found"] / 20) * 30, 30)
                    analysis["achieved_score"] = round(project_score + metrics_score + skills_score, 2)
        
        # Ensure job matching fields have proper structure when present
        if "job_match" in result:
            job_match_defaults = {
                "job_title": "",
                "required_skills": [],
                "matched_skills": [],
                "missing_skills": [],
                "extra_skills": [],
                "skill_match_score": 0,
                "avg_project_relevance": 0,
                "overall_relevance_score": 0,
                "overall_fit": "Weak Fit",
                "project_relevance": {}
            }
            
            for field, default_value in job_match_defaults.items():
                if field not in result["job_match"]:
                    result["job_match"][field] = default_value
        
        return result
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing failed: {str(e)}")
        return create_comprehensive_fallback_analysis(response_text)
    except Exception as e:
        print(f"Response parsing error: {str(e)}")
        return create_comprehensive_fallback_analysis(response_text)

def create_comprehensive_fallback_analysis(text: str) -> Dict[str, Any]:
    """Create a complete analysis structure with all fields if JSON parsing fails."""
    return {
        "skills": [],
        "projects": [],
        "projects_with_skills": {},
        "quantifiable_impacts": {},
        "relevant_projects": [],
        "analysis": {
            "total_skills_found": 0,
            "total_projects": 0,
            "relevant_projects": 0,
            "skills_with_metrics": 0,
            "achieved_score": 0,
            "max_possible_score": 100
        },
        "error": "Failed to parse AI response - please try again",
        "raw_response": text[:300] if text else "No response received"
    }

def analyze_resume_with_cohere(file_path: str, job_title: str = None, job_skills: List[str] = None, 
                             job_description: str = None, profile: str = "general") -> Dict[str, Any]:
    """
    Optimized resume analysis with complete response structure and smart timeout handling.
    """
    try:
        print("🚀 Starting optimized resume analysis...")
        
        # Extract text
        if file_path.endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
        elif file_path.endswith(".docx"):
            text = extract_text_from_docx(file_path)
        else:
            raise ValueError("Unsupported file format. Only .pdf and .docx supported.")
        
        if not text.strip():
            raise ValueError("No text could be extracted from the file.")
        
        print(f"📄 Extracted {len(text)} characters from resume")
        
        # Create optimized prompt with complete structure
        prompt = create_optimized_prompt(text, job_title, job_description)
        print(f"📝 Generated {len(prompt)} character prompt")
        
        # Determine analysis type for timeout calculation
        analysis_type = "complex" if job_title and job_description else "basic"
        
        # Call API with progressive timeout strategy
        response_text = call_cohere_with_progressive_timeout(prompt, analysis_type)
        
        # Parse response with complete field validation
        result = parse_cohere_response(response_text)
        
        # Add metadata
        result["processing_info"] = {
            "resume_length": len(text),
            "prompt_length": len(prompt),
            "analysis_type": analysis_type,
            "timestamp": time.time()
        }
        
        print("✅ Analysis completed successfully")
        return result
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Analysis failed: {error_msg}")
        
        return {
            "skills": [],
            "projects": [],
            "projects_with_skills": {},
            "quantifiable_impacts": {},
            "relevant_projects": [],
            "analysis": {
                "total_skills_found": 0,
                "total_projects": 0,
                "relevant_projects": 0,
                "skills_with_metrics": 0,
                "achieved_score": 0,
                "max_possible_score": 100
            },
            "error": f"Analysis failed: {error_msg}",
            "processing_info": {
                "error_time": time.time(),
                "analysis_type": "failed"
            }
        }

def test_cohere_connection() -> bool:
    """Test Cohere API connection with optimized settings and version detection."""
    try:
        print("🔧 Testing Cohere connection...")
        
        client = cohere.Client(
            api_key=os.environ.get('COHERE_API_KEY'),
            timeout=10  # Short timeout for test
        )
        
        # Try different API methods
        response_text = None
        
        try:
            # Try v5+ syntax first
            response = client.chat(
                model="command-r-08-2024",  # Use faster model for test
                message="Reply with just: 'Connection OK'",
                temperature=0.0,
                max_tokens=10
            )
            response_text = response.text
        except TypeError:
            try:
                # Try v4 syntax
                response = client.chat(
                    model="command-r-08-2024",
                    messages=[{"role": "user", "content": "Reply with just: 'Connection OK'"}],
                    temperature=0.0,
                    max_tokens=10
                )
                response_text = response.message.content
            except AttributeError:
                # Fall back to generate API
                response = client.generate(
                    model="command-r-plus",
                    prompt="Reply with just: 'Connection OK'",
                    max_tokens=10,
                    temperature=0.0
                )
                response_text = response.generations[0].text
        
        success = response_text and "connection ok" in response_text.lower()
        print(f"✅ Connection test: {'PASSED' if success else 'FAILED'}")
        return success
        
    except Exception as e:
        print(f"❌ Connection test failed: {str(e)}")
        return False

# Backwards compatibility
analyze_resume = analyze_resume_with_cohere