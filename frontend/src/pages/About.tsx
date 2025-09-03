import Layout from "@/components/Layout";
import GradientText from "@/components/ui/GradientText";
const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 z-[-3]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl text-resume-primary dark:text-resume-secondary mb-4">
              <span className="inline">
                About{" "}
                <span className="inline"><GradientText
                  colors={["#9BBD67", "#26C168", "#92C8C0", "#4079ff", "#E3F1E8"]}
                  animationSpeed={10}
                  showBorder={false}
                  className="text-2x1 font-semibold pb-2 inline"
                >ResumeAI</GradientText>
                </span>
              </span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Your all-in-one AI-powered platform for creating standout resumes, analyzing job compatibility, and tracking applications.
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert prose-headings:text-resume-primary prose-a:text-resume-primary max-w-none">
            <p>
              <strong>ResumeAI</strong> is your comprehensive career companion, combining cutting-edge AI technology with practical tools to supercharge your job search. From intelligent resume analysis to ATS-friendly resume building and application tracking, we've got every aspect of your job hunt covered.
            </p>

            <h2 className="mt-12 mb-4 text-2xl text-resume-primary dark:text-resume-secondary">🤖 AI-Powered Resume Analyzer</h2>
            <p>
              Our flagship feature uses advanced machine learning and natural language processing to deliver deep insights into your resume's effectiveness. Simply upload your resume and select your target job role, and our AI will:
            </p>
            <ul>
              <li><strong>Match Analysis</strong>: Compare your skills and experience against specific job requirements</li>
              <li><strong>Skill Gap Identification</strong>: Highlight missing keywords and competencies that recruiters are looking for</li>
              <li><strong>ATS Compatibility Check</strong>: Ensure your resume passes through Applicant Tracking Systems</li>
              <li><strong>Content Optimization</strong>: Get specific recommendations to improve impact and relevance</li>
              <li><strong>Resume Scoring</strong>: Receive a comprehensive score with detailed breakdown of strengths and weaknesses</li>
            </ul>

            <h2 className="mt-12 mb-4 text-2xl text-resume-primary dark:text-resume-secondary">📝 Smart Resume Builder</h2>
            <p>
              Create professional, ATS-friendly resumes with our intelligent builder designed to maximize your chances of getting noticed:
            </p>
            <ul>
              <li><strong>ATS-Optimized Templates</strong>: Choose from professionally designed templates that pass through automated screening systems</li>
              <li><strong>Smart Content Suggestions</strong>: Get AI-powered recommendations for bullet points, skills, and descriptions</li>
              <li><strong>Real-Time Optimization</strong>: See live feedback as you build to ensure maximum impact</li>
              <li><strong>Multiple Formats</strong>: Export in PDF, DOCX, or print-ready formats</li>
              <li><strong>Customizable Styling</strong>: Adjust fonts, spacing, colors, and layout to match your personal brand</li>
              <li><strong>Industry-Specific Guidance</strong>: Tailored advice based on your target industry and role</li>
            </ul>

            <h2 className="mt-12 mb-4 text-2xl text-resume-primary dark:text-resume-secondary">📊 Job Application Tracker</h2>
            <p>
              Stay organized and never lose track of your job applications with our comprehensive tracking system:
            </p>
            <ul>
              <li><strong>Application Management</strong>: Store and organize all your job applications in one central location</li>
              <li><strong>Status Tracking</strong>: Update application status as <em>Applied</em>, <em>In Progress</em>, or <em>Not Selected</em></li>
              <li><strong>Timeline Visualization</strong>: See your application journey and follow-up reminders</li>
              <li><strong>Company Insights</strong>: Keep notes about companies, interview experiences, and contacts</li>
              <li><strong>Document Management</strong>: Link specific resume versions and cover letters to each application</li>
            </ul>

            <h2 className="mt-12 mb-4 text-2xl text-resume-primary dark:text-resume-secondary">How ResumeAI Works</h2>
            <ol>
              <li><strong>Analyze</strong>: Upload your current resume and get AI-powered insights for your target roles</li>
              <li><strong>Build</strong>: Create or improve your resume using our intelligent builder with real-time optimization</li>
              <li><strong>Apply</strong>: Use your polished, ATS-friendly resume to apply for positions</li>
              <li><strong>Track</strong>: Monitor all your applications, set reminders, and stay organized throughout your job search</li>
              <li><strong>Iterate</strong>: Continuously improve based on feedback and results</li>
            </ol>

            <h2 className="mt-12 mb-4 text-2xl text-resume-primary dark:text-resume-secondary">Our Mission</h2>
            <p>
              At ResumeAI, we're democratizing access to professional career tools. We believe that everyone deserves the opportunity to present their best professional self, regardless of their background or resources. Our AI-driven platform levels the playing field, giving you the same advantages that expensive career consultants provide.
            </p>

            <h2 className="mt-12 mb-4 text-2xl text-resume-primary dark:text-resume-secondary">Privacy & Security First</h2>
            <p>
              Your career data is sensitive, and we treat it that way. All resume analyses happen in real-time with enterprise-grade security. Your documents are never shared with third parties, and you maintain complete control over your data. We process everything securely and only store what you explicitly choose to save for your convenience.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
