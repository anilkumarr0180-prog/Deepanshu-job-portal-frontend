import { axiosInstance } from "@/lib/axios";

export interface RecruiterDashboardResponse {
  totalJobs: number;
  activeJobs: number;
  draftJobs: number;
  closedJobs: number;
  totalApplications: number;
}

export async function getRecruiterDashboard(): Promise<RecruiterDashboardResponse> {
  const response = await axiosInstance.get("/dashboard/recruiter");
  return response.data.data;
}
