import { useQuery } from "@tanstack/react-query";
import { getConnectionStatus } from "../api/connectionApi";

export function useConnectionStatus(targetUserId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["connection-status", targetUserId],
    queryFn: () => (targetUserId ? getConnectionStatus(targetUserId) : null),
    enabled: Boolean(targetUserId) && enabled,
    staleTime: 1000 * 30,
  });
}