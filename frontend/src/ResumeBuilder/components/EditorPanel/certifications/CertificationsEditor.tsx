import { Plus, Trash2 } from 'lucide-react';
import { Certification } from '../../../types/index';

interface CertificationsEditorProps {
    certifications: Certification[];
    addCertification: () => void;
    updateCertification: (id: string, field: keyof Certification, value: string) => void;
    deleteCertification: (id: string) => void;
}

export const CertificationsEditor = ({
    certifications,
    addCertification,
    updateCertification,
    deleteCertification
}: CertificationsEditorProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-center text-resume-primary dark:text-resume-secondary mb-6">
                Certifications & Achievements
            </h3>

            <button
                onClick={addCertification}
                className="        w-full px-4 py-2 
        border-2 border-dotted border-gray-400 
        dark:border-gray-500
        rounded-lg 
        flex items-center justify-center gap-2 
        text-resume-primary dark:text-resume-secondary
        hover:border-resume-primary dark:hover:border-resume-secondary
        transition-colors
        bg-transparent"
            >
                <Plus size={16} />
                Add Certification
            </button>

            <div className="space-y-6">
                {certifications.map((cert) => (
                    <div key={cert.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg space-y-3">
                        <div className="flex justify-end">
                            <button
                                onClick={() => deleteCertification(cert.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Certification Name <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="AWS Certified Developer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Issuing Organization <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="Amazon Web Services"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Date Issued <span className='text-red-600'>*</span></label>
                                <input
                                    type="text"
                                    value={cert.date}
                                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="Jan 2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Credential ID</label>
                                <input
                                    type="text"
                                    value={cert.credentialId}
                                    onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                                    className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                    placeholder="ABC123XYZ"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Credential URL</label>
                            <input
                                type="url"
                                value={cert.link}
                                onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                                className="h-8 w-full p-2 text-xs rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-black
                                   focus:border-[0.5px] focus:ring-1 focus:ring-resume-primary/60 dark:focus:ring-resume-secondary/70 
                                   focus:shadow-[0_0_6px_rgba(26,54,93,0.4)] dark:focus:shadow-[0_0_6px_rgba(56,178,172,0.4)] 
                                   outline-none focus:outline-none transition-all duration-150"
                                placeholder="https://credentials.example.com/..."
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};