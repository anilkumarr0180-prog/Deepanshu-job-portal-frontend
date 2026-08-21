import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createPost } from "../api/postApi";
import type { CreatePostPayload, Post } from "../types/post.types";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<Post, unknown, CreatePostPayload>({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      toast.success("Post created successfully.");
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to create post."
      );
    },
  });
}
