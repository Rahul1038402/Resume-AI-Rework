"""
Prompts for Summary section AI assistance
"""
import json
from typing import Dict, Optional

class SummaryPrompts:
    
    @staticmethod
    def get_system_prompt(context: Dict) -> str:
        target_job = context.get('target_job', 'Software Engineer')
        skills = context.get('skills', [])
        experience = context.get('experience', [])
        
        skills_str = ', '.join(skills[:10]) if skills else 'various technologies'
        exp_years = len(experience) if experience else 0
        
        return f"""You are an expert resume consultant helping a candidate create a compelling professional summary for {target_job} positions.

**⚠️ CRITICAL JSON RESPONSE RULES - READ FIRST ⚠️**

When providing a suggestion, respond with ONLY the raw JSON:

❌ WRONG:
"Here's a professional summary tailored to your experience:
{{"type": "suggestion", "summary": "..."}}"

✅ CORRECT:
{{"type": "suggestion", "summary": "...", "message": "Here's your summary!"}}

RULES:
1. NO text before or after JSON
2. ALL commentary in "message" field
3. One mode per response: CONVERSATION or SUGGESTION

**IMPORTANT: SUGGESTION LIFECYCLE**
Once you provide a suggestion, DO NOT repeat it unless the user explicitly asks to refine it. After providing a suggestion:
- If user says "thanks", "hi", "hello" → Respond naturally and ask if they want to make changes
- If user provides NEW information → Create a NEW suggestion
- DO NOT regenerate the same suggestion

**CONVERSATION MODE:**
For general questions, greetings, or follow-ups, respond in plain text naturally.

**SUGGESTION MODE:**
When you have enough information, respond with VALID JSON in this EXACT format (NO text before or after):

{{
  "type": "suggestion",
  "summary": "Dynamic software engineer with 3+ years building scalable web applications using React and Node.js. Proven track record of reducing load times by 40% and improving user engagement through data-driven optimizations. Passionate about creating efficient, maintainable code.",
  "message": "Here's your professional summary! Feel free to edit before adding."
}}

**SUMMARY REQUIREMENTS:**
- Target length: 40-45 words (STRICT - count words!)
- Include: Role + Experience Level + Key Skills + Main Achievement + Career Focus
- Be specific with technologies and metrics
- Action-oriented and impactful
- Tailored to {target_job} role
- Third-person or first-person (ask user preference)

**YOUR WORKFLOW:**

1. **Check for Job Description:**
   - First ask: "Do you have a job description you're targeting? If yes, please share it."
   - If YES: Extract key requirements and align summary
   - If NO: Ask about their target role

2. **Gather Key Information:**
   - Years of experience
   - Core technical skills/expertise
   - Biggest achievement or impact (with metrics if possible)
   - Career focus or what they're passionate about
   - Industries or domains worked in

3. **Generate Summary:**
   - Keep it to 40-45 words
   - Make it punchy and achievement-focused
   - Include specific technologies/skills
   - Add one quantifiable achievement if available

4. **After Suggestion:**
   - User will accept, reject, or refine
   - Don't repeat unless asked
   - If casual response, engage naturally

**QUALITY EXAMPLES:**

✅ GOOD (44 words):
"Full-stack developer with 4 years building enterprise SaaS applications using React, Node.js, and PostgreSQL. Reduced API response time by 60% and improved system reliability to 99.9% uptime. Passionate about clean architecture and mentoring junior developers in modern development practices."

✅ GOOD (42 words):
"Data engineer specializing in ETL pipelines and cloud infrastructure with 5+ years at tech startups. Processed 100M+ daily records using Python and Apache Spark, reducing data processing costs by 45%. Focused on scalable solutions for real-time analytics."

❌ BAD - Too generic:
"Software engineer with experience in web development. Good at problem-solving and working in teams. Looking for opportunities to grow."

❌ BAD - Too long (60+ words)

**CURRENT CONTEXT:**
- Target Role: {target_job}
- Your Skills: {skills_str}
- Experience Items: {exp_years}

Start by warmly greeting the user and asking if they have a job description!"""

    @staticmethod
    def extract_json_from_text(content: str) -> Optional[str]:
        """Extract JSON from text"""
        brace_depth = 0
        start_idx = -1
        
        for i, char in enumerate(content):
            if char == '{':
                if brace_depth == 0:
                    start_idx = i
                brace_depth += 1
            elif char == '}':
                brace_depth -= 1
                if brace_depth == 0 and start_idx != -1:
                    potential_json = content[start_idx:i+1]
                    try:
                        parsed = json.loads(potential_json)
                        if parsed.get('type') == 'suggestion' and 'summary' in parsed:
                            return potential_json
                    except:
                        continue
        return None
    
    @staticmethod
    def is_json_response(content: str) -> bool:
        """Check if response is JSON suggestion format"""
        try:
            parsed = json.loads(content.strip())
            return parsed.get('type') == 'suggestion' and 'summary' in parsed
        except:
            extracted = SummaryPrompts.extract_json_from_text(content)
            if extracted:
                try:
                    parsed = json.loads(extracted)
                    return parsed.get('type') == 'suggestion' and 'summary' in parsed
                except:
                    pass
            return False
    
    @staticmethod
    def parse_json_suggestion(content: str) -> Optional[Dict]:
        """Parse JSON suggestion response"""
        try:
            content_stripped = content.strip()
            
            # Remove markdown code blocks
            if content_stripped.startswith('```json'):
                content_stripped = content_stripped[7:]
            if content_stripped.startswith('```'):
                content_stripped = content_stripped[3:]
            if content_stripped.endswith('```'):
                content_stripped = content_stripped[:-3]
            
            content_stripped = content_stripped.strip()
            
            # Try direct parse
            try:
                parsed = json.loads(content_stripped)
                if parsed.get('type') == 'suggestion' and 'summary' in parsed:
                    return SummaryPrompts._validate_suggestion(parsed)
            except json.JSONDecodeError:
                pass
            
            # Try extracting JSON
            extracted_json = SummaryPrompts.extract_json_from_text(content)
            if extracted_json:
                parsed = json.loads(extracted_json)
                if parsed.get('type') == 'suggestion' and 'summary' in parsed:
                    return SummaryPrompts._validate_suggestion(parsed)
            
            return None
        except Exception as e:
            print(f"JSON parse error: {e}")
            return None
    
    @staticmethod
    def _validate_suggestion(parsed: Dict) -> Optional[Dict]:
        """Validate suggestion structure"""
        if 'summary' not in parsed:
            return None
        
        summary = parsed['summary']
        if not isinstance(summary, str) or len(summary.strip()) < 20:
            return None
        
        # Count words (rough)
        word_count = len(summary.split())
        if word_count > 60:  # Too long
            print(f"Warning: Summary is {word_count} words (recommended: 40-45)")
        
        return parsed
    
    @staticmethod
    def get_refinement_prompt(current_summary: str, refinement_type: str) -> str:
        """Generate refinement prompts"""
        base = "IMPORTANT: Return ONLY the JSON response with no additional text.\n\n"
        
        prompts = {
            'impactful': f"""Make this summary more impactful and achievement-focused:

"{current_summary}"

Add stronger action verbs and quantifiable achievements if possible. Keep 40-45 words.

{base}""",
            
            'keywords': f"""Add more relevant technical keywords to this summary:

"{current_summary}"

Include specific technologies, methodologies, or industry terms. Keep 40-45 words.

{base}""",
            
            'simplify': f"""Simplify this summary while keeping impact:

"{current_summary}"

Make it more accessible, remove jargon, but keep achievements. Keep 40-45 words.

{base}"""
        }
        
        return prompts.get(refinement_type, prompts['impactful'])