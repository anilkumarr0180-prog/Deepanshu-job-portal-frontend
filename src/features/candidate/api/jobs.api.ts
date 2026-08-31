import { axiosInstance } from "@/lib/axios";
import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { removeEmptyFields } from "@/shared/utils/removeEmptyFields";

export interface JobsFilterParams {
  search?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  minSalary?: string;
  maxSalary?: string;
  skills?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export interface JobsPagination {
  page: number;
  limit: number;
  totalJobs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface JobsResponse {
  jobs: BackendJobDetails[];
  pagination: JobsPagination;
}

export interface ApplyJobPayload {
  coverLetter?: string;
  applicantName?: string;
  applicantPhone?: string;
  applicantDesignation?: string;
  experienceYears?: number;
  relevantSkills?: string[];
  noticePeriod?: string;
  resumeUrl?: string;
  resumePublicId?: string;
  resumeFileName?: string;
}

interface JobsApiResponse {
  success: boolean;
  message: string;
  data: {
    jobs: BackendJobDetails[];
    pagination: JobsPagination;
  };
}

export async function getLatestJobs(): Promise<BackendJobDetails[]> {
  const response = await axiosInstance.get<JobsApiResponse>("/jobs", {
    params: { limit: "6" },
  });

  return response.data.data.jobs;
}

export async function getJobsWithFilters(
  params: JobsFilterParams
): Promise<JobsResponse> {
  const cleanedParams = removeEmptyFields(params);
  const response = await axiosInstance.get<JobsApiResponse>("/jobs", {
    params: cleanedParams,
  });

  return response.data.data;
}

export async function applyForJob(
  jobId: string,
  payload?: ApplyJobPayload
): Promise<void> {
  await axiosInstance.post<{ success: boolean; message: string }>(
    `/jobs/${jobId}/apply`,
    payload ?? {}
  );
}

export interface QuickApplyPayload {
  jobId: string;
  coverLetter?: string;
}

export async function quickApplyForJob(
  payload: QuickApplyPayload
): Promise<any> {
  const response = await axiosInstance.post<{
    success: boolean;
    message: string;
    data: any;
  }>("/applications/quick-apply", payload);
  return response.data;
}
