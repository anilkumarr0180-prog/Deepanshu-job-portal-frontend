import { axiosInstance } from "@/lib/axios";
import type {
  GenerateJobDescriptionInput,
  GeneratedJobDescription,
  ParsedResume,
  MatchAnalysisInput,
  MatchAnalysisResult,
} from "../types/ai.types";

/**
 * 1. Generate structured Job Description for recruiters
 */
export async function generateJobDescriptionApi(
  payload: GenerateJobDescriptionInput
): Promise<GeneratedJobDescription> {
  const response = await axiosInstance.post<{
    success: boolean;
    data: GeneratedJobDescription;
  }>("/ai/generate-job-description", payload);
  return response.data.data;
}

/**
 * 2. Parse uploaded Resume PDF or raw text
 */
export async function parseResumeApi(payload: {
  resumeUrl?: string;
  rawText?: string;
}): Promise<ParsedResume> {
  const response = await axiosInstance.post<{
    success: boolean;
    data: ParsedResume;
  }>("/ai/parse-resume", payload);
  return response.data.data;
}

/**
 * 3. Analyze ATS Match score between Candidate & Job
 */
export async function analyzeMatchApi(
  payload: MatchAnalysisInput
): Promise<MatchAnalysisResult> {
  const response = await axiosInstance.post<{
    success: boolean;
    data: MatchAnalysisResult;
  }>("/ai/analyze-match", payload);
  return response.data.data;
}
