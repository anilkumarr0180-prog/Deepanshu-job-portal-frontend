import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePost, type ApiMessageResponse } from "../api/postApi";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation<ApiMessageResponse, unknown, string>({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: (_data, postId) => {
      toast.success("Post deleted successfully.");
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to delete post."
      );
    },
  });
}
