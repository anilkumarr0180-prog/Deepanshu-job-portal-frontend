import { axiosInstance } from "@/lib/axios";

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: {
    users: {
      totalUsers: number;
      totalRecruiters: number;
      totalCandidates: number;
      activeRecruiters: number;
      activeCandidates: number;
      blockedUsers: number;
    };
    jobs: {
      totalJobs: number;
      activeJobs: number;
      closedJobs: number;
      draftJobs: number;
    };
    applications: {
      totalApplications: number;
      applicationsToday: number;
      applicationsThisWeek: number;
      applicationsThisMonth: number;
    };
    recentUsers: Array<{
      _id: string;
      name: string;
      email: string;
      role: string;
      isBlocked: boolean;
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

export interface AdminUserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    items: AdminUserItem[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface AdminJobItem {
  _id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: string;
  experienceLevel: string;
  status: string;
  skills: string[];
  recruiterId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminJobsResponse {
  success: boolean;
  message: string;
  data: {
    items: AdminJobItem[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export async function getAdminDashboard() {
  const response = await axiosInstance.get("/admin/dashboard");
  return response.data as AdminDashboardResponse;
}

export async function getAdminUsers(params?: Record<string, unknown>) {
  const response = await axiosInstance.get("/admin/users", { params });
  return response.data as AdminUsersResponse;
}

export async function getAdminUserById(id: string) {
  const response = await axiosInstance.get(`/admin/users/${id}`);
  return response.data as { success: boolean; message: string; data: AdminUserItem };
}

export async function blockAdminUser(id: string) {
  const response = await axiosInstance.patch(`/admin/users/${id}/block`);
  return response.data as { success: boolean; message: string; data: AdminUserItem };
}

export async function unblockAdminUser(id: string) {
  const response = await axiosInstance.patch(`/admin/users/${id}/unblock`);
  return response.data as { success: boolean; message: string; data: AdminUserItem };
}

export async function getAdminJobs(params?: Record<string, unknown>) {
  const response = await axiosInstance.get("/admin/jobs", { params });
  return response.data as AdminJobsResponse;
}

export async function deleteAdminJob(id: string) {
  const response = await axiosInstance.delete(`/admin/jobs/${id}`);
  return response.data as { success: boolean; message: string; data: null };
}
