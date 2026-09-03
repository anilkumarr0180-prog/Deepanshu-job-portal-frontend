export type CandidateBlogStatus = "draft" | "published" | "DRAFT" | "PUBLISHED";

export interface BlogCategorySummary {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  postCount?: number;
}

export interface BlogAuthorSummary {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface CandidateBlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: BlogCategorySummary | string;
  authorId: BlogAuthorSummary | string;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  coverImageAlt?: string;
  tags: string[];
  readingTime: number;
  status: CandidateBlogStatus;
  isFeatured: boolean;
  isTrending: boolean;
  publishedAt?: string;
  seo?: BlogSeo;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateBlogsPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CandidateBlogsResponse {
  success: boolean;
  message: string;
  data: {
    items: CandidateBlogItem[];
    pagination: CandidateBlogsPagination;
  };
}

export interface CandidateBlogDetailResponse {
  success: boolean;
  message: string;
  data: CandidateBlogItem;
}

export interface BlogCategoriesResponse {
  success: boolean;
  message: string;
  data: BlogCategorySummary[];
}

export interface CandidateBlogQueryParams {
  page?: number | string;
  limit?: number | string;
  status?: CandidateBlogStatus | "all";
  category?: string;
  search?: string;
  sort?: "newest" | "oldest" | "views" | "title";
}

export interface CreateCandidateBlogPayload {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  categoryId: string;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  coverImageAlt?: string;
  tags?: string[];
  readingTime?: number;
  status?: CandidateBlogStatus;
  publishedAt?: string;
  seo?: BlogSeo;
}

export interface UpdateCandidateBlogPayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  categoryId?: string;
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  coverImageAlt?: string;
  tags?: string[];
  readingTime?: number;
  status?: CandidateBlogStatus;
  publishedAt?: string | null;
  seo?: BlogSeo;
}
