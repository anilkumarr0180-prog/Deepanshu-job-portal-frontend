import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { likePost } from "../api/postApi";
import type { PostReaction } from "../types/post.types";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation<PostReaction, unknown, string>({
    mutationFn: (postId: string) => likePost(postId),
    onSuccess: (_data, postId) => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to like post.");
    },
  });
}
