import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePost } from "../api/postApi";
import type { UpdatePostPayload, Post } from "../types/post.types";

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation<
    Post,
    unknown,
    { postId: string; payload: UpdatePostPayload }
  >({
    mutationFn: ({ postId, payload }) => updatePost(postId, payload),
    onSuccess: (_data, variables) => {
      toast.success("Post updated successfully.");
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({
        queryKey: ["post", variables.postId],
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to update post."
      );
    },
  });
}
