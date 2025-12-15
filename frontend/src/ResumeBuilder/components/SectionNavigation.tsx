import { User, Briefcase, GraduationCap, Award, Code, FolderOpen, NotebookPen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActiveSection } from '../types';

interface SectionNavigationProps {
    activeSection: ActiveSection;
    setActiveSection: (section: ActiveSection) => void;
}

export const SectionNavigation = ({ activeSection, setActiveSection }: SectionNavigationProps) => {
    const sections = [
        { id: 'personal', icon: User, label: 'Personal' },
        { id: 'summary', icon: NotebookPen, label: 'Summary' },
        { id: 'skills', icon: Code, label: 'Skills' },
        { id: 'projects', icon: FolderOpen, label: 'Projects' },
        { id: 'experience', icon: Briefcase, label: 'Experience' },
        { id: 'education', icon: GraduationCap, label: 'Education' },
        { id: 'certifications', icon: Award, label: 'Certifications' }
    ];
    return (
        <div className="flex flex-wrap justify-center items-center gap-2 py-4 border-b border-gray-200 dark:border-gray-700">
            {sections.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    onClick={() => setActiveSection(id as ActiveSection)}
                    className={cn(
                        "px-3 py-2 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200",
                        activeSection === id
                            ? "text-black dark:text-white dark:hover:bg-gray-900 border-2 dark:border-gray-400 shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900 border dark:border-gray-700"
                    )}
                >
                    <Icon size={16} />
                    {label}
                </button>
            ))}
        </div>
    );
}