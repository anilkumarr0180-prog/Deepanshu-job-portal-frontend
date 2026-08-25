import { useQuery } from "@tanstack/react-query";
import { savedPostApi } from "../api/savedPostApi";
import type { GetSavedPostsParams } from "../types/post.types";

export const SAVED_POSTS_QUERY_KEY = ["saved-posts"];

export function useSavedPosts(params?: GetSavedPostsParams) {
  return useQuery({
    queryKey: [...SAVED_POSTS_QUERY_KEY, params],
    queryFn: () => savedPostApi.getMySavedPosts(params),
  });
}
