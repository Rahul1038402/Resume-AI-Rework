import re
import fitz
from docx import Document

# Sections names that usually appear in resumes
HEADERS = [
    "education", "experience", "work experience", "employment", "professional experience",
    "skills", "technical skills", "core competencies", "expertise", "technologies",
    "projects", "personal projects", "academic projects", "key projects",
    "certifications", "certificates", "achievements", "accomplishments", "awards",
    "interests", "hobbies", "summary", "profile", "objective", "about",
    "contact information", "contact", "languages", "publications", "research",
    "hackathons", "competitions", "volunteer", "volunteering"
]

# ---------- TEXT EXTRACTION ----------
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

# ---------- ENHANCED SKILLS EXTRACTION ----------
def extract_skills(text: str):
    """
    Enhanced skills extraction with precise regex patterns to avoid false positives.
    Returns properly formatted skills for consistency with existing codebase.
    """
    skill_patterns = {
        # Programming Languages - More precise patterns
        'python': r'\bpython(?:3(?:\.\d+)?)?(?!\w)',
        'javascript': r'\bjavascript\b(?!\w)',
        'typescript': r'\btypescript\b(?!\w)',
        'java': r'\bjava\b(?!\s*script)(?!\w)',
        'c++': r'\bc\+\+\b',
        'c#': r'\bc#\b',
        'php': r'\bphp\b(?!\w)',
        'ruby': r'\bruby\b(?!\s*on\s*rails)(?!\w)',
        'go': r'\b(?:go|golang)\b(?!\w)',
        'rust': r'\brust\b(?!\w)',
        'kotlin': r'\bkotlin\b(?!\w)',
        'swift': r'\bswift\b(?!\w)',
        'scala': r'\bscala\b(?!\w)',
        'r': r'\br\b(?=\s|$|[,.])',
        'matlab': r'\bmatlab\b(?!\w)',
        'perl': r'\bperl\b(?!\w)',
        
        # Web Frontend - Fixed patterns
        'html5': r'\bhtml5?\b(?!\w)',
        'css': r'\bcss3?\b(?!\w)',
        'react': r'\breact(?:\.js|js)?\b(?!\w)',
        'angular': r'\bangular(?:js)?\b(?!\w)',
        'vue.js': r'\bvue(?:\.js|js)?\b(?!\w)',
        'redux': r'\bredux(?:\.js)?\b(?!\w)',
        'vuex': r'\bvuex\b(?!\w)',
        'bootstrap': r'\bbootstrap\b(?!\w)',
        'tailwind css': r'\btailwind(?:\s*css)?\b(?!\w)',
        'sass': r'\bsass\b(?!\w)',
        'scss': r'\bscss\b(?!\w)',
        'less': r'\bless\b(?!\w)',
        'jquery': r'\bjquery\b(?!\w)',
        'graphql': r'\bgraphql\b(?!\w)',
        
        # Backend - More precise patterns
        'node.js': r'\bnode(?:\.js|js)?\b(?!\w)',
        'express': r'\bexpress(?:\.js)?\b(?!\w)',
        'flask': r'\bflask\b(?!\w)',
        'django': r'\bdjango\b(?!\w)',
        'fastapi': r'\bfastapi\b(?!\w)',
        'spring boot': r'\bspring(?:\s*boot)?\b(?!\w)',
        'laravel': r'\blaravel\b(?!\w)',
        'ruby on rails': r'\b(?:rails|ruby\s*on\s*rails)\b',
        
        # API patterns - FIXED to avoid false positives
        'rest apis': r'\brest\s+apis?\b',
        'rest': r'\brest\b(?=\s+(?:api|endpoint|service))',
        'api': r'\bapis?\b(?=\s|$|[,.])',
        'jwt': r'\b(?:jwt|json\s*web\s*token)\b',
        
        # Databases
        'mysql': r'\bmysql\b(?!\w)',
        'postgresql': r'\b(?:postgresql|postgres)\b(?!\w)',
        'mongodb': r'\b(?:mongodb|mongo)\b(?!\w)',
        'redis': r'\bredis\b(?!\w)',
        'sqlite': r'\bsqlite\b(?!\w)',
        'oracle': r'\boracle\b(?!\w)',
        'sql server': r'\bsql\s*server\b',
        'dynamodb': r'\bdynamodb\b(?!\w)',
        'elasticsearch': r'\belasticsearch\b(?!\w)',
        'firebase': r'\bfirebase\b(?!\w)',
        'cassandra': r'\bcassandra\b(?!\w)',
        
        # Data Science & ML - FIXED AI patterns
        'machine learning': r'\bmachine\s*learning\b',
        'deep learning': r'\bdeep\s*learning\b',
        'artificial intelligence': r'\b(?:artificial\s*intelligence)\b|(?<!\w)ai(?!\w)(?=\s|$|[,.])',
        'nlp': r'\bnlp\b(?=\s|$|[,.])',
        'computer vision': r'\bcomputer\s*vision\b',
        'data analysis': r'\bdata\s*(?:analysis|analytics)\b',
        'statistics': r'\bstatistics\b(?!\w)',
        'numpy': r'\bnumpy\b(?!\w)',
        'pandas': r'\bpandas\b(?!\w)',
        'scikit-learn': r'\b(?:scikit-learn|scikit\s*learn|sklearn)\b',
        'tensorflow': r'\btensorflow\b(?!\w)',
        'pytorch': r'\bpytorch\b(?!\w)',
        'keras': r'\bkeras\b(?!\w)',
        'matplotlib': r'\bmatplotlib\b(?!\w)',
        'seaborn': r'\bseaborn\b(?!\w)',
        'jupyter': r'\bjupyter\b(?!\w)',
        'anaconda': r'\banaconda\b(?!\w)',
        'opencv': r'\bopencv\b(?!\w)',
        'mediapipe': r'\bmediapipe\b(?!\w)',
        'spacy': r'\bspacy\b(?!\w)',
        
        # Cloud & DevOps
        'aws': r'\b(?:aws|amazon\s*web\s*services)\b',
        'azure': r'\b(?:azure|microsoft\s*azure)\b',
        'google cloud': r'\b(?:gcp|google\s*cloud(?:\s*platform)?)\b',
        'docker': r'\bdocker\b(?!\w)',
        'kubernetes': r'\b(?:kubernetes|k8s)\b(?!\w)',
        'jenkins': r'\bjenkins\b(?!\w)',
        'git': r'\bgit\b(?!\w)',
        'github': r'\bgithub\b(?!\w)',
        'gitlab': r'\bgitlab\b(?!\w)',
        'ci/cd': r'\bci/?cd\b',
        'terraform': r'\bterraform\b(?!\w)',
        'ansible': r'\bansible\b(?!\w)',
        
        # Development Tools
        'vs code': r'\b(?:vs\s*code|visual\s*studio\s*code)\b',
        'intellij idea': r'\b(?:intellij(?:\s*idea)?)\b',
        'eclipse': r'\beclipse\b(?!\w)',
        'xcode': r'\bxcode\b(?!\w)',
        'figma': r'\bfigma\b(?!\w)',
        'photoshop': r'\bphotoshop\b(?!\w)',
        'illustrator': r'\billustrator\b(?!\w)',
        'slack': r'\bslack\b(?!\w)',
        'jira': r'\bjira\b(?!\w)',
        'confluence': r'\bconfluence\b(?!\w)',
        'vite': r'\bvite\b(?!\w)',
    }
    
    found_skills = set()
    text_lower = text.lower()
    
    for skill_key, pattern in skill_patterns.items():
        if re.search(pattern, text_lower, re.IGNORECASE):
            found_skills.add(skill_key)
    
    # Return properly formatted skills sorted (matches your existing return format)
    return sorted(list(found_skills))

# ---------- ENHANCED SKILL MATCHING SYSTEM ----------
def create_skill_matcher():
    """
    Create comprehensive skill matching function with all variations handled.
    This fixes the Tailwind CSS and other skill matching issues.
    """
    # COMPREHENSIVE skill variations mapping - KEY FIX for skill matching
    skill_variations = {
        # Frontend frameworks/libraries
        'React': ['React', 'ReactJS', 'React.js', 'react', 'reactjs', 'react.js'],
        'Angular': ['Angular', 'AngularJS', 'angular', 'angularjs'],
        'Vue.js': ['Vue', 'Vue.js', 'VueJS', 'vue', 'vue.js', 'vuejs'],
        'Redux': ['Redux', 'redux', 'Redux.js'],
        'jQuery': ['jQuery', 'jquery', 'JQuery'],
        
        # CSS Frameworks - CRITICAL FIX for Tailwind CSS matching
        'Tailwind CSS': [
            'Tailwind CSS', 'TailwindCSS', 'Tailwind', 'tailwind css', 
            'tailwindcss', 'tailwind', 'TAILWIND CSS', 'TAILWINDCSS', 'TAILWIND'
        ],
        'Bootstrap': ['Bootstrap', 'bootstrap', 'Bootstrap CSS'],
        'CSS': ['CSS', 'CSS3', 'css', 'css3'],
        'Sass': ['Sass', 'SASS', 'sass'],
        'SCSS': ['SCSS', 'scss'],
        
        # Programming Languages
        'JavaScript': ['JavaScript', 'Javascript', 'JS', 'javascript', 'js'],
        'TypeScript': ['TypeScript', 'Typescript', 'TS', 'typescript', 'ts'],
        'Python': ['Python', 'python', 'Python3', 'python3'],
        'Java': ['Java', 'java'],
        'HTML5': ['HTML5', 'HTML', 'html5', 'html'],
        'C++': ['C++', 'c++', 'cpp', 'CPP'],
        'C#': ['C#', 'c#', 'csharp', 'C-Sharp'],
        'PHP': ['PHP', 'php'],
        'Ruby': ['Ruby', 'ruby'],
        'Go': ['Go', 'go', 'golang', 'Golang'],
        'Rust': ['Rust', 'rust'],
        'Kotlin': ['Kotlin', 'kotlin'],
        'Swift': ['Swift', 'swift'],
        'Scala': ['Scala', 'scala'],
        'R': ['R', 'r'],
        'MATLAB': ['MATLAB', 'matlab', 'Matlab'],
        
        # Backend
        'Node.js': ['Node.js', 'NodeJS', 'Node', 'node.js', 'nodejs', 'node'],
        'Express': ['Express', 'ExpressJS', 'Express.js', 'express', 'expressjs'],
        'Flask': ['Flask', 'flask'],
        'FastAPI': ['FastAPI', 'fastapi', 'Fast API'],
        'Django': ['Django', 'django'],
        'Spring Boot': ['Spring Boot', 'SpringBoot', 'Spring', 'spring boot', 'springboot'],
        'Laravel': ['Laravel', 'laravel'],
        'Ruby on Rails': ['Ruby on Rails', 'Rails', 'rails', 'ruby on rails'],
        
        # API related
        'REST APIs': ['REST APIs', 'REST API', 'REST', 'rest apis', 'rest api', 'rest', 'RESTful'],
        'API': ['API', 'APIs', 'api', 'apis'],
        'JWT': ['JWT', 'jwt', 'JSON Web Token', 'json web token'],
        'GraphQL': ['GraphQL', 'graphql', 'Graph QL'],
        
        # Databases
        'MongoDB': ['MongoDB', 'Mongo', 'mongodb', 'mongo', 'MongoDb'],
        'MySQL': ['MySQL', 'mysql', 'My SQL'],
        'PostgreSQL': ['PostgreSQL', 'Postgres', 'postgresql', 'postgres'],
        'Redis': ['Redis', 'redis', 'REDIS'],
        'SQLite': ['SQLite', 'sqlite', 'Sqlite'],
        'Oracle': ['Oracle', 'oracle', 'ORACLE'],
        'SQL Server': ['SQL Server', 'sql server', 'SQLServer', 'Microsoft SQL Server'],
        'DynamoDB': ['DynamoDB', 'dynamodb', 'DynamoDb'],
        'Elasticsearch': ['Elasticsearch', 'elasticsearch', 'ElasticSearch'],
        'Firebase': ['Firebase', 'firebase'],
        'Cassandra': ['Cassandra', 'cassandra'],
        
        # Data Science & ML
        'Machine Learning': ['Machine Learning', 'machine learning', 'ML', 'ml'],
        'Deep Learning': ['Deep Learning', 'deep learning', 'DL', 'dl'],
        'Artificial Intelligence': ['AI', 'ai', 'Artificial Intelligence', 'artificial intelligence'],
        'NLP': ['NLP', 'nlp', 'Natural Language Processing', 'natural language processing'],
        'Computer Vision': ['Computer Vision', 'computer vision', 'CV', 'cv'],
        'Data Analysis': ['Data Analysis', 'data analysis', 'Data Analytics', 'data analytics'],
        'Statistics': ['Statistics', 'statistics', 'Stats', 'stats'],
        'NumPy': ['NumPy', 'numpy', 'Numpy', 'np'],
        'Pandas': ['Pandas', 'pandas', 'pd'],
        'Scikit-learn': ['Scikit-learn', 'scikit-learn', 'sklearn', 'Sklearn', 'Scikit learn'],
        'TensorFlow': ['TensorFlow', 'tensorflow', 'Tensorflow', 'tf'],
        'PyTorch': ['PyTorch', 'pytorch', 'Pytorch', 'torch'],
        'Keras': ['Keras', 'keras'],
        'Matplotlib': ['Matplotlib', 'matplotlib'],
        'Seaborn': ['Seaborn', 'seaborn'],
        'Jupyter': ['Jupyter', 'jupyter', 'Jupyter Notebook'],
        'Anaconda': ['Anaconda', 'anaconda'],
        'OpenCV': ['OpenCV', 'opencv', 'Open CV'],
        'MediaPipe': ['MediaPipe', 'mediapipe', 'Media Pipe'],
        'spaCy': ['spaCy', 'spacy', 'Spacy'],
        
        # Cloud & DevOps
        'AWS': ['AWS', 'Amazon Web Services', 'aws'],
        'Azure': ['Azure', 'Microsoft Azure', 'azure'],
        'Google Cloud': ['Google Cloud', 'GCP', 'Google Cloud Platform', 'google cloud'],
        'Docker': ['Docker', 'docker'],
        'Kubernetes': ['Kubernetes', 'kubernetes', 'K8s', 'k8s'],
        'Jenkins': ['Jenkins', 'jenkins'],
        'CI/CD': ['CI/CD', 'ci/cd', 'CI CD', 'Continuous Integration'],
        'Terraform': ['Terraform', 'terraform'],
        'Ansible': ['Ansible', 'ansible'],
        
        # Tools
        'Git': ['Git', 'git', 'GIT'],
        'GitHub': ['GitHub', 'Github', 'github'],
        'GitLab': ['GitLab', 'Gitlab', 'gitlab'],
        'VS Code': ['VS Code', 'VSCode', 'Visual Studio Code', 'vscode'],
        'IntelliJ IDEA': ['IntelliJ IDEA', 'IntelliJ', 'intellij', 'IntelliJ Idea'],
        'Eclipse': ['Eclipse', 'eclipse'],
        'Xcode': ['Xcode', 'xcode'],
        'Figma': ['Figma', 'figma'],
        'Photoshop': ['Photoshop', 'photoshop', 'Adobe Photoshop'],
        'Illustrator': ['Illustrator', 'illustrator', 'Adobe Illustrator'],
        'Slack': ['Slack', 'slack'],
        'Jira': ['Jira', 'jira', 'JIRA'],
        'Confluence': ['Confluence', 'confluence'],
        'Vite': ['Vite', 'vite'],
    }
    
    def match_skills(candidate_skills, job_requirements):
        """
        Enhanced skill matching with comprehensive variation handling.
        
        Args:
            candidate_skills: List of skills from resume
            job_requirements: Dict of job skills with weights or list of skills
        
        Returns:
            matched_skills: Dict of matched skills with scores
            missing_skills: Dict of unmatched job requirements
        """
        # Handle case where job_requirements is a list instead of dict
        if isinstance(job_requirements, list):
            job_requirements = {skill: 5 for skill in job_requirements}  # Default weight of 5
        
        matched_skills = {}
        missing_skills = {}
        
        # Normalize candidate skills for comparison
        candidate_lower = [skill.lower() for skill in candidate_skills]
        
        # Check each job requirement
        for job_skill, weight in job_requirements.items():
            found_match = False
            job_skill_lower = job_skill.lower()
            
            # Direct match first
            if job_skill in candidate_skills or job_skill_lower in candidate_lower:
                matched_skills[job_skill] = weight
                found_match = True
                continue
            
            # Check against skill variations
            for standard_skill, variations in skill_variations.items():
                # If job requirement matches any variation of a standard skill
                if any(var.lower() == job_skill_lower for var in variations):
                    # Check if candidate has this standard skill or any of its variations
                    if (standard_skill in candidate_skills or 
                        any(var in candidate_skills for var in variations) or
                        any(var.lower() in candidate_lower for var in variations)):
                        matched_skills[job_skill] = weight
                        found_match = True
                        break
                
                # If candidate has a standard skill, check if job requirement is a variation
                if standard_skill in candidate_skills:
                    if any(var.lower() == job_skill_lower for var in variations):
                        matched_skills[job_skill] = weight
                        found_match = True
                        break
            
            if not found_match:
                missing_skills[job_skill] = weight
        
        return matched_skills, missing_skills
    
    return match_skills

# ---------- ENHANCED SKILLS NORMALIZATION ----------
def normalize_skills(skills, return_capitalized=True, profile="general"):
    """
    Enhanced normalization with better synonym mapping and profile support.
    """
    synonym_map = {
        # Programming Languages
        "js": "javascript",
        "typescript": "typescript", "ts": "typescript",
        "python3": "python", "py": "python", "python": "python",
        "java": "java",
        "c++": "c++", "cpp": "c++", 
        "c#": "c#", "csharp": "c#",
        "php": "php", 
        "ruby": "ruby", 
        "go": "go", "golang": "go",
        "rust": "rust", 
        "kotlin": "kotlin", 
        "swift": "swift", 
        "scala": "scala",
        
        # Frontend
        "html": "html5", "html5": "html5","html 5": "html5", 
        "css3": "css", "css": "css",
        "react.js": "react", "react": "react", "reactjs": "react",
        "angular": "angular", "angularjs": "angular", 
        "vue": "vue.js", "vue.js": "vue.js",
        "redux.js": "redux", "redux": "redux", 
        "vuex": "vuex",
        "bootstrap": "bootstrap", 
        "tailwind": "tailwind css", "tailwindcss": "tailwind css" , "tailwind css": "tailwind css",
        "sass": "sass", 
        "scss": "scss", 
        "less": "less",
        "jquery": "jquery", 
        "graphql": "graphql",
        
        # Backend
        "nodejs": "node.js", "node.js": "node.js", "node": "node.js",
        "expressjs": "express", "express.js": "express", "express": "express",
        "flask": "flask", 
        "django": "django", 
        "fastapi": "fastapi",
        "spring": "spring boot", "spring boot": "spring boot", "springboot": "spring boot",
        "laravel": "laravel", 
        "rails": "ruby on rails", "ruby on rails": "ruby on rails",
        
        # API related
        "rest apis": "rest apis", "rest api": "rest apis", "restful": "rest apis",
        "rest": "rest apis",
        "apis": "api", "api": "api",
        "jwt": "jwt",
        
        # Databases
        "mysql": "mysql", 
        "postgresql": "postgresql", "postgres": "postgresql",
        "mongodb": "mongodb", "mongo": "mongodb", 
        "redis": "redis",
        "sqlite": "sqlite", 
        "oracle": "oracle", 
        "sql server": "sql server",
        "dynamodb": "dynamodb", 
        "elasticsearch": "elasticsearch",
        "firebase": "firebase",
        
        # Data Science & ML
        "ml": "machine learning", "machine learning": "machine learning",
        "dl": "deep learning", "deep learning": "deep learning",
        "artificial intelligence": "artificial intelligence",
        "nlp": "nlp", "natural language processing": "nlp",
        "computer vision": "computer vision", "cv": "computer vision",
        "np": "numpy", "numpy": "numpy", 
        "pd": "pandas", "pandas": "pandas",
        "sklearn": "scikit-learn", "scikit learn": "scikit-learn", "scikit-learn": "scikit-learn",
        "tf": "tensorflow", "tensorflow": "tensorflow", 
        "torch": "pytorch", "pytorch": "pytorch",
        "keras": "keras", 
        "matplotlib": "matplotlib", 
        "seaborn": "seaborn",
        "jupyter": "jupyter", 
        "anaconda": "anaconda",
        "opencv": "opencv",
        "mediapipe": "mediapipe",
        "spacy": "spacy",
        
        # Cloud & DevOps
        "aws": "aws", "amazon web services": "aws", 
        "azure": "azure", "microsoft azure": "azure",
        "gcp": "google cloud", "google cloud platform": "google cloud", "google cloud": "google cloud",
        "docker": "docker", 
        "kubernetes": "kubernetes", "k8s": "kubernetes",
        "jenkins": "jenkins", 
        "git": "git", 
        "github": "github", 
        "gitlab": "gitlab",
        "ci/cd": "ci/cd", 
        "terraform": "terraform", 
        "ansible": "ansible",
        
        # Tools
        "vs code": "vs code", "visual studio code": "vs code",
        "intellij": "intellij idea", "intellij idea": "intellij idea",
        "figma": "figma", 
        "photoshop": "photoshop", 
        "illustrator": "illustrator",
        "vite": "vite",
    }
    
    display_map = {
        # Programming Languages
        "javascript": "JavaScript", "typescript": "TypeScript", "python": "Python",
        "java": "Java", "c++": "C++", "c#": "C#", "php": "PHP", "ruby": "Ruby",
        "go": "Go", "rust": "Rust", "kotlin": "Kotlin", "swift": "Swift", "scala": "Scala",
        
        # Frontend
        "html5": "HTML5", "css": "CSS", "react": "React", "angular": "Angular",
        "vue.js": "Vue.js", "redux": "Redux", "vuex": "Vuex",
        "bootstrap": "Bootstrap", "tailwind css": "Tailwind CSS",
        "sass": "Sass", "scss": "SCSS", "less": "Less", "jquery": "jQuery",
        "graphql": "GraphQL",
        
        # Backend
        "node.js": "Node.js", "express": "Express", "flask": "Flask",
        "django": "Django", "fastapi": "FastAPI", "spring boot": "Spring Boot",
        "laravel": "Laravel", "ruby on rails": "Ruby on Rails",
        
        # API related
        "rest apis": "REST APIs", "rest": "REST", "api": "API", "jwt": "JWT",
        
        # Databases
        "mysql": "MySQL", "postgresql": "PostgreSQL", "mongodb": "MongoDB",
        "redis": "Redis", "sqlite": "SQLite", "oracle": "Oracle",
        "sql server": "SQL Server", "dynamodb": "DynamoDB", "elasticsearch": "Elasticsearch",
        "firebase": "Firebase",
        
        # Data Science & ML
        "machine learning": "Machine Learning", "deep learning": "Deep Learning",
        "artificial intelligence": "Artificial Intelligence", "nlp": "NLP",
        "computer vision": "Computer Vision", "numpy": "NumPy", "pandas": "Pandas",
        "scikit-learn": "Scikit-learn", "tensorflow": "TensorFlow", "pytorch": "PyTorch",
        "keras": "Keras", "matplotlib": "Matplotlib", "seaborn": "Seaborn",
        "jupyter": "Jupyter", "anaconda": "Anaconda", "opencv": "OpenCV",
        "mediapipe": "MediaPipe", "spacy": "spaCy",
        
        # Cloud & DevOps
        "aws": "AWS", "azure": "Azure", "google cloud": "Google Cloud",
        "docker": "Docker", "kubernetes": "Kubernetes", "jenkins": "Jenkins",
        "git": "Git", "github": "GitHub", "gitlab": "GitLab", "ci/cd": "CI/CD",
        "terraform": "Terraform", "ansible": "Ansible",
        
        # Tools
        "vs code": "VS Code", "intellij idea": "IntelliJ IDEA",
        "figma": "Figma", "photoshop": "Photoshop", "illustrator": "Illustrator",
        "vite": "Vite",
    }
    
    # Profile-specific skills
    profile_map = {
        "frontend": {
            "html5", "css", "javascript", "typescript", "react", "angular", "vue.js",
            "redux", "vuex", "bootstrap", "tailwind css", "sass", "scss", "less",
            "jquery", "graphql"
        },
        "backend": {
            "python", "java", "javascript", "typescript", "node.js", "express",
            "flask", "django", "fastapi", "spring boot", "php", "laravel",
            "ruby", "ruby on rails", "go", "rust", "c#", "mysql", "postgresql",
            "mongodb", "redis", "sqlite", "oracle", "sql server", "rest apis", "api"
        },
        "data_scientist": {
            "python", "r", "sql", "machine learning", "deep learning",
            "artificial intelligence", "nlp", "computer vision", "numpy",
            "pandas", "scikit-learn", "tensorflow", "pytorch", "keras",
            "matplotlib", "seaborn", "jupyter", "anaconda", "mysql",
            "postgresql", "mongodb", "aws", "azure", "google cloud",
            "opencv", "mediapipe", "spacy"
        },
        "general": set(display_map.keys())
    }
    
    allowed_skills = profile_map.get(profile, profile_map["general"])
    
    normalized = []
    for skill in skills:
        s = skill.strip().lower()
        if s in synonym_map:
            s = synonym_map[s]
        if s in allowed_skills:
            normalized.append(s)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_normalized = []
    for skill in normalized:
        if skill not in seen:
            unique_normalized.append(skill)
            seen.add(skill)
    
    return [display_map.get(s, s.capitalize()) for s in unique_normalized] if return_capitalized else unique_normalized


# ---------- PROJECTS & SKILLS (Enhanced for your specific format) ----------
def extract_projects_with_skills(text: str):
    """Extracts project names and skills specifically for your resume format"""
    projects_skills = {}
    lines = text.splitlines()
    
    # Find the PROJECTS section
    projects_section_started = False
    projects_section_lines = []
    
    for line in lines:
        clean = line.strip()
        clean_lower = clean.lower()
        
        # Start capturing at "PROJECTS" (case insensitive, exact match)
        if clean_lower == "projects" or (clean.isupper() and "projects" in clean_lower and len(clean_lower.split()) <= 2):
            projects_section_started = True
            continue
        
        # Stop at next major section header (uppercase sections)
        if projects_section_started and clean:
            # Check if this is another major section
            if clean.isupper() and len(clean.split()) <= 4:
                section_keywords = ['experience', 'education', 'skills', 'certifications', 'achievements', 'awards']
                if any(keyword in clean_lower for keyword in section_keywords):
                    break
        
        if projects_section_started and clean:
            projects_section_lines.append(clean)
    
    if not projects_section_lines:
        return {}
    
    current_project = None
    project_descriptions = []
    
    for line in projects_section_lines:
        clean_line = line.strip()
        low = clean_line.lower()
        
        # Check if this is a technologies line first (before project title check)
        if low.startswith(('technologies:', 'tech stack:', 'stack:')) and current_project:
            if ':' in clean_line:
                tech_part = clean_line.split(":", 1)[1].strip()
                
                # Handle duplicate "Technologies:" prefix in the extracted part
                if tech_part.lower().startswith('technologies:'):
                    tech_part = tech_part.split(":", 1)[1].strip()
                
                # Handle both single and multiple technologies
                if tech_part:  # Only proceed if there's content after the colon
                    # Split by common separators
                    skills = [s.strip() for s in re.split(r",|;|\|", tech_part) if s.strip()]
                    # If no separators found, treat the whole thing as one skill
                    if not skills and tech_part:
                        skills = [tech_part]
                    
                    # Clean up any remaining "Technologies:" prefixes from individual skills
                    cleaned_skills = []
                    for skill in skills:
                        if skill.lower().startswith('technologies:'):
                            skill = skill.split(':', 1)[1].strip()
                        cleaned_skills.append(skill)
                    
                    project_descriptions.extend(cleaned_skills)
            continue  # Skip to next line after processing technologies
        
        # Words/phrases that should NOT be treated as project titles
        non_project_words = {
            'link', 'links', 'github', 'demo', 'live', 'view', 'website', 'url', 
            'source', 'code', 'repo', 'repository', 'documentation', 'docs',
            'preview', 'hosted', 'deployed', 'visit', 'see', 'click', 'here'
        }
        
        # FIXED: Updated project title detection for your specific format
        # Your projects are formatted like "Posture AI – AI-powered posture analyzer..."
        # or "Resume AI – Full-stack web app..."
        is_project_title = (
            not clean_line.startswith(('•', '-', '◦', '*')) and
            not low.startswith(('technologies:', 'tech stack:', 'stack:', 'built', 'developed', 
                               'created', 'implemented', 'designed', 'achieved', 'enabled', 
                               'optimized', 'finalist')) and
            # FIXED: Increase word limit since your project titles include descriptions
            len(clean_line.split()) <= 15 and  # Increased from 10 to 15
            # Must have at least one capitalized word (like "Posture AI")
            any(word[0].isupper() for word in clean_line.split() if word and word.isalpha()) and
            # FIXED: Allow lines ending with description (your format includes descriptions)
            # not clean_line.endswith('.') and  # Removed this restriction
            not any(desc_word in low for desc_word in ['using', 'with', 'via', 'by', 'through', 'among']) and
            # Filter out common non-project words
            low not in non_project_words and
            # Filter out single common words that appear in resumes
            not (len(clean_line.split()) == 1 and low in non_project_words) and
            # FIXED: Add specific check for your format with em dash or hyphen
            ('–' in clean_line or '-' in clean_line or 'ai' in low)  # Your projects contain "AI"
        )
        
        if is_project_title:
            # Save previous project
            if current_project and project_descriptions:
                projects_skills[current_project] = set(project_descriptions)
            
            # FIXED: Extract just the project name before the description
            # Split on em dash or double hyphen to get clean project name
            if '–' in clean_line:
                current_project = clean_line.split('–')[0].strip()
            elif ' - ' in clean_line:
                current_project = clean_line.split(' - ')[0].strip()
            else:
                current_project = clean_line
            project_descriptions = []
    
    # Handle last project
    if current_project and project_descriptions:
        projects_skills[current_project] = set(project_descriptions)
    
    # Convert sets to sorted lists & normalize capitalization
    result = {}
    for project, skills in projects_skills.items():
        # Clean up and normalize skills
        normalized_skills = []
        for skill in skills:
            skill_clean = skill.strip()
            if skill_clean:  # Only add non-empty skills
                normalized_skills.append(skill_clean)
        
        if normalized_skills:
            result[project] = sorted(normalized_skills)
    
    return result


# ---------- QUANTIFIABLE IMPACT (Enhanced for your specific format) ----------
def extract_quantifiable_impact(text: str):
    """Extract any line that contains numeric data from the projects section."""  
    impacts = {}
    lines = text.splitlines()
    
    # Find the PROJECTS section
    projects_section_started = False
    projects_section_lines = []
    
    for line in lines:
        clean = line.strip()
        clean_lower = clean.lower()
        
        # Start capturing at "PROJECTS" (case insensitive, exact match)
        if clean_lower == "projects" or (clean.isupper() and "projects" in clean_lower and len(clean_lower.split()) <= 2):
            projects_section_started = True
            continue
        
        # Stop at next major section header
        if projects_section_started and clean:
            if clean.isupper() and len(clean.split()) <= 4:
                section_keywords = ['experience', 'education', 'skills', 'certifications', 'achievements', 'awards']
                if any(keyword in clean_lower for keyword in section_keywords):
                    break
        
        if projects_section_started and clean:
            projects_section_lines.append(clean)
    
    if not projects_section_lines:
        return {}
    
    current_project = None
    all_lines = []  # Collect ALL lines for current project
    
    for line in projects_section_lines:
        clean_line = line.strip()
        low = clean_line.lower()
        
        # FIXED: Use the same project detection logic as the working function
        non_project_words = {
            'link', 'links', 'github', 'demo', 'live', 'view', 'website', 'url', 
            'source', 'code', 'repo', 'repository', 'documentation', 'docs',
            'preview', 'hosted', 'deployed', 'visit', 'see', 'click', 'here'
        }
        
        # FIXED: Match the working project detection logic
        is_project_title = (
            not clean_line.startswith(('•', '-', '◦', '*')) and
            not low.startswith(('technologies:', 'tech stack:', 'stack:', 'built', 'developed', 
                               'created', 'implemented', 'designed', 'achieved', 'enabled', 
                               'optimized', 'finalist')) and
            len(clean_line.split()) <= 15 and  # Match the working function
            any(word[0].isupper() for word in clean_line.split() if word and word.isalpha()) and
            not any(desc_word in low for desc_word in ['using', 'with', 'via', 'by', 'through', 'among']) and
            low not in non_project_words and
            not (len(clean_line.split()) == 1 and low in non_project_words) and
            ('–' in clean_line or '-' in clean_line or 'ai' in low)  # Match the working function
        )
        
        if is_project_title:
            # Process previous project
            if current_project and all_lines:
                # FIXED: Reconstruct full bullet points that may be split across lines
                reconstructed_lines = []
                current_bullet = ""
                
                for proj_line in all_lines:
                    proj_line = proj_line.strip()
                    
                    # Skip Technologies/Tech Stack lines and Link lines
                    if (proj_line and 
                        not proj_line.lower().startswith(('technologies:', 'tech stack:', 'stack:', 'link')) and
                        proj_line.lower() != 'link'):
                        
                        # If line starts with bullet point, it's a new bullet
                        if proj_line.startswith(('•', '-', '◦', '*')):
                            # Save previous bullet if it exists and has numbers
                            if current_bullet and re.search(r'\d+', current_bullet):
                                reconstructed_lines.append(current_bullet.strip())
                            # Start new bullet
                            current_bullet = proj_line
                        else:
                            # This is a continuation of the current bullet
                            if current_bullet:
                                current_bullet += " " + proj_line
                            else:
                                # Standalone line (shouldn't happen in your format, but handle it)
                                if re.search(r'\d+', proj_line):
                                    reconstructed_lines.append(proj_line)
                
                # Don't forget the last bullet point
                if current_bullet and re.search(r'\d+', current_bullet):
                    reconstructed_lines.append(current_bullet.strip())
                
                if reconstructed_lines:
                    impacts[current_project] = reconstructed_lines
            
            # FIXED: Extract clean project name (same logic as working function)
            if '–' in clean_line:
                current_project = clean_line.split('–')[0].strip()
            elif ' - ' in clean_line:
                current_project = clean_line.split(' - ')[0].strip()
            else:
                current_project = clean_line
            all_lines = []
        
        # Collect ALL lines for current project (except the project title itself)
        elif current_project and clean_line:
            all_lines.append(clean_line)
    
    # Handle last project
    if current_project and all_lines:
        # FIXED: Reconstruct full bullet points that may be split across lines
        reconstructed_lines = []
        current_bullet = ""
        
        for proj_line in all_lines:
            proj_line = proj_line.strip()
            
            # Skip Technologies/Tech Stack lines and Link lines
            if (proj_line and 
                not proj_line.lower().startswith(('technologies:', 'tech stack:', 'stack:', 'link')) and
                proj_line.lower() != 'link'):
                
                # If line starts with bullet point, it's a new bullet
                if proj_line.startswith(('•', '-', '◦', '*')):
                    # Save previous bullet if it exists and has numbers
                    if current_bullet and re.search(r'\d+', current_bullet):
                        reconstructed_lines.append(current_bullet.strip())
                    # Start new bullet
                    current_bullet = proj_line
                else:
                    # This is a continuation of the current bullet
                    if current_bullet:
                        current_bullet += " " + proj_line
                    else:
                        # Standalone line (shouldn't happen in your format, but handle it)
                        if re.search(r'\d+', proj_line):
                            reconstructed_lines.append(proj_line)
        
        # Don't forget the last bullet point
        if current_bullet and re.search(r'\d+', current_bullet):
            reconstructed_lines.append(current_bullet.strip())
        
        if reconstructed_lines:
            impacts[current_project] = reconstructed_lines
    
    return {proj: metrics for proj, metrics in impacts.items() if metrics}


# ---------- SKILL MATCHING (Enhanced with new skill matching logic) ----------
def match_skills_against_job(text, job_title: str, job_skills: list, profile="general"):
    """Enhanced job matching with improved skill matching and count-based relevance scoring"""
    # Extract and normalize resume skills
    resume_skills = normalize_skills(extract_skills(text), profile=profile)
    job_skills_norm = normalize_skills(job_skills, profile=profile)
    
    # Use the enhanced skill matcher for better matching
    skill_matcher = create_skill_matcher()
    
    # Convert job skills to dict format for the matcher
    job_skills_dict = {skill: 5 for skill in job_skills_norm}  # Default weight of 5
    
    # Get matched and missing skills using the enhanced matcher
    matched_skills_dict, missing_skills_dict = skill_matcher(resume_skills, job_skills_dict)
    
    # Convert back to lists for compatibility with existing code
    matched = list(matched_skills_dict.keys())
    missing = list(missing_skills_dict.keys())
    extra = [s for s in resume_skills if s not in job_skills_norm]
    
    def relevance_label(matched_count: int) -> str:
        """Determine relevance based on number of matched skills"""
        if matched_count == 0:
            return "Not Relevant"
        elif matched_count <= 2:  # 1-2 matches
            return "Somewhat Relevant"
        else:  # 3 or more matches
            return "Highly Relevant"
    
    projects_with_skills = extract_projects_with_skills(text)
    project_relevance = {}
    
    for project, skills in projects_with_skills.items():
        normalized_proj_skills = normalize_skills(skills, profile=profile)
        
        # Use enhanced skill matcher for project skills too
        proj_skills_dict = {skill: 5 for skill in normalized_proj_skills}
        proj_matched_dict, _ = skill_matcher(job_skills_norm, proj_skills_dict)
        
        overlap = set(proj_matched_dict.keys())
        matched_count = len(overlap)
        
        project_relevance[project] = {
            "skills": normalized_proj_skills,
            "matched_skills": list(overlap),
            "matched_skills_count": matched_count,
            "relevance_label": relevance_label(matched_count)
        }
    
    # Overall scoring - using skill match percentage for overall assessment
    skill_match_score = round(len(matched) / max(1, len(job_skills_norm)) * 100, 2) if job_skills_norm else 0
    
    # Calculate average project relevance based on skill counts
    if project_relevance:
        # Convert relevance labels to scores for averaging
        relevance_scores = []
        for proj_data in project_relevance.values():
            matched_count = proj_data["matched_skills_count"]
            if matched_count == 0:
                relevance_scores.append(0)    # Not Relevant
            elif matched_count <= 2:  
                relevance_scores.append(50)   # Somewhat Relevant
            else:  # 3 or more
                relevance_scores.append(100)  # Highly Relevant
        
        avg_project_relevance = round(sum(relevance_scores) / len(relevance_scores), 2)
    else:
        avg_project_relevance = 0
    
    # Overall score calculation
    overall_score = round((skill_match_score * 0.75) + (avg_project_relevance * 0.25), 2)
    
    overall_label = "Weak Fit"
    if overall_score >= 75:
        overall_label = "Strong Fit"
    elif overall_score >= 50:
        overall_label = "Moderate Fit"
    
    return {
        "job_title": job_title,
        "matched_skills": matched,
        "missing_skills": missing,
        "extra_skills": extra,
        "skill_match_score": skill_match_score,
        "avg_project_relevance": avg_project_relevance,
        "overall_relevance_score": overall_score,
        "overall_fit": overall_label,
        "project_relevance": project_relevance
    }


# ---------- MAIN ANALYSIS FUNCTION ----------
def analyze_resume(file_path: str, job_title: str = None, job_skills: list = None, profile="general"):
    """
    Main analysis function with improved error handling for your specific resume format
    Returns data structure matching your frontend expectations
    """
    try:
        if file_path.endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
        elif file_path.endswith(".docx"):
            text = extract_text_from_docx(file_path)
        else:
            raise ValueError("Unsupported file format. Only .pdf and .docx are supported.")
        
        if not text.strip():
            raise ValueError("No text could be extracted from the file.")
        
        # Extract all components
        skills = extract_skills(text)
        projects_with_skills = extract_projects_with_skills(text)
        quantifiable_impacts = extract_quantifiable_impact(text)
        
        # Create projects list for frontend compatibility
        projects = list(projects_with_skills.keys()) if projects_with_skills else []
        
        # Filter relevant projects (projects that have skills matching the job)
        relevant_projects = []
        if job_skills and projects_with_skills:
            job_skills_norm = normalize_skills(job_skills, profile=profile)
            skill_matcher = create_skill_matcher()
            
            for project, project_skills in projects_with_skills.items():
                normalized_proj_skills = normalize_skills(project_skills, profile=profile)
                # Use enhanced skill matcher
                proj_skills_dict = {skill: 5 for skill in normalized_proj_skills}
                job_skills_dict = {skill: 5 for skill in job_skills_norm}
                matched_dict, _ = skill_matcher(normalized_proj_skills, job_skills_dict)
                
                if matched_dict:  # If any skills matched
                    relevant_projects.append(project)
        
        # Calculate analysis metrics
        total_projects = len(projects)
        relevant_projects_count = len(relevant_projects)
        skills_with_metrics = len([p for p in quantifiable_impacts.keys()])
        
        # Score calculation (out of 100)
        achieved_score = 0
        if total_projects > 0:
            project_score = (relevant_projects_count / total_projects) * 40
            metrics_score = min((skills_with_metrics / max(1, total_projects)) * 30, 30)
            skills_score = min((len(skills) / 20) * 30, 30)  # Assume 20 is good skill count
            achieved_score = round(project_score + metrics_score + skills_score, 2)
        else:
            skills_score = min((len(skills) / 20) * 50, 50)  # Give more weight to skills if no projects
            achieved_score = round(skills_score, 2)
        
        # Build result matching your frontend structure
        result = {
            "skills": skills,
            "projects": projects,
            "projects_with_skills": projects_with_skills,
            "quantifiable_impacts": quantifiable_impacts,
            "relevant_projects": relevant_projects,
            "analysis": {
                "total_skills_found": len(skills),
                "total_projects": total_projects,
                "relevant_projects": relevant_projects_count,
                "skills_with_metrics": skills_with_metrics,
                "achieved_score": achieved_score,
                "max_possible_score": 100
            }
        }
        
        # Add job matching if job details provided
        if job_title and job_skills:
            job_match_result = match_skills_against_job(text, job_title, job_skills, profile=profile)
            
            # Use enhanced skill matcher for better matching results
            skill_matcher = create_skill_matcher()
            job_skills_dict = {skill: 5 for skill in job_skills}
            matched_skills_dict, missing_skills_dict = skill_matcher(normalize_skills(extract_skills(text), profile=profile), job_skills_dict)
            
            # Generate recommendations
            recommendations = []
            if job_match_result["missing_skills"]:
                for skill in job_match_result["missing_skills"][:3]:  # Top 3 missing skills
                    recommendations.append(
                        f"Consider learning {skill} to strengthen your profile for {job_title} positions. "
                        "This skill is commonly required in the industry."
                    )
            
            if job_match_result["avg_project_relevance"] < 50:
                recommendations.append(
                    f"Consider adding more projects that demonstrate {job_title} skills to increase relevance."
                )
            
            # Calculate final score based on skill matching
            skill_match_percentage = (len(job_match_result["matched_skills"]) / 
                                    max(1, len(job_skills))) * 100
            final_score = round((skill_match_percentage + job_match_result["avg_project_relevance"]) / 2, 1)
            
            # Add job matching results to the response
            result.update({
                "job_match": job_match_result,
                "target_job": job_title,
                "score": final_score,
                "matched_skills": matched_skills_dict,
                "missing_skills": missing_skills_dict,
                "recommendations": recommendations
            })
        
        return result
        
    except Exception as e:
        raise Exception(f"Error analyzing resume: {str(e)}")


# ---------- ADDITIONAL HELPER FUNCTIONS ----------
def get_section_content(text: str, section_name: str) -> str:
    """Extract content from a specific section of the resume"""
    lines = text.splitlines()
    section_started = False
    section_content = []
    
    for line in lines:
        clean = line.strip()
        clean_lower = clean.lower()
        
        if section_name.lower() in clean_lower and clean.isupper():
            section_started = True
            continue
        
        if section_started and clean:
            # Stop at next major section
            if clean.isupper() and len(clean.split()) <= 4:
                break
            section_content.append(line)
    
    return '\n'.join(section_content)


def extract_contact_info(text: str) -> dict:
    """Extract contact information from resume"""
    contact_info = {}
    
    # Email pattern
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    if emails:
        contact_info['email'] = emails[0]
    
    # Phone pattern (various formats)
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, text)
    if phones:
        contact_info['phone'] = ''.join(phones[0]) if isinstance(phones[0], tuple) else phones[0]
    
    return contact_info