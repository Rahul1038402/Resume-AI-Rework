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

# Initialize Cohere client with timeout configurations
co = cohere.Client(
    api_key=os.environ.get('COHERE_API_KEY'),
    timeout=180  # 3 minutes timeout
)

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

def truncate_resume_text(text: str, max_length: int = 8000) -> str:
    """Truncate resume text if it's too long to prevent timeouts."""
    if len(text) <= max_length:
        return text
    
    # Try to truncate intelligently at sentence boundaries
    truncated = text[:max_length]
    last_period = truncated.rfind('.')
    if last_period > max_length * 0.8:  # If we can find a period in the last 20%
        return truncated[:last_period + 1]
    
    return truncated + "..."

def create_analysis_prompt(resume_text: str, job_title: str = None, job_skills: List[str] = None, job_description: str = None) -> str:
    """Create a comprehensive prompt for Cohere to analyze the resume."""
    
    # Truncate resume text to prevent timeouts
    resume_text = truncate_resume_text(resume_text, 6000)
    
    base_prompt = f"""
You are an expert resume analyzer. Analyze the following resume text and extract information in the exact JSON format specified below.

RESUME TEXT:
{resume_text}

Extract the following information and return ONLY a valid JSON object with this exact structure:

{{
    "skills": [list of technical skills found in resume - programming languages, frameworks, tools, etc.],
    "projects": [list of project names/titles only],
    "projects_with_skills": {{
        "Project Name": [list of technologies/skills used in this project]
    }},
    "quantifiable_impacts": {{
        "Project Name": [list of bullet points with numbers/metrics/achievements]
    }},
    "relevant_projects": [list of project names relevant to the job if job info provided],
    "analysis": {{
        "total_skills_found": number,
        "total_projects": number,
        "relevant_projects": number,
        "skills_with_metrics": number,
        "achieved_score": number out of 100,
        "max_possible_score": 100
    }}
}}

IMPORTANT INSTRUCTIONS:
1. For "skills": Extract ALL technical skills explicitly written in the resume (programming languages, frameworks, libraries, tools, platforms, databases, etc.). Do NOT infer or add related technologies if not explicitly mentioned.
2. For "projects": Extract only the main project names/titles (clean titles without descriptions).
3. For "projects_with_skills": Map each project to its technologies ONLY if explicitly listed under "Tech Stack", "Technologies", or similar. If not listed, return an empty array. Do not guess technologies from context.
4. For "quantifiable_impacts": Extract bullet points ONLY if they contain explicit numbers, percentages, metrics, or measurable achievements. If none exist, return an empty list for that project. Do not invent or estimate values.
5. For "relevant_projects": If job info is provided, include projects that explicitly use relevant technologies.
6. Scoring Rules:
   - Project relevance = 40%
   - Quantifiable metrics = 30%
   - Total skills = 30%
   - Normalize each sub-score to its weight. If a category has no data, assign 0.
7. Ensure the final JSON is strictly valid and parsable.

Return ONLY the JSON object, no additional text or explanation.
"""

    if job_title:
        job_info_section = f"""

JOB INFORMATION:
- Job Title: {job_title}"""
        
        if job_description:
            # Also truncate job description to prevent overly long prompts
            job_desc_truncated = truncate_resume_text(job_description, 2000)
            job_info_section += f"""
- Job Description: {job_desc_truncated}

Based on this job description, intelligently identify:
1. Required technical skills (extract from the job description)
2. Preferred skills mentioned
3. Level of experience expected
4. Domain-specific requirements

Then match these requirements against the resume skills."""
        else:
            job_info_section += f"""

Since no job description is provided, analyze what skills would typically be required for a {job_title} role. Consider:
1. Core technical skills for {job_title} (entry to mid-level)
2. Popular frameworks/libraries in this domain
3. Essential tools and platforms
4. Industry-standard practices
5. Both technical and soft skills relevant to this role

Then match these typical requirements against the resume skills."""
            
        base_prompt += job_info_section + f"""

Additionally add these fields to the JSON:
{{
    "job_match": {{
        "job_title": "{job_title}",
        "required_skills": [skills typically required or mentioned in job description for this role],
        "matched_skills": [skills from resume that match job requirements],
        "missing_skills": [required skills not found in resume],
        "extra_skills": [skills in resume that are bonus/additional for this role],
        "skill_match_score": percentage of required skills found in resume,
        "avg_project_relevance": average relevance score of projects (0-100),
        "overall_relevance_score": overall fit score considering skills, projects, and experience level (0-100),
        "overall_fit": "Strong Fit" | "Moderate Fit" | "Weak Fit",
        "project_relevance": {{
            "Project Name": {{
                "skills": [project skills],
                "matched_skills": [skills from this project matching job requirements],
                "matched_skills_count": number,
                "relevance_score": number (0-100),
                "relevance_label": "Highly Relevant" | "Somewhat Relevant" | "Not Relevant"
            }}
        }}
    }},
    "target_job": "{job_title}",
    "score": final compatibility score (0-100),
    "matched_skills": {{"skill_name": relevance_weight}},
    "missing_skills": {{"skill_name": importance_weight}},
    "recommendations": [
        "Based on the job requirements, consider learning [specific missing skills] to strengthen your profile.",
        "Your projects demonstrate [specific strengths], but could benefit from [specific improvements based on role requirements].",
        "To increase competitiveness for {job_title} roles, focus on [domain-specific advice based on current trends]."
    ]
}}

SKILL MATCHING INTELLIGENCE:
- For job descriptions: Extract exact skills mentioned and infer closely related ones
- For job titles only: Use your knowledge of current industry requirements for that role
- Consider skill synonyms (e.g., "JavaScript" matches "JS", "React.js" matches "React")
- Weight skills by importance: core skills > nice-to-have > bonus skills
- Account for skill levels: if resume shows advanced skills, don't penalize for missing basics

RECOMMENDATION INTELLIGENCE:
- Prioritize 2-3 most impactful missing skills rather than listing everything
- Group related technologies (e.g., "Python data science stack: Pandas, NumPy, Scikit-learn")
- Consider career progression (don't recommend basics if person has advanced skills)
- Make suggestions specific to job description requirements if provided
- Focus on high-impact improvements that match industry trends
- Avoid recommending skills already demonstrated in resume

PROJECT RELEVANCE SCORING:
- "Highly Relevant" (80-100): Project directly applicable to job requirements with 3+ matching core skills
- "Somewhat Relevant" (40-79): Project has 1-2 skills that transfer to the job requirements  
- "Not Relevant" (0-39): Project skills don't align with job requirements

OVERALL FIT CALCULATION:
- Strong Fit (80-100): High skill match + relevant projects + quantifiable impact
- Moderate Fit (50-79): Good skill match OR good projects OR good metrics
- Weak Fit (0-49): Low skill match AND limited relevant experience
"""

    return base_prompt

def parse_cohere_response(response_text: str) -> Dict[str, Any]:
    """Parse and validate Cohere's JSON response."""
    try:
        # Clean the response - remove any non-JSON content
        response_text = response_text.strip()
        
        # Find JSON object bounds
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        
        if start_idx == -1 or end_idx == 0:
            raise ValueError("No JSON object found in response")
        
        json_str = response_text[start_idx:end_idx]
        
        # Parse JSON
        result = json.loads(json_str)
        
        # Validate required fields
        required_fields = ["skills", "projects", "projects_with_skills", "quantifiable_impacts", "analysis"]
        for field in required_fields:
            if field not in result:
                result[field] = [] if field != "analysis" else {}
        
        # Ensure analysis has required subfields
        if "analysis" in result:
            analysis_defaults = {
                "total_skills_found": 0,
                "total_projects": 0,
                "relevant_projects": 0,
                "skills_with_metrics": 0,
                "achieved_score": 0,
                "max_possible_score": 100
            }
            for key, default_value in analysis_defaults.items():
                if key not in result["analysis"]:
                    result["analysis"][key] = default_value
        
        return result
        
    except json.JSONDecodeError as e:
        # Fallback: create basic structure from text analysis
        return create_fallback_analysis(response_text)
    except Exception as e:
        raise Exception(f"Error parsing Cohere response: {str(e)}")

def create_fallback_analysis(text: str) -> Dict[str, Any]:
    """Create a basic analysis structure if JSON parsing fails."""
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
        "error": "Failed to parse AI response",
        "raw_response": text[:500]  # First 500 chars for debugging
    }

def enhance_analysis_with_post_processing(result: Dict[str, Any]) -> Dict[str, Any]:
    """Post-process the analysis to ensure data consistency and completeness."""
    
    # Ensure relevant_projects is populated
    if "relevant_projects" not in result or not result["relevant_projects"]:
        result["relevant_projects"] = list(result.get("projects", []))
    
    # Update analysis counts to match actual data
    if "analysis" in result:
        analysis = result["analysis"]
        analysis["total_skills_found"] = len(result.get("skills", []))
        analysis["total_projects"] = len(result.get("projects", []))
        analysis["relevant_projects"] = len(result.get("relevant_projects", []))
        analysis["skills_with_metrics"] = len(result.get("quantifiable_impacts", {}))
        
        # Recalculate score if needed
        if analysis.get("achieved_score", 0) == 0:
            total_projects = analysis["total_projects"]
            if total_projects > 0:
                project_score = (analysis["relevant_projects"] / total_projects) * 40
                metrics_score = min((analysis["skills_with_metrics"] / total_projects) * 30, 30)
                skills_score = min((analysis["total_skills_found"] / 20) * 30, 30)
                analysis["achieved_score"] = round(project_score + metrics_score + skills_score, 2)
    
    return result

def call_cohere_with_retry(prompt: str, max_retries: int = 3) -> str:
    """Call Cohere Chat API with retry logic and exponential backoff."""
    import time

    for attempt in range(max_retries):
        try:
            print(f"Attempt {attempt + 1}: Calling Cohere Chat API...")

            # Chat API call
            response = co.chat(
                model='command-a-03-2025',  # latest recommended model
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0,  # deterministic output for JSON parsing
            )

            # Return the content from AI
            return response.message.content

        except Exception as e:
            error_msg = str(e).lower()

            # Retry only on timeout errors
            if "timeout" in error_msg or "read operation timed out" in error_msg:
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # exponential backoff: 1s, 2s, 4s
                    print(f"Timeout on attempt {attempt + 1}, retrying in {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                else:
                    raise Exception("API timeout after multiple retries") from e
            else:
                # For non-timeout errors, raise immediately
                raise e

    raise Exception("Max retries exceeded")


def analyze_resume_with_cohere(file_path: str, job_title: str = None, job_skills: List[str] = None, job_description: str = None, profile: str = "general") -> Dict[str, Any]:
    """
    Main analysis function using Cohere API with improved timeout handling.
    Returns the same JSON structure as the original analyzer.
    """
    try:
        # Extract text from file
        if file_path.endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
        elif file_path.endswith(".docx"):
            text = extract_text_from_docx(file_path)
        else:
            raise ValueError("Unsupported file format. Only .pdf and .docx are supported.")
        
        if not text.strip():
            raise ValueError("No text could be extracted from the file.")
        
        print(f"Extracted resume text length: {len(text)} characters")
        
        # Create the analysis prompt
        prompt = create_analysis_prompt(text, job_title, job_skills, job_description)
        print(f"Generated prompt length: {len(prompt)} characters")
        
        # Call Cohere API with retry logic
        response_text = call_cohere_with_retry(prompt)
        
        # Parse the response
        result = parse_cohere_response(response_text)
        
        # Post-process to ensure completeness
        result = enhance_analysis_with_post_processing(result)
        
        print("Analysis completed successfully")
        return result
        
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        # Return error in the same format expected by frontend
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
            "error": f"Analysis failed: {str(e)}"
        }

def test_cohere_connection() -> bool:
    """Test if Cohere API is properly configured."""
    try:
        response = co.generate(
            model='command-r-plus',
            prompt="Say 'Hello, Cohere is working!'",
            max_tokens=10,
            temperature=0.1
        )
        return "Hello" in response.generations[0].text
    except Exception as e:
        print(f"Cohere connection test failed: {e}")
        return False

# Backwards compatibility - alias the main function
analyze_resume = analyze_resume_with_cohere