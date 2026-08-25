import type { UserRole } from "@/shared/types/role";

export interface PostAuthor {
  _id: string;
  name: string;
  email?: string;
  role: UserRole;
  profilePicture?: string;
}

export interface Post {
  _id: string;
  authorId: PostAuthor | string;
  content: string;
  mediaUrl?: string;
  mediaPublicId?: string;
  originalPostId?: Post | string;
  isPublished: boolean;
  isDeleted: boolean;
  likesCount: number;
  commentsCount: number;
  repostsCount?: number;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  isReposted?: boolean;
  isSaved?: boolean;
  savedAt?: string;
}

export interface PostsPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total?: number;
  pages?: number;
}

export interface PostsResponse {
  success: boolean;
  message?: string;
  data: {
    items?: Post[];
    posts?: Post[];
    pagination: PostsPagination;
  };
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  authorId?: string;
  isPublished?: boolean;
  search?: string;
  sort?: "newest" | "oldest";
  feedType?: "for-you" | "recent" | "my-network";
}

export interface CreatePostPayload {
  content: string;
  mediaUrl?: string;
  mediaPublicId?: string;
  isPublished?: boolean;
}

export interface RepostPayload {
  content?: string;
}


export interface UpdatePostPayload {
  content?: string;
  mediaUrl?: string | null;
  mediaPublicId?: string | null;
  isPublished?: boolean;
}

export interface PostComment {
  _id: string;
  postId: string;
  parentCommentId?: string | null;
  authorId: PostAuthor | string;
  content: string;
  isDeleted?: boolean;
  replyCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PostReaction {
  _id: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GetPostCommentsParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
  parentCommentId?: string | null;
}

export interface CreatePostCommentPayload {
  content: string;
  parentCommentId?: string | null;
}

export interface UpdatePostCommentPayload {
  content: string;
}

export interface PostCommentsPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PostCommentsResponse {
  items: PostComment[];
  pagination: PostCommentsPagination;
}

export type ReportTargetType = "post" | "comment" | "user";

export type ReportReason =
  | "spam"
  | "harassment"
  | "inappropriate"
  | "hate_speech"
  | "misinformation"
  | "impersonation"
  | "other";

export interface CreateReportPayload {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
}

export interface ReportItem {
  _id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: string;
  updatedAt?: string;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  data: ReportItem;
}

export interface GetSavedPostsParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
}

export interface SavedPostsResponse {
  success: boolean;
  data: {
    items: Post[];
    pagination: PostsPagination;
  };
}

