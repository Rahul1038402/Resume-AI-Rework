import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Download, User, Briefcase, GraduationCap, Award, Code, FolderOpen, Settings, Eye, X, Lightbulb, Check, RotateCcw, NotebookPen } from 'lucide-react';
import Header from '@/components/Header';
import ShinyText from '@/components/ui/ShinyText';
import { cn } from '@/lib/utils';
import '../index.css';
import GradientText from '@/components/ui/GradientText';

interface PersonalInfo {
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

interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
}

interface Project {
    id: string;
    title: string;
    technologies: string;
    description: string[];
    link?: string;
}

interface Experience {
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string[];
}

interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
    link?: string;
}

interface SkillCategory {
    id: string;
    name: string;
    value: string;
}

interface Skills {
    categories: SkillCategory[];
}

interface ResumeData {
    personalInfo: PersonalInfo;
    summary: string;
    skills: Skills;
    projects: Project[];
    experiences: Experience[];
    education: Education[];
    certifications: Certification[];
}

type ActiveTab = 'editor' | 'layout';
type ActiveSection = 'personal' | 'summary' | 'skills' | 'projects' | 'experience' | 'education' | 'certifications';

interface LayoutSettings {
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

// LocalStorage constants
const STORAGE_KEY_RESUME = 'resume-builder-data';
const STORAGE_KEY_LAYOUT = 'resume-builder-layout';
const STORAGE_KEY_TIMESTAMP = 'resume-builder-timestamp';

export default function ResumeBuilder() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
    const [activeSection, setActiveSection] = useState<ActiveSection>('personal');
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);
    const [lastSaved, setLastSaved] = useState<string>('');

    // LocalStorage utility functions
    const saveToLocalStorage = (key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            localStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().toISOString());
            setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    };

    const loadFromLocalStorage = (key: string) => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    };

    const getDefaultResumeData = (): ResumeData => ({
        personalInfo: {
            firstName: 'Your Name',
            lastName: '',
            email: 'abc@gmail.com',
            phone: '+91 12345 67890',
            location: 'Sector XX, City, State',
            targetJobTitle: 'Your Target Job Title'
        },
        summary: 'A short professional summary goes here. Highlight your key skills and experience in 2-3 sentences.',
        skills: {
            categories: [
                { id: '1', name: 'Frontend', value: 'Skill 1, Skill 2, Skill 3' },
                { id: '2', name: 'Backend', value: 'Skill 1, Skill 2, Skill 3' },
                { id: '3', name: 'Database', value: 'Skill 1, Skill 2, Skill 3' },
            ]
        },
        projects: [],
        experiences: [],
        education: [
            {
                id: '1',
                institution: 'Institution Name',
                degree: 'Degree Name',
                field: 'Field of Study',
                graduationDate: 'Graduation Date',
                gpa: 'GPA (optional)'
            }
        ],
        certifications: []
    });

    const getDefaultLayoutSettings = (): LayoutSettings => ({
        fontSize: 9.5,
        lineHeight: "1.3",
        pageSize: "A4",
        fontFamily: "Arial",
        margins: {
            left: 0.5,
            right: 0.5,
            top: 0.5,
            bottom: 0.5,
        },
    });

    const resetAllData = () => {
        const confirmReset = window.confirm(
            "Are you sure you want to reset all data? This will permanently delete all your resume information and cannot be undone."
        );

        if (confirmReset) {
            try {
                // Clear localStorage
                localStorage.removeItem(STORAGE_KEY_RESUME);
                localStorage.removeItem(STORAGE_KEY_LAYOUT);
                localStorage.removeItem(STORAGE_KEY_TIMESTAMP);

                // Reset state to defaults
                setResumeData(getDefaultResumeData());
                setLayoutSettings(getDefaultLayoutSettings());
                setLastSaved('');

                // Reset UI state
                setActiveTab('editor');
                setActiveSection('personal');
                setEditingId(null);
                setEditingName('');
            } catch (error) {
                console.error('Failed to reset data:', error);
                alert('Failed to reset data. Please try again.');
            }
        }
    };

    const [resumeData, setResumeData] = useState<ResumeData>(() => {
        const saved = loadFromLocalStorage(STORAGE_KEY_RESUME);
        return saved || getDefaultResumeData();
    });

    const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(() => {
        const saved = loadFromLocalStorage(STORAGE_KEY_LAYOUT);
        return saved || getDefaultLayoutSettings();
    });

    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

    // Auto-save resume data to localStorage
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveToLocalStorage(STORAGE_KEY_RESUME, resumeData);
        }, 1000); // Debounce saves by 1 second

        return () => clearTimeout(timeoutId);
    }, [resumeData]);

    // Auto-save layout settings to localStorage
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveToLocalStorage(STORAGE_KEY_LAYOUT, layoutSettings);
        }, 500); // Shorter debounce for layout changes

        return () => clearTimeout(timeoutId);
    }, [layoutSettings]);

    // Load timestamp on mount
    useEffect(() => {
        const timestamp = localStorage.getItem(STORAGE_KEY_TIMESTAMP);
        if (timestamp) {
            const date = new Date(timestamp);
            setLastSaved(date.toLocaleTimeString());
        }
    }, []);

    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const addSkillCategory = () => {
        const newCategory = {
            id: Date.now().toString(),
            name: 'New Category',
            value: ''
        };

        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                categories: [...(prev.skills.categories || []), newCategory]
            }
        }));
    };

    const removeSkillCategory = (id) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                categories: prev.skills.categories.filter(cat => cat.id !== id)
            }
        }));
    };

    const updateSkillCategory = (id, field, value) => {
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

    const startEditing = (id, currentName) => {
        setEditingId(id);
        setEditingName(currentName);
    };

    const saveEdit = (id) => {
        updateSkillCategory(id, 'name', editingName);
        setEditingId(null);
        setEditingName('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const addProject = () => {
        const newProject = {
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

    const updateProject = (id: string, field: keyof Project, value: any) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(project =>
                project.id === id ? { ...project, [field]: value } : project
            )
        }));
    };

    const deleteProject = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter(project => project.id !== id)
        }));
    };

    const addProjectDescription = (projectId: string) => {
        updateProject(projectId, 'description', [...resumeData.projects.find(p => p.id === projectId)?.description || [], '']);
    };

    const updateProjectDescription = (projectId: string, index: number, value: string) => {
        const project = resumeData.projects.find(p => p.id === projectId);
        if (project) {
            const newDescription = [...project.description];
            newDescription[index] = value;
            updateProject(projectId, 'description', newDescription);
        }
    };

    const removeProjectDescription = (projectId: string, index: number) => {
        const project = resumeData.projects.find(p => p.id === projectId);
        if (project && project.description.length > 1) {
            const newDescription = project.description.filter((_, i) => i !== index);
            updateProject(projectId, 'description', newDescription);
        }
    };

    const addExperience = () => {
        const newExperience: Experience = {
            id: Date.now().toString(),
            title: '',
            company: '',
            duration: '',
            description: ['']
        };
        setResumeData(prev => ({
            ...prev,
            experiences: [...prev.experiences, newExperience]
        }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: any) => {
        setResumeData(prev => ({
            ...prev,
            experiences: prev.experiences.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const deleteExperience = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            experiences: prev.experiences.filter(exp => exp.id !== id)
        }));
    };

    const addExperienceDescription = (experienceId: string) => {
        updateExperience(experienceId, 'description', [...resumeData.experiences.find(p => p.id === experienceId)?.description || [], '']);
    };

    const updateExperienceDescription = (experienceId: string, index: number, value: string) => {
        const experience = resumeData.experiences.find(p => p.id === experienceId);
        if (experience) {
            const newDescription = [...experience.description];
            newDescription[index] = value;
            updateExperience(experienceId, 'description', newDescription);
        }
    };

    const removeExperienceDescription = (experienceId: string, index: number) => {
        const experience = resumeData.experiences.find(p => p.id === experienceId);
        if (experience && experience.description.length > 1) {
            const newDescription = experience.description.filter((_, i) => i !== index);
            updateExperience(experienceId, 'description', newDescription);
        }
    };

    const addEducation = () => {
        const newEducation: Education = {
            id: Date.now().toString(),
            institution: '',
            degree: '',
            field: '',
            graduationDate: '',
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
        const newCertification = {
            id: Date.now().toString(),
            name: '',
            issuer: '',
            date: '',
            credentialId: '',
            link: ''
        };
        setResumeData(prev => ({
            ...prev,
            certifications: [...prev.certifications, newCertification]
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

    const updateLayoutSettings = (field: string, value: any) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setLayoutSettings(prev => ({
                ...prev,
                [parent]: { ...(prev[parent as keyof LayoutSettings] as object), [child]: value }
            }));
        } else {
            setLayoutSettings(prev => ({ ...prev, [field]: value }));
        }
    };

    const roundToOneDecimal = (num: number): number => {
        return Math.round(num * 10) / 10;
    };

    const updateMargin = (side: 'left' | 'right' | 'top' | 'bottom', increment: number) => {
        setLayoutSettings(prev => ({
            ...prev,
            margins: {
                ...prev.margins,
                [side]: Math.max(0.1, Math.min(2, roundToOneDecimal(prev.margins[side] + increment)))
            }
        }));
    };

    const handleDownload = () => {
        const resumeEl = document.querySelector("#resume-preview");
        if (!resumeEl) return;

        // Keep your existing print styles if you have them; this is just a placeholder hook.
        const printStyle = document.createElement("style");
        printStyle.textContent = `
            @media print {
            body * { visibility: hidden; }
            #resume-preview, #resume-preview * { visibility: visible; }
            #resume-preview { position: absolute; left: 0; top: 0; width: 100% !important; }

            .resume-page:nth-of-type(n+2) {
                display: none !important;
            }

            .resume-page {
            page-break-after: auto !important;
            break-after: auto !important;
            }

            .resume-page:last-child {
                page-break-after: auto;
            }
            .resume-section {
                page-break-inside: avoid;
            }
            .resume-item {
                page-break-inside: avoid;
            }
            }
        `;
        document.head.appendChild(printStyle);

        // Different hint for mobile vs desktop (many mobile UIs don't expose page range)
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const msg = isMobile
            ? `Note: On mobile, the print dialog may not let you pick a page range.\nIf you see extra blank pages, save as PDF and share only page 1.`
            : `Tip: The number of pages while printing pdf may have some blank pages too, navigate "Pages" -> "Custom" and set 1–1 to print only the first page.`;

        const proceed = window.confirm(`${msg}\n\nOpen the print dialog now?`);
        if (!proceed) {
            document.head.removeChild(printStyle);
            return;
        }

        const cleanup = () => {
            try {
                document.head.removeChild(printStyle);
            } catch (_) { }
            window.removeEventListener("afterprint", cleanup);
        };

        window.addEventListener("afterprint", cleanup);
        window.print();
    };

    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const checkContentHeight = () => {
            const resumePageEl = document.querySelector(".resume-page");
            if (!resumePageEl) return;

            const contentHeight = resumePageEl.scrollHeight;
            const pageHeightPx =
                layoutSettings.pageSize === "A4" ? 11.7 * 96 : 11 * 96;

            if (contentHeight > pageHeightPx) {
                setShowWarning(true);
            } else {
                setShowWarning(false);
            }
        };

        checkContentHeight();
        window.addEventListener("resize", checkContentHeight);

        return () => window.removeEventListener("resize", checkContentHeight);
    }, [resumeData, layoutSettings]);

    const sectionIcons = {
        personal: User,
        summary: Edit3,
        skills: Code,
        projects: FolderOpen,
        experience: Briefcase,
        education: GraduationCap,
        certifications: Award
    };

    const renderEditorContent = () => {
        switch (activeSection) {
            case 'personal':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={resumeData.personalInfo.firstName}
                                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                                    className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={resumeData.personalInfo.lastName}
                                    onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                                    className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Target Job Title</label>
                            <input
                                type="text"
                                value={resumeData.personalInfo.targetJobTitle}
                                onChange={(e) => updatePersonalInfo('targetJobTitle', e.target.value)}
                                className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                placeholder="e.g., Frontend Developer, Data Analyst"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={resumeData.personalInfo.email}
                                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Phone Number</label>
                            <input
                                type="text"
                                value={resumeData.personalInfo.phone}
                                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                placeholder="Your phone number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Location</label>
                            <input
                                type="text"
                                value={resumeData.personalInfo.location}
                                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                placeholder="City, State"
                            />
                        </div>

                        {/* Professional Links Section */}
                        <div className="mt-6">
                            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-300 mb-3">Professional Links</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        value={resumeData.personalInfo.linkedinUrl || ''}
                                        onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
                                        className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="https://linkedin.com/in/yoursummary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={resumeData.personalInfo.githubUrl || ''}
                                        onChange={(e) => updatePersonalInfo('githubUrl', e.target.value)}
                                        className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="https://github.com/yourusername"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Portfolio URL</label>
                                    <input
                                        type="url"
                                        value={resumeData.personalInfo.portfolioUrl || ''}
                                        onChange={(e) => updatePersonalInfo('portfolioUrl', e.target.value)}
                                        className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">LeetCode URL</label>
                                    <input
                                        type="url"
                                        value={resumeData.personalInfo.leetcodeUrl || ''}
                                        onChange={(e) => updatePersonalInfo('leetcodeUrl', e.target.value)}
                                        className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="https://leetcode.com/yourusername"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'summary':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">Professional Summary</h3>
                        <div>
                            <label className="block text-sm font-medium text-center text-gray-700 dark:text-gray-400 mb-1">Summary</label>
                            <textarea
                                value={resumeData.summary}
                                onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                                className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                rows={4}
                                placeholder="Brief 2-3 lines summary highlighting your key skills, experience level, and career focus..."
                            />
                        </div>
                    </div>
                );

            case 'skills':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center justify-between mb-6">
                            <h3 className="text-xl font-medium text-resume-primary dark:text-resume-secondary mb-6">Technical Skills</h3>
                            <button
                                onClick={addSkillCategory}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors duration-200"
                            >
                                <Plus size={16} />
                                Add Category
                            </button>
                        </div>

                        <div className="space-y-4">
                            {(resumeData.skills.categories || []).map((category) => (
                                <div key={category.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        {editingId === category.id ? (
                                            <div className="flex items-center gap-2 flex-1">
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="flex-1 p-1 text-sm border rounded focus:ring-2 border-resume-primary focus:ring-resume-primary focus:border-resume-primary dark:border-resume-secondary dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none dark:bg-gray-700"
                                                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(category.id)}
                                                />
                                                <button
                                                    onClick={() => saveEdit(category.id)}
                                                    className="p-1 text-green-600 hover:text-green-700"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="p-1 text-red-600 hover:text-red-700"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 flex-1">
                                                    {category.name}
                                                </label>
                                                <button
                                                    onClick={() => startEditing(category.id, category.name)}
                                                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => removeSkillCategory(category.id)}
                                                    className="p-1 text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={category.value}
                                        onChange={(e) => updateSkillCategory(category.id, 'value', e.target.value)}
                                        className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary focus:ring-resume-primary focus:border-resume-primary dark:border-resume-secondary dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Enter skills separated by commas..."
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'projects':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col justify-between items-center">
                            <h3 className="text-xl font-medium text-resume-primary dark:text-resume-secondary mb-6">Projects</h3>
                            <button
                                onClick={addProject}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                            >
                                <Plus size={16} /> Add Project
                            </button>
                        </div>
                        {resumeData.projects.map((project, index) => (
                            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-800 dark:text-gray-400">Project {index + 1}</h4>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                                        className="w-full p-2 text-sm dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Project Title"
                                    />
                                    <input
                                        type="url"
                                        value={project.link || ''}
                                        onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                                        className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Project Link (optional) - e.g., https://github.com/username/project"
                                    />
                                    <input
                                        type="text"
                                        value={project.technologies}
                                        onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                                        className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Tech Stack used (e.g., React, Node.js, MongoDB)"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Description Points</label>
                                        {project.description.map((desc, descIndex) => (
                                            <div key={descIndex} className="flex gap-2 mb-2">
                                                <textarea
                                                    value={desc}
                                                    onChange={(e) => updateProjectDescription(project.id, descIndex, e.target.value)}
                                                    className="flex-1 p-2 text-xs dark:bg-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Description point"
                                                    rows={3}
                                                />
                                                {project.description.length > 1 && (
                                                    <button
                                                        onClick={() => removeProjectDescription(project.id, descIndex)}
                                                        className="text-red-500 hover:text-red-700 px-2"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addProjectDescription(project.id)}
                                            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Add Description Point
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'experience':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col justify-between items-center">
                            <h3 className="text-xl font-medium text-resume-primary dark:text-resume-secondary mb-6">Work Experience</h3>
                            <button
                                onClick={addExperience}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                            >
                                <Plus size={16} /> Add Experience
                            </button>
                        </div>
                        {resumeData.experiences.map((exp, index) => (
                            <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-800 dark:text-gray-400">Experience {index + 1}</h4>
                                    <button
                                        onClick={() => deleteExperience(exp.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={exp.title}
                                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                        className="w-full p-2 dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Job Title"
                                    />
                                    <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                        className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Company Name"
                                    />
                                    <input
                                        type="text"
                                        value={exp.duration}
                                        onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                                        className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Duration (e.g., Jun 2024 - Aug 2024)"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Description Points</label>
                                        {exp.description.map((desc, descIndex) => (
                                            <div key={descIndex} className="flex gap-2 mb-2">
                                                <textarea
                                                    value={desc}
                                                    onChange={(e) => updateExperienceDescription(exp.id, descIndex, e.target.value)}
                                                    className="flex-1 p-2 text-xs dark:bg-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Description point"
                                                    rows={3}
                                                />
                                                {exp.description.length > 1 && (
                                                    <button
                                                        onClick={() => removeExperienceDescription(exp.id, descIndex)}
                                                        className="text-red-500 hover:text-red-700 px-2"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addExperienceDescription(exp.id)}
                                            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Add Description Point
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'education':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col justify-between items-center">
                            <h3 className="text-xl font-medium text-resume-primary dark:text-resume-secondary mb-6">Education</h3>
                            <button
                                onClick={addEducation}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                            >
                                <Plus size={16} /> Add Education
                            </button>
                        </div>
                        {resumeData.education.map((edu, index) => (
                            <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-800 dark:text-gray-400">Education {index + 1}</h4>
                                    <button
                                        onClick={() => deleteEducation(edu.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                        className="w-full p-2 dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Institution Name"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                            className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                            placeholder="Degree (e.g., Bachelor of Technology)"
                                        />
                                        <input
                                            type="text"
                                            value={edu.field}
                                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                            className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                            placeholder="Field of Study"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={edu.graduationDate}
                                            onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                                            className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                            placeholder="Graduation Date"
                                        />
                                        <input
                                            type="text"
                                            value={edu.gpa || ''}
                                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                            className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                            placeholder="GPA (optional)"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'certifications':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col justify-between items-center">
                            <h3 className="text-xl font-medium text-resume-primary dark:text-resume-secondary mb-6">Certifications / Achievements</h3>
                            <button
                                onClick={addCertification}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                            >
                                <Plus size={16} /> Add Certifications / Achievements
                            </button>
                        </div>
                        {resumeData.certifications.map((cert, index) => (
                            <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-800 dark:text-gray-400">Certification / Achievements {index + 1}</h4>
                                    <button
                                        onClick={() => deleteCertification(cert.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={cert.name}
                                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                        className="w-full p-2 text-sm dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Certification / Achievements Name"
                                    />

                                    <input
                                        type="url"
                                        value={cert.link || ''}
                                        onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                                        className="w-full p-2 text-sm dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Certification Link (optional) - e.g., https://credential-url.com"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={cert.issuer}
                                            onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                            className="w-full p-2 text-sm dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                            placeholder="Issuing Organization"
                                        />
                                        <input
                                            type="text"
                                            value={cert.date}
                                            onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                            className="w-full p-2 text-sm dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                            placeholder="Date"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={cert.credentialId || ''}
                                        onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                                        className="w-full p-2 text-sm dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                        placeholder="Credential ID (optional)"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    const renderLayoutSettings = () => {
        return (
            <div className="space-y-6">
                <h3 className="text-xl font-medium text-resume-primary dark:text-resume-secondary mb-6">Layout & Style</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                            Font Size
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    updateLayoutSettings("fontSize", Math.max(8, layoutSettings.fontSize - 0.5))
                                }
                                className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                -
                            </button>

                            <span className="text-sm">{layoutSettings.fontSize}</span>

                            <button
                                onClick={() =>
                                    updateLayoutSettings("fontSize", Math.min(16, layoutSettings.fontSize + 0.5))
                                }
                                className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                +
                            </button>

                            <button
                                onClick={() => updateLayoutSettings("fontSize", 9.5)}
                                className="border border-blue-400 font-semibold rounded-md px-3 py-1 text-xs text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800/45 transition-colors duration-200 ml-4"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Font Family</label>
                        <select
                            value={layoutSettings.fontFamily || 'Arial'}
                            onChange={(e) => updateLayoutSettings('fontFamily', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="Arial">Arial</option>
                            <option value="Calibri">Calibri</option>
                            <option value="Cambria">Cambria</option>
                            <option value="Garamond">Garamond</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Line Height</label>
                        <select
                            value={layoutSettings.lineHeight}
                            onChange={(e) => updateLayoutSettings('lineHeight', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="1.15">1.15 Condensed</option>
                            <option value="1.3">1.3 Normal</option>
                            <option value="1.5">1.5 Relaxed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Page Size</label>
                        <select
                            value={layoutSettings.pageSize}
                            onChange={(e) => updateLayoutSettings('pageSize', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="A4">A4 (210 x 297 mm)</option>
                            <option value="Letter">Letter (8.5 x 11 in)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Margins (in inches)</label>
                        <div className="grid grid-cols-2 gap-3">
                            {(['left', 'right', 'top', 'bottom'] as const).map(side => (
                                <div key={side} className="flex items-center gap-2">
                                    <label className="text-xs text-gray-700 dark:text-gray-400 w-12 capitalize">{side}</label>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => updateMargin(side, -0.1)}
                                            className="h-6 w-6 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            -
                                        </button>
                                        <span className="text-xs w-8 text-center">{layoutSettings.margins[side].toFixed(1)}</span>
                                        <button
                                            onClick={() => updateMargin(side, 0.1)}
                                            className="h-6 w-6 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Header />
            <div className="flex flex-col pt-24">
                <div className="text-center mb-4">
                    <GradientText
                        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        animationSpeed={11}
                        showBorder={false}
                        className="text-5xl "
                    >
                        <p className="mb-5">
                            Resume Builder
                        </p>
                    </GradientText>

                </div>
                {/* Left Panel - Editor */}
                <div className="w-full border-r border-gray-200 border-b flex flex-col">
                    {/* Header with tabs and download button */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 mt-4 gap-2">
                            {/* Left buttons (Editor, Layout & Style, Reset) */}
                            <div className="flex gap-2 justify-center sm:justify-start">
                                <button
                                    onClick={() => setActiveTab("editor")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeTab === "editor"
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-gray-300 text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    <Edit3 size={16} /> Editor
                                </button>

                                <button
                                    onClick={() => setActiveTab("layout")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeTab === "layout"
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-gray-300 text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    <Settings size={16} /> Layout & Style
                                </button>

                                <button
                                    onClick={resetAllData}
                                    className="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                                    title="Reset all progress"
                                >
                                    <RotateCcw size={16} /> Reset
                                </button>
                            </div>

                            {/* Download Button */}
                            <div className="flex justify-center sm:justify-end sm:mt-0 mt-4">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2 bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/90 hover:dark:bg-resume-secondary/80 text-white rounded-lg transition-colors duration-200"
                                >
                                    <Download className="font-medium" size={16} />{" "}
                                    <ShinyText
                                        text="Download PDF"
                                        disabled={false}
                                        speed={2}
                                        className="font-medium"
                                    />
                                </button>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-2 items-center justify-center'>
                            <div className='flex justify-center items-center space-x-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4'>
                                <NotebookPen className='size-8 sm:size-4 text-green-600' />
                                <p>Use this feature in tablet, laptop or desktop for a better resume preview.</p>
                            </div>

                            {lastSaved && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Last auto-saved at {lastSaved}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'editor' ? (
                            <div className="flex flex-col">
                                {/* Section Navigation */}
                                <div className="w-full sm:border-r sm:border-b border-t border-b border-gray-200 p-6">
                                    <h4 className="text-xl font-medium text-resume-primary dark:text-resume-secondary mb-6">Sections</h4>
                                    <nav className="grid grid-cols-2 gap-1">
                                        {Object.entries(sectionIcons).map(([section, Icon]) => (
                                            <button
                                                key={section}
                                                onClick={() => setActiveSection(section as ActiveSection)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 ${activeSection === section
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors duration-200'
                                                    }`}
                                            >
                                                <Icon size={16} />
                                                <span className="sm:inline">
                                                    {section === 'personal' ? 'Personal Info' :
                                                        section === 'summary' ? 'Summary' :
                                                            section === 'skills' ? 'Skills' :
                                                                section === 'projects' ? 'Projects' :
                                                                    section === 'experience' ? 'Experience' :
                                                                        section === 'education' ? 'Education' :
                                                                            'Certifications / Achievements'}
                                                </span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Section Editor */}
                                <div className="flex-1 p-6 pb-12">
                                    {renderEditorContent()}
                                </div>
                            </div>
                        ) : (
                            <div className="p-6">
                                {renderLayoutSettings()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Resume Preview */}
                <div className="text-xl font-medium text-center mt-10 mb-6 text-resume-primary dark:text-resume-secondary flex items-center justify-center gap-2">
                    <span className="p-2 border-2 rounded-full flex items-center justify-center">
                        <Eye size={20} className="text-resume-primary dark:text-resume-secondary" />
                    </span>
                    <span>PDF Preview</span>
                </div>

                {/* Suggestions Toggle Button */}
                <div className='flex justify-center items-center mb-6'>
                    <button
                        onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
                        className="ml-4 p-4 w-auto border-2 rounded-full flex items-center justify-center bg-amber-200/20 hover:bg-amber-200/40 dark:hover:bg-amber-200/30 transition-colors duration-200"
                    >
                        <Lightbulb size={20} className="text-amber-400" />
                        <p className='pl-3'>Click for Suggestions</p>
                    </button>
                </div>
            </div>

            {/* Suggestions Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center",
                    "transition-all duration-300",
                    isSuggestionsOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                )}
            >
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-resume-primary dark:text-resume-secondary">
                            Resume Building Tips
                        </h2>
                        <button
                            onClick={() => setIsSuggestionsOpen(false)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                        >
                            <X size={24} className="text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 text-left max-h-[60vh] overflow-y-auto">
                        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3 text-resume-primary dark:text-resume-secondary">
                                Keep it Concise
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Limit your resume to 1 page. Recruiters typically spend 6-10 seconds scanning a resume initially.
                            </p>
                        </div>

                        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3 text-resume-primary dark:text-resume-secondary">
                                Use Action Verbs
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Start bullet points with strong action verbs like 'Developed', 'Implemented', 'Optimized', 'Led', 'Collaborated'.
                            </p>
                        </div>

                        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3 text-resume-primary dark:text-resume-secondary">
                                Quantify Achievements
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Include numbers, percentages, and metrics wherever possible. Example: 'Improved performance by 40%' instead of 'Improved performance'.
                            </p>
                        </div>

                        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3 text-resume-primary dark:text-resume-secondary">
                                Tailor for Each Job
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Customize your resume for each application by highlighting relevant skills and experiences that match the job description.
                            </p>
                        </div>

                        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3 text-resume-primary dark:text-resume-secondary">
                                Use Keywords
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Include industry-specific keywords from the job posting to pass through Applicant Tracking Systems (ATS).
                            </p>
                        </div>

                        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3 text-resume-primary dark:text-resume-secondary">
                                Professional Formatting
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Use consistent fonts, spacing, and formatting. Ensure your resume is easy to read both digitally and when printed.
                            </p>
                        </div>

                        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3 text-resume-primary dark:text-resume-secondary">
                                Proofread Carefully
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Check for spelling, grammar, and formatting errors. Have someone else review it for a fresh perspective.
                            </p>
                        </div>

                        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3 text-resume-primary dark:text-resume-secondary">
                                Include Relevant Links
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Add links to your LinkedIn, GitHub, portfolio, or other professional profiles that showcase your work.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsSuggestionsOpen(false)}
                            className="bg-resume-primary hover:bg-resume-primary/90 dark:bg-resume-secondary dark:hover:bg-resume-secondary/90 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </div>

            {showWarning && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96 text-center">
                        <h2 className="text-lg font-bold text-red-600 mb-3">
                            ⚠ Content Exceeds Page Limit
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Your resume is longer than one {layoutSettings.pageSize} page.
                            Some content may be cut off when exporting to PDF/printing.
                        </p>
                        <button
                            onClick={() => setShowWarning(false)}
                            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                        >
                            Okay, Got It
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 flex justify-center items-center p-4 lg:p-8 overflow-y-auto bg-gray-200 dark:bg-black">
                <style>
                    {`
                        .resume-page {
                            page-break-after: always;
                            break-after: page;
                        }
                        .resume-page:last-child {
                            page-break-after: auto;
                            break-after: auto;
                        }
                        .resume-section {
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                        .resume-item {
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                        @media print {
                            .resume-page {
                                height: ${layoutSettings.pageSize === 'A4' ? '11.7in' : '11in'};
                                width: ${layoutSettings.pageSize === 'A4' ? '8.27in' : '8.5in'};
                                margin: 0;
                                padding: ${layoutSettings.margins.top}in ${layoutSettings.margins.right}in ${layoutSettings.margins.bottom}in ${layoutSettings.margins.left}in;
                                page-break-after: always;
                                font-family: "${layoutSettings.fontFamily || 'Arial'}", sans-serif;
                            }
                            .resume-page:last-child {
                                page-break-after: auto;
                            }
                        }
                    `}
                </style>

                <div id="resume-preview" className="space-y-8 sm:w-auto w-full">
                    {/* First Page */}
                    <div
                        className="bg-white resume-page"
                        style={{
                            width: layoutSettings.pageSize === 'A4' ? '8.27in' : '8.5in',
                            maxWidth: '100%',
                            height: layoutSettings.pageSize === 'A4' ? '11.7in' : '11in',
                            padding: `${layoutSettings.margins.top}in ${layoutSettings.margins.right}in ${layoutSettings.margins.bottom}in ${layoutSettings.margins.left}in`,
                            fontSize: `${layoutSettings.fontSize}px`,
                            lineHeight: layoutSettings.lineHeight,
                            fontFamily: `"${layoutSettings.fontFamily || 'Arial'}", sans-serif`,
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        {/* Header */}
                        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6 resume-section">
                            <div
                                className="font-bold text-black mb-2"
                                style={{ fontSize: `${layoutSettings.fontSize * 2.9}px` }}
                            >
                                {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                            </div>
                            <div
                                className="text-gray-600 mb-2"
                                style={{ fontSize: `${layoutSettings.fontSize * 1.7}px` }}
                            >
                                {resumeData.personalInfo.targetJobTitle}
                            </div>

                            {/* Contact Information Line */}
                            <div
                                className="text-gray-700 mb-2 flex flex-wrap justify-center items-center gap-1"
                                style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                            >
                                {/* Email with mailto link*/}
                                <a
                                    href={`mailto:${resumeData.personalInfo.email}`}
                                    className="text-black font-semibold underline"
                                >
                                    {resumeData.personalInfo.email}
                                </a>

                                {resumeData.personalInfo.phone && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <span>{resumeData.personalInfo.phone}</span>
                                    </>
                                )}

                                {resumeData.personalInfo.location && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <span>{resumeData.personalInfo.location}</span>
                                    </>
                                )}
                            </div>

                            {/* Professional Links Line */}
                            {(resumeData.personalInfo.linkedinUrl ||
                                resumeData.personalInfo.githubUrl ||
                                resumeData.personalInfo.portfolioUrl ||
                                resumeData.personalInfo.leetcodeUrl) && (
                                    <div
                                        className="text-gray-700 flex flex-wrap justify-center items-center gap-1"
                                        style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                                    >
                                        {resumeData.personalInfo.linkedinUrl && (
                                            <a
                                                href={
                                                    resumeData.personalInfo.linkedinUrl.startsWith("http")
                                                        ? resumeData.personalInfo.linkedinUrl
                                                        : `https://${resumeData.personalInfo.linkedinUrl}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-black font-semibold underline"
                                            >
                                                LinkedIn
                                            </a>
                                        )}

                                        {resumeData.personalInfo.githubUrl && (
                                            <>
                                                {resumeData.personalInfo.linkedinUrl && <span className="mx-1">•</span>}
                                                <a
                                                    href={
                                                        resumeData.personalInfo.githubUrl.startsWith("http")
                                                            ? resumeData.personalInfo.githubUrl
                                                            : `https://${resumeData.personalInfo.githubUrl}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black font-semibold underline"
                                                >
                                                    GitHub
                                                </a>
                                            </>
                                        )}

                                        {resumeData.personalInfo.portfolioUrl && (
                                            <>
                                                {(resumeData.personalInfo.linkedinUrl ||
                                                    resumeData.personalInfo.githubUrl) && <span className="mx-1">•</span>}
                                                <a
                                                    href={
                                                        resumeData.personalInfo.portfolioUrl.startsWith("http")
                                                            ? resumeData.personalInfo.portfolioUrl
                                                            : `https://${resumeData.personalInfo.portfolioUrl}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black font-semibold underline"
                                                >
                                                    Portfolio
                                                </a>
                                            </>
                                        )}

                                        {resumeData.personalInfo.leetcodeUrl && (
                                            <>
                                                {(resumeData.personalInfo.linkedinUrl ||
                                                    resumeData.personalInfo.githubUrl ||
                                                    resumeData.personalInfo.portfolioUrl) && (
                                                        <span className="mx-1">•</span>
                                                    )}
                                                <a
                                                    href={
                                                        resumeData.personalInfo.leetcodeUrl.startsWith("http")
                                                            ? resumeData.personalInfo.leetcodeUrl
                                                            : `https://${resumeData.personalInfo.leetcodeUrl}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black font-semibold underline"
                                                >
                                                    LeetCode
                                                </a>
                                            </>
                                        )}
                                    </div>
                                )}
                        </div>

                        {/* Summary Section */}
                        {resumeData.summary && (
                            <div className="mb-6 resume-section">
                                <h2
                                    className="font-bold text-black mb-3 pb-1 border-b border-gray-300 uppercase"
                                    style={{ fontSize: `${layoutSettings.fontSize * 1.7}px` }}
                                >
                                    Summary
                                </h2>
                                <p className="text-gray-700" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                    {resumeData.summary}
                                </p>
                            </div>
                        )}

                        {/* Technical Skills Section */}
                        {resumeData.skills.categories && resumeData.skills.categories.length > 0 && (
                            <div className="mb-6 resume-section">
                                <h2
                                    className="font-bold text-black mb-3 pb-1 border-b border-gray-300 uppercase"
                                    style={{ fontSize: `${layoutSettings.fontSize * 1.7}px` }}
                                >
                                    Technical Skills
                                </h2>
                                <div className="space-y-2">
                                    {resumeData.skills.categories.map((category) => (
                                        category.value && (
                                            <div key={category.id} className="flex flex-wrap">
                                                <strong className="text-black mr-2" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                                    {category.name}:
                                                </strong>
                                                <div className="text-gray-700" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                                    {category.value}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects Section */}
                        {resumeData.projects.length > 0 && (
                            <div className="mb-6 resume-section">
                                <h2
                                    className="font-bold text-black mb-3 pb-1 border-b border-gray-300 uppercase"
                                    style={{ fontSize: `${layoutSettings.fontSize * 1.7}px` }}
                                >
                                    Projects
                                </h2>
                                {resumeData.projects.map((project) => (
                                    <div key={project.id} className="mb-5 resume-item">
                                        <div className="flex justify-between items-start mb-1">
                                            <div
                                                className="font-bold text-black"
                                                style={{ fontSize: `${layoutSettings.fontSize * 1.5}px` }}
                                            >
                                                {project.title}
                                            </div>
                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black font-semibold underline ml-4 flex-shrink-0"
                                                    style={{ fontSize: `${layoutSettings.fontSize * 1.2}px` }}
                                                >
                                                    Link
                                                </a>
                                            )}
                                        </div>
                                        {project.technologies && (
                                            <div
                                                className="text-gray-600 italic mb-2"
                                                style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                                            >
                                                Tech Stack: {project.technologies}
                                            </div>
                                        )}
                                        <ul className="ml-5">
                                            {project.description.filter(desc => desc.trim()).map((desc, index) => (
                                                <li
                                                    key={index}
                                                    className="text-gray-700 mb-1"
                                                    style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                                                >
                                                    • {desc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Experience Section */}
                        {resumeData.experiences.length > 0 && (
                            <div className="mb-6 resume-section">
                                <h2
                                    className="font-bold text-black mb-3 pb-1 border-b border-gray-300 uppercase"
                                    style={{ fontSize: `${layoutSettings.fontSize * 1.7}px` }}
                                >
                                    Experience
                                </h2>
                                {resumeData.experiences.map((exp) => (
                                    <div key={exp.id} className="mb-5 resume-item">
                                        <div
                                            className="font-bold text-black mb-1"
                                            style={{ fontSize: `${layoutSettings.fontSize * 1.5}px` }}
                                        >
                                            {exp.title}
                                        </div>
                                        <div
                                            className="text-gray-600 mb-2"
                                            style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                                        >
                                            {exp.company} • {exp.duration}
                                        </div>
                                        <ul className="ml-5">
                                            {exp.description.filter(desc => desc.trim()).map((desc, index) => (
                                                <li
                                                    key={index}
                                                    className="text-gray-700 mb-1"
                                                    style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                                                >
                                                    • {desc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Education Section */}
                        {resumeData.education.length > 0 && (
                            <div className="mb-6 resume-section">
                                <h2
                                    className="font-bold text-black mb-3 pb-1 border-b border-gray-300 uppercase"
                                    style={{ fontSize: `${layoutSettings.fontSize * 1.7}px` }}
                                >
                                    Education
                                </h2>
                                {resumeData.education.map((edu) => (
                                    <div key={edu.id} className="mb-4 resume-item">
                                        <div
                                            className="font-bold text-black mb-1"
                                            style={{ fontSize: `${layoutSettings.fontSize * 1.5}px` }}
                                        >
                                            {edu.degree} - {edu.field}
                                        </div>
                                        <div
                                            className="text-gray-600"
                                            style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                                        >
                                            {edu.institution} • Expected Graduation: {edu.graduationDate}
                                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Certifications Section */}
                        {resumeData.certifications.length > 0 && (
                            <div className="mb-6 resume-section">
                                <h2
                                    className="font-bold text-black mb-3 pb-1 border-b border-gray-300 uppercase"
                                    style={{ fontSize: `${layoutSettings.fontSize * 1.7}px` }}
                                >
                                    Certifications / Achievements
                                </h2>
                                <ul className="ml-5 list-disc list-outside">
                                    {resumeData.certifications.map((cert) => (
                                        <li
                                            key={cert.id}
                                            className="text-gray-700 mb-2 resume-item"
                                            style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                                        >
                                            <div>
                                                <strong>{cert.name}</strong> - {cert.issuer} ({cert.date})
                                                {cert.credentialId && ` - Credential ID: ${cert.credentialId}`}
                                            </div>
                                            {cert.link && (
                                                <div className="mt-1">
                                                    <a
                                                        href={cert.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-black font-bold underline"
                                                        style={{ fontSize: `${layoutSettings.fontSize * 1.2}px` }}
                                                    >
                                                        View Credential
                                                    </a>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}