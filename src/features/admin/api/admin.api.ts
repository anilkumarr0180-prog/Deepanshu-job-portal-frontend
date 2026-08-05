import { axiosInstance } from "@/lib/axios";

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    totalRecruiters: number;
    totalCandidates: number;
    totalJobs: number;
    totalApplications: number;
    recentUsers: Array<{
      _id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
    recentJobs: Array<{
      _id: string;
      title: string;
      company: string;
      status: string;
      createdAt: string;
      recruiterId: {
        name: string;
        email: string;
      } | null;
    }>;
  };
}

export async function getAdminDashboard() {
  const response = await axiosInstance.get("/admin/dashboard");

  return response.data as AdminDashboardResponse;
}
