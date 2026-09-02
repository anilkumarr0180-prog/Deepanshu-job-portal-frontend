import { useQuery } from "@tanstack/react-query";
import {
  getPublicBlogs,
  getBlogBySlug,
  getBlogCategories,
  getFeaturedBlogs,
  getTrendingBlogs,
} from "../api/blog.api";
import type { PublicBlogFilters } from "../types/blog.types";

export function usePublicBlogs(filters?: PublicBlogFilters) {
  return useQuery({
    queryKey: ["public-blogs", filters],
    queryFn: async () => {
      const response = await getPublicBlogs(filters);
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

export function usePublicBlogBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["public-blog", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Blog slug is required");
      const response = await getBlogBySlug(slug);
      return response.data;
    },
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
  });
}

export function usePublicBlogCategories() {
  return useQuery({
    queryKey: ["public-blog-categories"],
    queryFn: async () => {
      const response = await getBlogCategories();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedBlogs(limit = 6) {
  return useQuery({
    queryKey: ["featured-blogs", limit],
    queryFn: async () => {
      const response = await getFeaturedBlogs(limit);
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useTrendingBlogs(limit = 6) {
  return useQuery({
    queryKey: ["trending-blogs", limit],
    queryFn: async () => {
      const response = await getTrendingBlogs(limit);
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}
