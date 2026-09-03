import { axiosInstance } from "@/lib/axios";
import type {
  RecruiterBlogsResponse,
  RecruiterBlogDetailResponse,
  RecruiterBlogCategoriesResponse,
  RecruiterBlogQueryParams,
  CreateRecruiterBlogPayload,
  UpdateRecruiterBlogPayload,
} from "../types/recruiter-blog.types";

export const getMyBlogs = async (
  params?: RecruiterBlogQueryParams
): Promise<RecruiterBlogsResponse> => {
  const response = await axiosInstance.get<RecruiterBlogsResponse>("/blogs/my", {
    params,
  });
  return response.data;
};

export const getMyBlogById = async (
  id: string
): Promise<RecruiterBlogDetailResponse> => {
  const response = await axiosInstance.get<RecruiterBlogDetailResponse>(
    `/blogs/my/${id}`
  );
  return response.data;
};

export const createMyBlog = async (
  payload: CreateRecruiterBlogPayload
): Promise<RecruiterBlogDetailResponse> => {
  const response = await axiosInstance.post<RecruiterBlogDetailResponse>(
    "/blogs/my",
    payload
  );
  return response.data;
};

export const updateMyBlog = async (
  id: string,
  payload: UpdateRecruiterBlogPayload
): Promise<RecruiterBlogDetailResponse> => {
  const response = await axiosInstance.patch<RecruiterBlogDetailResponse>(
    `/blogs/my/${id}`,
    payload
  );
  return response.data;
};

export const deleteMyBlog = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete<{
    success: boolean;
    message: string;
  }>(`/blogs/my/${id}`);
  return response.data;
};

export const publishMyBlog = async (
  id: string
): Promise<RecruiterBlogDetailResponse> => {
  const response = await axiosInstance.patch<RecruiterBlogDetailResponse>(
    `/blogs/my/${id}/publish`
  );
  return response.data;
};

export const unpublishMyBlog = async (
  id: string
): Promise<RecruiterBlogDetailResponse> => {
  const response = await axiosInstance.patch<RecruiterBlogDetailResponse>(
    `/blogs/my/${id}/unpublish`
  );
  return response.data;
};

export const getBlogCategories = async (): Promise<RecruiterBlogCategoriesResponse> => {
  const response = await axiosInstance.get<RecruiterBlogCategoriesResponse>(
    "/blogs/categories"
  );
  return response.data;
};
