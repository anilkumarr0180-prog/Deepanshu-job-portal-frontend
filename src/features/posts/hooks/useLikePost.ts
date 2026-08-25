import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { likePost } from "../api/postApi";
import type { Post, PostReaction, PostsResponse } from "../types/post.types";

interface MutationContext {
  previousPostsQueries: Array<[readonly unknown[], PostsResponse["data"] | undefined]>;
  previousSinglePost?: Post;
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation<PostReaction, unknown, string, MutationContext>({
    mutationFn: (postId: string) => likePost(postId),
    onMutate: async (postId: string) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // Snapshot the previous values
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
                  isLiked: true,
                  likesCount: (p.likesCount || 0) + 1,
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
          isLiked: true,
          likesCount: (previousSinglePost.likesCount || 0) + 1,
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
      toast.error(axiosError.response?.data?.message || "Failed to like post.");
    },
    onSettled: (_data, _error, postId) => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

