import re
from typing import Dict, List, Any, Set
from difflib import SequenceMatcher

def extract_skills(text: str) -> Set[str]:
    """Extract technical skills from resume text."""
    skill_patterns = [
        r'\b(?:Python|Java|JavaScript|React|Node\.js|SQL|AWS|Docker|Git|HTML|CSS)\b',
        r'\b[A-Z][a-z]+(?:\.[a-z]+)*\b',  # Technology names
    ]
    
    skills = set()
    for pattern in skill_patterns:
        skills.update(re.findall(pattern, text, re.IGNORECASE))
    
    return {skill.lower() for skill in skills if len(skill) > 2}

def extract_experience_years(text: str) -> int:
    """Extract years of experience from resume."""
    patterns = [
        r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
        r'experience.*?(\d+)\+?\s*years?',
        r'(\d+)\+?\s*years?\s*in'
    ]
    
    years = []
    for pattern in patterns:
        matches = re.findall(pattern, text.lower())
        years.extend([int(match) for match in matches])
    
    return max(years) if years else 0

def compare_resumes(resume1_text: str, resume2_text: str) -> Dict[str, Any]:
    """Compare two resumes and highlight differences."""
    
    # Extract skills
    skills1 = extract_skills(resume1_text)
    skills2 = extract_skills(resume2_text)
    
    # Extract experience
    exp1 = extract_experience_years(resume1_text)
    exp2 = extract_experience_years(resume2_text)
    
    # Calculate similarity
    similarity = SequenceMatcher(None, resume1_text.lower(), resume2_text.lower()).ratio()
    
    # Find unique and common elements
    common_skills = skills1.intersection(skills2)
    unique_skills1 = skills1 - skills2
    unique_skills2 = skills2 - skills1
    
    # Word count comparison
    words1 = len(resume1_text.split())
    words2 = len(resume2_text.split())
    
    return {
        "similarity_score": round(similarity * 100, 1),
        "skills_comparison": {
            "common_skills": list(common_skills),
            "resume1_unique": list(unique_skills1),
            "resume2_unique": list(unique_skills2),
            "skills_overlap": round(len(common_skills) / max(len(skills1.union(skills2)), 1) * 100, 1)
        },
        "experience_comparison": {
            "resume1_years": exp1,
            "resume2_years": exp2,
            "difference": abs(exp1 - exp2)
        },
        "structure_comparison": {
            "resume1_words": words1,
            "resume2_words": words2,
            "length_difference": abs(words1 - words2)
        },
        "recommendations": generate_comparison_recommendations(skills1, skills2, exp1, exp2, similarity)
    }

def generate_comparison_recommendations(skills1: Set[str], skills2: Set[str], 
                                      exp1: int, exp2: int, similarity: float) -> List[str]:
    """Generate recommendations based on resume comparison."""
    recommendations = []
    
    if len(skills2) > len(skills1):
        recommendations.append("Resume 2 has more diverse skills - consider adding missing skills to Resume 1")
    elif len(skills1) > len(skills2):
        recommendations.append("Resume 1 has more diverse skills - consider adding missing skills to Resume 2")
    
    if exp2 > exp1:
        recommendations.append("Resume 2 shows more experience - ensure Resume 1 highlights all relevant experience")
    elif exp1 > exp2:
        recommendations.append("Resume 1 shows more experience - ensure Resume 2 highlights all relevant experience")
    
    if similarity < 0.3:
        recommendations.append("Resumes are very different - consider aligning format and content structure")
    elif similarity > 0.8:
        recommendations.append("Resumes are very similar - consider differentiating for different job types")
    
    unique1 = skills1 - skills2
    unique2 = skills2 - skills1
    
    if unique1:
        recommendations.append(f"Consider adding these skills from Resume 1 to Resume 2: {', '.join(list(unique1)[:5])}")
    if unique2:
        recommendations.append(f"Consider adding these skills from Resume 2 to Resume 1: {', '.join(list(unique2)[:5])}")
    
    return recommendations