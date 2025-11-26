import { useState } from "react";
import ResumeUploader from "@/components/ResumeUploader";
import ATSComparisonView from "@/components/ATSComparisonView";
import Layout from "@/components/Layout";
import GradientText from "@/components/ui/GradientText";

const ATSComparisonPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col dark:bg-black">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={11}
                showBorder={false}
                className="text-5xl"
              >
                <p className="mb-5">
                  ATS Resume Comparison
                </p>
              </GradientText>

              <p className="text-xl text-gray-600 dark:text-gray-300">
                Upload your resume to compare it with our ATS-optimized format and get instant scores comparison
              </p>
            </div>

            {!uploadedFile ? (
              <div className="max-w-2xl mx-auto">
                <ResumeUploader onFileSelected={setUploadedFile} />
              </div>
            ) : (
              <ATSComparisonView uploadedFile={uploadedFile} />
            )}

            {uploadedFile && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-white bg-resume-primary dark:bg-resume-secondary hover:bg-resume-primary/80 hover:dark:bg-resume-secondary/80 rounded-md p-4 transition-colors duration-200"
                >
                  Upload a different resume
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ATSComparisonPage;