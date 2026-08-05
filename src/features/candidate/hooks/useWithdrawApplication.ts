import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { withdrawApplication } from "../api/applications.api";

export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdrawApplication,
    onSuccess: () => {
      toast.success("Application withdrawn successfully.");
      void queryClient.invalidateQueries({
        queryKey: ["applications", "mine"],
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to withdraw application."
      );
    },
  });
}
