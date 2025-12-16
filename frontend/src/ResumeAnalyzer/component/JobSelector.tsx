import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2 } from "lucide-react";

interface JobSelectorProps {
  onJobSelected: (job: string | null, description?: string) => void;
}

const JobSelector = ({ onJobSelected }: JobSelectorProps) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const jobs = [
    {
      id: "data-scientist",
      title: "Data Scientist",
      description: "Machine learning, statistics, and data analysis"
    },
    {
      id: "frontend-developer",
      title: "Frontend Developer",
      description: "UI development with JavaScript, React, HTML, CSS"
    },
    {
      id: "backend-developer",
      title: "Backend Developer",
      description: "Server-side applications with databases and APIs"
    },
    {
      id: "full-stack-developer",
      title: "Full Stack Developer",
      description: "End-to-end web development with frontend and backend"
    },
    {
      id: "software-engineer",
      title: "Software Engineer",
      description: "General software development and engineering"
    },
    {
      id: "devops-engineer",
      title: "DevOps Engineer",
      description: "Infrastructure, deployment, and automation"
    }
  ];

  const handleJobChange = (value: string) => {
    const jobTitle = value === "general" ? null : jobs.find(job => job.id === value)?.title || null;
    setSelectedJob(value);
    onJobSelected(jobTitle);
  };

  return (
    <Card className="bg-transparent rounded-b-md border border-gray-200 dark:border-gray-700">
      <CardContent className="pt-6">
        <h3 className="text-lg text-resume-primary dark:text-resume-secondary mb-4">Select Target Job</h3>

        <div className="flex flex-col space-y-6">
          {/* Job Selection Column */}
          <div>
            <RadioGroup
              value={selectedJob || ""}
              onValueChange={handleJobChange}
              className="space-y-3"
            >
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`flex items-start space-x-3 p-3 rounded-md border transition-colors ${selectedJob === job.id
                      ? "border-resume-primary dark:text-white bg-blue-50 dark:bg-gray-800"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
                    }`}
                >
                  <RadioGroupItem value={job.id} id={job.id} className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor={job.id}
                      className={`block text-base font-medium mb-1 cursor-pointer ${selectedJob === job.id
                          ? "text-resume-primary dark:text-white"
                          : "text-gray-900 dark:text-gray-200"
                        }`}
                    >
                      {job.title}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{job.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Job Description Column */}
          <div className={`transition-all duration-300 ${selectedJob ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <Label
              htmlFor="job-description"
              className="text-lg text-resume-primary dark:text-resume-secondary mb-4"
            >
              Job Description (Optional)
            </Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here to get more targeted analysis and recommendations..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px] resize-y mt-4"
              disabled={!selectedJob}
            />

            {selectedJob && (
              <button
                onClick={async () => {
                  setIsUpdating(true);
                  setIsUpdated(false);
                  
                  // Simulate update process
                  await new Promise(resolve => setTimeout(resolve, 800));
                  
                  const jobTitle = jobs.find(job => job.id === selectedJob)?.title || null;
                  onJobSelected(jobTitle, jobDescription);
                  
                  setIsUpdating(false);
                  setIsUpdated(true);
                  
                  // Hide the checkmark after 2 seconds
                  setTimeout(() => setIsUpdated(false), 5000);
                }}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : isUpdated ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Updated!
                  </>
                ) : (
                  "Update Job Description"
                )}
              </button>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Adding a job description helps provide more accurate skill matching and personalized recommendations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSelector;