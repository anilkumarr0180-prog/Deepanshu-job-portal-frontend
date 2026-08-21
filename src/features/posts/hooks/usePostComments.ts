import { useQuery } from "@tanstack/react-query";
import { getPostComments } from "../api/postApi";
import type {
  GetPostCommentsParams,
  PostCommentsResponse,
} from "../types/post.types";

export function usePostComments(
  postId: string,
  params?: GetPostCommentsParams
) {
  return useQuery<PostCommentsResponse>({
    queryKey: ["postComments", postId, params],
    queryFn: () => getPostComments(postId, params),
    enabled: !!postId,
  });
}
