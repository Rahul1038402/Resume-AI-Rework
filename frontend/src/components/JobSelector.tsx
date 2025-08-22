import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface JobSelectorProps {
  onJobSelected: (job: string | null) => void;
}

const JobSelector = ({ onJobSelected }: JobSelectorProps) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  
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
    }
  ];

  const handleJobChange = (value: string) => {
    const jobTitle = value === "general" ? null : jobs.find(job => job.id === value)?.title || null;
    setSelectedJob(value);
    onJobSelected(jobTitle);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Select Target Job</h3>
        <RadioGroup
          value={selectedJob || ""}
          onValueChange={handleJobChange}
          className="space-y-3"
        >
          {jobs.map((job) => (
            <div 
              key={job.id}
              className={`flex items-start space-x-3 p-3 rounded-md border transition-colors ${
                selectedJob === job.id ? "border-resume-primary dark:text-white bg-blue-50 dark:bg-gray-800" : "border-gray-200 hover:border-gray-500"
              }`}
            >
              <RadioGroupItem value={job.id} id={job.id} className="mt-1" />
              <div className="flex-1">
                <Label 
                  htmlFor={job.id}
                  className={`block text-base font-medium mb-1 cursor-pointer ${
                    selectedJob === job.id ? "text-resume-primary dark:text-white" : " dark:text-gray-200"
                  }`}
                >
                  {job.title}
                </Label>
                <p className="text-sm text-gray-500">{job.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default JobSelector;
