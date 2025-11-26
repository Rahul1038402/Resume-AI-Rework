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
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            {sections.map(({ id, icon: Icon, label }) => (
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
    );
}