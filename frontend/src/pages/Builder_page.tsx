import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Download, User, Briefcase, GraduationCap, Award, Code, FolderOpen, Settings } from 'lucide-react';
import html2pdf from "html2pdf.js";
import Header from '@/components/Header';
import ShinyText from '@/components/ui/ShinyText';

interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    targetJobTitle: string;
    linkedinUrl?: string;    // Add LinkedIn URL
    githubUrl?: string;      // Add GitHub URL  
    portfolioUrl?: string;   // Add Portfolio URL
    leetcodeUrl?: string;    // Add LeetCode URL
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
    link?: string; // Add this field
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
    link?: string; // Add this field
}

interface Skills {
    frontend: string;
    backend: string;
    database: string;
    tools: string;
    softSkills: string;
}

interface ResumeData {
    personalInfo: PersonalInfo;
    profile: string;
    skills: Skills;
    projects: Project[];
    experience: Experience[];
    education: Education[];
    certifications: Certification[];
}

type ActiveTab = 'editor' | 'layout';
type ActiveSection = 'personal' | 'profile' | 'skills' | 'projects' | 'experience' | 'education' | 'certifications';

interface LayoutSettings {
    fontSize: number;
    lineHeight: string;
    pageSize: string;
    margins: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
}

export default function ResumeBuilder() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
    const [activeSection, setActiveSection] = useState<ActiveSection>('personal');

    const [resumeData, setResumeData] = useState<ResumeData>({
        personalInfo: {
            firstName: 'Your Name',
            lastName: '',
            email: 'abc@gmail.com',
            phone: '+91 12345 67890',
            location: 'Sector XX, City, State',
            targetJobTitle: 'Your Target Job Title'
        },
        profile: 'A short professional summary goes here. Highlight your key skills and experience in 2–3 sentences.',
        skills: {
            frontend: 'Skill 1, Skill 2, Skill 3',
            backend: 'Skill 1, Skill 2, Skill 3',
            database: 'Skill 1, Skill 2, Skill 3',
            tools: 'Skill 1, Skill 2, Skill 3',
            softSkills: 'Skill 1, Skill 2, Skill 3'
        },
        projects: [],
        experience: [],
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

    const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
        fontSize: 9.5,
        lineHeight: '1.15',
        pageSize: 'A4',
        margins: {
            left: 0.4,
            right: 0.4,
            top: 0.4,
            bottom: 0.4
        }
    });

    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const updateSkill = (field: keyof Skills, value: string) => {
        setResumeData(prev => ({
            ...prev,
            skills: { ...prev.skills, [field]: value }
        }));
    };

    const addProject = () => {
        const newProject = {
            id: Date.now().toString(),
            title: '',
            technologies: '',
            description: [''],
            link: '' // Add link field
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
            experience: [...prev.experience, newExperience]
        }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: any) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
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
            link: '' // Add link field
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


    const handleDownload = () => {
        const element = document.querySelector("#resume-preview");
        if (!element) return;

        const opt = {
            margin: 0.5,
            filename: "resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        };

        html2pdf().from(element).set(opt).save();
    };

    const sectionIcons = {
        personal: User,
        profile: Edit3,
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
                        <h3 className="text-lg font-semibold text-resume-primary dark:text-resume-secondary mb-4">Personal Information</h3>
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
                                        placeholder="https://linkedin.com/in/yourprofile"
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

            case 'profile':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-resume-primary dark:text-resume-secondary mb-4">Professional Summary</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Profile</label>
                            <textarea
                                value={resumeData.profile}
                                onChange={(e) => setResumeData(prev => ({ ...prev, profile: e.target.value }))}
                                className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                rows={4}
                                placeholder="Brief 2-3 line summary highlighting your key skills, experience level, and career focus..."
                            />
                        </div>
                    </div>
                );

            case 'skills':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-resume-primary dark:text-resume-secondary mb-4">Technical Skills</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Frontend</label>
                                <input
                                    type="text"
                                    value={resumeData.skills.frontend}
                                    onChange={(e) => updateSkill('frontend', e.target.value)}
                                    className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                    placeholder="HTML5, CSS3, JavaScript, React, TypeScript"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Backend</label>
                                <input
                                    type="text"
                                    value={resumeData.skills.backend}
                                    onChange={(e) => updateSkill('backend', e.target.value)}
                                    className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                    placeholder="Node.js, Python, Flask, Express.js"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Database</label>
                                <input
                                    type="text"
                                    value={resumeData.skills.database}
                                    onChange={(e) => updateSkill('database', e.target.value)}
                                    className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                    placeholder="MySQL, MongoDB, PostgreSQL, Firebase"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Tools</label>
                                <input
                                    type="text"
                                    value={resumeData.skills.tools}
                                    onChange={(e) => updateSkill('tools', e.target.value)}
                                    className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                    placeholder="Git, GitHub, VS Code, Figma, Docker, AWS"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Soft Skills</label>
                                <input
                                    type="text"
                                    value={resumeData.skills.softSkills}
                                    onChange={(e) => updateSkill('softSkills', e.target.value)}
                                    className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                    placeholder="Problem Solving, Team Collaboration, Communication"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'projects':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col justify-between items-center">
                            <h3 className="text-lg text-center pb-6 font-semibold text-resume-primary dark:text-resume-secondary">Projects</h3>
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
                                        placeholder="Technologies used (e.g., React, Node.js, MongoDB)"
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
                            <h3 className="text-lg text-center pb-6 font-semibold text-resume-primary dark:text-resume-secondary">Work Experience</h3>
                            <button
                                onClick={addExperience}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                            >
                                <Plus size={16} /> Add Experience
                            </button>
                        </div>
                        {resumeData.experience.map((exp, index) => (
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Description</label>
                                        <textarea
                                            value={exp.description.join('\n')}
                                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
                                            className="w-full p-2 text-xs dark:bg-gray-700 border rounded-md focus:ring-2 border-resume-primary  focus:ring-resume-primary  focus:border-resume-primary  dark:border-resume-secondary  dark:focus:ring-resume-secondary dark:focus:border-resume-secondary focus:outline-none"
                                            rows={4}
                                            placeholder="Job responsibilities and achievements (one per line)"
                                        />
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
                            <h3 className="text-lg text-center pb-6 font-semibold text-resume-primary dark:text-resume-secondary">Education</h3>
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
                            <h3 className="text-lg text-center font-semibold text-resume-primary dark:text-resume-secondary pb-6">Certifications & Achievements</h3>
                            <button
                                onClick={addCertification}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                            >
                                <Plus size={16} /> Add Achievements
                            </button>
                        </div>
                        {resumeData.certifications.map((cert, index) => (
                            <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-800 dark:text-gray-400">Certification {index + 1}</h4>
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
                                        placeholder="Certification Name"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Font Size</label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => updateLayoutSettings('fontSize', Math.max(8, layoutSettings.fontSize - 0.5))}
                                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                -
                            </button>
                            <span className="text-sm">{layoutSettings.fontSize}</span>
                            <button
                                onClick={() => updateLayoutSettings('fontSize', Math.min(16, layoutSettings.fontSize + 0.5))}
                                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                +
                            </button>
                            <button
                                onClick={() => updateLayoutSettings('fontSize', 9.5)}
                                className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Line Height</label>
                        <select
                            value={layoutSettings.lineHeight}
                            onChange={(e) => updateLayoutSettings('lineHeight', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="A4">A4 (210 x 297 mm)</option>
                            <option value="Letter">Letter (8.5 x 11 in)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Margins (in inches)</label>
                        <div className="grid grid-cols-2 gap-3">
                            {(['Left', 'Right', 'Top', 'Bottom'] as const).map(side => (
                                <div key={side} className="flex items-center gap-2">
                                    <label className="text-xs text-gray-700 dark:text-gray-400 w-12">{side}</label>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => updateLayoutSettings(`margins.${side}`, Math.max(0.1, layoutSettings.margins[side] - 0.1))}
                                            className="px-1 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                                        >
                                            -
                                        </button>
                                        <span className="text-xs w-8 text-center">{layoutSettings.margins[side]}</span>
                                        <button
                                            onClick={() => updateLayoutSettings(`margins.${side}`, Math.min(2, layoutSettings.margins[side] + 0.1))}
                                            className="px-1 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
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
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
                {/* Left Panel - Editor */}
                <div className="w-full bg-white dark:bg-gray-900 border-r border-gray-200 flex flex-col">
                    {/* Header with tabs and download button */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-900">
                        <div className="flex sm:flex-row justify-between items-center mb-4 gap-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('editor')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeTab === 'editor'
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white '
                                        : 'bg-gray-300 text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <Edit3 size={16} /> Editor
                                </button>
                                <button
                                    onClick={() => setActiveTab('layout')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeTab === 'layout'
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white '
                                        : 'bg-gray-300 text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <Settings size={16} /> Layout & Style
                                </button>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                            >
                                <Download className='font-medium' size={16} /> <ShinyText text="Download PDF" disabled={false} speed={2} className='font-medium' />
                            </button>
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'editor' ? (
                            <div className="flex flex-col">
                                {/* Section Navigation */}
                                <div className="w-full bg-gray-50 dark:bg-gray-900 sm:border-r sm:border-b border-t border-b border-gray-200 p-6">
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
                                                        section === 'profile' ? 'Profile' :
                                                            section === 'skills' ? 'Skills' :
                                                                section === 'projects' ? 'Projects' :
                                                                    section === 'experience' ? 'Experience' :
                                                                        section === 'education' ? 'Education' :
                                                                            'Certifications'}
                                                </span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Section Editor */}
                                <div className="flex-1 p-6">
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
                <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-4 lg:p-8 overflow-y-auto">
                    <style>{`
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
                            }
                            .resume-page:last-child {
                                page-break-after: auto;
                            }
                        }
                    `}</style>
                    <div id="resume-preview" className="space-y-8 sm:w-auto w-full">
                        {/* First Page */}
                        <div

                            className="bg-white shadow-lg resume-page"
                            style={{
                                width: layoutSettings.pageSize === 'A4' ? '8.27in' : '8.5in',
                                maxWidth: '100%',
                                height: layoutSettings.pageSize === 'A4' ? '11.7in' : '11in',
                                padding: `${layoutSettings.margins.top}in ${layoutSettings.margins.right}in ${layoutSettings.margins.bottom}in ${layoutSettings.margins.left}in`,
                                fontSize: `${layoutSettings.fontSize}px`,
                                lineHeight: layoutSettings.lineHeight,
                                fontFamily: 'Arial, sans-serif',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            {/* Header */}
/* Updated Header Section */
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
                                    className="text-gray-700 mb-2"
                                    style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                                >
                                    {resumeData.personalInfo.email}
                                    {resumeData.personalInfo.phone && ` • ${resumeData.personalInfo.phone}`}
                                    {resumeData.personalInfo.location && ` • ${resumeData.personalInfo.location}`}
                                </div>

                                {/* Professional Links Line */}
                                {(resumeData.personalInfo.linkedinUrl || resumeData.personalInfo.githubUrl || resumeData.personalInfo.portfolioUrl) && (
                                    <div
                                        className="text-gray-700 flex flex-wrap justify-center items-center gap-2"
                                        style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                                    >
                                        {resumeData.personalInfo.linkedinUrl && (
                                            <>
                                                <span>LinkedIn: </span>
                                                <a
                                                    href={resumeData.personalInfo.linkedinUrl.startsWith('http') ? resumeData.personalInfo.linkedinUrl : `https://${resumeData.personalInfo.linkedinUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black font-bold underline"
                                                >
                                                    {resumeData.personalInfo.linkedinUrl.replace(/^https?:\/\//, '')}
                                                </a>
                                            </>
                                        )}

                                        {resumeData.personalInfo.githubUrl && (
                                            <>
                                                {resumeData.personalInfo.linkedinUrl && <span className="mx-1">•</span>}
                                                <span>GitHub: </span>
                                                <a
                                                    href={resumeData.personalInfo.githubUrl.startsWith('http') ? resumeData.personalInfo.githubUrl : `https://${resumeData.personalInfo.githubUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black font-bold underline"
                                                >
                                                    {resumeData.personalInfo.githubUrl.replace(/^https?:\/\//, '')}
                                                </a>
                                            </>
                                        )}

                                        {resumeData.personalInfo.portfolioUrl && (
                                            <>
                                                {(resumeData.personalInfo.linkedinUrl || resumeData.personalInfo.githubUrl) && <span className="mx-1">•</span>}
                                                <span>Portfolio: </span>
                                                <a
                                                    href={resumeData.personalInfo.portfolioUrl.startsWith('http') ? resumeData.personalInfo.portfolioUrl : `https://${resumeData.personalInfo.portfolioUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black font-bold underline"
                                                >
                                                    {resumeData.personalInfo.portfolioUrl.replace(/^https?:\/\//, '')}
                                                </a>
                                            </>
                                        )}
                                    </div>
                                )}

                                {resumeData.personalInfo.leetcodeUrl && (
                                    <div
                                        className="text-gray-700 flex justify-center items-center gap-2 mt-2"
                                        style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}
                                    >
                                        <span>LeetCode: </span>
                                        <a
                                            href={resumeData.personalInfo.leetcodeUrl.startsWith('http') ? resumeData.personalInfo.leetcodeUrl : `https://${resumeData.personalInfo.leetcodeUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-black font-bold underline"
                                        >
                                            {resumeData.personalInfo.leetcodeUrl.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}

                            </div>

                            {/* Profile Section */}
                            {resumeData.profile && (
                                <div className="mb-6 resume-section">
                                    <h2
                                        className="font-bold text-black mb-3 pb-1 border-b border-gray-300 uppercase"
                                        style={{ fontSize: `${layoutSettings.fontSize * 1.7}px` }}
                                    >
                                        Profile
                                    </h2>
                                    <p className="text-gray-700" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                        {resumeData.profile}
                                    </p>
                                </div>
                            )}

                            {/* Technical Skills Section */}
                            {(resumeData.skills.frontend || resumeData.skills.backend || resumeData.skills.database || resumeData.skills.tools || resumeData.skills.softSkills) && (
                                <div className="mb-6 resume-section">
                                    <h2
                                        className="font-bold text-black mb-3 pb-1 border-b border-gray-300 uppercase"
                                        style={{ fontSize: `${layoutSettings.fontSize * 1.7}px` }}
                                    >
                                        Technical Skills
                                    </h2>
                                    <div className="space-y-2">
                                        {resumeData.skills.frontend && (
                                            <div className="flex flex-wrap">
                                                <strong className="text-black mr-2" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                                    Frontend:
                                                </strong>
                                                <div className="text-gray-700" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                                    {resumeData.skills.frontend}
                                                </div>
                                            </div>
                                        )}
                                        {resumeData.skills.backend && (
                                            <div className="flex flex-wrap">
                                                <strong className="text-black mr-2" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                                    Backend:
                                                </strong>
                                                <div className="text-gray-700" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                                    {resumeData.skills.backend}
                                                </div>
                                            </div>
                                        )}
                                        {resumeData.skills.database && (
                                            <div className="flex flex-wrap">
                                                <strong className="text-black mr-2" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                                    Database:
                                                </strong>
                                                <div className="text-gray-700" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                                    {resumeData.skills.database}
                                                </div>
                                            </div>
                                        )}
                                        {resumeData.skills.tools && (
                                            <div className="flex flex-wrap">
                                                <strong className="text-black mr-2" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                                    Tools:
                                                </strong>
                                                <div className="text-gray-700" style={{ fontSize: `${layoutSettings.fontSize * 1.3}px` }}>
                                                    {resumeData.skills.tools}
                                                </div>
                                            </div>
                                        )}
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
                                                        className="text-black font-bold underline ml-4 flex-shrink-0"
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
                                                    Technologies: {project.technologies}
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
                            {resumeData.experience.length > 0 && (
                                <div className="mb-6 resume-section">
                                    <h2
                                        className="font-bold text-black mb-3 pb-1 border-b border-gray-300 uppercase"
                                        style={{ fontSize: `${layoutSettings.fontSize * 1.7}px` }}
                                    >
                                        Experience
                                    </h2>
                                    {resumeData.experience.map((exp) => (
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
                                                        {desc}
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
                                        Certifications & Achievements
                                    </h2>
                                    <ul className="ml-5">
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

                        {/* Additional pages will be created here when content overflows */}
                        <div
                            className="bg-white shadow-lg resume-page"
                            style={{
                                width: layoutSettings.pageSize === 'A4' ? '8.27in' : '8.5in',
                                maxWidth: '100%',
                                height: layoutSettings.pageSize === 'A4' ? '11.7in' : '11in',
                                padding: `${layoutSettings.margins.top}in ${layoutSettings.margins.right}in ${layoutSettings.margins.bottom}in ${layoutSettings.margins.left}in`,
                                fontSize: `${layoutSettings.fontSize}px`,
                                lineHeight: layoutSettings.lineHeight,
                                fontFamily: 'Arial, sans-serif',
                                overflow: 'hidden',
                                display: 'none'
                            }}
                        >
                            {/* Overflow content will be moved here by JavaScript if needed */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}