import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { RotateCcw, AlertCircle, Sparkles } from "lucide-react";

import BlogHero from "../components/BlogHero";
import PublicBlogCard from "../components/PublicBlogCard";
import BlogCardSkeleton from "../components/BlogCardSkeleton";
import BlogPagination from "../components/BlogPagination";
import BlogSidebar from "../components/BlogSidebar";
import {
  usePublicBlogs,
  usePublicBlogCategories,
  useFeaturedBlogs,
} from "../hooks/usePublicBlogs";
import type { PublicBlogFilters } from "../types/blog.types";

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state extraction
  const page = searchParams.get("page") || "1";
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const sortParam =
    (searchParams.get("sort") as "newest" | "oldest" | "popular" | "trending") ||
    "newest";

  // Category queries
  const { data: categories = [], isLoading: isLoadingCategories } =
    usePublicBlogCategories();

  // Featured blogs for the top 3 cover cards
  const { data: featuredBlogs = [], isLoading: isLoadingFeatured } =
    useFeaturedBlogs(3);

  // Active category filter
  const activeCategory = categoryParam || "all";

  // Build filter object for React Query
  const filters = useMemo<PublicBlogFilters>(() => {
    const f: PublicBlogFilters = {
      page,
      limit: 6, // 6 items per page for clean 2-column grid
      sort: sortParam,
    };

    if (searchParam.trim()) {
      f.search = searchParam.trim();
    }

    if (categoryParam && categoryParam !== "all") {
      f.category = categoryParam;
    }

    return f;
  }, [page, categoryParam, searchParam, sortParam]);

  // Query blog posts for Latest Posts
  const { data, isLoading, isError, refetch } = usePublicBlogs(filters);

  // Helper to update URL search params
  const updateParams = (newParams: Record<string, string | null>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(newParams).forEach(([key, value]) => {
          if (value === null || value === "" || value === "all") {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });
        return next;
      },
      { replace: false }
    );
  };

  const handleSelectCategory = (categorySlug: string) => {
    updateParams({
      category: categorySlug === "all" ? null : categorySlug,
      page: "1",
    });
  };

  const handleSearch = (query: string) => {
    updateParams({
      search: query || null,
      page: "1",
    });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({
      page: String(newPage),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const blogsList = data?.items ?? [];
  const pagination = data?.pagination;

  // Top 3 cover blogs: use featured blogs or fallback to first 3 blogs
  const topCoverBlogs =
    featuredBlogs.length > 0 ? featuredBlogs.slice(0, 3) : blogsList.slice(0, 3);

  const hasActiveFilters = Boolean(
    (categoryParam && categoryParam !== "all") || searchParam.trim()
  );

  return (
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-[#080E1A] pb-24">
      {/* ── Blog Hero Section ── */}
      <BlogHero
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        isLoadingCategories={isLoadingCategories}
      />

      {/* ── Section 1: Top 3 Full-Cover Cards ── */}
      <section className="container mx-auto max-w-[1140px] px-4 pt-12 pb-6">
        {isLoadingFeatured && topCoverBlogs.length === 0 ? (
          <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <BlogCardSkeleton key={n} />
            ))}
          </div>
        ) : topCoverBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-3">
            {topCoverBlogs.map((post) => (
              <PublicBlogCard key={post._id} post={post} variant="cover" />
            ))}
          </div>
        ) : null}
      </section>

      {/* ── Section 2: Latest Posts with 2-Column Grid + Sidebar ── */}
      <section className="container mx-auto max-w-[1140px] px-4 pt-10 md:pt-14">
        {/* Section Header */}
        <div className="text-left mb-8 md:mb-10">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[28px] sm:text-[32px] md:text-[36px] font-bold text-[#05264E] dark:text-[#F1F5F9] mb-2.5">
            {categoryParam && categoryParam !== "all"
              ? `${categories.find((c) => c.slug === categoryParam || c._id === categoryParam)?.name || "Category"} Articles`
              : searchParam
              ? `Search results for "${searchParam}"`
              : "Latest Posts"}
          </h2>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-base md:text-[18px] text-[#66789C] dark:text-slate-400 font-normal">
            Do not miss the trending news
          </p>
        </div>

        {/* 2-Column Content + 1-Column Sidebar Row */}
        <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-12">
          {/* Left: 8 Cols (2-Column Blog Grid) */}
          <main className="lg:col-span-8">
            {isError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-900/50 dark:bg-red-950/30">
                <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
                <h3 className="mt-3 text-base font-bold text-red-700 dark:text-red-400">
                  Failed to load blog posts
                </h3>
                <p className="mt-1 text-xs text-red-600/80 dark:text-red-300/80">
                  There was a problem connecting to the server. Please try again.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void refetch();
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex h-[420px] flex-col overflow-hidden rounded-[16px] border border-slate-200 bg-white p-[10px] animate-pulse dark:border-slate-800 dark:bg-[#131D2E]"
                  >
                    <div className="h-[210px] w-full rounded-[12px] bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-4 space-y-2 p-3">
                      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-6 w-full rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : blogsList.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
                  {blogsList.map((post) => (
                    <PublicBlogCard
                      key={post._id}
                      post={post}
                      variant="standard"
                    />
                  ))}
                </div>

                {/* ── Pagination ── */}
                {pagination && (
                  <div className="mt-10">
                    <BlogPagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs dark:border-slate-800 dark:bg-[#131D2E]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF3FC] text-[#3C65F5] dark:bg-[#1E293B] dark:text-[#5E81FF]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#05264E] dark:text-[#F1F5F9]">
                  No blog articles found
                </h3>
                <p className="mt-1 text-sm text-[#66789C] dark:text-slate-400">
                  {searchParam
                    ? `No results matched "${searchParam}". Try different keywords or reset filters.`
                    : "No published articles available in this category yet."}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#05264E]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </main>

          {/* Right: 4 Cols (Sidebar matching pl-40 pl-lg-15) */}
          <div className="lg:col-span-4 lg:pl-[15px] xl:pl-[30px]">
            <BlogSidebar
              searchQuery={searchParam}
              onSearch={handleSearch}
              galleryPosts={blogsList}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
