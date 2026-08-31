import { useQuery } from "@tanstack/react-query";
import { getApplicationInterviews } from "../api/interviews.api";
import type { Interview } from "../types/interview.types";

/**
 * React Query hook to fetch all scheduled interview rounds for a specific application.
 */
export function useApplicationInterviews(applicationId?: string) {
  return useQuery<Interview[]>({
    queryKey: ["interviews", "application", applicationId],
    queryFn: () => {
      if (!applicationId) return Promise.resolve([]);
      return getApplicationInterviews(applicationId);
    },
    enabled: Boolean(applicationId),
    staleTime: 1000 * 30, // 30 seconds
  });
}
