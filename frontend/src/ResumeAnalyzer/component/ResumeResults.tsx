import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Code,
  BarChart3,
  FileText,
  Zap,
  Star,
  StarHalf,
  X
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ResumeResultsProps } from '../types/analysis'

const ResumeResults = ({ result, loading, error }: ResumeResultsProps) => {
  /** -------------------- LOADING STATE -------------------- */
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-6 w-full mt-2 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-4 w-1/3 mt-4 bg-gray-300 dark:bg-gray-700" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700" />
                <div className="flex gap-2">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton
                      key={j}
                      className="h-6 w-20 bg-gray-300 dark:bg-gray-700"
                    />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  /** -------------------- ERROR STATE -------------------- */
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  /** -------------------- EMPTY STATE -------------------- */
  if (!result) {
    return (
      <Alert>
        <Info className="h-4 w-4 mt-2" />
        <AlertTitle className="flex items-center gap-2 justify-between">
          <span>Ready to analyze</span>
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium border border-green-600 rounded-xl p-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            AI Active
          </span>
        </AlertTitle>
        <AlertDescription>
          Upload a resume and select a target job to begin comprehensive analysis.
        </AlertDescription>
      </Alert>
    );
  }

  /** -------------------- DESTRUCTURE DATA -------------------- */
  const {
    score = 0,
    matched_skills = {},
    missing_skills = {},
    recommendations = [],
    target_job = "General",
    projects = [],
    analysis = {
      total_skills_found: 0,
      total_projects: 0,
      relevant_projects: 0,
      skills_with_metrics: 0,
      achieved_score: 0,
      project_bonus: 0,
      diversity_bonus: 0
    }
  } = result;

  // Extract project relevance from the backend response structure
  const job_match = (result as any).job_match || {};
  const project_relevance = job_match.project_relevance || {};

  /** -------------------- HELPERS -------------------- */
  const getScoreInfo = (score: number) => {
    if (score >= 80) return { color: "text-green-600", message: "Excellent Match", icon: "🎉" };
    if (score >= 70) return { color: "text-blue-600", message: "Strong Match", icon: "💪" };
    if (score >= 60) return { color: "text-yellow-600", message: "Good Match", icon: "👍" };
    if (score >= 40) return { color: "text-orange-600", message: "Needs Improvement", icon: "🔧" };
    return { color: "text-red-600", message: "Major Gaps", icon: "🚨" };
  };

  const getRelevanceIcon = (relevanceLabel: string) => {
    switch (relevanceLabel) {
      case "Highly Relevant":
        return <Star className="h-4 w-4 dark:text-green-400 dark:fill-green-400 text-green-200 fill-green-200" />;
      case "Somewhat Relevant":
        return <StarHalf className="h-4 w-4 dark:text-yellow-400 dark:fill-yellow-400 text-yellow-200 fill-yellow-200" />;
      case "Not Relevant":
        return <X className="h-4 w-4 dark:text-red-500 text-red-200" />;
      default:
        return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRelevanceBadgeVariant = (relevanceLabel: string) => {
    switch (relevanceLabel) {
      case "Highly Relevant":
        return "default";
      case "Somewhat Relevant":
        return "secondary";
      case "Not Relevant":
        return "destructive";
      default:
        return "outline";
    }
  };

  const safeNumber = (value: any, decimals = 1): string => {
    const num = typeof value === 'number' ? value : 0;
    return num.toFixed(decimals);
  };

  const scoreInfo = getScoreInfo(score);

  /** -------------------- MAIN RENDER -------------------- */
  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="shadow-lg border-2">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Analysis Results</CardTitle>
              <p className="text-lg text-muted-foreground mt-1">
                {scoreInfo.icon} {scoreInfo.message}
              </p>
            </div>
            <div className={`text-3xl sm:text-4xl font-bold ${scoreInfo.color}`}>
              {Math.round(score)}/100
            </div>
          </div>
          <Progress value={score} className="h-4 mt-4" />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-muted-foreground">
              Target: <span className="font-medium text-foreground">
                {target_job
                  .toLowerCase()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Skills: {analysis.total_skills_found}</span>
              <span>Projects: {analysis.total_projects}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-200">
                {safeNumber(job_match.skill_match_score || analysis.achieved_score)}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-100">Skills Match</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-200">
                {safeNumber(job_match.avg_project_relevance || 0)}
              </div>
              <div className="text-sm text-green-800 dark:text-green-100">Avg Project Relevance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-200">
                {safeNumber(job_match.overall_relevance_score || score)}
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-100">Overall Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Matched Skills ({(job_match.matched_skills || []).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(job_match.matched_skills || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(job_match.matched_skills || []).map((skill: string, index: number) => (
                  <Badge
                    key={`${skill}-${index}`}
                    variant="default"
                    className="gap-1.5 bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No matching skills detected for this job role.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Missing Critical Skills ({(job_match.missing_skills || []).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(job_match.missing_skills || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(job_match.missing_skills || []).map((skill: string, index: number) => (
                  <Badge
                    key={`${skill}-${index}`}
                    variant="destructive"
                    className="gap-1.5"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Great! No critical missing skills identified.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Projects Analysis with Relevance Labels */}
      {Object.keys(project_relevance).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" />
              Projects Analysis ({Object.keys(project_relevance).length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Projects categorized by relevance to {target_job}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(project_relevance).map(([projectName, projectData]: [string, any], index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-lg">{projectName}</h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getRelevanceBadgeVariant(projectData.relevance_label)}
                      className="flex items-center gap-1"
                    >
                      {getRelevanceIcon(projectData.relevance_label)}
                      {projectData.relevance_label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Skills Used ({((result as any).projects_with_skills[projectName] || []).length}):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {((result as any).projects_with_skills[projectName] || []).map((skill: string, skillIndex: number) => {
                        const isMatched = (projectData.matched_skills || []).includes(skill);
                        return (
                          <Badge
                            key={`${skill}-${skillIndex}`}
                            variant={isMatched ? "default" : "outline"}
                            className={`text-xs ${isMatched ? 'bg-green-100 text-green-800' : ''}`}
                          >
                            {isMatched && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {skill}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">
                      Quantifiable Results:
                    </p>
                    {/* Get metrics from the main data structure */}
                    {(() => {
                      const metricsData = (result as any).quantifiable_impacts || {};
                      const projectMetrics = metricsData[projectName] || [];

                      return projectMetrics.length > 0 ? (
                        <div className="space-y-1">
                          {projectMetrics.slice(0, 3).map((metric: string, metricIndex: number) => (
                            <div key={metricIndex} className="text-xs dark:bg-green-800 p-2 rounded border-2 border-green-500">
                              <TrendingUp className="h-3 w-3 inline mr-1 text-green-600" />
                              {metric}
                            </div>
                          ))}
                          {projectMetrics.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{projectMetrics.length - 3} more metrics
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground p-2 dark:bg-yellow-950 rounded border-2 border-yellow-500">
                          <AlertTriangle className="h-3 w-3 inline mr-1 text-yellow-600" />
                          No quantifiable results detected
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Matched Skills Summary for this project */}
                {(projectData.matched_skills || []).length > 0 && (
                  <div className="mt-3 p-2 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-green-700 font-semibold">
                      <CheckCircle2 className="h-3 w-3 inline mr-1" />
                      <strong>{(projectData.matched_skills || []).length}</strong> job-relevant skill{(projectData.matched_skills || []).length !== 1 ? 's' : ''} found: {(projectData.matched_skills || []).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 dark:bg-gray-800 bg-gray-100 rounded-lg border-l-4 border-blue-400">
                  <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-500">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-200">{analysis.total_skills_found}</div>
              <div className="text-xs text-blue-800 dark:text-blue-100">Total Skills Found</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-200">{Object.keys(project_relevance).length}</div>
              <div className="text-xs text-green-800 dark:text-green-100">Analyzed Projects</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-200">
                {Object.values(project_relevance).filter((p: any) => p.relevance_label === "Highly Relevant").length}
              </div>
              <div className="text-xs text-purple-800 dark:text-purple-100">Highly Relevant</div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-700 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-200">
                {(() => {
                  const totalProjects = Object.keys(project_relevance).length;
                  const metricsData = (result as any).quantifiable_impacts || {};
                  const projectsWithMetrics = Object.keys(metricsData).filter(project =>
                    (metricsData[project] || []).length > 0
                  ).length;
                  return totalProjects > 0 ? Math.round((projectsWithMetrics / totalProjects) * 100) : 0;
                })()}%
              </div>
              <div className="text-xs text-orange-800 dark:text-orange-100">Have Metrics</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeResults;