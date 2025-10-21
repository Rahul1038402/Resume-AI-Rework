from typing import Dict, List, Any, Set
import re

# Industry skill requirements database
INDUSTRY_SKILLS = {
    "software engineer": {
        "core": ["python", "javascript", "git", "sql", "html", "css"],
        "advanced": ["react", "node.js", "docker", "aws", "kubernetes", "mongodb"],
        "emerging": ["typescript", "graphql", "microservices", "ci/cd", "terraform"]
    },
    "data scientist": {
        "core": ["python", "sql", "statistics", "pandas", "numpy", "matplotlib"],
        "advanced": ["machine learning", "tensorflow", "pytorch", "spark", "hadoop", "r"],
        "emerging": ["mlops", "deep learning", "nlp", "computer vision", "kubernetes"]
    },
    "frontend developer": {
        "core": ["html", "css", "javascript", "react", "git", "responsive design"],
        "advanced": ["typescript", "vue.js", "angular", "webpack", "sass", "redux"],
        "emerging": ["next.js", "svelte", "web3", "pwa", "webassembly"]
    },
    "backend developer": {
        "core": ["python", "java", "sql", "git", "rest api", "database design"],
        "advanced": ["node.js", "docker", "redis", "mongodb", "postgresql", "microservices"],
        "emerging": ["graphql", "serverless", "kubernetes", "grpc", "event sourcing"]
    },
    "devops engineer": {
        "core": ["linux", "git", "docker", "ci/cd", "bash", "networking"],
        "advanced": ["kubernetes", "aws", "terraform", "ansible", "jenkins", "monitoring"],
        "emerging": ["gitops", "service mesh", "chaos engineering", "observability"]
    }
}

def extract_resume_skills(resume_text: str) -> Set[str]:
    """Extract skills from resume text using pattern matching."""
    
    # Common skill patterns
    skill_patterns = [
        r'\b(?:Python|Java|JavaScript|TypeScript|React|Angular|Vue|Node\.js|Express)\b',
        r'\b(?:HTML|CSS|SASS|SCSS|Bootstrap|Tailwind)\b',
        r'\b(?:SQL|MySQL|PostgreSQL|MongoDB|Redis|Elasticsearch)\b',
        r'\b(?:AWS|Azure|GCP|Docker|Kubernetes|Jenkins|Git|GitHub)\b',
        r'\b(?:TensorFlow|PyTorch|Pandas|NumPy|Scikit-learn|Matplotlib)\b',
        r'\b(?:REST|GraphQL|API|Microservices|CI/CD|DevOps)\b'
    ]
    
    skills = set()
    text_lower = resume_text.lower()
    
    # Extract from skill patterns
    for pattern in skill_patterns:
        matches = re.findall(pattern, resume_text, re.IGNORECASE)
        skills.update([match.lower() for match in matches])
    
    # Extract from skills section
    skills_section = re.search(r'skills?:?\s*(.+?)(?:\n\n|\n[A-Z]|$)', text_lower, re.DOTALL)
    if skills_section:
        skills_text = skills_section.group(1)
        # Split by common delimiters
        skill_items = re.split(r'[,•\n\t\|]', skills_text)
        for item in skill_items:
            clean_skill = re.sub(r'[^\w\s\.\-\+]', '', item.strip())
            if len(clean_skill) > 2 and len(clean_skill) < 30:
                skills.add(clean_skill.lower())
    
    return skills

def analyze_skills_gap(resume_text: str, target_role: str) -> Dict[str, Any]:
    """Analyze skills gap for a target role."""
    
    # Extract skills from resume
    resume_skills = extract_resume_skills(resume_text)
    
    # Get target role requirements
    target_role_lower = target_role.lower()
    role_requirements = None
    
    for role, requirements in INDUSTRY_SKILLS.items():
        if role in target_role_lower or any(word in target_role_lower for word in role.split()):
            role_requirements = requirements
            break
    
    if not role_requirements:
        # Default to software engineer if role not found
        role_requirements = INDUSTRY_SKILLS["software engineer"]
    
    # Calculate matches and gaps
    all_required = set(role_requirements["core"] + role_requirements["advanced"])
    matched_skills = resume_skills.intersection(all_required)
    missing_core = set(role_requirements["core"]) - resume_skills
    missing_advanced = set(role_requirements["advanced"]) - resume_skills
    bonus_skills = resume_skills.intersection(set(role_requirements["emerging"]))
    
    # Calculate scores
    core_score = (len(role_requirements["core"]) - len(missing_core)) / len(role_requirements["core"]) * 100
    advanced_score = (len(role_requirements["advanced"]) - len(missing_advanced)) / len(role_requirements["advanced"]) * 100
    overall_score = (core_score * 0.7) + (advanced_score * 0.3)
    
    return {
        "target_role": target_role,
        "overall_score": round(overall_score, 1),
        "core_skills_score": round(core_score, 1),
        "advanced_skills_score": round(advanced_score, 1),
        "matched_skills": list(matched_skills),
        "missing_skills": {
            "core": list(missing_core),
            "advanced": list(missing_advanced)
        },
        "bonus_skills": list(bonus_skills),
        "skill_counts": {
            "total_resume_skills": len(resume_skills),
            "matched_skills": len(matched_skills),
            "missing_core": len(missing_core),
            "missing_advanced": len(missing_advanced),
            "bonus_skills": len(bonus_skills)
        },
        "recommendations": generate_skill_recommendations(missing_core, missing_advanced, overall_score),
        "learning_path": create_learning_path(missing_core, missing_advanced)
    }

def generate_skill_recommendations(missing_core: Set[str], missing_advanced: Set[str], score: float) -> List[str]:
    """Generate skill improvement recommendations."""
    recommendations = []
    
    if missing_core:
        recommendations.append(f"Priority: Learn core skills - {', '.join(list(missing_core)[:3])}")
    
    if missing_advanced and len(missing_core) <= 2:
        recommendations.append(f"Next: Add advanced skills - {', '.join(list(missing_advanced)[:3])}")
    
    if score >= 80:
        recommendations.append("Excellent skill match! Focus on gaining practical experience.")
    elif score >= 60:
        recommendations.append("Good foundation. Fill key gaps to become highly competitive.")
    else:
        recommendations.append("Significant skill gaps. Focus on core requirements first.")
    
    return recommendations

def create_learning_path(missing_core: Set[str], missing_advanced: Set[str]) -> List[Dict[str, Any]]:
    """Create a prioritized learning path."""
    
    # Learning resources mapping
    resources = {
        "python": {"type": "Programming", "time": "2-3 months", "resources": ["Python.org tutorial", "Codecademy Python"]},
        "javascript": {"type": "Programming", "time": "2-3 months", "resources": ["MDN Web Docs", "freeCodeCamp"]},
        "react": {"type": "Framework", "time": "1-2 months", "resources": ["React Official Docs", "React Tutorial"]},
        "sql": {"type": "Database", "time": "1 month", "resources": ["W3Schools SQL", "SQLBolt"]},
        "git": {"type": "Tool", "time": "2 weeks", "resources": ["Git Tutorial", "GitHub Learning Lab"]},
        "docker": {"type": "DevOps", "time": "1 month", "resources": ["Docker Official Tutorial", "Docker for Beginners"]},
        "aws": {"type": "Cloud", "time": "2-3 months", "resources": ["AWS Free Tier", "AWS Training"]}
    }
    
    learning_path = []
    
    # Add core skills first
    for skill in list(missing_core)[:5]:
        if skill in resources:
            learning_path.append({
                "skill": skill,
                "priority": "High",
                "category": resources[skill]["type"],
                "estimated_time": resources[skill]["time"],
                "resources": resources[skill]["resources"]
            })
    
    # Add advanced skills
    for skill in list(missing_advanced)[:3]:
        if skill in resources:
            learning_path.append({
                "skill": skill,
                "priority": "Medium",
                "category": resources[skill]["type"],
                "estimated_time": resources[skill]["time"],
                "resources": resources[skill]["resources"]
            })
    
    return learning_path