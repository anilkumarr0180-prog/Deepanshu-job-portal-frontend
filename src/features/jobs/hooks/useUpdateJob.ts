import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { CreateJobPayload } from "../api/jobs.api";
import { updateJob } from "../api/jobs.api";

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateJobPayload }) =>
      updateJob(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Job posting updated successfully.");
      void queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["job", variables.id] });
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "recruiter"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to update job posting."
      );
    },
  });
}