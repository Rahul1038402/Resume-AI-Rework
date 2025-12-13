import { Plus, Trash2 } from 'lucide-react';
import { Project } from '../../../../types/index';

interface ProjectsEditorProps {
    projects: Project[];
    addProject: () => void;
    updateProject: (id: string, field: keyof Project, value: string | string[]) => void;
    deleteProject: (id: string) => void;
    addProjectDescription: (projectId: string) => void;
    updateProjectDescription: (projectId: string, index: number, value: string) => void;
    deleteProjectDescription: (projectId: string, index: number) => void;
}

const ProjectsEditor = ({
    projects,
    addProject,
    updateProject,
    deleteProject,
    addProjectDescription,
    updateProjectDescription,
    deleteProjectDescription
}: ProjectsEditorProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Projects
            </h3>

            <button
                onClick={addProject}
                className="
        w-full px-4 py-2 
        border-2 border-dotted border-gray-400 
        dark:border-gray-500
        rounded-lg 
        flex items-center justify-center gap-2 
        text-resume-primary dark:text-resume-secondary
        hover:border-resume-primary dark:hover:border-resume-secondary
        transition-colors
        bg-transparent
    "
            >
                <Plus size={16} />
                Add Project
            </button>
            <div className="space-y-6">
                {projects.map((project) => (
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
}
export default ProjectsEditor;