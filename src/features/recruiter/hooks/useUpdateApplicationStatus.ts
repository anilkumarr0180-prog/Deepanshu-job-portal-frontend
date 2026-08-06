import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateApplicationStatus } from "../api/applications.api";

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["applications", "all"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "recruiter"] });
      toast.success("Application status updated successfully.");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to update application status."
      );
    },
  });
}
