interface SummaryEditorProps {
    summary: string;
    updateSummary: (value: string) => void;
}

export const SummaryEditor = ({ summary, updateSummary }: SummaryEditorProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Professional Summary
            </h3>

            <div>
                <label className="block text-sm font-medium mb-2">Summary <span className='text-red-600'>*</span></label>
                <textarea
                    value={summary}
                    onChange={(e) => updateSummary(e.target.value)}
                    rows={12}
                    className="w-full p-2 text-xs rounded-md border border-resume-primary/70 bg-white dark:bg-gray-800 
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                    placeholder="Write a compelling professional summary highlighting your key skills, experience, and career objectives..."
                />
                <p className="text-sm text-gray-500 mt-1">
                    {summary.length} characters
                </p>
            </div>
        </div>
    );
};