import { LayoutSettings as LayoutSettingsType } from '../types';

interface LayoutSettingsProps {
    layoutSettings: LayoutSettingsType;
    updateLayoutSettings: (field: keyof LayoutSettingsType, value: any) => void;
    updateMargin: (side: keyof LayoutSettingsType['margins'], value: number) => void;
}

export const LayoutSettings = ({
    layoutSettings,
    updateLayoutSettings,
    updateMargin
}: LayoutSettingsProps) => {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Layout Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Font Size (px)</label>
                    <input
                        type="number"
                        value={layoutSettings.fontSize}
                        onChange={(e) => updateLayoutSettings('fontSize', parseInt(e.target.value) || 11)}
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                        min="8"
                        max="16"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Line Height <span className='text-xs text-gray-700 dark:text-gray-400'>(Adjusts Spacing Between Content)</span></label>
                    <input
                        type="text"
                        value={layoutSettings.lineHeight}
                        onChange={(e) => updateLayoutSettings('lineHeight', e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                        placeholder="1.6"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Page Size</label>
                    <select
                        value={layoutSettings.pageSize}
                        onChange={(e) => updateLayoutSettings('pageSize', e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    >
                        <option value="A4">A4</option>
                        <option value="Letter">Letter</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Font Family</label>
                    <select
                        value={layoutSettings.fontFamily}
                        onChange={(e) => updateLayoutSettings('fontFamily', e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    >
                        <option value='"CMU Serif", "Computer Modern Serif", Georgia, serif'>CMU Serif [Recommended]</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Courier New', monospace">Courier New</option>
                    </select>
                </div>
            </div>

            <div>
                <h4 className="text-lg font-medium mb-4">Margins (px)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Top</label>
                        <input
                            type="number"
                            value={layoutSettings.margins.top}
                            onChange={(e) => updateMargin('top', parseInt(e.target.value) || 20)}
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            min="10"
                            max="50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Bottom</label>
                        <input
                            type="number"
                            value={layoutSettings.margins.bottom}
                            onChange={(e) => updateMargin('bottom', parseInt(e.target.value) || 20)}
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            min="10"
                            max="50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Left</label>
                        <input
                            type="number"
                            value={layoutSettings.margins.left}
                            onChange={(e) => updateMargin('left', parseInt(e.target.value) || 20)}
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            min="10"
                            max="50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Right</label>
                        <input
                            type="number"
                            value={layoutSettings.margins.right}
                            onChange={(e) => updateMargin('right', parseInt(e.target.value) || 20)}
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            min="10"
                            max="50"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};