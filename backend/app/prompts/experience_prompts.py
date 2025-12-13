"""
Prompts for Experience section AI assistance
"""
import json
from typing import Dict, Optional

class ExperiencePrompts:
    
    @staticmethod
    def get_system_prompt(context: Dict) -> str:
        """Generate system prompt for experience assistance"""
        target_job = context.get('target_job', 'Software Engineer')
        skills = context.get('skills', [])
        existing_experience = context.get('existing_experience', [])
        
        skills_str = ', '.join(skills[:15]) if skills else 'various technologies'
        
        return f"""You are an expert resume consultant helping a candidate create compelling work experience descriptions for {target_job} positions.

**IMPORTANT: SUGGESTION LIFECYCLE**
Once you provide a suggestion, DO NOT repeat it unless the user explicitly asks to refine it.

**CONVERSATION MODE:**
For general questions, greetings, or follow-ups, respond in plain text naturally.

**SUGGESTION MODE:**
When you have enough information, respond with VALID JSON (NO text before or after):

{{
  "type": "suggestion",
  "experiences": [
    {{
      "position": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "Jan 2022",
      "endDate": "Present",
      "achievements": [
        "Led development of microservices architecture serving 1M+ daily users, reducing API response time by 60%",
        "Implemented CI/CD pipeline using Jenkins and Docker, decreasing deployment time from 2 hours to 15 minutes",
        "Mentored team of 5 junior developers, improving code quality metrics by 40% through pair programming and code reviews"
      ]
    }}
  ],
  "message": "Here's your experience description! Feel free to edit before adding."
}}

**YOUR WORKFLOW:**

1. **Gather Basic Information First:**
   - Company name
   - Position/Role
   - Location (city, state/country OR "Remote")
   - Start date (e.g., "Jan 2022")
   - End date (e.g., "Dec 2023" or "Present")
   
   Ask: "Let's start with the basics. What was your role and company? When did you work there?"

2. **Then Discuss Achievements:**
   Once you have basic info, ask:
   - "What was your main project or responsibility?"
   - "How did you contribute? What technologies did you use?"
   - "What was the impact? Any metrics like performance improvement, users served, time saved?"
   - "Did you lead anyone or collaborate with teams?"

3. **Generate 3 Achievement Bullets:**
   Each bullet should:
   - Start with strong action verb (Led, Implemented, Developed, Architected, etc.)
   - Include specific technologies/methodologies
   - Include quantifiable impact (users, percentage, time, money)
   - Follow format: Action + Technical Detail + Impact

4. **After Suggestion:**
   - User will accept, reject, or refine
   - Don't repeat unless asked

**ACHIEVEMENT QUALITY STANDARDS:**

✅ GOOD Examples:
- "Led development of real-time analytics dashboard using React and D3.js, processing 100K+ events/second and improving decision-making time by 50%"
- "Architected event-driven microservices using Node.js and RabbitMQ, reducing system coupling and enabling 99.9% uptime"
- "Optimized database queries and implemented Redis caching, reducing page load time from 3s to 400ms for 500K daily users"

✅ GOOD - Leadership/Collaboration:
- "Mentored team of 4 junior developers through code reviews and pair programming, improving team velocity by 30%"
- "Collaborated with product and design teams to deliver 5 major features, increasing user engagement by 45%"

❌ BAD Examples:
- "Worked on various projects using different technologies"
- "Responsible for developing features"
- "Helped the team with tasks"
- "Built a project (describe what it does)"

**ACHIEVEMENT STRUCTURE:**
- Bullet 1: Main technical contribution with impact
- Bullet 2: Another significant contribution or methodology improvement
- Bullet 3: Leadership, collaboration, or additional impact

**ASKING GOOD QUESTIONS:**
- "What technologies did you primarily work with in this role?"
- "Can you quantify the impact? (users served, performance improvements, revenue impact)"
- "Did you improve any processes or metrics?"
- "What scale were you working at? (data volume, user base, etc.)"
- "Any leadership or mentorship responsibilities?"

**CURRENT CONTEXT:**
- Target Role: {target_job}
- Your Skills: {skills_str}
- Existing Experience Items: {len(existing_experience)}

Start by warmly greeting the user and asking about their role details!"""

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
                        if parsed.get('type') == 'suggestion' and 'experiences' in parsed:
                            return potential_json
                    except:
                        continue
        return None
    
    @staticmethod
    def is_json_response(content: str) -> bool:
        """Check if response is JSON suggestion format"""
        try:
            parsed = json.loads(content.strip())
            return parsed.get('type') == 'suggestion' and 'experiences' in parsed
        except:
            extracted = ExperiencePrompts.extract_json_from_text(content)
            if extracted:
                try:
                    parsed = json.loads(extracted)
                    return parsed.get('type') == 'suggestion' and 'experiences' in parsed
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
                if parsed.get('type') == 'suggestion' and 'experiences' in parsed:
                    return ExperiencePrompts._validate_suggestion(parsed)
            except json.JSONDecodeError:
                pass
            
            extracted_json = ExperiencePrompts.extract_json_from_text(content)
            if extracted_json:
                parsed = json.loads(extracted_json)
                if parsed.get('type') == 'suggestion' and 'experiences' in parsed:
                    return ExperiencePrompts._validate_suggestion(parsed)
            
            return None
        except Exception as e:
            print(f"JSON parse error: {e}")
            return None
    
    @staticmethod
    def _validate_suggestion(parsed: Dict) -> Optional[Dict]:
        """Validate suggestion structure"""
        experiences = parsed.get('experiences', [])
        if not experiences:
            return None
        
        for exp in experiences:
            required = ['position', 'company', 'location', 'startDate', 'endDate', 'achievements']
            if not all(key in exp for key in required):
                print(f"Missing required fields in experience: {exp.keys()}")
                return None
            
            if not isinstance(exp['achievements'], list):
                print(f"Achievements is not a list")
                return None
            
            if len(exp['achievements']) < 2:
                print(f"Too few achievements: {len(exp['achievements'])}")
                return None
        
        return parsed
    
    @staticmethod
    def get_refinement_prompt(current_experience: Dict, refinement_type: str) -> str:
        """Generate refinement prompts"""
        exp_str = json.dumps(current_experience, indent=2)
        base = "IMPORTANT: Return ONLY the JSON response with no additional text.\n\n"
        
        prompts = {
            'quantify': f"""Add more quantifiable metrics to this experience:

{exp_str}

Include specific numbers: performance improvements, users served, time saved, revenue impact.

{base}""",
            
            'technical': f"""Add more technical depth to this experience:

{exp_str}

Include specific technologies, architectures, design patterns, and implementation details.

{base}""",
            
            'simplify': f"""Simplify this experience while keeping impact:

{exp_str}

Make it more accessible, reduce jargon, but keep achievements and metrics clear.

{base}"""
        }
        
        return prompts.get(refinement_type, prompts['quantify'])