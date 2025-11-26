import { Download, Edit3, Settings, Loader2, RotateCcw } from 'lucide-react';
import ShinyText from '@/components/ui/ShinyText';
import { ActiveTab } from '../types'; interface TopControlsProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    handleDownload: () => void;
    resetAllData: () => void;
    isDownloading: boolean;
    downloadProgress: number;
    lastSaved: string;
}export const TopControls = ({
    activeTab,
    setActiveTab,
    handleDownload,
    resetAllData,
    isDownloading,
    downloadProgress,
    lastSaved
}: TopControlsProps) => {
    return (
        <div className="bg-white dark:bg-black shadow-md top-16 z-30 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Left: Tab Buttons */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        <button
                            onClick={() => setActiveTab("editor")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeTab === "editor" ? "bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 dark:hover:bg-resume-secondary/80 text-white" : "bg-gray-300 text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"}`}
                        >
                            <Edit3 size={16} />
                            Editor
                        </button>                    <button
                            onClick={() => setActiveTab("layout")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeTab === "layout"
                                ? "bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 dark:hover:bg-resume-secondary/80 text-white"
                                : "bg-gray-300 text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                }`}
                        >
                            <Settings size={16} />
                            Layout
                        </button>
                    </div>                {/* Right: Action Buttons */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="relative px-4 py-2 text-sm font-medium rounded-lg bg-green-500 dark:bg-gray-800 text-white flex items-center gap-2 transition-colors duration-200 overflow-hidden disabled:opacity-80"
                        >
                            {/* Progress bar background */}
                            <div
                                className="absolute inset-0 bg-green-700 dark:bg-gray-950 transition-all duration-300 ease-out"
                                style={{
                                    width: `${downloadProgress}%`,
                                    left: 0
                                }}
                            />                        {/* Button content */}
                            <span className="relative z-10 flex items-center gap-2">
                                {isDownloading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <ShinyText
                                            text={`Downloading... ${downloadProgress}%`}
                                            disabled={false}
                                            speed={3}
                                            className="custom-class"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Download size={16} />
                                        <ShinyText
                                            text="Download PDF"
                                            disabled={false}
                                            speed={3}
                                            className="custom-class"
                                        />
                                    </>
                                )}
                            </span>
                        </button>                    <button
                            onClick={resetAllData}
                            disabled={isDownloading}
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-colors duration-200 disabled:opacity-50"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>
                    </div>
                </div>            {lastSaved && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Last saved: {lastSaved}
                    </p>
                )}
            </div>
        </div >
    );
};