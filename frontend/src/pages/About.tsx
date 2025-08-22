import Layout from "@/components/Layout";
import GradientText from "@/components/ui/GradientText";
const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 z-[-3]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-resume-primary dark:text-resume-secondary mb-4">
              <span className="inline">
              About{" "}
              <span className="inline"><GradientText
                colors={["#9BBD67", "#26C168", "#92C8C0", "#4079ff", "#E3F1E8", "#515039", "#88FDE9", "#0B532F"]}
                animationSpeed={10}
                showBorder={false}
                className="text-2x1 font-semibold pb-2 inline"
              >ResumeAI</GradientText>
              </span>
              </span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Empowering job seekers to create smarter resumes with AI-driven insights.
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert prose-headings:text-resume-primary prose-a:text-resume-primary max-w-none">
            <p>
              <strong>ResumeAI</strong> is your intelligent partner in crafting resumes that get noticed.
              We leverage advanced AI and natural language processing to give your resume a competitive edge—analyzing it against job descriptions, identifying gaps, and suggesting improvements that align with industry expectations.
            </p>

            <h2 className="mt-12 mb-4 text-2xl font-semibold text-resume-primary dark:text-resume-secondary">How Our Technology Works</h2>
            <p>
              Our system uses state-of-the-art machine learning and natural language processing (NLP) to analyze the content of your resume. It extracts core competencies, experience, and keywords, then compares them to your target job’s requirements—highlighting strengths and areas for improvement.
            </p>

            <h2 className="mt-12 mb-4 text-2xl font-semibold text-resume-primary dark:text-resume-secondary">Getting Started</h2>
            <ol>
              <li><strong>Upload Your Resume</strong>: Upload your resume in PDF or DOCX format for analysis.</li>
              <li><strong>Select a Job Role</strong>: Choose a specific role you're applying for, or opt for a general review.</li>
              <li><strong>View Your Resume Insights</strong>: Receive an in-depth report with a resume score, matched and missing skills, and structural feedback.</li>
              <li><strong>Apply Our Recommendations</strong>: Fine-tune your resume based on personalized, actionable suggestions.</li>
            </ol>

            <h2 className="mt-12 mb-4 text-2xl font-semibold text-resume-primary dark:text-resume-secondary">Our Mission</h2>
            <p>
              At ResumeAI, we believe that everyone deserves access to smart tools that level the playing field in job applications. Our mission is to democratize resume feedback—making it simple, accessible, and effective for everyone.
            </p>

            <h2 className="mt-12 mb-4 text-2xl font-semibold text-resume-primary dark:text-resume-secondary">Our Commitment to Your Privacy</h2>
            <p>
              Your data stays yours. All resume analyses are processed securely and privately, in real-time. We never store your documents unless you choose to save them for future access. No third-party sharing. No surprises.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
