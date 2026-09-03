import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import {
  getMyBlogs,
  getMyBlogById,
  createMyBlog,
  updateMyBlog,
  deleteMyBlog,
  publishMyBlog,
  unpublishMyBlog,
  getBlogCategories,
} from "../api/recruiter-blog.api";
import type {
  RecruiterBlogQueryParams,
  CreateRecruiterBlogPayload,
  UpdateRecruiterBlogPayload,
} from "../types/recruiter-blog.types";

interface ApiErrorResponse {
  message?: string;
  errors?: Array<{ field?: string; message: string }>;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const errorData = error.response?.data;
    if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
      return errorData.errors
        .map((e) => `${e.field ? `${e.field}: ` : ""}${e.message}`)
        .join(", ");
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

export function useRecruiterBlogs(params?: RecruiterBlogQueryParams) {
  return useQuery({
    queryKey: ["recruiter-my-blogs", params],
    queryFn: async () => {
      const response = await getMyBlogs(params);
      return response.data;
    },
  });
}

export function useRecruiterBlog(id: string | undefined) {
  return useQuery({
    queryKey: ["recruiter-my-blog", id],
    queryFn: async () => {
      if (!id) throw new Error("Blog ID is required");
      const response = await getMyBlogById(id);
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

export function useCreateRecruiterBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRecruiterBlogPayload) => createMyBlog(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Blog created successfully.");
      void queryClient.invalidateQueries({ queryKey: ["recruiter-my-blogs"] });
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

export function useUpdateRecruiterBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateRecruiterBlogPayload;
    }) => updateMyBlog(id, payload),
    onSuccess: (res, variables) => {
      toast.success(res.message || "Blog updated successfully.");
      void queryClient.invalidateQueries({ queryKey: ["recruiter-my-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["recruiter-my-blog", variables.id] });
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

export function useDeleteRecruiterBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMyBlog(id),
    onSuccess: (res) => {
      toast.success(res.message || "Blog deleted successfully.");
      void queryClient.invalidateQueries({ queryKey: ["recruiter-my-blogs"] });
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

export function usePublishRecruiterBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishMyBlog(id),
    onSuccess: (res, id) => {
      toast.success(res.message || "Blog published successfully.");
      void queryClient.invalidateQueries({ queryKey: ["recruiter-my-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["recruiter-my-blog", id] });
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

export function useUnpublishRecruiterBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unpublishMyBlog(id),
    onSuccess: (res, id) => {
      toast.success(res.message || "Blog unpublished successfully.");
      void queryClient.invalidateQueries({ queryKey: ["recruiter-my-blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["recruiter-my-blog", id] });
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
