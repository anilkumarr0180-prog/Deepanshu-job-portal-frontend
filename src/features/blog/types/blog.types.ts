export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  postCount?: number;
}

export interface BlogAuthor {
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

export type BlogStatus = "draft" | "published" | "archived" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface PublicBlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: BlogCategory | string;
  authorId: BlogAuthor | string;
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

export interface BlogPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PublicBlogsResponse {
  success: boolean;
  message: string;
  data: {
    items: PublicBlogItem[];
    pagination: BlogPagination;
  };
}

export interface SingleBlogResponse {
  success: boolean;
  message: string;
  data: PublicBlogItem;
}

export interface BlogCategoriesResponse {
  success: boolean;
  message: string;
  data: BlogCategory[];
}

export interface PublicBlogListResponse {
  success: boolean;
  message: string;
  data: PublicBlogItem[];
}

export interface PublicBlogFilters {
  page?: string | number;
  limit?: string | number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: "newest" | "oldest" | "popular" | "trending";
}
