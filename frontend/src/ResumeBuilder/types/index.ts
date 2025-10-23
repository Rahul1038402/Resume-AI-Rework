export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  targetJobTitle: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  leetcodeUrl?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Project {
  id: string;
  title: string;
  technologies: string;
  description: string[];
  link?: string;
}

export interface Experience {
  id: string;
  position: string;
  location: string;
  company: string;
  startDate: string;
  endDate: string;
  achievements: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  value: string;
}

export interface Skills {
  categories: SkillCategory[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  skills: Skills;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}

export type ActiveTab = 'editor' | 'layout' | 'templates';
export type ActiveSection = 'personal' | 'summary' | 'skills' | 'projects' | 'experience' | 'education' | 'certifications';

export interface LayoutSettings {
  fontSize: number;
  lineHeight: string;
  pageSize: string;
  fontFamily: string;
  margins: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export interface WarningConfig {
    enabled: boolean;
    thresholds: {
        minProjects: number;
        minExperience: number;
        minSkillCategories: number;
        minEducation: number;
    };
}
