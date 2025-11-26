import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import { TopControls } from './components/TopControls';
import { LayoutSettings as LayoutSettingsComponent } from './components/LayoutSettings';
import { SuggestionsOverlay } from './components/SuggestionsOverlay';
import { useResumeData } from './hooks/useResumeData';
import { useLayoutSettings } from './hooks/useLayoutSettings';
import { useResumeValidation } from './hooks/useResumeValidation';
import { ActiveTab, ActiveSection } from './types';
import { generateResumePDF } from '@/api/resumeService';
import '../index.css';

const STORAGE_KEY_LAST_SAVED = 'lastSaved';

const loadLastSaved = (): string => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_LAST_SAVED);
        return saved || '';
    } catch (error) {
        console.error('Error loading last saved:', error);
        return '';
    }
};

const saveLastSaved = (timestamp: string): void => {
    try {
        localStorage.setItem(STORAGE_KEY_LAST_SAVED, timestamp);
    } catch (error) {
        console.error('Error saving last saved:', error);
    }
};

function ResumeBuilder() {
    // Custom hooks
    const {
        resumeData,
        updatePersonalInfo,
        updateSummary,
        addSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        addProject,
        updateProject,
        deleteProject,
        addProjectDescription,
        updateProjectDescription,
        deleteProjectDescription,
        addExperience,
        updateExperience,
        deleteExperience,
        addExperienceAchievement,
        updateExperienceAchievement,
        deleteExperienceAchievement,
        addEducation,
        updateEducation,
        deleteEducation,
        addCertification,
        updateCertification,
        deleteCertification,
        resetResumeData
    } = useResumeData();

    const {
        layoutSettings,
        updateLayoutSettings,
        updateMargin,
        resetLayoutSettings
    } = useLayoutSettings();

    const { warnings, validateResumeData } = useResumeValidation(resumeData);

    // Local state
    const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
    const [activeSection, setActiveSection] = useState<ActiveSection>('personal');
    const [lastSaved, setLastSaved] = useState<string>('');
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    // Handle initial page load
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Load last saved timestamp on mount
    useEffect(() => {
        const saved = loadLastSaved();
        if (saved) setLastSaved(saved);
    }, []);

    // Update last saved timestamp whenever data changes
    useEffect(() => {
        const now = new Date().toLocaleString();
        setLastSaved(now);
        saveLastSaved(now);
    }, [resumeData, layoutSettings]);

    // Validate resume data whenever it changes
    useEffect(() => {
        validateResumeData();
    }, [resumeData, validateResumeData]);

    const resetAllData = () => {
        if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            resetResumeData();
            resetLayoutSettings();
            localStorage.removeItem(STORAGE_KEY_LAST_SAVED);
            setLastSaved('');
        }
    };

    const handleDownload = async () => {
        const resumeEl = document.querySelector('.resume-content');
        if (!resumeEl) return;

        try {
            setIsDownloading(true);
            setDownloadProgress(0);

            // Get ALL computed styles from the element
            const htmlContent = resumeEl.outerHTML;

            // Extract inline styles from the document
            const styleSheets = Array.from(document.styleSheets);
            let cssContent = '';

            styleSheets.forEach(sheet => {
                try {
                    const rules = Array.from(sheet.cssRules || []);
                    rules.forEach(rule => {
                        cssContent += rule.cssText + '\n';
                    });
                } catch (e) {
                    console.warn('Could not access stylesheet:', e);
                }
            });

            console.log('HTML length:', htmlContent.length);
            console.log('CSS length:', cssContent.length);
            console.log('HTML preview:', htmlContent.substring(0, 500));

            const firstName = resumeData.personalInfo.firstName || 'Resume';
            const lastName = resumeData.personalInfo.lastName || '';
            const fileName = `${firstName}_${lastName}_Resume.pdf`.replace(/\s+/g, '_');

            await generateResumePDF(
                htmlContent,
                cssContent,
                layoutSettings,
                fileName,
                (progress) => setDownloadProgress(progress)
            );

            setTimeout(() => {
                setIsDownloading(false);
                setDownloadProgress(0);
            }, 500);

        } catch (error) {
            console.error('PDF download error:', error);
            alert('Failed to generate PDF. Please try again.');
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    // Early return for loading state
    if (isPageLoading) {
        return (
            <>
                <Header />
                <div className="container mx-auto">
                    <div className="flex items-center justify-center h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-resume-primary dark:border-resume-secondary"></div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="flex flex-col pt-24">
                {/* Top Controls */}
                <TopControls
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    handleDownload={handleDownload}
                    resetAllData={resetAllData}
                    isDownloading={isDownloading}
                    downloadProgress={downloadProgress}
                    lastSaved={lastSaved}
                />

                {/* Main Content Area */}
                <div className="flex-1">
                    {activeTab === 'editor' ? (
                        <div className="flex flex-col custom:flex-row justify-center items-center gap-4 p-4">
                            <style>
                                {`
                                    @media (min-width: 1185px) {
                                        .responsive-flex {
                                            flex-direction: row !important;
                                        }
                                    }
                                `}
                            </style>
                            
                            {/* Editor Panel */}
                            <EditorPanel
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                resumeData={resumeData}
                                updatePersonalInfo={updatePersonalInfo}
                                updateSummary={updateSummary}
                                addSkillCategory={addSkillCategory}
                                updateSkillCategory={updateSkillCategory}
                                deleteSkillCategory={deleteSkillCategory}
                                addProject={addProject}
                                updateProject={updateProject}
                                deleteProject={deleteProject}
                                addProjectDescription={addProjectDescription}
                                updateProjectDescription={updateProjectDescription}
                                deleteProjectDescription={deleteProjectDescription}
                                addExperience={addExperience}
                                updateExperience={updateExperience}
                                deleteExperience={deleteExperience}
                                addExperienceAchievement={addExperienceAchievement}
                                updateExperienceAchievement={updateExperienceAchievement}
                                deleteExperienceAchievement={deleteExperienceAchievement}
                                addEducation={addEducation}
                                updateEducation={updateEducation}
                                deleteEducation={deleteEducation}
                                addCertification={addCertification}
                                updateCertification={updateCertification}
                                deleteCertification={deleteCertification}
                            />

                            {/* Preview Panel */}
                            <PreviewPanel
                                resumeData={resumeData}
                                layoutSettings={layoutSettings}
                                warnings={warnings}
                                setIsSuggestionsOpen={setIsSuggestionsOpen}
                            />
                        </div>
                    ) : activeTab === 'layout' ? (
                        <div className="p-6">
                            <LayoutSettingsComponent
                                layoutSettings={layoutSettings}
                                updateLayoutSettings={updateLayoutSettings}
                                updateMargin={updateMargin}
                            />
                        </div>
                    ) : null}
                </div>

                {/* Suggestions Overlay */}
                <SuggestionsOverlay
                    isOpen={isSuggestionsOpen}
                    onClose={() => setIsSuggestionsOpen(false)}
                    warnings={warnings}
                />
            </div>
        </>
    );
}
export default ResumeBuilder;
