import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteJob } from "../api/jobs.api";

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
  });
}