import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { unlikePost, type ApiMessageResponse } from "../api/postApi";

export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation<ApiMessageResponse, unknown, string>({
    mutationFn: (postId: string) => unlikePost(postId),
    onSuccess: (_data, postId) => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to unlike post."
      );
    },
  });
}
