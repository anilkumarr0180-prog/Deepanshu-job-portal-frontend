import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePostComment, type ApiMessageResponse } from "../api/postApi";

export function useDeletePostComment() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiMessageResponse,
    unknown,
    { postId: string; commentId: string }
  >({
    mutationFn: ({ postId, commentId }) => deletePostComment(postId, commentId),
    onSuccess: (_data, variables) => {
      toast.success("Comment deleted successfully.");
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
        axiosError.response?.data?.message || "Failed to delete comment."
      );
    },
  });
}
