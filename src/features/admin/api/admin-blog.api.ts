import { axiosInstance } from "@/lib/axios";
import type {
  AdminBlogDetailResponse,
  AdminBlogQueryParams,
  AdminBlogsResponse,
  BlogCategoriesResponse,
  CreateBlogPayload,
  UpdateBlogPayload,
} from "../types/admin-blog.types";

export async function getAdminBlogs(
  params?: AdminBlogQueryParams
): Promise<AdminBlogsResponse> {
  const response = await axiosInstance.get<AdminBlogsResponse>("/admin/blogs", {
    params,
  });
  return response.data;
}

export async function getAdminBlogById(
  id: string
): Promise<AdminBlogDetailResponse> {
  const response = await axiosInstance.get<AdminBlogDetailResponse>(
    `/admin/blogs/${id}`
  );
  return response.data;
}

export async function createBlog(
  payload: CreateBlogPayload
): Promise<AdminBlogDetailResponse> {
  const response = await axiosInstance.post<AdminBlogDetailResponse>(
    "/admin/blogs",
    payload
  );
  return response.data;
}

export async function updateBlog(
  id: string,
  payload: UpdateBlogPayload
): Promise<AdminBlogDetailResponse> {
  const response = await axiosInstance.patch<AdminBlogDetailResponse>(
    `/admin/blogs/${id}`,
    payload
  );
  return response.data;
}

export async function deleteBlog(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await axiosInstance.delete<{
    success: boolean;
    message: string;
  }>(`/admin/blogs/${id}`);
  return response.data;
}

export async function publishBlog(
  id: string
): Promise<AdminBlogDetailResponse> {
  const response = await axiosInstance.patch<AdminBlogDetailResponse>(
    `/admin/blogs/${id}/publish`
  );
  return response.data;
}

export async function unpublishBlog(
  id: string
): Promise<AdminBlogDetailResponse> {
  const response = await axiosInstance.patch<AdminBlogDetailResponse>(
    `/admin/blogs/${id}/unpublish`
  );
  return response.data;
}

export async function archiveBlog(
  id: string
): Promise<AdminBlogDetailResponse> {
  const response = await axiosInstance.patch<AdminBlogDetailResponse>(
    `/admin/blogs/${id}/archive`
  );
  return response.data;
}

export async function getBlogCategories(): Promise<BlogCategoriesResponse> {
  const response = await axiosInstance.get<BlogCategoriesResponse>(
    "/blogs/categories"
  );
  return response.data;
}
