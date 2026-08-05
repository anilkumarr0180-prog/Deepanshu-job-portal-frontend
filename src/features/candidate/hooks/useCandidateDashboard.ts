import { useQuery } from "@tanstack/react-query";

import {
  getCandidateDashboard,
  type CandidateDashboardResponse,
} from "../api/dashboard.api";

export function useCandidateDashboard() {
  return useQuery<CandidateDashboardResponse>({
    queryKey: ["dashboard", "candidate"],
    queryFn: getCandidateDashboard,
  });
}
