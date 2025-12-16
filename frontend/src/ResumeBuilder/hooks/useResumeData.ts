import { useState, useEffect } from 'react';
import {
    ResumeData,
    PersonalInfo,
    Education,
    Project,
    Experience,
    Certification,
    SkillCategory
} from '../types';

const STORAGE_KEY = 'resumeData';

const getDefaultResumeData = (): ResumeData => ({
    personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        targetJobTitle: '',
        linkedinUrl: '',
        githubUrl: '',
    },
    summary: '',
    skills: {
        categories: [
            {
                id: Date.now().toString(),
                name: '',
                value: ''
            }
        ]
    },
    projects: [
        {
            id: Date.now().toString(),
            title: '',
            technologies: '',
            description: [''],
            link: ''
        }
    ],
    experience: [
        {
            id: Date.now().toString(),
            position: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            achievements: ['']
        }
    ],
    education: [
        {
            id: Date.now().toString(),
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            gpa: ''
        }
    ],
    certifications: [
        {
            id: Date.now().toString(),
            name: '',
            issuer: '',
            date: '',
            credentialId: '',
            link: ''
        }
    ]
});

const loadFromLocalStorage = (): ResumeData | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;
        
        const savedData = JSON.parse(saved);
        const defaultData = getDefaultResumeData();
        
        // Ensure arrays have at least one default item if they're empty
        return {
            ...savedData,
            // Keep saved data if it has items, otherwise use default (which has 1 item)
            education: savedData.education?.length > 0 ? savedData.education : defaultData.education,
            experience: savedData.experience?.length > 0 ? savedData.experience : defaultData.experience,
            projects: savedData.projects?.length > 0 ? savedData.projects : defaultData.projects,
            certifications: savedData.certifications?.length > 0 ? savedData.certifications : defaultData.certifications,
            skills: {
                categories: savedData.skills?.categories?.length > 0 
                    ? savedData.skills.categories 
                    : defaultData.skills.categories
            }
        };
    } catch (error) {
        console.error(`Error loading ${STORAGE_KEY}:`, error);
        return null;
    }
};

const saveToLocalStorage = (data: ResumeData): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${STORAGE_KEY}:`, error);
    }
};

export const useResumeData = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(() => {
        const saved = loadFromLocalStorage();
        return saved || getDefaultResumeData();
    });

    // Auto-save to localStorage whenever resumeData changes
    useEffect(() => {
        saveToLocalStorage(resumeData);
    }, [resumeData]);

    // Personal Info
    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value
            }
        }));
    };

    // Summary
    const updateSummary = (value: string) => {
        setResumeData(prev => ({ ...prev, summary: value }));
    };

    // Skills
    const addSkillCategory = () => {
        const newCategory: SkillCategory = {
            id: Date.now().toString(),
            name: '',
            value: ''
        };
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                categories: [...prev.skills.categories, newCategory]
            }
        }));
    };

    const updateSkillCategory = (id: string, field: keyof SkillCategory, value: string) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                categories: prev.skills.categories.map(cat =>
                    cat.id === id ? { ...cat, [field]: value } : cat
                )
            }
        }));
    };

    const deleteSkillCategory = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                categories: prev.skills.categories.filter(cat => cat.id !== id)
            }
        }));
    };

    const replaceAllSkillCategories = (categories: SkillCategory[]) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                categories: categories.map(cat => ({
                    ...cat,
                    id: cat.id || Date.now().toString() + Math.random()
                }))
            }
        }));
    };

    // Projects
    const addProject = () => {
        const newProject: Project = {
            id: Date.now().toString(),
            title: '',
            technologies: '',
            description: [''],
            link: ''
        };
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, newProject]
        }));
    };

    const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(proj =>
                proj.id === id ? { ...proj, [field]: value } : proj
            )
        }));
    };

    const addProjectDescription = (projectId: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(proj =>
                proj.id === projectId
                    ? { ...proj, description: [...proj.description, ''] }
                    : proj
            )
        }));
    };

    const updateProjectDescription = (projectId: string, index: number, value: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(proj =>
                proj.id === projectId
                    ? {
                        ...proj,
                        description: proj.description.map((desc, i) =>
                            i === index ? value : desc
                        )
                    }
                    : proj
            )
        }));
    };

    const deleteProjectDescription = (projectId: string, index: number) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(proj =>
                proj.id === projectId
                    ? {
                        ...proj,
                        description: proj.description.filter((_, i) => i !== index)
                    }
                    : proj
            )
        }));
    };

    const deleteProject = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter(proj => proj.id !== id)
        }));
    };

    // Experience
    const addExperience = () => {
        const newExperience: Experience = {
            id: Date.now().toString(),
            position: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            achievements: ['']
        };
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, newExperience]
        }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string | string[]) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const addExperienceAchievement = (expId: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === expId
                    ? { ...exp, achievements: [...exp.achievements, ''] }
                    : exp
            )
        }));
    };

    const updateExperienceAchievement = (expId: string, index: number, value: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === expId
                    ? {
                        ...exp,
                        achievements: exp.achievements.map((ach, i) =>
                            i === index ? value : ach
                        )
                    }
                    : exp
            )
        }));
    };

    const deleteExperienceAchievement = (expId: string, index: number) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === expId
                    ? {
                        ...exp,
                        achievements: exp.achievements.filter((_, i) => i !== index)
                    }
                    : exp
            )
        }));
    };

    const deleteExperience = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    // Education
    const addEducation = () => {
        const newEducation: Education = {
            id: Date.now().toString(),
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            gpa: ''
        };
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, newEducation]
        }));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const deleteEducation = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    // Certifications
    const addCertification = () => {
        const newCert: Certification = {
            id: Date.now().toString(),
            name: '',
            issuer: '',
            date: '',
            credentialId: '',
            link: ''
        };
        setResumeData(prev => ({
            ...prev,
            certifications: [...prev.certifications, newCert]
        }));
    };

    const updateCertification = (id: string, field: keyof Certification, value: string) => {
        setResumeData(prev => ({
            ...prev,
            certifications: prev.certifications.map(cert =>
                cert.id === id ? { ...cert, [field]: value } : cert
            )
        }));
    };

    const deleteCertification = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            certifications: prev.certifications.filter(cert => cert.id !== id)
        }));
    };

    // Reset all data
    const resetResumeData = () => {
        setResumeData(getDefaultResumeData());
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        resumeData,
        updatePersonalInfo,
        updateSummary,
        addSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        replaceAllSkillCategories,
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
        deleteCertification,
        resetResumeData
    };
};