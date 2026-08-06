import { axiosInstance } from "@/lib/axios";
import { removeEmptyFields } from "@/shared/utils/removeEmptyFields";
import type { BackendJob, BackendJobDetails } from "../utils/jobMapper";

export interface JobsFilterParams {
  search?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  minSalary?: string;
  maxSalary?: string;
  skills?: string;
  sort?: string;
  status?: string;
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

export interface CreateJobPayload {
  title: string;
  description: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: string;
  experienceLevel: string;
  status?: string;
  skills: string[];
}

export async function getJobs(params?: Record<string, unknown>) {
  const cleanedParams = params ? removeEmptyFields(params) : undefined;
  const response = await axiosInstance.get("/jobs", {
    params: cleanedParams,
  });

  return response.data;
}

export async function getJobsWithFilters(
  params: JobsFilterParams
): Promise<JobsResponse> {
  const cleanedParams = removeEmptyFields(params);
  const response = await axiosInstance.get<{
    success: boolean;
    message: string;
    data: JobsResponse;
  }>("/jobs", {
    params: cleanedParams,
  });

  return response.data.data;
}

export async function getMyJobs(): Promise<BackendJob[]> {
  const response = await axiosInstance.get("/jobs/my-jobs");

  return response.data.data;
}

export async function getJobById(id: string): Promise<BackendJobDetails> {
  const response = await axiosInstance.get(`/jobs/${id}`);

  return response.data.data;
}

export async function createJob(data: CreateJobPayload) {
  const response = await axiosInstance.post("/jobs", data);

  return response.data;
}

export async function updateJob(id: string, data: CreateJobPayload) {
  const response = await axiosInstance.put(`/jobs/${id}`, data);

  return response.data;
}

export async function deleteJob(id: string) {
  const response = await axiosInstance.delete(`/jobs/${id}`);

  return response.data;
}