import { Download, Edit3, Settings, Loader2, RotateCcw } from 'lucide-react';
import ShinyText from '@/components/ui/ShinyText';
import { ActiveTab } from '../types';

interface TopControlsProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    handleDownload: () => void;
    resetAllData: () => void;
    isDownloading: boolean;
    downloadProgress: number;
}
export const TopControls = ({
    activeTab,
    setActiveTab,
    handleDownload,
    resetAllData,
    isDownloading,
    downloadProgress,
}: TopControlsProps) => {
    return (
        <div className="bg-transparent top-16 z-30">
            <div className="relative overflow-hidden container mx-auto px-4 pb-5">
                                  <div
        className="absolute shadow-lg bottom-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent_0%,rgba(203,213,225,0.5)_20%,rgba(203,213,225,1)_50%,rgba(203,213,225,0.5)_80%,transparent_100%)]
    dark:bg-[linear-gradient(to_right,transparent_0%,rgba(100,116,139,0.3)_20%,rgba(100,116,139,0.6)_50%,rgba(100,116,139,0.3)_80%,transparent_100%)]"
      />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Left: Tab Buttons */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        <button
                            onClick={() => setActiveTab("editor")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeTab === "editor" ? "text-black dark:text-white dark:hover:bg-gray-900 border-2 dark:border-gray-400 shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900 border dark:border-gray-700"}`}
                        >
                            <Edit3 size={16} />
                            Editor
                        </button>                    
                        <button
                            onClick={() => setActiveTab("layout")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeTab === "layout"
                                ? "text-black dark:text-white dark:hover:bg-gray-900 border-2 dark:border-gray-400 shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900 border dark:border-gray-700"
                                }`}
                        >
                            <Settings size={16} />
                            Layout
                        </button>
                    </div>
                    {/* Right: Action Buttons */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="relative px-4 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-colors duration-200 overflow-hidden disabled:opacity-80"
                        >
                            {/* Progress bar background */}
                            <div
                                className="absolute inset-0 bg-green-800 transition-all duration-300 ease-out"
                                style={{
                                    width: `${downloadProgress}%`,
                                    left: 0
                                }}
                            />
                            {/* Button content */}
                            <span className="relative z-10 flex items-center gap-2">
                                {isDownloading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Downloading... {downloadProgress}%</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={16} />
                                        Download PDF
                                    </>
                                )}
                            </span>
                        </button>                    
                        <button
                            onClick={resetAllData}
                            disabled={isDownloading}
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-colors duration-200 disabled:opacity-50"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};