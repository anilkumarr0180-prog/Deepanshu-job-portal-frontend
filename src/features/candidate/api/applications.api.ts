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
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantDesignation?: string;
  experienceYears?: number;
  relevantSkills?: string[];
  noticePeriod?: string;
  resume: string;
  resumeFileName?: string;
  coverLetter?: string;
  interviewDetails?: {
    mode?: "video" | "in-person" | "phone";
    date?: string;
    time?: string;
    type?: string;
    locationOrLink?: string;
    notes?: string;
    timezone?: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyApplicationsApiResponse {
  success: boolean;
  data: BackendCandidateApplication[] | { items: BackendCandidateApplication[] };
}

interface WithdrawApplicationApiResponse {
  success: boolean;
  message: string;
}

export async function getMyApplications(): Promise<BackendCandidateApplication[]> {
  try {
    const response = await axiosInstance.get<MyApplicationsApiResponse>("/applications/my");

    const rawData = response.data?.data;

    if (Array.isArray(rawData)) {
      return rawData;
    }

    if (rawData && typeof rawData === "object" && Array.isArray(rawData.items)) {
      return rawData.items;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch my applications:", error);
    return [];
  }
}

export async function withdrawApplication(
  applicationId: string
): Promise<void> {
  await axiosInstance.delete<WithdrawApplicationApiResponse>(
    `/applications/${applicationId}`
  );
}

export interface BackendApplicationStatusHistoryActor {
  _id: string;
  name: string;
  email?: string;
  role?: string;
  profilePicture?: string;
}

export interface BackendApplicationStatusHistoryItem {
  _id: string;
  applicationId: string;
  jobId: string;
  fromStatus: string;
  toStatus: string;
  changedBy: BackendApplicationStatusHistoryActor | string;
  reason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationHistoryApiResponse {
  success: boolean;
  data: BackendApplicationStatusHistoryItem[];
}

export async function getApplicationHistory(
  applicationId: string
): Promise<BackendApplicationStatusHistoryItem[]> {
  const response = await axiosInstance.get<ApplicationHistoryApiResponse>(
    `/applications/${applicationId}/history`
  );
  return response.data?.data || [];
}
