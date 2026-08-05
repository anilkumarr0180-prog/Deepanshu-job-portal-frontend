import { useQuery } from "@tanstack/react-query";
import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";

import { getLatestJobs } from "../api/jobs.api";

export function useLatestJobs() {
  return useQuery<BackendJobDetails[]>({
    queryKey: ["jobs", "latest"],
    queryFn: getLatestJobs,
  });
}
