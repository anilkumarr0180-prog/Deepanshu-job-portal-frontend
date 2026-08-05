import { useQuery } from "@tanstack/react-query";

import { getJobs } from "@/features/jobs/api/jobs.api";

export interface AdminJobItem {
  _id: string;
  title: string;
  company: string;
  status: string;
  createdAt: string;
  recruiterId: {
    name: string;
    email: string;
  } | null;
}

export interface AdminJobsResponse {
  jobs: AdminJobItem[];
  pagination: {
    page: number;
    limit: number;
    totalJobs: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

function normalizeJobStatus(status: string): "Published" | "Draft" | "Archived" {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "Published";
    case "DRAFT":
      return "Draft";
    case "CLOSED":
      return "Archived";
    default:
      return "Draft";
  }
}

export interface AdminJobFromBackend extends Omit<AdminJobItem, "status"> {
  status: "Published" | "Draft" | "Archived";
}

export function useAdminJobs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["admin-jobs", params],
    queryFn: async () => {
      const response = (await getJobs(params)) as { data?: AdminJobsResponse };
      const data = response.data ?? ({} as AdminJobsResponse);

      const normalizedJobs: AdminJobFromBackend[] = (data.jobs ?? []).map((job) => ({
        ...job,
        status: normalizeJobStatus(job.status),
      }));

      return {
        ...data,
        jobs: normalizedJobs,
      };
    },
  });
}
