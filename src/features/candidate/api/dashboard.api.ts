import { axiosInstance } from "@/lib/axios";

export interface CandidateDashboardResponse {
  totalApplications: number;
  applied: number;
  shortlisted: number;
  interview: number;
  hired: number;
  rejected: number;
}

interface CandidateDashboardApiResponse {
  success: boolean;
  message: string;
  data: CandidateDashboardResponse;
}

export async function getCandidateDashboard(): Promise<CandidateDashboardResponse> {
  const response =
    await axiosInstance.get<CandidateDashboardApiResponse>(
      "/dashboard/candidate"
    );

  return response.data.data;
}
