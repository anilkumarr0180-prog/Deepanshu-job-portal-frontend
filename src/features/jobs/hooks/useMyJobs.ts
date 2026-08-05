import { useQuery } from "@tanstack/react-query";
import type { BackendJob } from "../utils/jobMapper";

import { getMyJobs } from "../api/jobs.api";

export function useMyJobs() {
  return useQuery<BackendJob[]>({
    queryKey: ["my-jobs"],
    queryFn: getMyJobs,
  });
}