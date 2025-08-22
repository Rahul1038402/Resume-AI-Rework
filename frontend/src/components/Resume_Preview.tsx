// src/components/ResumePreview.tsx
import React from "react";

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  summary: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];
  education: {
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
  }[];
}

const ResumePreview: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white text-black p-8 rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <header className="text-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="text-gray-700">
          {data.email} | {data.phone}
        </p>
        {data.linkedin && (
          <p>
            <a
              href={data.linkedin}
              target="_blank"
              className="text-blue-600 underline"
            >
              LinkedIn
            </a>
          </p>
        )}
        {data.github && (
          <p>
            <a
              href={data.github}
              target="_blank"
              className="text-blue-600 underline"
            >
              GitHub
            </a>
          </p>
        )}
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold border-b mb-2">Professional Summary</h2>
        <p className="text-gray-800">{data.summary}</p>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold border-b mb-2">Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {data.skills.map((skill, i) => (
            <li
              key={i}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm border"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold border-b mb-2">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-bold">
              {exp.title} - {exp.company}
            </h3>
            <p className="text-sm text-gray-600">
              {exp.location} | {exp.startDate} - {exp.endDate}
            </p>
            <ul className="list-disc pl-6 text-gray-800">
              {exp.description.map((line, j) => (
                <li key={j}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section>
        <h2 className="text-lg font-semibold border-b mb-2">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="mb-2">
            <h3 className="font-bold">{edu.degree}</h3>
            <p className="text-sm text-gray-600">
              {edu.school}, {edu.location}
            </p>
            <p className="text-sm text-gray-600">
              {edu.startDate} - {edu.endDate}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ResumePreview;
