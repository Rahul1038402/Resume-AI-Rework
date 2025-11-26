import { X, Lightbulb, Check } from 'lucide-react';

interface SuggestionsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    warnings: string[];
}

export const SuggestionsOverlay = ({ isOpen, onClose, warnings }: SuggestionsOverlayProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-black rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                    <h3 className="text-2xl font-semibold flex items-center gap-2 text-resume-primary dark:text-resume-secondary">
                        <Lightbulb size={24} />
                        Resume Suggestions
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {warnings.length > 0 ? (
                        warnings.map((warning, index) => (
                            <div
                                key={index}
                                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3"
                            >
                                <Check className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                                <p className="text-yellow-800 dark:text-yellow-400">{warning}</p>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex gap-3">
                            <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <p className="text-green-800 dark:text-green-400">
                                Great! Your resume looks complete.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};