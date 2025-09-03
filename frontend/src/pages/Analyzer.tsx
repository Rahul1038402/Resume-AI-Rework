import { useState } from "react";
import Layout from "@/components/Layout";
import ResumeUploader from "@/components/ResumeUploader";
import JobSelector from "@/components/JobSelector";
import ResumeResults from "@/components/ResumeResults";
import { AnalysisResult } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { analyzeResume } from "@/api/resumeService";
import { toast } from "sonner";
import { FileText, Loader2, Settings, Upload } from "lucide-react";
import GradientText from "@/components/ui/GradientText";
import { Link } from "react-router-dom";

const Analyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetJob, setTargetJob] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");


  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleJobSelected = (selectedJob: string | null, description?: string) => {
    setTargetJob(selectedJob);
    setJobDescription(description || "");
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisResult = await analyzeResume(file, targetJob, [], jobDescription);
      setResult(analysisResult);
      toast.success("Analysis completed successfully!");
    } catch (err) {
      console.error("Analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "Analysis failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openRecommendedFormat = () => {
    window.open('/recommended-resume-format.html', '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12" >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={11}
              showBorder={false}
              className="text-5xl "
            >
              <p className="mb-5">
                Resume Analyzer
              </p>
            </GradientText>

            <p className="text-xl text-gray-600 dark:text-gray-300 ">
              Upload your resume, choose a target job, and get AI-powered analysis
            </p>
          </div>
          {/* Resume Builder Highlight - Shown after file upload */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xl font-medium text-green-800 dark:text-green-200 mb-2">
                  Make Your Resume ATS-Friendly
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  For even better results with recruiters
                  and Applicant Tracking Systems (ATS), try our Resume Builder. In just minutes, you
                  can create a clean, professional, and ATS-friendly resume that stands out.
                </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openRecommendedFormat}
                      className="text-amber-700 dark:text-amber-300 border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors duration-300"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Recommended Format
                    </Button>
                    <Link to="/builder">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-700 dark:text-green-300 border-green-300 hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-300"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Build Resume of Recommended Format
                    </Button>
                    </Link>
                  </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">

            <div className="flex flex-col">
              <ResumeUploader onFileSelected={handleFileSelected} />
              <JobSelector onJobSelected={handleJobSelected} />
            </div>

            <Card className="bg-resume-light dark:bg-gray-800 p-6 text-center">
              <Button
                className="w-full sm:w-auto bg-resume-primary hover:bg-resume-primary/90 dark:bg-resume-secondary dark:hover:bg-resume-secondary/90 px-8"
                size="lg"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 z-0">
                We'll analyze your resume against {targetJob || "general"} requirements
              </p>
            </Card>

            <ResumeResults
              result={result}
              loading={isAnalyzing}
              error={error}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analyzer;