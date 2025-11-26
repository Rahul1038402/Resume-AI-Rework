import { useState, useEffect, useCallback } from 'react';
import { ResumeData, WarningConfig } from '../types';

const getDefaultWarningConfig = (): WarningConfig => ({
    enabled: true,
    thresholds: {
        minProjects: 2,
        minExperience: 1,
        minSkillCategories: 3,
        minEducation: 1
    }
});

export const useResumeValidation = (resumeData: ResumeData) => {
    const [warnings, setWarnings] = useState<string[]>([]);
    const [warningConfig] = useState<WarningConfig>(getDefaultWarningConfig());

    const validateResumeData = useCallback(() => {
        if (!warningConfig.enabled) {
            setWarnings([]);
            return;
        }

        const newWarnings: string[] = [];

        // Check projects
        if (resumeData.projects.length < warningConfig.thresholds.minProjects) {
            newWarnings.push(`Add at least ${warningConfig.thresholds.minProjects} projects to strengthen your resume`);
        }

        // Check skills
        if (resumeData.skills.categories.length < warningConfig.thresholds.minSkillCategories) {
            newWarnings.push(`Add more skill categories (minimum: ${warningConfig.thresholds.minSkillCategories})`);
        }

        // Check education
        if (resumeData.education.length < warningConfig.thresholds.minEducation) {
            newWarnings.push(`Add your education details (minimum: ${warningConfig.thresholds.minEducation})`);
        }

        // Check contact information
        if (!resumeData.personalInfo.email || !resumeData.personalInfo.phone) {
            newWarnings.push('Ensure contact information is complete');
        }

        // Check summary
        if (!resumeData.summary || resumeData.summary.length < 50) {
            newWarnings.push('Add a compelling professional summary (at least 50 characters)');
        }

        // General tips
        newWarnings.push(`Try Keeping your resume to 1 page for optimal recruiter engagement.`);
        newWarnings.push(`If you feel the content won't fit in 1 page, consider decreasing the Line Height in Layout Tab.`);

        setWarnings(newWarnings);
    }, [resumeData, warningConfig]);

    useEffect(() => {
        validateResumeData();
    }, [validateResumeData]);

    return {
        warnings,
        warningConfig,
        validateResumeData
    };
};