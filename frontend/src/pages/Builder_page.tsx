import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Download, Loader2, User, Briefcase, GraduationCap, Award, Code, FolderOpen, Settings, Eye, X, Lightbulb, Check, RotateCcw, NotebookPen, FileText } from 'lucide-react';
import Header from '@/components/Header';
import ShinyText from '@/components/ui/ShinyText';
import { cn } from '@/lib/utils';
import '../index.css';
import GradientText from '@/components/ui/GradientText';
import {
    PersonalInfo,
    Education,
    Project,
    Experience,
    Certification,
    SkillCategory,
    Skills,
    ResumeData,
    ActiveTab,
    ActiveSection,
    LayoutSettings,
    WarningConfig
} from '../ResumeBuilder/types/index';
import { generateResumePDF } from '@/api/resumeService';

const STORAGE_KEY_RESUME = 'resumeData';
const STORAGE_KEY_LAYOUT = 'layoutSettings';
const STORAGE_KEY_LAST_SAVED = 'lastSaved';

const loadFromLocalStorage = (key: string): any => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error(`Error loading ${key}:`, error);
        return null;
    }
};

const saveToLocalStorage = (key: string, data: any): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
    }
};

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
        categories: []
    },
    projects: [],
    experience: [],
    education: [],
    certifications: []
});

const getDefaultLayoutSettings = (): LayoutSettings => ({
    fontSize: 11,
    lineHeight: '1.2',
    pageSize: 'A4',
    fontFamily: '"CMU Serif", "Computer Modern Serif", Georgia, serif',
    margins: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
    }
});

export default function ResumeBuilder() {
    const [resumeData, setResumeData] = useState<ResumeData>(() => {
        const saved = loadFromLocalStorage(STORAGE_KEY_RESUME);
        return saved || getDefaultResumeData();
    });

    const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(() => {
        const saved = loadFromLocalStorage(STORAGE_KEY_LAYOUT);
        return saved || getDefaultLayoutSettings();
    });

    const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
    const [activeSection, setActiveSection] = useState<ActiveSection>('personal');
    const [lastSaved, setLastSaved] = useState<string>('');
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [warningConfig] = useState<WarningConfig>({
        enabled: true,
        thresholds: {
            minProjects: 2,
            minExperience: 1,
            minSkillCategories: 3,
            minEducation: 1
        }
    });

    // Update functions
    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value
            }
        }));
    };

    const updateSummary = (value: string) => {
        setResumeData(prev => ({ ...prev, summary: value }));
    };

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

    const updateLayoutSettings = (field: keyof LayoutSettings, value: any) => {
        setLayoutSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateMargin = (side: keyof LayoutSettings['margins'], value: number) => {
        setLayoutSettings(prev => ({
            ...prev,
            margins: {
                ...prev.margins,
                [side]: value
            }
        }));
    };

    const validateResumeData = () => {
        if (!warningConfig.enabled) {
            setWarnings([]);
            return;
        }

        const newWarnings: string[] = [];

        if (resumeData.projects.length < warningConfig.thresholds.minProjects) {
            newWarnings.push(`Add at least ${warningConfig.thresholds.minProjects} projects to strengthen your resume`);
        }

        if (resumeData.skills.categories.length < warningConfig.thresholds.minSkillCategories) {
            newWarnings.push(`Add more skill categories (minimum: ${warningConfig.thresholds.minSkillCategories})`);
        }

        if (resumeData.education.length < warningConfig.thresholds.minEducation) {
            newWarnings.push(`Add your education details (minimum: ${warningConfig.thresholds.minEducation})`);
        }

        if (!resumeData.personalInfo.email || !resumeData.personalInfo.phone) {
            newWarnings.push('Ensure contact information is complete');
        }

        if (!resumeData.summary || resumeData.summary.length < 50) {
            newWarnings.push('Add a compelling professional summary (at least 50 characters)');
        }

        newWarnings.push(`Try Keeping your resume to 1 page for optimal recruiter engagement.`);

        newWarnings.push(`If you feel the content won't fit in 1 page, consider decreasing the Line Height in Layout Tab.`);

        setWarnings(newWarnings);
    };

    const resetAllData = () => {
        if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            setResumeData(getDefaultResumeData());
            setLayoutSettings(getDefaultLayoutSettings());
            localStorage.removeItem(STORAGE_KEY_RESUME);
            localStorage.removeItem(STORAGE_KEY_LAYOUT);
            localStorage.removeItem(STORAGE_KEY_LAST_SAVED);
            setLastSaved('');
        }
    };

    const handleDownload = async () => {
        const resumeEl = document.querySelector('.resume-content');
        if (!resumeEl) return;

        try {
            setIsDownloading(true);
            setDownloadProgress(0);

            const htmlContent = resumeEl.outerHTML;
            const cssContent = '';

            const firstName = resumeData.personalInfo.firstName || 'Resume';
            const lastName = resumeData.personalInfo.lastName || '';
            const fileName = `${firstName}_${lastName}_Resume.pdf`.replace(/\s+/g, '_');

            await generateResumePDF(
                htmlContent,
                cssContent,
                layoutSettings,
                fileName,
                (progress) => setDownloadProgress(progress) // Progress callback
            );

            setTimeout(() => {
                setIsDownloading(false);
                setDownloadProgress(0);
            }, 500);

        } catch (error) {
            console.error('PDF download error:', error);
            alert('Failed to generate PDF. Please try again.');
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    useEffect(() => {
        saveToLocalStorage(STORAGE_KEY_RESUME, resumeData);
        saveToLocalStorage(STORAGE_KEY_LAYOUT, layoutSettings);
        const now = new Date().toLocaleString();
        setLastSaved(now);
        saveToLocalStorage(STORAGE_KEY_LAST_SAVED, now);
    }, [resumeData, layoutSettings]);

    useEffect(() => {
        validateResumeData();
    }, [resumeData, warningConfig]);

    useEffect(() => {
        const saved = loadFromLocalStorage(STORAGE_KEY_LAST_SAVED);
        if (saved) setLastSaved(saved);
    }, []);


    const sectionIcons = {
        personal: User,
        summary: Edit3,
        skills: Code,
        projects: FolderOpen,
        experience: Briefcase,
        education: GraduationCap,
        certifications: Award
    };

    const renderPersonalInfoEditor = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">First Name <span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        value={resumeData.personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                        placeholder="John"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Last Name <span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        value={resumeData.personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                        placeholder="Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Email <span className='text-red-600'>*</span></label>
                    <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                        placeholder="john.doe@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Phone <span className='text-red-600'>*</span></label>
                    <input
                        type="tel"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                        placeholder="+1 234 567 8900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Location <span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                        placeholder="San Francisco, CA"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Target Job Title <span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        value={resumeData.personalInfo.targetJobTitle}
                        onChange={(e) => updatePersonalInfo('targetJobTitle', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                        placeholder="Software Engineer"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                    <input
                        type="url"
                        value={resumeData.personalInfo.linkedinUrl}
                        onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                        placeholder="https://linkedin.com/in/johndoe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <input
                        type="url"
                        value={resumeData.personalInfo.githubUrl}
                        onChange={(e) => updatePersonalInfo('githubUrl', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                        placeholder="https://github.com/johndoe"
                    />
                </div>
            </div>
        </div>
    );

    const renderSummaryEditor = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Professional Summary
            </h3>

            <div>
                <label className="block text-sm font-medium mb-2">Summary <span className='text-red-600'>*</span></label>
                <textarea
                    value={resumeData.summary}
                    onChange={(e) => updateSummary(e.target.value)}
                    rows={12}
                    className="w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                    placeholder="Write a compelling professional summary highlighting your key skills, experience, and career objectives..."
                />
                <p className="text-sm text-gray-500 mt-1">
                    {resumeData.summary.length} characters
                </p>
            </div>
        </div>
    );

    const renderSkillsEditor = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Technical Skills
            </h3>

            <button
                onClick={addSkillCategory}
                className="w-full px-4 py-2 bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 dark:hover:bg-resume-secondary/80 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
                <Plus size={16} />
                Add Skill Category
            </button>

            <div className="space-y-4">
                {resumeData.skills.categories.map((category) => (
                    <div key={category.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg space-y-3">
                        <div className="flex justify-end">
                            <button
                                onClick={() => deleteSkillCategory(category.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Category Name</label>
                            <input
                                type="text"
                                value={category.name}
                                onChange={(e) => updateSkillCategory(category.id, 'name', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="e.g., Languages"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
                            <input
                                type="text"
                                value={category.value}
                                onChange={(e) => updateSkillCategory(category.id, 'value', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="e.g., JavaScript, Python, Java"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderProjectsEditor = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Projects
            </h3>

            <button
                onClick={addProject}
                className="w-full px-4 py-2 bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 dark:hover:bg-resume-secondary/80 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
                <Plus size={16} />
                Add Project
            </button>

            <div className="space-y-6">
                {resumeData.projects.map((project) => (
                    <div key={project.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg space-y-3">
                        <div className="flex justify-end">
                            <button
                                onClick={() => deleteProject(project.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Project Title <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                value={project.title}
                                onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="Project Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Technologies Used <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                value={project.technologies}
                                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="React, Node.js, MongoDB"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Project Link</label>
                            <input
                                type="url"
                                value={project.link}
                                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="https://github.com/username/project"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium">Description Points</label>
                                <button
                                    onClick={() => addProjectDescription(project.id)}
                                    className="text-resume-primary hover:text-resume-primary/80 dark:text-resume-secondary dark:hover:text-resume-secondary/80 flex items-center text-xs"
                                >
                                    <Plus size={14} />
                                    Add Point
                                </button>
                            </div>

                            <div className="space-y-2">
                                {project.description.map((desc, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={desc}
                                            onChange={(e) => updateProjectDescription(project.id, index, e.target.value)}
                                            className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                            placeholder="Describe what you accomplished..."
                                        />
                                        {project.description.length > 1 && (
                                            <button
                                                onClick={() => deleteProjectDescription(project.id, index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderExperienceEditor = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Work Experience
            </h3>

            <button
                onClick={addExperience}
                className="w-full px-4 py-2 bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 dark:hover:bg-resume-secondary/80 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
                <Plus size={16} />
                Add Experience
            </button>

            <div className="space-y-6">
                {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg space-y-3">
                        <div className="flex justify-end">
                            <button
                                onClick={() => deleteExperience(exp.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Position <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="Software Engineer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Location <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="Delhi, India / Remote"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Company <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="Company Name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Start Date <span className='text-red-600'>*</span></label>
                                <input
                                    type="text"
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="Jan 2023"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">End Date <span className='text-red-600'>*</span></label>
                                <input
                                    type="text"
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="Present"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium">Achievements</label>
                                <button
                                    onClick={() => addExperienceAchievement(exp.id)}
                                    className="text-resume-primary hover:text-resume-primary/80 dark:text-resume-secondary dark:hover:text-resume-secondary/80 flex items-center text-xs"
                                >
                                    <Plus size={14} />
                                    Add Achievement
                                </button>
                            </div>

                            <div className="space-y-2">
                                {exp.achievements.map((achievement, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={achievement}
                                            onChange={(e) => updateExperienceAchievement(exp.id, index, e.target.value)}
                                            className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                            placeholder="Describe your achievement..."
                                        />
                                        {exp.achievements.length > 1 && (
                                            <button
                                                onClick={() => deleteExperienceAchievement(exp.id, index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderEducationEditor = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Education
            </h3>

            <button
                onClick={addEducation}
                className="w-full px-4 py-2 bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 dark:hover:bg-resume-secondary/80 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
                <Plus size={16} />
                Add Education
            </button>

            <div className="space-y-6">
                {resumeData.education.map((edu) => (
                    <div key={edu.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg space-y-3">
                        <div className="flex justify-end">
                            <button
                                onClick={() => deleteEducation(edu.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Institution <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="University Name"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Degree <span className='text-red-600'>*</span></label>
                                <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="B.Tech"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Field of Study <span className='text-red-600'>*</span></label>
                                <input
                                    type="text"
                                    value={edu.field}
                                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="Computer Science"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Start Date</label>
                                <input
                                    type="text"
                                    value={edu.startDate}
                                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="2023"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">End Date <span className='text-red-600'>*</span></label>
                                <input
                                    type="text"
                                    value={edu.endDate}
                                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="2027"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">GPA <span className='text-gray-700 dark:text-gray-400 text-xs'>(Optional)</span></label>
                                <input
                                    type="number"
                                    value={edu.gpa}
                                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="8.5/10.0"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCertificationsEditor = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Certifications & Achievements
            </h3>

            <button
                onClick={addCertification}
                className="w-full px-4 py-2 bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 dark:hover:bg-resume-secondary/80 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
                <Plus size={16} />
                Add Certification
            </button>

            <div className="space-y-6">
                {resumeData.certifications.map((cert) => (
                    <div key={cert.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg space-y-3">
                        <div className="flex justify-end">
                            <button
                                onClick={() => deleteCertification(cert.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Certification Name <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="AWS Certified Developer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Issuing Organization <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="Amazon Web Services"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Date Issued <span className='text-red-600'>*</span></label>
                                <input
                                    type="text"
                                    value={cert.date}
                                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="Jan 2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Credential ID</label>
                                <input
                                    type="text"
                                    value={cert.credentialId}
                                    onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="ABC123XYZ"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Credential URL</label>
                            <input
                                type="url"
                                value={cert.link}
                                onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="https://credentials.example.com/..."
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLayoutSettings = () => (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Layout Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Font Size (px)</label>
                    <input
                        type="number"
                        value={layoutSettings.fontSize}
                        onChange={(e) => updateLayoutSettings('fontSize', parseInt(e.target.value) || 11)}
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                        min="8"
                        max="16"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Line Height <span className='text-xs text-gray-700 dark:text-gray-400'>(Adjusts Spacing Between Content)</span></label>
                    <input
                        type="text"
                        value={layoutSettings.lineHeight}
                        onChange={(e) => updateLayoutSettings('lineHeight', e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                        placeholder="1.6"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Page Size</label>
                    <select
                        value={layoutSettings.pageSize}
                        onChange={(e) => updateLayoutSettings('pageSize', e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    >
                        <option value="A4">A4</option>
                        <option value="Letter">Letter</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Font Family</label>
                    <select
                        value={layoutSettings.fontFamily}
                        onChange={(e) => updateLayoutSettings('fontFamily', e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    >
                        <option value='"CMU Serif", "Computer Modern Serif", Georgia, serif'>CMU Serif [Recommended]</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Courier New', monospace">Courier New</option>
                    </select>
                </div>
            </div>

            <div>
                <h4 className="text-lg font-medium mb-4">Margins (px)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Top</label>
                        <input
                            type="number"
                            value={layoutSettings.margins.top}
                            onChange={(e) => updateMargin('top', parseInt(e.target.value) || 20)}
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            min="10"
                            max="50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Bottom</label>
                        <input
                            type="number"
                            value={layoutSettings.margins.bottom}
                            onChange={(e) => updateMargin('bottom', parseInt(e.target.value) || 20)}
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            min="10"
                            max="50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Left</label>
                        <input
                            type="number"
                            value={layoutSettings.margins.left}
                            onChange={(e) => updateMargin('left', parseInt(e.target.value) || 20)}
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            min="10"
                            max="50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Right</label>
                        <input
                            type="number"
                            value={layoutSettings.margins.right}
                            onChange={(e) => updateMargin('right', parseInt(e.target.value) || 20)}
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            min="10"
                            max="50"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderResumePreview = () => (
        <div className="resume-content" style={{
            fontFamily: layoutSettings.fontFamily,
            height: '10.7in',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%',
        }}>
            {/* Header */}
            <div className="mb-3" style={{
                textAlign: 'center',
                paddingBottom: '10pt',
                marginBottom: '10pt'
            }}>
                <h1 className="mb-0" style={{
                    fontSize: '24pt',
                    fontWeight: 'normal',
                    letterSpacing: '0.02em',
                }}>
                    {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                </h1>
                {resumeData.personalInfo.targetJobTitle && (
                    <p style={{
                        fontSize: '14pt',
                        fontWeight: 'normal',
                        marginBottom: '2pt'
                    }}>
                        {resumeData.personalInfo.targetJobTitle}
                    </p>
                )}

                {/* Social Links on separate line */}
                {(resumeData.personalInfo.githubUrl || resumeData.personalInfo.linkedinUrl) && (
                    <div style={{
                        fontSize: '10pt',
                        fontWeight: 'normal',
                    }}>
                        {resumeData.personalInfo.githubUrl && (
                            <span>
                                <a href={resumeData.personalInfo.githubUrl} target='_blank' style={{ color: 'rgb(0, 51, 153)', textDecoration: 'none' }}>
                                    Github: {resumeData.personalInfo.githubUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                </a>
                                {resumeData.personalInfo.linkedinUrl && ' | '}
                            </span>
                        )}
                        {resumeData.personalInfo.linkedinUrl && (
                            <a href={resumeData.personalInfo.linkedinUrl} target='_blank' style={{ color: 'rgb(0, 51, 153)', textDecoration: 'none' }}>
                                LinkedIn: {resumeData.personalInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                            </a>
                        )}
                    </div>
                )}

                {/* Contact info on next line */}
                <div style={{
                    fontSize: '10pt',
                    fontWeight: 'normal',
                    color: 'rgb(0, 51, 153)',
                }}>
                    {resumeData.personalInfo.email && (
                        <span>{resumeData.personalInfo.email}</span>
                    )}
                    {resumeData.personalInfo.email && resumeData.personalInfo.phone && ' | '}
                    {resumeData.personalInfo.phone && (
                        <span>{resumeData.personalInfo.phone}</span>
                    )}
                    {(resumeData.personalInfo.email || resumeData.personalInfo.phone) && resumeData.personalInfo.location && ' | '}
                    {resumeData.personalInfo.location && (
                        <span>{resumeData.personalInfo.location}</span>
                    )}
                </div>
            </div>

            {/* Summary */}
            {resumeData.summary && (
                <div style={{ marginBottom: '10pt' }}>
                    <h2 style={{
                        fontSize: '14.4pt',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        fontWeight: 'normal',
                        marginBottom: '0',
                        paddingBottom: '1pt',
                        borderBottom: '0.4pt solid black',
                        marginTop: '10pt'
                    }}>
                        Summary
                    </h2>
                    <p style={{
                        textAlign: 'justify',
                        fontSize: '10pt',
                        lineHeight: '1.3',
                        fontWeight: 'normal',
                        marginTop: '6pt',
                        marginBottom: '0'
                    }}>
                        {resumeData.summary}
                    </p>
                </div>
            )}

            {/* Skills */}
            {resumeData.skills.categories.length > 0 && (() => {
                // Calculate longest category name length
                const longestCategory = Math.max(
                    ...resumeData.skills.categories.map(cat => cat.name.length)
                );
                const labelWidth = `${longestCategory * 7 + 10}pt`; // Approximate width in points

                return (
                    <div style={{ marginBottom: '10pt' }}>
                        <h2 style={{
                            fontSize: '14.4pt',
                            textTransform: 'uppercase',
                            textAlign: 'left',
                            fontWeight: 'normal',
                            marginBottom: '0',
                            paddingBottom: '1pt',
                            borderBottom: '0.4pt solid black',
                            marginTop: '10pt'
                        }}>
                            Skills
                        </h2>
                        <div style={{ fontSize: '10pt', marginTop: '6pt' }}>
                            {resumeData.skills.categories.map((category) => (
                                <div key={category.id} style={{
                                    marginBottom: '2px',
                                    display: 'flex'
                                }}>
                                    <span style={{
                                        fontWeight: 'normal',
                                        minWidth: labelWidth,
                                        display: 'inline-block'
                                    }}>
                                        {category.name}:
                                    </span>
                                    <span style={{
                                        fontWeight: 'normal',
                                        flex: 1
                                    }}>
                                        {category.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
                <div style={{ marginBottom: '10pt' }}>
                    <h2 style={{
                        fontSize: '14.4pt',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        fontWeight: 'normal',
                        marginBottom: '0',
                        paddingBottom: '1pt',
                        borderBottom: '0.4pt solid black',
                        marginTop: '10pt'
                    }}>
                        Experience
                    </h2>
                    <div style={{ marginTop: '6pt' }}>
                        {resumeData.experience.map((exp) => (
                            <div key={exp.id} style={{
                                marginBottom: '9pt',
                                fontWeight: 'normal'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    marginBottom: '6pt',
                                    marginTop: '10pt'
                                }}>
                                    <div style={{
                                        fontSize: '12pt',
                                        fontWeight: 'normal'
                                    }}>
                                        <span style={{ fontWeight: 'bold' }}>{exp.position}</span>
                                        <span> at </span>
                                        <span style={{ fontWeight: 'bold' }}>{exp.company}</span>
                                        <span style={{ marginLeft: '4pt' }}>({exp.location})</span>
                                    </div>
                                    <span style={{
                                        fontSize: '12pt',
                                        fontWeight: 'normal'
                                    }}>
                                        {exp.startDate} - {exp.endDate}
                                    </span>
                                </div>
                                {exp.achievements.length > 0 && exp.achievements[0] && (
                                    <ul style={{
                                        fontSize: '10pt',
                                        marginTop: '2pt',
                                        marginBottom: '0',
                                        marginLeft: '1em',
                                        paddingLeft: '0',
                                        listStyleType: 'none',
                                        fontWeight: 'normal'
                                    }}>
                                        {exp.achievements.map((achievement, index) => (
                                            achievement && <li key={index} style={{
                                                lineHeight: '1.3',
                                                marginBottom: '3pt',
                                                position: 'relative',
                                                paddingLeft: '1.2em'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: '0'
                                                }}>•</span>
                                                {achievement}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && (
                <div style={{ marginBottom: '10pt' }}>
                    <h2 style={{
                        fontSize: '14.4pt',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        fontWeight: 'normal',
                        marginBottom: '0',
                        paddingBottom: '1pt',
                        borderBottom: '0.4pt solid black',
                        marginTop: '10pt'
                    }}>
                        Projects
                    </h2>
                    <div style={{ marginTop: '6pt' }}>
                        {resumeData.projects.map((project) => (
                            <div key={project.id} style={{
                                marginBottom: '9pt',
                                fontWeight: 'normal'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    marginBottom: '2pt'
                                }}>
                                    <h3 style={{
                                        fontSize: '12pt',
                                        fontWeight: 'bold',
                                        margin: '0'
                                    }}>
                                        {project.title}
                                    </h3>
                                    {project.link && (
                                        <a href={project.link} target='_blank' style={{
                                            color: 'rgb(0, 51, 153)',
                                            textDecoration: 'none',
                                            fontSize: '12pt',
                                            fontWeight: 'normal'
                                        }}>
                                            Live Demo
                                        </a>
                                    )}
                                </div>
                                {project.technologies && (
                                    <p style={{
                                        fontSize: '9pt',
                                        fontStyle: 'italic',
                                        marginBottom: '2pt',
                                        marginTop: '0',
                                        fontWeight: 'normal'
                                    }}>
                                        Tech Stack: {project.technologies}
                                    </p>
                                )}
                                {project.description.length > 0 && project.description[0] && (
                                    <ul style={{
                                        fontSize: '10pt',
                                        marginTop: '2pt',
                                        marginBottom: '0',
                                        marginLeft: '1em',
                                        paddingLeft: '0',
                                        listStyleType: 'none',
                                        fontWeight: 'normal'
                                    }}>
                                        {project.description.map((desc, index) => (
                                            desc && <li key={index} style={{
                                                lineHeight: '1.3',
                                                marginBottom: '3pt',
                                                position: 'relative',
                                                paddingLeft: '1.2em'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: '0'
                                                }}>•</span>
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
                <div style={{ marginBottom: '10pt' }}>
                    <h2 style={{
                        fontSize: '14.4pt',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        fontWeight: 'normal',
                        marginBottom: '0',
                        paddingBottom: '1pt',
                        borderBottom: '0.4pt solid black',
                        marginTop: '10pt'
                    }}>
                        Education
                    </h2>
                    <div style={{
                        fontSize: '11pt',
                        marginTop: '6pt',
                        fontWeight: 'normal'
                    }}>
                        {resumeData.education.map((edu) => (
                            <div key={edu.id} style={{
                                marginBottom: '6pt',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline'
                            }}>
                                <div>
                                    <span style={{ fontWeight: 'normal', marginLeft: '1em' }}>
                                        {edu.degree} in{' '}
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {edu.field}
                                    </span>
                                    <span style={{ fontWeight: 'normal' }}>
                                        {' '}at{' '}
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {edu.institution}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '1em', whiteSpace: 'nowrap' }}>
                                    {edu.gpa && (
                                        <span style={{ fontWeight: 'normal' }}>
                                            (GPA: {edu.gpa})
                                        </span>
                                    )}
                                    <span style={{ fontWeight: 'normal' }}>
                                        {edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications & Achievements */}
            {resumeData.certifications.length > 0 && (
                <div style={{ marginBottom: '10pt' }}>
                    <h2 style={{
                        fontSize: '14.4pt',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        fontWeight: 'normal',
                        marginBottom: '0',
                        paddingBottom: '1pt',
                        borderBottom: '0.4pt solid black',
                        marginTop: '10pt'
                    }}>
                        Certifications & Achievements
                    </h2>
                    <ul style={{
                        fontSize: '10pt',
                        marginTop: '6pt',
                        marginBottom: '0',
                        marginLeft: '1em',
                        paddingLeft: '0',
                        listStyleType: 'none',
                        fontWeight: 'normal'
                    }}>
                        {resumeData.certifications.map((cert) => (
                            <li key={cert.id} style={{
                                lineHeight: '1.3',
                                marginBottom: '3pt',
                                position: 'relative',
                                paddingLeft: '1.2em',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '0'
                                }}>•</span>
                                <span>
                                    {cert.name}
                                    {cert.issuer && ` – ${cert.issuer}`}
                                    {cert.date && ` (${cert.date})`}
                                </span>
                                {cert.link && (
                                    <a href={cert.link} target='_blank' style={{
                                        color: 'rgb(0, 51, 153)',
                                        textDecoration: 'none',
                                        marginLeft: '1em',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        View Credential
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );


    return (
        <>
            <Header />
            <div className="flex flex-col pt-24">
                {/* Top Controls */}
                <div className="bg-white dark:bg-black shadow-md top-16 z-30 border-b border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            {/* Left: Tab Buttons */}
                            <div className="flex gap-2 flex-wrap justify-center">
                                <button
                                    onClick={() => setActiveTab("editor")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeTab === "editor"
                                        ? "bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 dark:hover:bg-resume-secondary/80 text-white"
                                        : "bg-gray-300 text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    <Edit3 size={16} />
                                    Editor
                                </button>

                                <button
                                    onClick={() => setActiveTab("layout")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeTab === "layout"
                                        ? "bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 dark:hover:bg-resume-secondary/80 text-white"
                                        : "bg-gray-300 text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    <Settings size={16} />
                                    Layout
                                </button>
                            </div>

                            {/* Right: Action Buttons */}
                            <div className="flex gap-2 flex-wrap justify-center">
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="relative px-4 py-2 text-sm font-medium rounded-lg bg-green-500 dark:bg-gray-800 text-white flex items-center gap-2 transition-colors duration-200 overflow-hidden disabled:opacity-80"
                                >
                                    {/* Progress bar background */}
                                    <div
                                        className="absolute inset-0 bg-green-700 dark:bg-gray-950 transition-all duration-300 ease-out"
                                        style={{
                                            width: `${downloadProgress}%`,
                                            left: 0
                                        }}
                                    />

                                    {/* Button content */}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {isDownloading ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <ShinyText
                                                    text={`Downloading... ${downloadProgress}%`}
                                                    disabled={false}
                                                    speed={3}
                                                    className="custom-class"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Download size={16} />
                                                <ShinyText
                                                    text="Download PDF"
                                                    disabled={false}
                                                    speed={3}
                                                    className="custom-class"
                                                />
                                            </>
                                        )}
                                    </span>
                                </button>

                                <button
                                    onClick={resetAllData}
                                    disabled={isDownloading}
                                    className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-colors duration-200 disabled:opacity-50"
                                >
                                    <RotateCcw size={16} />
                                    Reset
                                </button>
                            </div>
                        </div>

                        {lastSaved && (
                            <p className="text-xs text-gray-500 text-center mt-2">
                                Last saved: {lastSaved}
                            </p>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {activeTab === 'editor' ? (
                        <div className="flex flex-col custom:flex-row justify-center items-center gap-4 p-4">
                            <style>
                                {`
                                    @media (min-width: 1185px) {
                                    .responsive-flex {
                                        flex-direction: row !important;
                                        }
                                    }
                                `}
                            </style>
                            {/* Editor Panel */}
                            <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 overflow-y-auto h-full custom:max-h-[calc(100vh-200px)] w-full custom:w-[500pt] max-w-full">
                                {/* Section Navigation */}
                                <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    {[
                                        { id: 'personal', icon: User, label: 'Personal' },
                                        { id: 'summary', icon: NotebookPen, label: 'Summary' },
                                        { id: 'skills', icon: Code, label: 'Skills' },
                                        { id: 'projects', icon: FolderOpen, label: 'Projects' },
                                        { id: 'experience', icon: Briefcase, label: 'Experience' },
                                        { id: 'education', icon: GraduationCap, label: 'Education' },
                                        { id: 'certifications', icon: Award, label: 'Certifications' }
                                    ].map(({ id, icon: Icon, label }) => (
                                        <button
                                            key={id}
                                            onClick={() => setActiveSection(id as ActiveSection)}
                                            className={cn(
                                                "px-3 py-2 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200",
                                                activeSection === id
                                                    ? "bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 dark:hover:bg-resume-secondary/80 shadow-md"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                            )}
                                        >
                                            <Icon size={16} />
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Section Content */}
                                {activeSection === 'personal' && renderPersonalInfoEditor()}
                                {activeSection === 'summary' && renderSummaryEditor()}
                                {activeSection === 'skills' && renderSkillsEditor()}
                                {activeSection === 'projects' && renderProjectsEditor()}
                                {activeSection === 'experience' && renderExperienceEditor()}
                                {activeSection === 'education' && renderEducationEditor()}
                                {activeSection === 'certifications' && renderCertificationsEditor()}
                            </div>

                            {/* Preview Panel */}
                            <div className="bg-gray-200 dark:bg-black rounded-lg shadow-lg p-6 overflow-x-auto custom:overflow-y-auto max-h-[calc(100vh-200px)] w-full custom:w-[620pt]">
                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <Eye size={20} />
                                        <GradientText
                                            colors={["#9BBD67", "#26C168", "#92C8C0", "#4079ff", "#E3F1E8"]}
                                            animationSpeed={10}
                                            showBorder={false}
                                            className="text-xl"
                                        >
                                            Live Preview
                                        </GradientText>
                                    </h2>

                                    {warnings.length > 0 && (
                                        <button
                                            onClick={() => setIsSuggestionsOpen(true)}
                                            className="relative px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-2 dark:bg-yellow-900/20 dark:text-yellow-400"
                                        >
                                            <Lightbulb size={16} />
                                            {warnings.length} Suggestions
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                                                {warnings.length}
                                            </span>
                                        </button>
                                    )}
                                </div>

                                <div
                                    id="resume-preview"
                                    style={{
                                        fontSize: `${layoutSettings.fontSize}px`,
                                        lineHeight: layoutSettings.lineHeight,
                                        fontFamily: layoutSettings.fontFamily,
                                        padding: `${layoutSettings.margins.top}px ${layoutSettings.margins.right}px ${layoutSettings.margins.bottom}px ${layoutSettings.margins.left}px`,
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        maxWidth: '100%',
                                    }}
                                    className="resume-preview bg-white text-black"
                                >
                                    {renderResumePreview()}
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'layout' ? (
                        <div className="p-6">
                            {renderLayoutSettings()}
                        </div>
                    ) : null}
                </div>

                {/* Suggestions Overlay */}
                {isSuggestionsOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-black rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                                <h3 className="text-2xl font-semibold flex items-center gap-2 text-resume-primary dark:text-resume-secondary">
                                    <Lightbulb size={24} />
                                    Resume Suggestions
                                </h3>
                                <button
                                    onClick={() => setIsSuggestionsOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {warnings.length > 0 ? (
                                    warnings.map((warning, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3"
                                        >
                                            <Check className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                                            <p className="text-yellow-800 dark:text-yellow-400">{warning}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex gap-3">
                                        <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                        <p className="text-green-800 dark:text-green-400">
                                            Great! Your resume looks complete.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}