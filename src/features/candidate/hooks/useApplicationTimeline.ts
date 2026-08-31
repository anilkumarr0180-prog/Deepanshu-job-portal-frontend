import { useQuery } from "@tanstack/react-query";
import { getApplicationHistory } from "../api/applications.api";

export function useApplicationTimeline(applicationId?: string) {
  return useQuery({
    queryKey: ["application-timeline", applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      return getApplicationHistory(applicationId);
    },
    enabled: Boolean(applicationId),
    staleTime: 1000 * 30, // 30 seconds
  });
}
