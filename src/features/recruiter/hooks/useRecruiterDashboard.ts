import { useQuery } from "@tanstack/react-query";
import { getRecruiterDashboard, type RecruiterDashboardResponse } from "../api/dashboard.api";

export function useRecruiterDashboard() {
  return useQuery<RecruiterDashboardResponse>({
    queryKey: ["dashboard", "recruiter"],
    queryFn: getRecruiterDashboard,
  });
}
