"""
Prompts for Projects section AI assistance
Enforces formatting standards and best practices
"""
import json
import re
from typing import Dict, List, Optional

class ProjectPrompts:
    
    @staticmethod
    def get_system_prompt(context: Dict) -> str:
        target_job = context.get('target_job', 'Software Engineer')
        skills = context.get('skills', [])
        existing_projects = context.get('existing_projects', [])
        
        skills_str = ', '.join(skills[:15]) if skills else 'various technologies'
        projects_str = ', '.join([p.get('title', '') for p in existing_projects[:3]]) if existing_projects else 'none yet'
        
        return f"""You are an expert resume consultant helping a candidate applying for {target_job} positions.

**⚠️ CRITICAL JSON RESPONSE RULES - READ FIRST ⚠️**

When providing a suggestion, you MUST respond with ONLY the raw JSON object. Follow these rules STRICTLY:

❌ WRONG - Text before JSON:
"Let me help you with that. Here's a suggestion:
{{"type": "suggestion", "projects": [...]}}"

❌ WRONG - Text after JSON:
{{"type": "suggestion", "projects": [...]}}
Let me know if you need any changes!

✅ CORRECT - ONLY JSON:
{{"type": "suggestion", "projects": [...], "message": "Your commentary goes in the message field"}}

RULES:
1. NO text before the opening brace
2. NO text after the closing brace
3. NO conversational preambles like "Here's...", "Let me...", "I've created..."
4. ALL your commentary MUST go inside the "message" field of the JSON
5. If you want to chat, do it in CONVERSATION MODE (plain text with NO JSON)
6. If you want to suggest, do it in SUGGESTION MODE (ONLY JSON, nothing else)

**IMPORTANT: SUGGESTION LIFECYCLE**
Once you provide a suggestion, DO NOT repeat it unless the user explicitly asks to see it again or refine it. After providing a suggestion:
- If user says "thanks", "thank you", "hi", "hello" → Respond naturally and ask what they'd like to do next
- If user provides NEW project info → Create a NEW suggestion for that project
- DO NOT regenerate the same suggestion you just provided

**CONVERSATION MODE:**
For general questions, clarifications, greetings, or follow-ups, respond in plain text naturally.
When the user says things like "hi", "hello", "thanks", "thank you" → greet them warmly and ask if they'd like to add another project or refine the current one.

**SUGGESTION MODE:**
When you have enough information to create a complete project description, respond with VALID JSON in this EXACT format.

CRITICAL: When providing a suggestion, return ONLY the JSON with NO additional text before or after it:

{{
  "type": "suggestion",
  "projects": [
    {{
      "title": "Actual Project Name",
      "link": "https://github.com/user/project",
      "technologies": "React, Node.js, WebSocket, MongoDB",
      "description": [
        "Built real-time collaborative whiteboard enabling 50+ concurrent users to draw simultaneously with shapes, text, and image uploads",
        "Implemented WebSocket architecture with Canvas API for instant synchronization and optimistic UI updates",
        "Processed 10,000+ drawings with <100ms latency and 99.5% uptime over 3 months"
      ]
    }}
  ],
  "message": "Here's a polished project description based on what you told me! Feel free to edit before adding."
}}

IMPORTANT: 
- Do NOT add any explanatory text before the JSON like "Here's a suggestion:" or "Based on..."
- Do NOT add any text after the JSON
- Return ONLY the raw JSON when making suggestions
- The JSON itself can include a "message" field for your commentary
- Once a suggestion is provided, DO NOT repeat it unless explicitly asked

**MULTI-PROJECT SUPPORT:**
You can suggest multiple projects in one response if the user mentions several projects:

{{
  "type": "suggestion",
  "projects": [
    {{ "title": "Project 1", ... }},
    {{ "title": "Project 2", ... }}
  ],
  "message": "I've created descriptions for both projects you mentioned!"
}}

**YOUR WORKFLOW:**

1. **Initial Interaction** - When user first mentions a project:
   - Acknowledge what they've shared
   - Ask 2-3 specific clarifying questions:
     * "How many users or concurrent connections does it handle?"
     * "What specific technical challenges did you solve?"
     * "Do you have metrics like performance improvements, scale, or user numbers?"

2. **Gathering Details** - As conversation continues:
   - Ask follow-up questions to get concrete numbers
   - Probe for technical implementation details
   - Clarify the impact and scale

3. **Generate Suggestion** - Once you have sufficient information:
   - Return ONLY the JSON suggestion format (no prefix text!)
   - Include ALL details gathered from conversation
   - Ensure each bullet is complete, specific, and quantified
   - Never use placeholder text like "describe the problem" or "add metrics"

4. **After Suggestion** - Once you've provided a suggestion:
   - The user will either accept, reject, or ask for refinements
   - DO NOT repeat the same suggestion
   - If user says casual things like "thanks" or "hi", respond conversationally
   - Ask if they want to add another project or make changes

**QUALITY STANDARDS FOR BULLETS:**

✅ GOOD Examples:
- "Built real-time chat application serving 10K+ daily active users with <50ms message latency"
- "Implemented event-driven microservices architecture using Kafka and Redis for horizontal scalability"
- "Reduced database query time by 80% through indexing optimization and caching layer"

❌ BAD Examples (Never do this):
- "What the project does (1 concise sentence...)"
- "Describe the technical approach"
- "Add quantifiable metrics"
- "Built a project that does something"

**ASKING GOOD QUESTIONS:**
When information is missing, ask specific questions:
- "How many users or API requests does it handle?"
- "What performance improvements did you achieve? (faster load times, reduced latency, etc.)"
- "What was the biggest technical challenge and how did you solve it?"
- "Do you have metrics on scale? (data processed, concurrent users, uptime, etc.)"

**CURRENT CONTEXT:**
- Target Role: {target_job}
- Your Skills: {skills_str}
- Existing Projects: {projects_str}

**IMPORTANT REMINDERS:**
1. Only return JSON when you have COMPLETE information for all 3 bullets
2. Each bullet must be a full sentence with specific details
3. Always include at least one quantifiable metric per project
4. Never return templates or placeholders
5. When returning JSON, return ONLY the JSON - no introductory or explanatory text
6. DO NOT repeat suggestions - once provided, move on to the next task
7. After providing a suggestion, respond naturally to greetings/thanks without re-suggesting

Begin by warmly greeting the user and asking about their project!"""

    @staticmethod
    def extract_json_from_text(content: str) -> Optional[str]:
        """
        Extract JSON from text that might have surrounding content.
        Handles cases like "Here's a suggestion: {json}" or "text {json} more text"
        """
        # Try to find JSON object boundaries
        # Look for outermost { ... } that contains "type": "suggestion"
        
        # Find all potential JSON objects
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
                    # Found a complete JSON object
                    potential_json = content[start_idx:i+1]
                    
                    # Check if it's a suggestion JSON
                    try:
                        parsed = json.loads(potential_json)
                        if parsed.get('type') == 'suggestion':
                            return potential_json
                    except:
                        continue
        
        return None
    
    @staticmethod
    def is_json_response(content: str) -> bool:
        """Check if response is JSON suggestion format"""
        try:
            # First try direct parse
            parsed = json.loads(content.strip())
            return parsed.get('type') == 'suggestion' and 'projects' in parsed
        except:
            # Try extracting JSON from text
            extracted = ProjectPrompts.extract_json_from_text(content)
            if extracted:
                try:
                    parsed = json.loads(extracted)
                    return parsed.get('type') == 'suggestion' and 'projects' in parsed
                except:
                    pass
            return False
    
    @staticmethod
    def parse_json_suggestion(content: str) -> Optional[Dict]:
        """
        Parse JSON suggestion response.
        Handles both pure JSON and JSON embedded in text.
        """
        try:
            # First, try direct parse (for pure JSON responses)
            content_stripped = content.strip()
            
            # Remove markdown code blocks if present
            if content_stripped.startswith('```json'):
                content_stripped = content_stripped[7:]
            if content_stripped.startswith('```'):
                content_stripped = content_stripped[3:]
            if content_stripped.endswith('```'):
                content_stripped = content_stripped[:-3]
            
            content_stripped = content_stripped.strip()
            
            # Try parsing directly
            try:
                parsed = json.loads(content_stripped)
                if parsed.get('type') == 'suggestion' and 'projects' in parsed:
                    # Validate structure
                    return ProjectPrompts._validate_suggestion(parsed)
            except json.JSONDecodeError:
                pass
            
            # If direct parse failed, try extracting JSON from surrounding text
            extracted_json = ProjectPrompts.extract_json_from_text(content)
            if extracted_json:
                parsed = json.loads(extracted_json)
                if parsed.get('type') == 'suggestion' and 'projects' in parsed:
                    return ProjectPrompts._validate_suggestion(parsed)
            
            return None
            
        except Exception as e:
            print(f"JSON parse error: {e}")
            return None
    
    @staticmethod
    def _validate_suggestion(parsed: Dict) -> Optional[Dict]:
        """Validate suggestion structure"""
        try:
            projects = parsed.get('projects', [])
            if not projects:
                return None
            
            # Validate each project has required fields
            for project in projects:
                if not all(key in project for key in ['title', 'technologies', 'description']):
                    print(f"Missing required fields in project: {project.keys()}")
                    return None
                
                # Description should be a list with 3 items
                if not isinstance(project['description'], list):
                    print(f"Description is not a list: {type(project['description'])}")
                    return None
                
                if len(project['description']) < 2:  # At least 2 bullets
                    print(f"Description has too few items: {len(project['description'])}")
                    return None
            
            return parsed
        except Exception as e:
            print(f"Validation error: {e}")
            return None
    
    @staticmethod
    def get_refinement_prompt(current_project: Dict, refinement_type: str) -> str:
        """
        Generate prompts for refining existing project content
        
        Args:
            current_project: Current project dict with title, technologies, description
            refinement_type: 'quantify', 'technical', 'simplify', or 'expand'
        """
        project_str = json.dumps(current_project, indent=2)
        
        base_instruction = "IMPORTANT: Return ONLY the JSON response with no additional text before or after it."
        
        prompts = {
            'quantify': f"""The user wants to add more quantifiable metrics to this project:

{project_str}

Please enhance it by adding specific numbers, percentages, or measurable outcomes:
- Performance metrics (latency, throughput, load time)
- Scale (users, requests, data volume)
- Improvement percentages
- Time saved or efficiency gains

{base_instruction}
Respond with the enhanced project in the exact JSON format shown in the system prompt.""",
            
            'technical': f"""The user wants more technical depth for this project:

{project_str}

Please add more technical details:
- Specific algorithms or design patterns
- Architecture decisions (microservices, event-driven, etc.)
- Database optimization techniques
- Scalability solutions

{base_instruction}
Respond with the enhanced project in the exact JSON format shown in the system prompt.""",
            
            'simplify': f"""The user wants to simplify this project description:

{project_str}

Please simplify while keeping impact clear:
- Focus on business value
- Reduce technical jargon
- Keep quantifiable results
- Make it accessible to non-technical readers

{base_instruction}
Respond with the simplified project in the exact JSON format shown in the system prompt.""",
            
            'expand': f"""The user wants to expand this project description:

{project_str}

Please expand each bullet to be more comprehensive:
- Add context to the problem/solution
- Include more implementation details
- Expand on the impact and outcomes

{base_instruction}
Respond with the expanded project in the exact JSON format shown in the system prompt."""
        }
        
        return prompts.get(refinement_type, prompts['quantify'])