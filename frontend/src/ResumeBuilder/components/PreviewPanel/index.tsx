import { Eye, Lightbulb } from 'lucide-react';
import GradientText from '@/components/ui/GradientText';
import { ResumePreview } from './ResumePreview';
import { ResumeData, LayoutSettings } from '../../types';

interface PreviewPanelProps {
    resumeData: ResumeData;
    layoutSettings: LayoutSettings;
    warnings: string[];
    setIsSuggestionsOpen: (isOpen: boolean) => void;
}

const PreviewPanel = ({
    resumeData,
    layoutSettings,
    warnings,
    setIsSuggestionsOpen
}: PreviewPanelProps) => {
    return (
        <div className="bg-gray-200 dark:bg-black rounded-lg shadow-lg p-6 overflow-x-auto custom:overflow-y-auto max-h-[calc(100vh-200px)] w-full custom:w-[620pt]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl text-resume-primary dark:text-resume-secondary font-semibold flex items-center gap-2">
                    <Eye size={20} />
                        Live Preview
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
                <ResumePreview
                    resumeData={resumeData}
                    layoutSettings={layoutSettings}
                />
            </div>
        </div>
    );
};
export default PreviewPanel;