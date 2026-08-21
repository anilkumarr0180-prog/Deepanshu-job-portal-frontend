import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePostComment } from "../api/postApi";
import type {
  UpdatePostCommentPayload,
  PostComment,
} from "../types/post.types";

export function useUpdatePostComment() {
  const queryClient = useQueryClient();

  return useMutation<
    PostComment,
    unknown,
    { postId: string; commentId: string; payload: UpdatePostCommentPayload }
  >({
    mutationFn: ({ postId, commentId, payload }) =>
      updatePostComment(postId, commentId, payload),
    onSuccess: (_data, variables) => {
      toast.success("Comment updated successfully.");
      void queryClient.invalidateQueries({
        queryKey: ["postComments", variables.postId],
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to update comment."
      );
    },
  });
}
