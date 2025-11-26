import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ATSComparisonPage = ({ uploadedFile }) => {
  const [userPdfUrl, setUserPdfUrl] = useState(null);
  const [userZoom, setUserZoom] = useState(100);
  const [recommendedZoom, setRecommendedZoom] = useState(100);
  const [userScore, setUserScore] = useState(null);
  const [recommendedScore] = useState(95); // Static high score for recommended format
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (uploadedFile) {
      // Create object URL for the uploaded PDF
      const url = URL.createObjectURL(uploadedFile);
      setUserPdfUrl(url);
      
      // Calculate ATS score
      calculateATSScore(uploadedFile);

      // Cleanup
      return () => URL.revokeObjectURL(url);
    }
  }, [uploadedFile]);

  const calculateATSScore = async (file) => {
    setIsCalculating(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('YOUR_FLASK_BACKEND_URL/calculate-ats-score', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setUserScore(data.score);
      toast.success("ATS score calculated successfully!");
    } catch (error) {
      console.error('Error calculating ATS score:', error);
      toast.error("Failed to calculate ATS score");
      // Fallback to demo score
      setUserScore(72);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleZoom = (type, direction) => {
    const setter = type === 'user' ? setUserZoom : setRecommendedZoom;
    const current = type === 'user' ? userZoom : recommendedZoom;
    
    if (direction === 'in' && current < 200) {
      setter(current + 10);
    } else if (direction === 'out' && current > 50) {
      setter(current - 10);
    }
  };

  const ScoreCard = ({ score, label, isCalculating }) => (
    <div className={`p-4 rounded-lg
    ${
              score >= 80 ? 'bg-green-600/30 dark:bg-green-800/20' : 
              score >= 60 ? 'bg-yellow-600/30 dark:bg-yellow-800/20' : 
              'bg-red-600/30 dark:bg-red-800/20'
            }`}>
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</p>
        {isCalculating ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-resume-primary dark:text-resume-secondary" />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className={`text-3xl font-bold ${
              score >= 80 ? 'text-green-600 dark:text-green-400' : 
              score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
              'text-red-600 dark:text-red-400'
            }`}>
              {score}%
            </span>
          </div>
        )}
        {!isCalculating && score && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
          </p>
        )}
      </div>
    </div>
  );

  const PDFViewer = ({ url, zoom, type, title }) => (
    <Card className="flex-1 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl dark:text-white">{title}</h3>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-900 overflow-auto">
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
          {url ? (
            <iframe
              src={url}
              className="w-full border-0 rounded"
              style={{ height: '600px', minHeight: '600px' }}
              title={title}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No file available</p>
            </div>
          )}
        </div>
      </div>

      {type === 'user' ? (
        <ScoreCard score={userScore} label="Your ATS Score" isCalculating={isCalculating} />
      ) : (
        <ScoreCard score={recommendedScore} label="Recommended Format Score" isCalculating={false} />
      )}
    </Card>
  );

  if (!uploadedFile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center dark:bg-gray-800 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Please upload a resume to view the ATS comparison
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl text-center text-resume-primary dark:text-resume-secondary mb-2">
            Here are the comparison results
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <PDFViewer
            url={userPdfUrl}
            zoom={userZoom}
            type="user"
            title="Your Resume"
          />
          
          <PDFViewer
            url="/recommended-resume-format.pdf"
            zoom={recommendedZoom}
            type="recommended"
            title="Recommended Format"
          />
        </div>

        {userScore && (
          <Card className="mt-6 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-3 dark:text-white">
              Improvement Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {userScore < 80 && (
                <>
                  <p>• Use standard section headings (Experience, Education, Skills)</p>
                  <p>• Avoid tables, images, and complex formatting</p>
                  <p>• Use standard fonts like Arial, Calibri, or Times New Roman</p>
                  <p>• Include relevant keywords from the job description</p>
                  <p>• Save your resume as a .docx or PDF file</p>
                </>
              )}
              {userScore >= 80 && (
                <p className="text-green-600 dark:text-green-400">
                  ✓ Your resume is well-optimized for ATS systems!
                </p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ATSComparisonPage;