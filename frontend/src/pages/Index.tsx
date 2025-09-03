
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import Aurora from '@/components/ui/Aurora';
import ShinyText from "@/components/ui/ShinyText";
import GradientText from "@/components/ui/GradientText";
import GlowingCards, { GlowingCard } from "@/components/ui/glowind-cards";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pb-36 overflow-hidden border-b border-gray-700 dark:border-gray-200">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <div className="mx-auto px-4 sm:pt-10 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 size-full flex flex-col justify-center items-center">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={11}
                showBorder={false}
                className="text-5xl"
              >
                <p className="mb-5">
                  Land Your Dream Job with AI-Powered Resume Tools
                </p>
              </GradientText>

              <p className="text-2xl mb-6 mt-8 tracking-wide">
                Don’t just send resumes. Build one in minutes,
                get AI-powered feedback to optimize it,
                and track every job application in one dashboard.
              </p>
            </div>

            {/* Feature Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900 px-8 py-6 text-lg"
                asChild
              >
                <Link to="/builder">
                  <ShinyText text="Build a Resume" disabled={false} speed={5} className="custom-class" />
                </Link>
              </Button>

              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900 px-8 py-6 text-lg"
                asChild
              >
                <Link to="/analyzer">
                  <ShinyText text="Analyze Resume" disabled={false} speed={5} className="custom-class" />
                </Link>
              </Button>

              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900 px-8 py-6 text-lg"
                asChild
              >
                <Link to="/tracker">
                  <ShinyText text="Track Applications" disabled={false} speed={5} className="custom-class" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </section>

      {/* Benefits Section */}
      <section className="py-20 border-b border-gray-700 dark:border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl mb-8 text-resume-primary dark:text-resume-secondary">
              All-in-One Resume AI: Build, Analyze & Track Your Career
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Resume AI empowers you to craft ATS-friendly resumes, get instant AI-powered analysis,
              and track all your job applications in one place giving you the edge to land
              more interviews and manage your career with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">

            {/* Analyzer */}
            <GlowingCards
              enableGlow={true}
              glowRadius={30}
              glowOpacity={0.8}
              animationDuration={500}
              gap="3rem"
              responsive={true}>
              <GlowingCard glowColor="#10b981" className="border-t-4 border-t-[#10b981]">
                <h3 className="text-xl mb-2 dark:text-resume-secondary">AI-Powered Resume Analyzer</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Instantly analyze your resume against job descriptions. Get personalized feedback on
                  skills, keywords, and formatting to make your resume ATS-friendly and job-ready.
                </p>
              </GlowingCard>
            </GlowingCards>

            {/* Builder */}
            <GlowingCards>
              <GlowingCard glowColor="#8b5cf6" className="border-t-4 border-t-[#8b5cf6]">
                <h3 className="text-xl mb-4 dark:text-resume-secondary  ">Resume Builder with Templates</h3>
                <p className="text-gray-600 dark:text-gray-300 ">
                  Choose from modern, ATS-optimized templates and create a polished resume in minutes.
                  Customize sections, highlight your strengths, and download ready-to-use resumes.
                </p>
              </GlowingCard>
            </GlowingCards>

            {/* Tracker (Planned Feature) */}
            <GlowingCards>
              <GlowingCard glowColor="#1810b9" className="border-t-4 border-t-[#1810b9]">
                <h3 className="text-xl mb-2 dark:text-resume-secondary">Job Application Tracker</h3>
                <p className="text-gray-600 dark:text-gray-300 ">
                  Store and manage your job applications with details like company name, job title,
                  platform applied on, resume used, application date, and current status all in one place.
                </p>
              </GlowingCard>
            </GlowingCards>

            {/* Instant Feedback */}
            <GlowingCards>
              <GlowingCard glowColor="#c5af24" className="border-t-4 border-t-[#c5af24]">
                <h3 className="text-xl mb-2 dark:text-resume-secondary  ">Immediate Feedback</h3>
                <p className="text-gray-600 dark:text-gray-300 ">
                  No more waiting days for reviews. Get instant, AI-driven suggestions that help you
                  improve your resume and job readiness in seconds.
                </p>
              </GlowingCard>
            </GlowingCards>
          </div>

          <div className="text-center mt-12">
            <Button
              className="bg-resume-primary hover:bg-resume-primary/90 dark:bg-resume-secondary dark:hover:bg-resume-secondary/90 px-8 text-white"
              size="lg"
              asChild
            >
              <Link to="/analyzer">Try Resume AI Now</Link>
            </Button>
          </div>
        </div>
      </section>

    </Layout >
  );
};

export default Index;
