import { useState, useEffect } from 'react';
import { Plus, LogOut, Calendar, Building, FileText, CheckCircle, Clock, XCircle, Award, Globe } from 'lucide-react';
import Layout from '@/components/Layout';
import GradientText from '@/components/ui/GradientText';
import '../index.css'
import { supabase } from '../lib/supabaseClient'

const JobTracker = () => {
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [formData, setFormData] = useState({
        job_role: '',
        company: '',
        platform: '',
        date_applied: '',
        resume_pdf: null,
        status: 'applied',
        description: ''
    });

    const statusOptions = [
        { value: 'applied', label: 'Applied', icon: Clock, color: 'text-blue-600 dark:text-blue-400' },
        { value: 'in_progress', label: 'In Progress', icon: Calendar, color: 'text-yellow-600 dark:text-yellow-400' },
        { value: 'got_offer', label: 'Got Offer', icon: Award, color: 'text-green-600 dark:text-green-400' },
        { value: 'not_selected', label: 'Not Selected', icon: XCircle, color: 'text-red-600 dark:text-red-400' }
    ];

    const platformOptions = [
        'LinkedIn',
        'Indeed',
        'Glassdoor',
        'Wellfound',
        'Stack Overflow Jobs',
        'GitHub Jobs',
        'Company Website',
        'Job Fair',
        'Referral',
        'Other'
    ];

    useEffect(() => {
        checkUser();
        setupAuthListener();
    }, []);

    useEffect(() => {
        if (user) {
            fetchApplications();
        }
    }, [user]);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setLoading(false);
    };

    const setupAuthListener = () => {
        supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
            if (session?.user) {
                fetchApplications();
            } else {
                setApplications([]);
            }
        });
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            alert('Error signing in: ' + error.message);
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            alert('Error signing out: ' + error.message);
        }
    };

    const fetchApplications = async () => {
        try {
            const { data, error } = await supabase
                .from('job_applications')
                .select('*')
                .order('date_applied', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        try {
            let resumeUrl = null;

            // Upload resume if provided
            if (formData.resume_pdf) {
                const fileExt = formData.resume_pdf.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(fileName, formData.resume_pdf);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('resumes')
                    .getPublicUrl(fileName);

                resumeUrl = publicUrl;
            }

            const applicationData = {
                job_role: formData.job_role,
                company: formData.company,
                platform: formData.platform,
                date_applied: formData.date_applied,
                resume_url: resumeUrl || (editingApp ? editingApp.resume_url : null),
                status: formData.status,
                description: formData.description,
                user_id: user.id
            };

            if (editingApp) {
                const { error } = await supabase
                    .from('job_applications')
                    .update(applicationData)
                    .eq('id', editingApp.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('job_applications')
                    .insert([applicationData]);
                if (error) throw error;
            }

            resetForm();
            fetchApplications();
        } catch (error) {
            alert('Error saving application: ' + error.message);
        }
    };

    const handleEdit = (app) => {
        setEditingApp(app);
        setFormData({
            job_role: app.job_role,
            company: app.company,
            platform: app.platform || '',
            date_applied: app.date_applied,
            resume_pdf: null,
            status: app.status,
            description: app.description || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this application?')) {
            try {
                const { error } = await supabase
                    .from('job_applications')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                fetchApplications();
            } catch (error) {
                alert('Error deleting application: ' + error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            job_role: '',
            company: '',
            platform: '',
            date_applied: '',
            resume_pdf: null,
            status: 'applied',
            description: ''
        });
        setShowForm(false);
        setEditingApp(null);
    };

    const getStatusIcon = (status) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        const Icon = statusOption?.icon || Clock;
        return <Icon className={`w-5 h-5 ${statusOption?.color || 'text-muted-foreground'}`} />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-xl text-foreground">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full mx-4 border border-border">
                    <div className="text-center">
                        <GradientText
                            colors={["#9BBD67", "#26C168", "#92C8C0", "#4079ff", "#E3F1E8"]}
                            animationSpeed={10}
                            showBorder={false}
                            className="text-4xl"
                        >
                            ResumeAI
                        </GradientText>
                        <p className="text-muted-foreground mb-8">Track your job applications efficiently</p>
                        <button
                            onClick={signInWithGoogle}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                        >
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="pt-12 bg-background">
                <div className="text-center mb-4">
                    <GradientText
                        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        animationSpeed={11}
                        showBorder={false}
                        className="text-5xl "
                    >
                        <p className="mb-5">
                            Job Application Tracker
                        </p>
                    </GradientText>
                </div>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
                        <h2 className="text-2xl text-resume-primary dark:text-resume-secondary">
                            My Applications
                        </h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/90 hover:dark:bg-resume-secondary/80 text-white rounded-lg transition-colors duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Add Application
                        </button>
                    </div>
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                            <div className="bg-card rounded-lg p-6 w-1/2 min-w-[350px] max-h-[90vh] overflow-y-auto border border-border">
                                <h3 className="text-2xl text-resume-primary dark:text-resume-secondary mb-4">
                                    {editingApp ? 'Edit Application' : 'Add New Application'}
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Job Role</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.job_role}
                                            onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                                            placeholder="e.g. Frontend Developer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Company</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                                            placeholder="e.g. Google"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Platform</label>
                                        <select
                                            value={formData.platform}
                                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                                        >
                                            <option value="">Select Platform</option>
                                            {platformOptions.map(platform => (
                                                <option key={platform} value={platform}>
                                                    {platform}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Date Applied</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date_applied}
                                            onChange={(e) => setFormData({ ...formData, date_applied: e.target.value })}
                                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground [&::-webkit-calendar-picker-indicator]:bg-white [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Resume PDF</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setFormData({ ...formData, resume_pdf: e.target.files[0] })}
                                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-muted file:text-foreground hover:file:bg-muted/80"
                                        />
                                        {editingApp && editingApp.resume_url && (
                                            <p className="text-sm text-muted-foreground mt-1">Current resume uploaded</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                                        >
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Description (Optional)</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                                            rows={3}
                                            placeholder="Add notes about this application..."
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md transition"
                                        >
                                            {editingApp ? 'Update' : 'Add'} Application
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground py-2 px-4 rounded-md transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {applications.map((app) => {
                            const statusOption = statusOptions.find(opt => opt.value === app.status);
                            const StatusIcon = statusOption?.icon || Clock;

                            return (
                                <div key={app.id} className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg text-resume-accent">{app.job_role}</h3>
                                            <p className="text-muted-foreground flex items-center gap-1">
                                                <Building className="w-4 h-4" />
                                                {app.company}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusIcon className={`w-5 h-5 ${statusOption?.color || 'text-muted-foreground'}`} />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {app.platform && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Globe className="w-4 h-4" />
                                                Platform: {app.platform}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            Applied: {new Date(app.date_applied).toLocaleDateString()}
                                        </div>

                                        {app.resume_url && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <a
                                                    href={app.resume_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:text-primary/80 underline"
                                                >
                                                    View Resume
                                                </a>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusOption?.value === 'applied' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                                statusOption?.value === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                                    statusOption?.value === 'got_offer' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusOption?.label}
                                            </span>
                                        </div>
                                    </div>

                                    {app.description && (
                                        <div className="mb-4">
                                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                                {app.description}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(app)}
                                            className="flex-1 bg-muted/80 hover:bg-gray-300 dark:hover:bg-gray-900 py-2 px-3 rounded-md text-sm transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(app.id)}
                                            className="flex-1 bg-destructive/80 hover:bg-destructive py-2 px-3 rounded-md text-sm transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {applications.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-muted-foreground mb-4">
                                <Building className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                            <p className="text-muted-foreground mb-6">Start tracking your job applications by adding your first one.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg inline-flex items-center gap-2 transition"
                            >
                                <Plus className="w-4 h-4" />
                                Add Your First Application
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </Layout>
    );
};

export default JobTracker;