import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createJob } from "../api/jobs.api";

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
  });
}