import { Plus, Trash2 } from 'lucide-react';
import { Skills, SkillCategory } from '../../types/index';

interface SkillsEditorProps {
    skills: Skills;
    addSkillCategory: () => void;
    updateSkillCategory: (id: string, field: keyof SkillCategory, value: string) => void;
    deleteSkillCategory: (id: string) => void;
}

export const SkillsEditor = ({
    skills,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory
}: SkillsEditorProps) => {
    return (
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
                {skills.categories.map((category) => (
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
};