/**
 * TypeScript types for AI Assistant feature - Updated for all sections
 */

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isSuggestion?: boolean;
}

export interface AIAssistantState {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  currentSuggestion: ParsedSuggestion | null;
  rateLimits: {
    remaining_section: number;
    remaining_session: number;
  };
}

// Parsed content types for different sections
export interface ParsedProject {
  title: string;
  technologies: string;
  description: string[];
  link?: string;
}

export interface ParsedSummary {
  summary: string;
}

export interface SkillCategory {
  name: string;
  value: string;
}

export interface ParsedSkills {
  skills: SkillCategory[];
}

export interface ParsedExperience {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  achievements: string[];
}

export interface ParsedEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

// Union type for all possible suggestions
export type ParsedSuggestion = 
  | ParsedProject 
  | ParsedSummary 
  | ParsedSkills 
  | ParsedExperience 
  | ParsedEducation;

// Resume context for AI
export interface ResumeContext {
  target_job?: string;
  skills?: string[];
  existing_projects?: any[];
  existing_experience?: any[];
  existing_education?: any[];
  existing_skills?: SkillCategory[];
  current_summary?: string;
}

// Refinement options for different sections
export interface RefinementOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

// Section-specific refinement options
export const PROJECT_REFINEMENTS: RefinementOption[] = [
  { id: 'quantify', label: 'Add Metrics', description: 'Include quantifiable results', icon: '📊' },
  { id: 'technical', label: 'More Technical', description: 'Add technical depth', icon: '⚙️' },
  { id: 'simplify', label: 'Simplify', description: 'Make more accessible', icon: '✨' }
];

export const SUMMARY_REFINEMENTS: RefinementOption[] = [
  { id: 'impactful', label: 'More Impactful', description: 'Strengthen achievements', icon: '💪' },
  { id: 'keywords', label: 'Add Keywords', description: 'Include technical keywords', icon: '🔑' },
  { id: 'simplify', label: 'Simplify', description: 'More accessible language', icon: '✨' }
];

export const SKILLS_REFINEMENTS: RefinementOption[] = [
  { id: 'add_categories', label: 'Add Categories', description: 'Suggest more categories', icon: '➕' },
  { id: 'match_jd', label: 'Match to JD', description: 'Align with job description', icon: '🎯' },
  { id: 'prioritize', label: 'Prioritize', description: 'Reorder by importance', icon: '⭐' }
];

export const EXPERIENCE_REFINEMENTS: RefinementOption[] = [
  { id: 'quantify', label: 'Add Metrics', description: 'Include quantifiable results', icon: '📊' },
  { id: 'technical', label: 'More Technical', description: 'Add technical depth', icon: '⚙️' },
  { id: 'simplify', label: 'Simplify', description: 'Make more accessible', icon: '✨' }
];