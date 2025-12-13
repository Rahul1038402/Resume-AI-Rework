"""
Prompts for Skills section AI assistance
"""
import json
from typing import Dict, List, Optional

class SkillsPrompts:
    
    @staticmethod
    def get_system_prompt(context: Dict) -> str:
        target_job = context.get('target_job', 'Software Engineer')
        existing_skills = context.get('existing_skills', [])
        
        return f"""You are an expert resume consultant helping a candidate organize their technical skills for {target_job} positions.

**⚠️ CRITICAL JSON RESPONSE RULES - READ FIRST ⚠️**

When providing a suggestion, you MUST respond with ONLY the raw JSON object:

❌ WRONG:
"Since you don't have a job description, let's focus on organizing your skills:
{{"type": "suggestion", "skills": [...]}}"

✅ CORRECT:
{{"type": "suggestion", "skills": [...], "message": "Here are your skills organized by category!"}}

RULES:
1. NO text before or after the JSON
2. ALL commentary goes in the "message" field
3. Choose ONE mode per response: CONVERSATION (plain text) OR SUGGESTION (pure JSON)

**IMPORTANT: SUGGESTION LIFECYCLE**
Once you provide a suggestion, DO NOT repeat it unless the user explicitly asks to refine it.

**CONVERSATION MODE:**
For general questions, greetings, or follow-ups, respond in plain text naturally.

**SUGGESTION MODE:**
When you have enough information, respond with VALID JSON (NO text before or after):

{{
  "type": "suggestion",
  "skills": [
    {{"name": "Languages", "value": "Python, JavaScript, TypeScript, Java"}},
    {{"name": "Frameworks", "value": "React, Node.js, Django, Spring Boot"}},
    {{"name": "Databases", "value": "PostgreSQL, MongoDB, Redis"}},
    {{"name": "Tools & Platforms", "value": "Docker, AWS, Git, Jenkins"}}
  ],
  "message": "Here are your skills organized by category! Edit as needed."
}}

**SKILL CATEGORIES TO USE:**
- Languages (Python, JavaScript, Java, etc.)
- Frameworks & Libraries (React, Django, Spring, etc.)
- Databases (PostgreSQL, MongoDB, MySQL, etc.)
- Cloud & DevOps (AWS, Docker, Kubernetes, CI/CD)
- Tools & Platforms (Git, Jira, VS Code, etc.)
- Concepts & Methodologies (Agile, OOP, Microservices, etc.)

**YOUR WORKFLOW:**

1. **Check for Job Description:**
   - First ask: "Do you have a job description you're targeting? If yes, please share it."
   - If YES with JD: Extract ALL technical skills mentioned → Ask user which they know
   - If NO JD: Ask about their target role and discuss their skills

2. **Extract Skills from JD (if provided):**
   - Parse JD for technical skills
   - Group them by category
   - Present to user: "I found these skills in the JD. Which ones do you know?"
   - Let user confirm/modify list

3. **If No JD - Gather Skills:**
   - Ask: "What programming languages do you know?"
   - Ask: "What frameworks/libraries have you worked with?"
   - Ask: "What databases and cloud platforms?"
   - Ask: "Any other tools or technologies?"

4. **Organize and Prioritize:**
   - Group skills into logical categories
   - Put most relevant skills for the role first in each category
   - Include 4-6 categories (not too many)
   - Each category should have 3-6 skills (not too cluttered)

5. **After Suggestion:**
   - User reviews and can add/remove skills
   - Don't repeat unless asked

**QUALITY GUIDELINES:**

✅ GOOD Organization:
- Languages: Python, JavaScript, Java, C++
- Frameworks: React, Node.js, Django, Flask
- Databases: PostgreSQL, MongoDB, Redis
- Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes

✅ GOOD - Role-specific prioritization (for Backend role):
- Languages: Python, Java, Go
- Frameworks: Django, Spring Boot, FastAPI
- Databases: PostgreSQL, MongoDB, Redis, Elasticsearch

❌ BAD - Too generic or messy:
- Technical Skills: Python, git, Agile, AWS, React, good communication
- Skills: Everything mixed together with soft skills

❌ BAD - Too many categories or too sparse:
- 10 different categories with 1-2 skills each

**JD ANALYSIS EXAMPLE:**

User shares JD mentioning: "Python, Django, React, PostgreSQL, AWS, Docker, REST APIs, Git"

Your response:
"I found these skills in the job description:
- Languages: Python
- Frameworks: Django, React
- Databases: PostgreSQL
- Cloud & DevOps: AWS, Docker
- Other: REST APIs, Git

Which of these do you know? Also, do you have any additional skills not listed here?"

**CURRENT CONTEXT:**
- Target Role: {target_job}
- Existing Skills: {len(existing_skills)} categories

Start by asking if they have a job description!"""

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
                        if parsed.get('type') == 'suggestion' and 'skills' in parsed:
                            return potential_json
                    except:
                        continue
        return None
    
    @staticmethod
    def is_json_response(content: str) -> bool:
        """Check if response is JSON suggestion format"""
        try:
            parsed = json.loads(content.strip())
            return parsed.get('type') == 'suggestion' and 'skills' in parsed
        except:
            extracted = SkillsPrompts.extract_json_from_text(content)
            if extracted:
                try:
                    parsed = json.loads(extracted)
                    return parsed.get('type') == 'suggestion' and 'skills' in parsed
                except:
                    pass
            return False
    
    @staticmethod
    def parse_json_suggestion(content: str) -> Optional[Dict]:
        """Parse JSON suggestion response"""
        try:
            content_stripped = content.strip()
            
            if content_stripped.startswith('```json'):
                content_stripped = content_stripped[7:]
            if content_stripped.startswith('```'):
                content_stripped = content_stripped[3:]
            if content_stripped.endswith('```'):
                content_stripped = content_stripped[:-3]
            
            content_stripped = content_stripped.strip()
            
            try:
                parsed = json.loads(content_stripped)
                if parsed.get('type') == 'suggestion' and 'skills' in parsed:
                    return SkillsPrompts._validate_suggestion(parsed)
            except json.JSONDecodeError:
                pass
            
            extracted_json = SkillsPrompts.extract_json_from_text(content)
            if extracted_json:
                parsed = json.loads(extracted_json)
                if parsed.get('type') == 'suggestion' and 'skills' in parsed:
                    return SkillsPrompts._validate_suggestion(parsed)
            
            return None
        except Exception as e:
            print(f"JSON parse error: {e}")
            return None
    
    @staticmethod
    def _validate_suggestion(parsed: Dict) -> Optional[Dict]:
        """Validate suggestion structure"""
        skills = parsed.get('skills', [])
        if not skills:
            return None
        
        # Validate each skill category
        for skill in skills:
            if not all(key in skill for key in ['name', 'value']):
                print(f"Missing required fields in skill: {skill.keys()}")
                return None
            
            if not isinstance(skill['name'], str) or not isinstance(skill['value'], str):
                print(f"Invalid types in skill")
                return None
        
        return parsed
    
    @staticmethod
    def get_refinement_prompt(current_skills: List[Dict], refinement_type: str) -> str:
        """Generate refinement prompts"""
        skills_str = json.dumps(current_skills, indent=2)
        base = "IMPORTANT: Return ONLY the JSON response with no additional text.\n\n"
        
        prompts = {
            'add_categories': f"""Add more relevant skill categories to this list:

{skills_str}

Consider adding categories like: Testing, Mobile, Security, Data Science, etc. based on context.

{base}""",
            
            'match_jd': f"""Re-prioritize these skills to better match the job description:

{skills_str}

Put most relevant skills first in each category. Add any missing critical skills.

{base}""",
            
            'prioritize': f"""Reorganize these skills putting the most important ones first:

{skills_str}

Focus on the most in-demand and relevant skills for the role.

{base}"""
        }
        
        return prompts.get(refinement_type, prompts['prioritize'])