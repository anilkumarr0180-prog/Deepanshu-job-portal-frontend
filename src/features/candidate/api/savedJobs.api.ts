import { axiosInstance } from "@/lib/axios";
import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";

export interface BackendSavedJobItem {
  _id: string;
  userId: string;
  jobId: BackendJobDetails;
  createdAt: string;
  updatedAt: string;
}

export interface SavedJobsApiResponse {
  success: boolean;
  data: {
    items: BackendSavedJobItem[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  } | BackendSavedJobItem[];
}

export interface SavedStatusApiResponse {
  success: boolean;
  data: {
    saved: boolean;
  };
}

export async function getSavedJobsApi(): Promise<BackendSavedJobItem[]> {
  try {
    const response = await axiosInstance.get<SavedJobsApiResponse>("/saved-jobs");
    const rawData = response.data?.data;

    if (Array.isArray(rawData)) {
      return rawData;
    }

    if (rawData && typeof rawData === "object" && Array.isArray(rawData.items)) {
      return rawData.items;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch saved jobs:", error);
    return [];
  }
}

export async function checkJobSavedStatusApi(jobId: string): Promise<boolean> {
  if (!jobId) return false;
  try {
    const response = await axiosInstance.get<SavedStatusApiResponse>(`/saved-jobs/${jobId}/status`);
    return response.data?.data?.saved ?? false;
  } catch {
    return false;
  }
}

export async function saveJobApi(jobId: string): Promise<boolean> {
  const response = await axiosInstance.post<{ success: boolean; data: { saved: boolean } }>(
    `/saved-jobs/${jobId}`
  );
  return response.data?.data?.saved ?? true;
}

export async function removeSavedJobApi(jobId: string): Promise<boolean> {
  const response = await axiosInstance.delete<{ success: boolean; data: { saved: boolean } }>(
    `/saved-jobs/${jobId}`
  );
  return response.data?.data?.saved ?? false;
}
