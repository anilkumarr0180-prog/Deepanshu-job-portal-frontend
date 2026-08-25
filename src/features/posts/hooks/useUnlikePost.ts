import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { unlikePost, type ApiMessageResponse } from "../api/postApi";
import type { Post, PostsResponse } from "../types/post.types";

interface MutationContext {
  previousPostsQueries: Array<[readonly unknown[], PostsResponse["data"] | undefined]>;
  previousSinglePost?: Post;
}

export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation<ApiMessageResponse, unknown, string, MutationContext>({
    mutationFn: (postId: string) => unlikePost(postId),
    onMutate: async (postId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // Snapshot previous values
      const previousPostsQueries = queryClient.getQueriesData<PostsResponse["data"]>({
        queryKey: ["posts"],
      });
      const previousSinglePost = queryClient.getQueryData<Post>(["post", postId]);

      // Optimistically update feed list queries
      queryClient.setQueriesData<PostsResponse["data"]>(
        { queryKey: ["posts"] },
        (oldData) => {
          if (!oldData) return oldData;
          const updatePostItem = (p: Post) =>
            p._id === postId
              ? {
                  ...p,
                  isLiked: false,
                  likesCount: Math.max(0, (p.likesCount || 1) - 1),
                }
              : p;

          return {
            ...oldData,
            items: oldData.items ? oldData.items.map(updatePostItem) : undefined,
            posts: oldData.posts ? oldData.posts.map(updatePostItem) : undefined,
          };
        }
      );

      // Optimistically update single post query if cached
      if (previousSinglePost) {
        queryClient.setQueryData<Post>(["post", postId], {
          ...previousSinglePost,
          isLiked: false,
          likesCount: Math.max(0, (previousSinglePost.likesCount || 1) - 1),
        });
      }

      return { previousPostsQueries, previousSinglePost };
    },
    onError: (error: unknown, postId: string, context) => {
      // Rollback to previous state on error
      if (context?.previousPostsQueries) {
        context.previousPostsQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousSinglePost) {
        queryClient.setQueryData(["post", postId], context.previousSinglePost);
      }
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message || "Failed to unlike post."
      );
    },
    onSettled: (_data, _error, postId) => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

