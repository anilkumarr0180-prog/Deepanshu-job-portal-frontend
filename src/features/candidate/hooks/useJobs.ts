import { useQuery } from "@tanstack/react-query";

import {
  getJobsWithFilters,
  type JobsResponse,
  type JobsFilterParams,
} from "../api/jobs.api";

export function useJobs(params: JobsFilterParams) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", params],
    queryFn: () => getJobsWithFilters(params),
  });
}
