import { axiosInstance } from "@/lib/axios";
import type {
  CandidateBlogDetailResponse,
  CandidateBlogQueryParams,
  CandidateBlogsResponse,
  BlogCategoriesResponse,
  CreateCandidateBlogPayload,
  UpdateCandidateBlogPayload,
} from "../types/candidate-blog.types";

export async function getMyBlogs(
  params?: CandidateBlogQueryParams
): Promise<CandidateBlogsResponse> {
  const response = await axiosInstance.get<CandidateBlogsResponse>("/blogs/my", {
    params,
  });
  return response.data;
}

export async function getMyBlogById(
  id: string
): Promise<CandidateBlogDetailResponse> {
  const response = await axiosInstance.get<CandidateBlogDetailResponse>(
    `/blogs/my/${id}`
  );
  return response.data;
}

export async function createMyBlog(
  payload: CreateCandidateBlogPayload
): Promise<CandidateBlogDetailResponse> {
  const response = await axiosInstance.post<CandidateBlogDetailResponse>(
    "/blogs/my",
    payload
  );
  return response.data;
}

export async function updateMyBlog(
  id: string,
  payload: UpdateCandidateBlogPayload
): Promise<CandidateBlogDetailResponse> {
  const response = await axiosInstance.patch<CandidateBlogDetailResponse>(
    `/blogs/my/${id}`,
    payload
  );
  return response.data;
}

export async function deleteMyBlog(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await axiosInstance.delete<{
    success: boolean;
    message: string;
  }>(`/blogs/my/${id}`);
  return response.data;
}

export async function publishMyBlog(
  id: string
): Promise<CandidateBlogDetailResponse> {
  const response = await axiosInstance.patch<CandidateBlogDetailResponse>(
    `/blogs/my/${id}/publish`
  );
  return response.data;
}

export async function unpublishMyBlog(
  id: string
): Promise<CandidateBlogDetailResponse> {
  const response = await axiosInstance.patch<CandidateBlogDetailResponse>(
    `/blogs/my/${id}/unpublish`
  );
  return response.data;
}

export async function getBlogCategories(): Promise<BlogCategoriesResponse> {
  const response = await axiosInstance.get<BlogCategoriesResponse>(
    "/blogs/categories"
  );
  return response.data;
}
