export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

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

export interface AdminBlogItem {
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
  status: BlogStatus;
  isFeatured: boolean;
  isTrending: boolean;
  publishedAt?: string;
  seo?: BlogSeo;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBlogsPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminBlogsResponse {
  success: boolean;
  message: string;
  data: {
    items: AdminBlogItem[];
    pagination: AdminBlogsPagination;
  };
}

export interface AdminBlogDetailResponse {
  success: boolean;
  message: string;
  data: AdminBlogItem;
}

export interface BlogCategoriesResponse {
  success: boolean;
  message: string;
  data: BlogCategorySummary[];
}

export interface AdminBlogQueryParams {
  page?: number | string;
  limit?: number | string;
  status?: BlogStatus | "all";
  category?: string;
  search?: string;
  isFeatured?: "true" | "false";
  isTrending?: "true" | "false";
  sort?: "newest" | "oldest" | "views" | "title";
}

export interface CreateBlogPayload {
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
  status?: BlogStatus;
  isFeatured?: boolean;
  isTrending?: boolean;
  publishedAt?: string;
  seo?: BlogSeo;
}

export interface UpdateBlogPayload {
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
  status?: BlogStatus;
  isFeatured?: boolean;
  isTrending?: boolean;
  publishedAt?: string | null;
  seo?: BlogSeo;
}
