import { useQuery } from "@tanstack/react-query";

import { getAllApplications } from "../api/applications.api";
import type { BackendApplicationWithJob } from "../utils/applicationMapper";

export function useAllApplications() {
  return useQuery<BackendApplicationWithJob[]>({
    queryKey: ["applications", "all"],
    queryFn: getAllApplications,
  });
}
