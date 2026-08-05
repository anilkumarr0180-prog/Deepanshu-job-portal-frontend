import { axiosInstance } from "@/lib/axios";
import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";

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
  const response = await axiosInstance.get<JobsApiResponse>("/jobs", {
    params,
  });

  return response.data.data;
}

export async function applyForJob(
  jobId: string,
  coverLetter?: string
): Promise<void> {
  await axiosInstance.post<{ success: boolean; message: string }>(
    `/jobs/${jobId}/apply`,
    coverLetter ? { coverLetter } : {}
  );
}
