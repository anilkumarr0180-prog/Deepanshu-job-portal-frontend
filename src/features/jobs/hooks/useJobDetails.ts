import { useQuery } from "@tanstack/react-query";
import type { BackendJobDetails } from "../utils/jobMapper";

import { getJobById } from "../api/jobs.api";

export function useJobDetails(id: string) {
  return useQuery<BackendJobDetails>({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
}