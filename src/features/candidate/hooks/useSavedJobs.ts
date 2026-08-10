import { useQuery } from "@tanstack/react-query";
import { getSavedJobsApi, checkJobSavedStatusApi, type BackendSavedJobItem } from "../api/savedJobs.api";

export function useSavedJobs() {
  return useQuery<BackendSavedJobItem[]>({
    queryKey: ["savedJobs"],
    queryFn: getSavedJobsApi,
  });
}

export function useCheckJobSavedStatus(jobId: string) {
  return useQuery<boolean>({
    queryKey: ["jobSavedStatus", jobId],
    queryFn: () => checkJobSavedStatusApi(jobId),
    enabled: Boolean(jobId),
  });
}
