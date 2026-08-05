import { useQuery } from "@tanstack/react-query";

import {
  getMyApplications,
  type BackendCandidateApplication,
} from "../api/applications.api";

export function useMyApplications() {
  return useQuery<BackendCandidateApplication[]>({
    queryKey: ["applications", "mine"],
    queryFn: getMyApplications,
  });
}
