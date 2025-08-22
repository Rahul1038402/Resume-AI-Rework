// Enhanced API service aligned with improved backend
const API_URL = "http://localhost:5000";

// Import the proper types
import { AnalysisResult, JobMatch, ProjectRelevance } from "../types/analysis";

// --- Common response handler ---
const handleApiResponse = async (response: Response, endpoint: string) => {
  console.log(`API Response for ${endpoint}:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    url: response.url,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorData = await response.json();
      console.error(`API Error Data for ${endpoint}:`, errorData);
      if (errorData.error) {
        errorMessage += ` - ${errorData.error}`;
      }
    } catch (jsonError) {
      console.error(`Failed to parse error JSON for ${endpoint}:`, jsonError);
      try {
        const errorText = await response.text();
        console.error(`Error text for ${endpoint}:`, errorText);
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      } catch (textError) {
        console.error(`Failed to read error text for ${endpoint}:`, textError);
      }
    }
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    console.log(`API Success Data for ${endpoint}:`, data);
    return data;
  } catch (jsonError) {
    console.error(`Failed to parse success JSON for ${endpoint}:`, jsonError);
    throw new Error(`Server returned invalid JSON response`);
  }
};

// --- API Calls ---

// ✅ Enhanced single job analysis with improved response normalization
function normalizeAnalysisResponse(apiResponse: any): AnalysisResult {
  console.log("Raw API Response:", apiResponse);
  
  const job = apiResponse.job_match || {};
  const skills = apiResponse.skills || [];
  const projectsWithSkills = apiResponse.projects_with_skills || {};
  const quantifiableImpacts = apiResponse.quantifiable_impacts || {};
  const projectRelevance = job.project_relevance || {};

  // Create projects array with enhanced data
  const projects = Object.entries(projectsWithSkills).map(([name, skillsList]) => {
    const projectSkills = Array.isArray(skillsList) ? skillsList : [];
    const metrics = quantifiableImpacts[name] || [];
    const relevanceData = projectRelevance[name] || {};
    
    return {
      name,
      skills: projectSkills,
      skills_count: projectSkills.length,
      metrics: metrics,
      metrics_count: metrics.length,
      has_quantifiable_results: metrics.length > 0,
      effectiveness_indicators: [],
      relevance_score: relevanceData.relevance_score || 0,
      description: "",
      skill_relevance: projectSkills.reduce((acc: Record<string, number>, skill: string) => {
        acc[skill] = 1;
        return acc;
      }, {})
    };
  });

  // Create relevant projects array from project_relevance
  const relevant_projects = Object.entries(projectRelevance).map(([name, data]: [string, any]) => ({
    name,
    skills: projectsWithSkills[name] || [],
    metrics: quantifiableImpacts[name] || [],
    relevance_score: data.relevance_score || 0,
    relevance_label: data.relevance_label || "Not Relevant"
  }));

  // Generate recommendations based on missing skills
  const recommendations = (job.missing_skills || []).map((skill: string) => 
    `Consider learning ${skill} to strengthen your profile for ${job.job_title || 'this role'}. This skill is commonly required in the industry.`
  );

  // Add project-specific recommendations
  const projectsWithoutMetrics = Object.entries(projectsWithSkills).filter(([name]) => 
    !quantifiableImpacts[name] || quantifiableImpacts[name].length === 0
  );
  
  if (projectsWithoutMetrics.length > 0) {
    recommendations.push(
      `${projectsWithoutMetrics.length} of your projects lack quantifiable results. Consider adding metrics like performance improvements, user engagement, or technical achievements to make them more impactful.`
    );
  }

  const result: AnalysisResult = {
    score: job.overall_relevance_score || 0,
    target_job: job.job_title,
    matched_skills: (job.matched_skills || []).reduce((acc: Record<string, number>, skill: string) => {
      acc[skill] = 5; // Default weight
      return acc;
    }, {}),
    missing_skills: (job.missing_skills || []).reduce((acc: Record<string, number>, skill: string) => {
      acc[skill] = 5; // Default weight
      return acc;
    }, {}),
    projects,
    relevant_projects,
    recommendations,
    analysis: {
      total_skills_found: skills.length,
      total_projects: Object.keys(projectsWithSkills).length,
      relevant_projects: Object.keys(projectRelevance).length,
      skills_with_metrics: Object.values(quantifiableImpacts).filter((metrics: any) => 
        Array.isArray(metrics) && metrics.length > 0
      ).length,
      achieved_score: job.skill_match_score || 0,
      project_bonus: Math.max(0, (job.avg_project_relevance || 0) - 50) * 0.5, // Bonus for high project relevance
      diversity_bonus: Math.max(0, skills.length - 10) * 0.2, // Bonus for skill diversity
    },
    // Include raw backend data for frontend access
    skills,
    projects_with_skills: projectsWithSkills,
    quantifiable_impacts: quantifiableImpacts,
    job_match: job
  };

  console.log("Normalized Result:", result);
  return result;
}

export const analyzeResume = async (
  file: File,
  targetJob: string | null,
  jobSkills: string[] = []
): Promise<AnalysisResult> => {
  console.log("Starting resume analysis:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    targetJob,
    jobSkills,
    apiUrl: API_URL,
  });

  const formData = new FormData();
  formData.append("file", file);
  if (targetJob) formData.append("target_job", targetJob.toLowerCase());

  if (jobSkills.length > 0) {
    formData.append("job_skills", jobSkills.join(","));
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const raw = await handleApiResponse(response, "analyze");
    const normalized = normalizeAnalysisResponse(raw);

    return normalized;
  } catch (error) {
    console.error("API Error in analyzeResume:", error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("Request timed out. Please try again with a smaller file.");
    }
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ✅ Enhanced multiple jobs analysis
export const analyzeMultipleJobs = async (
  file: File,
  jobsWithSkills: Record<string, string[]>
) => {
  console.log("Analyzing multiple jobs:", {
    fileName: file.name,
    jobsWithSkills,
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_jobs", Object.keys(jobsWithSkills).map(job => job.toLowerCase()).join(","));

  // Attach each job's skills as <job>_skills
  for (const [job, skills] of Object.entries(jobsWithSkills)) {
    const jobKey = job.toLowerCase();
    formData.append(`${jobKey}_skills`, skills.length ? skills.join(",") : "");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // Longer timeout for multiple jobs

    const response = await fetch(`${API_URL}/analyze-multiple-jobs`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const raw = await handleApiResponse(response, "analyze-multiple-jobs");
    
    // Normalize each job result
    const normalizedResults: Record<string, AnalysisResult> = {};
    for (const [jobTitle, jobResult] of Object.entries(raw)) {
      normalizedResults[jobTitle] = normalizeAnalysisResponse(jobResult);
    }

    return normalizedResults;
  } catch (error: any) {
    console.error("API Error in analyzeMultipleJobs:", error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("Request timed out. Please try again.");
    }
    throw new Error(`Failed to analyze multiple jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ✅ Enhanced project highlights
export const getProjectHighlights = async (
  file: File,
  targetJob: string,
  jobSkills: string[] = []
) => {
  console.log("Getting project highlights:", {
    fileName: file.name,
    targetJob,
    jobSkills,
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_job", targetJob.toLowerCase());
  formData.append("job_skills", jobSkills.length ? jobSkills.join(",") : "");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const response = await fetch(`${API_URL}/project-highlights`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const raw = await handleApiResponse(response, "project-highlights");
    
    // Enhance the project highlights response
    const enhanced = {
      ...raw,
      summary: {
        total_projects: Object.keys(raw.projects || {}).length,
        projects_with_impacts: Object.keys(raw.impacts || {}).length,
        impact_rate: Object.keys(raw.projects || {}).length > 0 
          ? Math.round((Object.keys(raw.impacts || {}).length / Object.keys(raw.projects || {}).length) * 100)
          : 0
      }
    };

    return enhanced;
  } catch (error: any) {
    console.error("API Error in getProjectHighlights:", error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("Request timed out. Please try again.");
    }
    throw new Error(`Failed to get project highlights: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ✅ Health check endpoint
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    
    return await handleApiResponse(response, "health-check");
  } catch (error: any) {
    console.error("Backend health check failed:", error);
    throw new Error(`Backend is not available: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ✅ Debug analyzer endpoint
export const testAnalyzer = async () => {
  try {
    const response = await fetch(`${API_URL}/debug/test-analyzer`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    
    return await handleApiResponse(response, "test-analyzer");
  } catch (error: any) {
    console.error("Analyzer test failed:", error);
    throw new Error(`Analyzer test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};