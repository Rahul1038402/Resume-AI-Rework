import { Plus, Trash2 } from 'lucide-react';
import { Education } from '../../types/index';

interface EducationEditorProps {
    education: Education[];
    addEducation: () => void;
    updateEducation: (id: string, field: keyof Education, value: string) => void;
    deleteEducation: (id: string) => void;
}

export const EducationEditor = ({
    education,
    addEducation,
    updateEducation,
    deleteEducation
}: EducationEditorProps) => {
    return (
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
                {education.map((edu) => (
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
};