import { useQuery } from "@tanstack/react-query";
import { getUserConnections } from "../api/connectionApi";
import type { GetConnectionsParams } from "../types/connection.types";

export function useConnections(params?: GetConnectionsParams) {
  return useQuery({
    queryKey: ["connections", params],
    queryFn: () => getUserConnections(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}
