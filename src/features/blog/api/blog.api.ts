import { axiosInstance } from "@/lib/axios";
import type {
  BlogCategoriesResponse,
  PublicBlogFilters,
  PublicBlogListResponse,
  PublicBlogsResponse,
  SingleBlogResponse,
} from "../types/blog.types";

export async function getPublicBlogs(
  params?: PublicBlogFilters
): Promise<PublicBlogsResponse> {
  const response = await axiosInstance.get<PublicBlogsResponse>("/blogs", {
    params,
  });
  return response.data;
}

export async function getBlogBySlug(
  slug: string
): Promise<SingleBlogResponse> {
  const response = await axiosInstance.get<SingleBlogResponse>(
    `/blogs/${slug}`
  );
  return response.data;
}

export async function getBlogCategories(): Promise<BlogCategoriesResponse> {
  const response = await axiosInstance.get<BlogCategoriesResponse>(
    "/blogs/categories"
  );
  return response.data;
}

export async function getFeaturedBlogs(
  limit = 6
): Promise<PublicBlogListResponse> {
  const response = await axiosInstance.get<PublicBlogListResponse>(
    "/blogs/featured",
    { params: { limit } }
  );
  return response.data;
}

export async function getTrendingBlogs(
  limit = 6
): Promise<PublicBlogListResponse> {
  const response = await axiosInstance.get<PublicBlogListResponse>(
    "/blogs/trending",
    { params: { limit } }
  );
  return response.data;
}
