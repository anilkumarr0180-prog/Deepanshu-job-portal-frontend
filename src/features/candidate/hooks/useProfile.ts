import { useQuery } from "@tanstack/react-query";

import { getProfile, type BackendProfile } from "../api/profile.api";

export function useProfile() {
  return useQuery<BackendProfile>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}
