import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import {
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  archiveBlog,
  getBlogCategories,
} from "../api/admin-blog.api";
import type {
  AdminBlogQueryParams,
  CreateBlogPayload,
  UpdateBlogPayload,
} from "../types/admin-blog.types";

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data;
    if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
      return errorData.errors.map((e: any) => `${e.field ? `${e.field}: ` : ""}${e.message}`).join(", ");
    }
    if (errorData?.message) {
      return String(errorData.message);
    }
    if (error.message) {
      return error.message;
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function useAdminBlogs(params?: AdminBlogQueryParams) {
  return useQuery({
    queryKey: ["admin-blogs", params],
    queryFn: async () => {
      const response = await getAdminBlogs(params);
      return response.data;
    },
  });
}

export function useAdminBlog(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-blog", id],
    queryFn: async () => {
      if (!id) throw new Error("Blog ID is required");
      const response = await getAdminBlogById(id);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const response = await getBlogCategories();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBlogPayload) => createBlog(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Blog created successfully.");
      void queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["featured-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["trending-blogs"] });
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error, "Failed to create blog.");
      toast.error(msg);
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBlogPayload }) =>
      updateBlog(id, payload),
    onSuccess: (res, variables) => {
      toast.success(res.message || "Blog updated successfully.");
      void queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-blog", variables.id] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blog"] });
      void queryClient.invalidateQueries({ queryKey: ["featured-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["trending-blogs"] });
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error, "Failed to update blog.");
      toast.error(msg);
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: (res) => {
      toast.success(res.message || "Blog deleted successfully.");
      void queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blog"] });
      void queryClient.invalidateQueries({ queryKey: ["featured-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["trending-blogs"] });
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error, "Failed to delete blog.");
      toast.error(msg);
    },
  });
}

export function usePublishBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishBlog(id),
    onSuccess: (res, id) => {
      toast.success(res.message || "Blog published successfully.");
      void queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-blog", id] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blog"] });
      void queryClient.invalidateQueries({ queryKey: ["featured-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["trending-blogs"] });
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error, "Failed to publish blog.");
      toast.error(msg);
    },
  });
}

export function useUnpublishBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unpublishBlog(id),
    onSuccess: (res, id) => {
      toast.success(res.message || "Blog unpublished successfully.");
      void queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-blog", id] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blog"] });
      void queryClient.invalidateQueries({ queryKey: ["featured-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["trending-blogs"] });
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error, "Failed to unpublish blog.");
      toast.error(msg);
    },
  });
}

export function useArchiveBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveBlog(id),
    onSuccess: (res, id) => {
      toast.success(res.message || "Blog archived successfully.");
      void queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-blog", id] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["public-blog"] });
      void queryClient.invalidateQueries({ queryKey: ["featured-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["trending-blogs"] });
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error, "Failed to archive blog.");
      toast.error(msg);
    },
  });
}
