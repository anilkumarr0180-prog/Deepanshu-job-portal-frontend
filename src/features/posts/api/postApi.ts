import { axiosInstance } from "@/lib/axios";
import { removeEmptyFields } from "@/shared/utils/removeEmptyFields";
import type {
  Post,
  PostComment,
  PostReaction,
  GetPostsParams,
  CreatePostPayload,
  UpdatePostPayload,
  GetPostCommentsParams,
  CreatePostCommentPayload,
  UpdatePostCommentPayload,
  PostsResponse,
  PostCommentsResponse,
} from "../types/post.types";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiMessageResponse {
  success: boolean;
  message?: string;
}

/**
 * Fetch a paginated feed of published posts.
 */
export async function getPosts(
  params?: GetPostsParams
): Promise<PostsResponse["data"]> {
  const cleanedParams = params ? removeEmptyFields(params) : undefined;
  const response = await axiosInstance.get<ApiResponse<PostsResponse["data"]>>(
    "/posts",
    { params: cleanedParams }
  );
  return response.data.data;
}

/**
 * Fetch a single post by its ID.
 */
export async function getPostById(postId: string): Promise<Post> {
  const response = await axiosInstance.get<ApiResponse<Post>>(
    `/posts/${postId}`
  );
  return response.data.data;
}

/**
 * Create a new post.
 */
export async function createPost(
  payload: CreatePostPayload
): Promise<Post> {
  const response = await axiosInstance.post<ApiResponse<Post>>(
    "/posts",
    payload
  );
  return response.data.data;
}

/**
 * Update an existing post by ID.
 */
export async function updatePost(
  postId: string,
  payload: UpdatePostPayload
): Promise<Post> {
  const response = await axiosInstance.put<ApiResponse<Post>>(
    `/posts/${postId}`,
    payload
  );
  return response.data.data;
}

/**
 * Soft delete a post by ID.
 */
export async function deletePost(
  postId: string
): Promise<ApiMessageResponse> {
  const response = await axiosInstance.delete<ApiMessageResponse>(
    `/posts/${postId}`
  );
  return response.data;
}

/**
 * Like a post by adding a reaction.
 */
export async function likePost(
  postId: string
): Promise<PostReaction> {
  const response = await axiosInstance.post<ApiResponse<PostReaction>>(
    `/posts/${postId}/reactions`
  );
  return response.data.data;
}

/**
 * Unlike a post by removing the user's reaction.
 */
export async function unlikePost(
  postId: string
): Promise<ApiMessageResponse> {
  const response = await axiosInstance.delete<ApiMessageResponse>(
    `/posts/${postId}/reactions`
  );
  return response.data;
}

/**
 * Fetch comments for a specific post.
 */
export async function getPostComments(
  postId: string,
  params?: GetPostCommentsParams
): Promise<PostCommentsResponse> {
  const cleanedParams = params ? removeEmptyFields(params) : undefined;
  const response = await axiosInstance.get<ApiResponse<PostCommentsResponse>>(
    `/posts/${postId}/comments`,
    { params: cleanedParams }
  );
  return response.data.data;
}

/**
 * Create a new comment on a post.
 */
export async function createPostComment(
  postId: string,
  payload: CreatePostCommentPayload
): Promise<PostComment> {
  const response = await axiosInstance.post<ApiResponse<PostComment>>(
    `/posts/${postId}/comments`,
    payload
  );
  return response.data.data;
}

/**
 * Update a comment on a post.
 */
export async function updatePostComment(
  postId: string,
  commentId: string,
  payload: UpdatePostCommentPayload
): Promise<PostComment> {
  const response = await axiosInstance.put<ApiResponse<PostComment>>(
    `/posts/${postId}/comments/${commentId}`,
    payload
  );
  return response.data.data;
}

/**
 * Delete a comment on a post.
 */
export async function deletePostComment(
  postId: string,
  commentId: string
): Promise<ApiMessageResponse> {
  const response = await axiosInstance.delete<ApiMessageResponse>(
    `/posts/${postId}/comments/${commentId}`
  );
  return response.data;
}
