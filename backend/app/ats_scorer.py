import re
from typing import Dict, List, Any

def calculate_ats_score(resume_text: str, job_description: str = None) -> Dict[str, Any]:
    """Calculate ATS compatibility score based on resume content."""
    
    score_breakdown = {
        "format_score": 0,
        "keyword_score": 0,
        "structure_score": 0,
        "content_score": 0
    }
    
    # Format scoring (25 points)
    format_issues = []
    if len(resume_text.split()) > 800:
        format_issues.append("Resume too long (>800 words)")
    else:
        score_breakdown["format_score"] += 10
    
    if re.search(r'\b(email|phone|linkedin)\b', resume_text.lower()):
        score_breakdown["format_score"] += 10
    else:
        format_issues.append("Missing contact information")
    
    if not re.search(r'[^\w\s]', resume_text):
        score_breakdown["format_score"] += 5
    else:
        format_issues.append("Contains special characters that may confuse ATS")
    
    # Structure scoring (25 points)
    structure_issues = []
    sections = ['experience', 'education', 'skills']
    found_sections = sum(1 for section in sections if section in resume_text.lower())
    score_breakdown["structure_score"] = (found_sections / len(sections)) * 25
    
    if found_sections < len(sections):
        structure_issues.append(f"Missing sections: {', '.join([s for s in sections if s not in resume_text.lower()])}")
    
    # Content scoring (25 points)
    content_issues = []
    if re.search(r'\d+%|\d+\+|\$\d+', resume_text):
        score_breakdown["content_score"] += 15
    else:
        content_issues.append("No quantifiable achievements found")
    
    if len(re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', resume_text)) > 20:
        score_breakdown["content_score"] += 10
    else:
        content_issues.append("Limited technical skills mentioned")
    
    # Keyword scoring (25 points)
    keyword_issues = []
    if job_description:
        job_keywords = set(re.findall(r'\b[a-zA-Z]{3,}\b', job_description.lower()))
        resume_keywords = set(re.findall(r'\b[a-zA-Z]{3,}\b', resume_text.lower()))
        keyword_match = len(job_keywords.intersection(resume_keywords)) / max(len(job_keywords), 1)
        score_breakdown["keyword_score"] = keyword_match * 25
        
        if keyword_match < 0.3:
            keyword_issues.append("Low keyword match with job description")
    else:
        score_breakdown["keyword_score"] = 15  # Default score without job description
    
    total_score = sum(score_breakdown.values())
    
    return {
        "total_score": round(total_score, 1),
        "score_breakdown": score_breakdown,
        "issues": {
            "format": format_issues,
            "structure": structure_issues,
            "content": content_issues,
            "keywords": keyword_issues
        },
        "recommendations": generate_ats_recommendations(score_breakdown, total_score)
    }

def generate_ats_recommendations(scores: Dict[str, float], total: float) -> List[str]:
    """Generate specific recommendations based on ATS score."""
    recommendations = []
    
    if scores["format_score"] < 20:
        recommendations.append("Use standard fonts and avoid complex formatting")
        recommendations.append("Keep resume under 800 words")
    
    if scores["structure_score"] < 20:
        recommendations.append("Include clear sections: Experience, Education, Skills")
        recommendations.append("Use standard section headers")
    
    if scores["content_score"] < 20:
        recommendations.append("Add quantifiable achievements with numbers/percentages")
        recommendations.append("Include more technical skills and tools")
    
    if scores["keyword_score"] < 20:
        recommendations.append("Match more keywords from the job description")
        recommendations.append("Use industry-standard terminology")
    
    if total >= 80:
        recommendations.append("Excellent ATS compatibility! Your resume should pass most systems.")
    elif total >= 60:
        recommendations.append("Good ATS score. Minor improvements will boost compatibility.")
    else:
        recommendations.append("Significant ATS improvements needed for better visibility.")
    
    return recommendations