import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { savedPostApi } from "../api/savedPostApi";
import type { Post, PostsResponse, SavedPostsResponse } from "../types/post.types";

interface ToggleSaveVariables {
  postId: string;
  isCurrentlySaved: boolean;
}

interface MutationContext {
  previousPostsQueries: Array<[readonly unknown[], PostsResponse["data"] | undefined]>;
  previousSavedPostsQueries: Array<[readonly unknown[], SavedPostsResponse["data"] | undefined]>;
  previousSinglePost?: Post;
}

export function useToggleSavePost() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; data: { isSaved: boolean } },
    unknown,
    ToggleSaveVariables,
    MutationContext
  >({
    mutationFn: ({ postId, isCurrentlySaved }: ToggleSaveVariables) => {
      if (isCurrentlySaved) {
        return savedPostApi.unsavePost(postId);
      }
      return savedPostApi.savePost(postId);
    },
    onMutate: async ({ postId, isCurrentlySaved }) => {
      const nextSavedState = !isCurrentlySaved;

      // Cancel outgoing refetches so optimistic data isn't overwritten immediately
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["saved-posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // Snapshot previous states
      const previousPostsQueries = queryClient.getQueriesData<PostsResponse["data"]>({
        queryKey: ["posts"],
      });
      const previousSavedPostsQueries = queryClient.getQueriesData<SavedPostsResponse["data"]>({
        queryKey: ["saved-posts"],
      });
      const previousSinglePost = queryClient.getQueryData<Post>(["post", postId]);

      // Optimistically update all feed queries
      queryClient.setQueriesData<PostsResponse["data"]>(
        { queryKey: ["posts"] },
        (oldData) => {
          if (!oldData) return oldData;
          const updatePostItem = (p: Post) =>
            p._id === postId ? { ...p, isSaved: nextSavedState } : p;

          return {
            ...oldData,
            items: oldData.items ? oldData.items.map(updatePostItem) : undefined,
            posts: oldData.posts ? oldData.posts.map(updatePostItem) : undefined,
          };
        }
      );

      // Optimistically update saved-posts queries
      queryClient.setQueriesData<SavedPostsResponse["data"]>(
        { queryKey: ["saved-posts"] },
        (oldData) => {
          if (!oldData) return oldData;
          if (!nextSavedState) {
            // Remove from saved list
            return {
              ...oldData,
              items: oldData.items.filter((p) => p._id !== postId),
              pagination: {
                ...oldData.pagination,
                totalItems: Math.max(0, (oldData.pagination.totalItems || 1) - 1),
              },
            };
          }
          return oldData;
        }
      );

      // Optimistically update single post query
      if (previousSinglePost) {
        queryClient.setQueryData<Post>(["post", postId], {
          ...previousSinglePost,
          isSaved: nextSavedState,
        });
      }

      return { previousPostsQueries, previousSavedPostsQueries, previousSinglePost };
    },
    onSuccess: (_data, { isCurrentlySaved }) => {
      if (isCurrentlySaved) {
        toast.success("Post removed from saved items.");
      } else {
        toast.success("Post saved to your bookmarks!");
      }
    },
    onError: (error: unknown, _variables, context) => {
      // Rollback
      if (context?.previousPostsQueries) {
        context.previousPostsQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousSavedPostsQueries) {
        context.previousSavedPostsQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousSinglePost) {
        queryClient.setQueryData(["post", context.previousSinglePost._id], context.previousSinglePost);
      }
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to update saved post.");
    },
    onSettled: (_data, _error, { postId }) => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}
