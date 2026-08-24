import { useQuery } from "@tanstack/react-query";
import { getPeopleSuggestions } from "../api/connectionApi";

export function usePeopleSuggestions(limit: number = 6) {
  return useQuery({
    queryKey: ["people-suggestions", limit],
    queryFn: () => getPeopleSuggestions(limit),
    staleTime: 1000 * 60 * 3,
  });
}