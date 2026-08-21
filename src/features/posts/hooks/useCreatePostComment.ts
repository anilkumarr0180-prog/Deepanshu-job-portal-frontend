import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createPostComment } from "../api/postApi";
import type {
  CreatePostCommentPayload,
  PostComment,
} from "../types/post.types";

export function useCreatePostComment() {
  const queryClient = useQueryClient();

  return useMutation<
    PostComment,
    unknown,
    { postId: string; payload: CreatePostCommentPayload }
  >({
    mutationFn: ({ postId, payload }) => createPostComment(postId, payload),
    onSuccess: (_data, variables) => {
      toast.success("Comment added successfully.");
      void queryClient.invalidateQueries({
        queryKey: ["postComments", variables.postId],
      });
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({
        queryKey: ["post", variables.postId],
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to add comment."
      );
    },
  });
}
