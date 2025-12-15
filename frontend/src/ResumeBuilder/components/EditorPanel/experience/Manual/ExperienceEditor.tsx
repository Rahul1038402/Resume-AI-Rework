import { Plus, Trash2 } from 'lucide-react';
import { Experience } from '../../../../types/index';

interface ExperienceEditorProps {
    experience: Experience[];
    addExperience: () => void;
    updateExperience: (id: string, field: keyof Experience, value: string | string[]) => void;
    deleteExperience: (id: string) => void;
    addExperienceAchievement: (expId: string) => void;
    updateExperienceAchievement: (expId: string, index: number, value: string) => void;
    deleteExperienceAchievement: (expId: string, index: number) => void;
}

export const ExperienceEditor = ({
    experience,
    addExperience,
    updateExperience,
    deleteExperience,
    addExperienceAchievement,
    updateExperienceAchievement,
    deleteExperienceAchievement
}: ExperienceEditorProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Work Experience
            </h3>

            <button
                onClick={addExperience}
                className="        w-full px-4 py-2 
        border-2 border-dotted border-gray-400 
        dark:border-gray-500
        rounded-lg 
        flex items-center justify-center gap-2 
        text-resume-primary dark:text-resume-secondary
        hover:border-resume-primary dark:hover:border-resume-secondary
        transition-colors
        bg-transparent"
            >
                <Plus size={16} />
                Add Experience
            </button>

            <div className="space-y-6">
                {experience.map((exp) => (
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
                                className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
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
                                className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
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
                                className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
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
                                    className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
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
                                    className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
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
                                            className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
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
};