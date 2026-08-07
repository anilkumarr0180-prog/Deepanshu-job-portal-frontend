import { axiosInstance } from "@/lib/axios";

export interface BackendCandidateJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin: number;
  salaryMax: number;
  status: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendCandidateApplication {
  _id: string;
  jobId: BackendCandidateJob;
  applicantId: string;
  resume: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MyApplicationsApiResponse {
  success: boolean;
  data: BackendCandidateApplication[];
}

interface WithdrawApplicationApiResponse {
  success: boolean;
  message: string;
}

export async function getMyApplications(): Promise<BackendCandidateApplication[]> {
  const response = await axiosInstance.get<any>("/applications/my");

  const rawData = response.data?.data;

  if (Array.isArray(rawData)) {
    return rawData;
  }

  if (rawData && typeof rawData === "object" && Array.isArray(rawData.items)) {
    return rawData.items;
  }

  return [];
}

export async function withdrawApplication(
  applicationId: string
): Promise<void> {
  await axiosInstance.delete<WithdrawApplicationApiResponse>(
    `/applications/${applicationId}`
  );
}
