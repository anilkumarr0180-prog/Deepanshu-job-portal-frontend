import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateJobPayload } from "../api/jobs.api";

import { updateJob } from "../api/jobs.api";

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateJobPayload }) =>
      updateJob(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", variables.id] });
    },
  });
}