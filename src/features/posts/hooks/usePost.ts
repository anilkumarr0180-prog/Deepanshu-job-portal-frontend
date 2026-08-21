import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../api/postApi";
import type { Post } from "../types/post.types";

export function usePost(postId: string) {
  return useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
}
