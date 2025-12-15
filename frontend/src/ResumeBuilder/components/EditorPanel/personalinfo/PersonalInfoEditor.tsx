import { PersonalInfo } from '../../../types/index';

interface PersonalInfoEditorProps {
    personalInfo: PersonalInfo;
    updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
}

export const PersonalInfoEditor = ({ personalInfo, updatePersonalInfo }: PersonalInfoEditorProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">First Name <span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-resume-primary/70 bg-white dark:bg-black 
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
                        value={personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-resume-primary/70 bg-white dark:bg-black 
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
                        value={personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-resume-primary/70 bg-white dark:bg-black 
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
                        value={personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-resume-primary/70 bg-white dark:bg-black 
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
                        value={personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-resume-primary/70 bg-white dark:bg-black 
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
                        value={personalInfo.targetJobTitle}
                        onChange={(e) => updatePersonalInfo('targetJobTitle', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-resume-primary/70 bg-white dark:bg-black 
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
                        value={personalInfo.linkedinUrl}
                        onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-resume-primary/70 bg-white dark:bg-black 
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
                        value={personalInfo.githubUrl}
                        onChange={(e) => updatePersonalInfo('githubUrl', e.target.value)}
                        className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-resume-primary/70 bg-white dark:bg-black 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                        placeholder="https://github.com/johndoe"
                    />
                </div>
            </div>
        </div>
    );
};