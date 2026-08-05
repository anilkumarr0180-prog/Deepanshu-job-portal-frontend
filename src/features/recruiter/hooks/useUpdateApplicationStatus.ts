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
      queryClient.invalidateQueries({ queryKey: ["applications", "all"] });
      toast.success("Application status updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update application status.");
    },
  });
}
