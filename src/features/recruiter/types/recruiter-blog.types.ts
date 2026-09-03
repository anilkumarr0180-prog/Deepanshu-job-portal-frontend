export type RecruiterBlogStatus = "draft" | "published" | "DRAFT" | "PUBLISHED";

export interface RecruiterBlogCategorySummary {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  postCount?: number;
}

export interface RecruiterBlogAuthorSummary {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
}

export interface RecruiterBlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface RecruiterBlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: RecruiterBlogCategorySummary | string;
  authorId: RecruiterBlogAuthorSummary | string;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  coverImageAlt?: string;
  tags: string[];
  readingTime: number;
  status: RecruiterBlogStatus;
  isFeatured: boolean;
  isTrending: boolean;
  publishedAt?: string;
  seo?: RecruiterBlogSeo;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecruiterBlogsPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RecruiterBlogsResponse {
  success: boolean;
  message: string;
  data: {
    items: RecruiterBlogItem[];
    pagination: RecruiterBlogsPagination;
  };
}

export interface RecruiterBlogDetailResponse {
  success: boolean;
  message: string;
  data: RecruiterBlogItem;
}

export interface RecruiterBlogCategoriesResponse {
  success: boolean;
  message: string;
  data: RecruiterBlogCategorySummary[];
}

export interface RecruiterBlogQueryParams {
  page?: number | string;
  limit?: number | string;
  status?: RecruiterBlogStatus | "all";
  category?: string;
  search?: string;
  sort?: "newest" | "oldest" | "views" | "title";
}

export interface CreateRecruiterBlogPayload {
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
  status?: RecruiterBlogStatus;
  publishedAt?: string;
  seo?: RecruiterBlogSeo;
}

export interface UpdateRecruiterBlogPayload {
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
  status?: RecruiterBlogStatus;
  publishedAt?: string | null;
  seo?: RecruiterBlogSeo;
}
