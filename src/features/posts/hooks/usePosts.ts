import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/postApi";
import type { GetPostsParams, PostsResponse } from "../types/post.types";

export function usePosts(params?: GetPostsParams) {
  return useQuery<PostsResponse["data"]>({
    queryKey: ["posts", params],
    queryFn: () => getPosts(params),
  });
}
