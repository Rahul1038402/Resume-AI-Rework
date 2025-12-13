import { Eye, Lightbulb } from 'lucide-react';
import { ResumePreview } from './ResumePreview';
import { ResumeData, LayoutSettings } from '../../types';
import { useEffect, useRef } from 'react';

interface PreviewPanelProps {
    resumeData: ResumeData;
    layoutSettings: LayoutSettings;
    warnings: string[];
    lastSaved: string;
    setIsSuggestionsOpen: (isOpen: boolean) => void;
}

const PreviewPanel = ({
    resumeData,
    layoutSettings,
    warnings,
    lastSaved,
    setIsSuggestionsOpen
}: PreviewPanelProps) => {

    const wrapperRef = useRef<HTMLDivElement>(null);
    const scaleRef = useRef<HTMLDivElement>(null);

    // 🔥 Auto-scale the A4 page so it fits the available width
    useEffect(() => {
        const scaleA4 = () => {
            if (!wrapperRef.current || !scaleRef.current) return;

            const wrapperWidth = wrapperRef.current.clientWidth;
            const A4_WIDTH_PX = 793.7; // 210mm → px @ 96dpi

            const scale = Math.min(wrapperWidth / A4_WIDTH_PX, 1);
            scaleRef.current.style.transform = `scale(${scale})`;
        };

        scaleA4();
        window.addEventListener("resize", scaleA4);
        return () => window.removeEventListener("resize", scaleA4);
    }, []);

    return (
        <div className="bg-gray-200 dark:bg-black rounded-lg shadow-lg p-6 overflow-auto max-h-[calc(100vh-200px)] w-full custom:w-[620pt]">

            {/* Header */}
            <div className="mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center0">
                    <div className="flex flex-col">
                        <h2 className="text-xl text-resume-primary dark:text-resume-secondary font-semibold flex items-center gap-2">
                            <Eye size={20} />
                            Live Preview
                        </h2>
                    </div>

                    {warnings.length > 0 && (
                        <button
                            onClick={() => setIsSuggestionsOpen(true)}
                            className="relative px-3 py-1 text-xs sm:text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-2 dark:bg-yellow-900/20 dark:text-yellow-400"
                        >
                            <Lightbulb size={16} />
                            {warnings.length} Suggestions
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                                {warnings.length}
                            </span>
                        </button>
                    )}
                </div>
                {lastSaved && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Last saved: {lastSaved}
                    </p>
                )}
            </div>

            {/* 🟦 Wrapper that scales */}
            <div
                ref={wrapperRef}
                className="w-full flex justify-center"
            >
                {/* 🟧 Scale transform container */}
                <div
                    ref={scaleRef}
                    style={{ transformOrigin: "top center" }}
                >
                    {/* 🟩 A4 page (fixed size, never changes) */}
                    <div
                        id="resume-preview"
                        style={{
                            width: "210mm",
                            height: "297mm",
                            overflow: "hidden",
                            background: "white",
                            fontSize: `${layoutSettings.fontSize}px`,
                            lineHeight: layoutSettings.lineHeight,
                            fontFamily: layoutSettings.fontFamily,
                            padding: `${layoutSettings.margins.top}px ${layoutSettings.margins.right}px ${layoutSettings.margins.bottom}px ${layoutSettings.margins.left}px`,
                        }}
                        className="resume-preview text-black shadow-sm"
                    >
                        <ResumePreview
                            resumeData={resumeData}
                            layoutSettings={layoutSettings}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PreviewPanel;
