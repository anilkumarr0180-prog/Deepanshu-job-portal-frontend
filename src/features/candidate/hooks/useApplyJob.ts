import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { applyForJob } from "../api/jobs.api";

export function useApplyJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      coverLetter,
    }: {
      jobId: string;
      coverLetter?: string;
    }) => applyForJob(jobId, coverLetter),
    onSuccess: () => {
      toast.success("Application submitted successfully.");
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      void queryClient.invalidateQueries({
        queryKey: ["applications", "mine"],
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError?.response?.data?.message ||
        "Failed to apply for this job. Please try again.";

      toast.error(message);
    },
  });
}
