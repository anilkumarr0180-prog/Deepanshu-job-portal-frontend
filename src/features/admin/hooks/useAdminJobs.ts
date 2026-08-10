import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAdminJobs,
  deleteAdminJob,
  type AdminJobItem,
} from "../api/admin.api";

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
      const response = await getAdminJobs(params);
      const data = response.data;

      const normalizedJobs: AdminJobFromBackend[] = (data.items ?? []).map(
        (job) => ({
          ...job,
          status: normalizeJobStatus(job.status),
        })
      );

      return {
        jobs: normalizedJobs,
        pagination: data.pagination ?? {
          page: 1,
          limit: 10,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    },
  });
}

export function useDeleteAdminJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => deleteAdminJob(jobId),
    onSuccess: (data) => {
      toast.success(data.message || "Job deleted successfully.");
      void queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete job.";
      toast.error(message);
    },
  });
}
