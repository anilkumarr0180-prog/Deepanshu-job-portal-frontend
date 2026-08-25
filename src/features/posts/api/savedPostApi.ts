import { axiosInstance } from "@/lib/axios";
import type { GetSavedPostsParams, SavedPostsResponse } from "../types/post.types";

export const savedPostApi = {
  savePost: async (postId: string) => {
    const response = await axiosInstance.post<{ success: boolean; message: string; data: { isSaved: boolean } }>(
      `/saved-posts/${postId}`
    );
    return response.data;
  },

  unsavePost: async (postId: string) => {
    const response = await axiosInstance.delete<{ success: boolean; message: string; data: { isSaved: boolean } }>(
      `/saved-posts/${postId}`
    );
    return response.data;
  },

  checkSavedStatus: async (postId: string) => {
    const response = await axiosInstance.get<{ success: boolean; data: { isSaved: boolean } }>(
      `/saved-posts/${postId}/status`
    );
    return response.data.data;
  },

  getMySavedPosts: async (params?: GetSavedPostsParams) => {
    const response = await axiosInstance.get<SavedPostsResponse>("/saved-posts", {
      params,
    });
    return response.data.data;
  },
};
