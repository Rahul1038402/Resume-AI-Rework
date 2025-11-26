import { ActiveSection } from '../../types';
import { PersonalInfoEditor } from './PersonalInfoEditor';
import { SummaryEditor } from './SummaryEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { CertificationsEditor } from './CertificationsEditor';
import { SectionNavigation } from '../SectionNavigation';

interface EditorPanelProps {
    activeSection: ActiveSection;
    setActiveSection: (section: ActiveSection) => void;
    resumeData: any;
    updatePersonalInfo: (field: string, value: string) => void;
    updateSummary: (value: string) => void;
    // Skills
    addSkillCategory: () => void;
    updateSkillCategory: (id: string, field: string, value: string) => void;
    deleteSkillCategory: (id: string) => void;
    // Projects
    addProject: () => void;
    updateProject: (id: string, field: string, value: string | string[]) => void;
    deleteProject: (id: string) => void;
    addProjectDescription: (projectId: string) => void;
    updateProjectDescription: (projectId: string, index: number, value: string) => void;
    deleteProjectDescription: (projectId: string, index: number) => void;
    // Experience
    addExperience: () => void;
    updateExperience: (id: string, field: string, value: string | string[]) => void;
    deleteExperience: (id: string) => void;
    addExperienceAchievement: (expId: string) => void;
    updateExperienceAchievement: (expId: string, index: number, value: string) => void;
    deleteExperienceAchievement: (expId: string, index: number) => void;
    // Education
    addEducation: () => void;
    updateEducation: (id: string, field: string, value: string) => void;
    deleteEducation: (id: string) => void;
    // Certifications
    addCertification: () => void;
    updateCertification: (id: string, field: string, value: string) => void;
    deleteCertification: (id: string) => void;
}

const EditorPanel = ({
    activeSection,
    setActiveSection,
    resumeData,
    updatePersonalInfo,
    updateSummary,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    addProject,
    updateProject,
    deleteProject,
    addProjectDescription,
    updateProjectDescription,
    deleteProjectDescription,
    addExperience,
    updateExperience,
    deleteExperience,
    addExperienceAchievement,
    updateExperienceAchievement,
    deleteExperienceAchievement,
    addEducation,
    updateEducation,
    deleteEducation,
    addCertification,
    updateCertification,
    deleteCertification
}: EditorPanelProps) => {
    return (
        <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 overflow-y-auto h-full custom:max-h-[calc(100vh-200px)] w-full custom:w-[500pt] max-w-full">
            <SectionNavigation 
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            {/* Section Content */}
            {activeSection === 'personal' && (
                <PersonalInfoEditor
                    personalInfo={resumeData.personalInfo}
                    updatePersonalInfo={updatePersonalInfo}
                />
            )}
            {activeSection === 'summary' && (
                <SummaryEditor
                    summary={resumeData.summary}
                    updateSummary={updateSummary}
                />
            )}
            {activeSection === 'skills' && (
                <SkillsEditor
                    skills={resumeData.skills}
                    addSkillCategory={addSkillCategory}
                    updateSkillCategory={updateSkillCategory}
                    deleteSkillCategory={deleteSkillCategory}
                />
            )}
            {activeSection === 'projects' && (
                <ProjectsEditor
                    projects={resumeData.projects}
                    addProject={addProject}
                    updateProject={updateProject}
                    deleteProject={deleteProject}
                    addProjectDescription={addProjectDescription}
                    updateProjectDescription={updateProjectDescription}
                    deleteProjectDescription={deleteProjectDescription}
                />
            )}
            {activeSection === 'experience' && (
                <ExperienceEditor
                    experience={resumeData.experience}
                    addExperience={addExperience}
                    updateExperience={updateExperience}
                    deleteExperience={deleteExperience}
                    addExperienceAchievement={addExperienceAchievement}
                    updateExperienceAchievement={updateExperienceAchievement}
                    deleteExperienceAchievement={deleteExperienceAchievement}
                />
            )}
            {activeSection === 'education' && (
                <EducationEditor
                    education={resumeData.education}
                    addEducation={addEducation}
                    updateEducation={updateEducation}
                    deleteEducation={deleteEducation}
                />
            )}
            {activeSection === 'certifications' && (
                <CertificationsEditor
                    certifications={resumeData.certifications}
                    addCertification={addCertification}
                    updateCertification={updateCertification}
                    deleteCertification={deleteCertification}
                />
            )}
        </div>
    );
};
export default EditorPanel;