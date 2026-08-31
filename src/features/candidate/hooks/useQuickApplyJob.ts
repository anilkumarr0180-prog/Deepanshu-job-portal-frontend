import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { quickApplyForJob, type QuickApplyPayload } from "../api/jobs.api";

export function useQuickApplyJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuickApplyPayload) => quickApplyForJob(payload),
    onSuccess: () => {
      toast.success("Quick application submitted successfully! 🎉");
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["job"] });
      void queryClient.invalidateQueries({
        queryKey: ["applications", "mine"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["my-applications"],
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError?.response?.data?.message ||
        "Failed to submit quick application. Please try again.";

      toast.error(message);
    },
  });
}
