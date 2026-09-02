import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown, RotateCcw, AlertCircle, Sparkles } from "lucide-react";

import BlogHero from "../components/BlogHero";
import PublicBlogCard from "../components/PublicBlogCard";
import BlogCardSkeleton from "../components/BlogCardSkeleton";
import BlogPagination from "../components/BlogPagination";
import BlogSidebar from "../components/BlogSidebar";
import { usePublicBlogs, usePublicBlogCategories } from "../hooks/usePublicBlogs";
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

  // Active category filter
  const activeCategory = categoryParam || "all";

  // Build filter object for React Query
  const filters = useMemo<PublicBlogFilters>(() => {
    const f: PublicBlogFilters = {
      page,
      limit: 6, // 6 items per page for clean 2x3 grid
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

  // Query blog posts
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

  const handleSortChange = (
    newSort: "newest" | "oldest" | "popular" | "trending"
  ) => {
    updateParams({
      sort: newSort === "newest" ? null : newSort,
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
  const totalItems = pagination?.totalItems ?? 0;

  const hasActiveFilters = Boolean(
    (categoryParam && categoryParam !== "all") || searchParam.trim()
  );

  return (
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-[#080E1A] pb-20">
      {/* ── Blog Hero Section ── */}
      <BlogHero
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        isLoadingCategories={isLoadingCategories}
      />

      {/* ── Main 2-Column Grid + Sidebar Container ── */}
      <div className="container mx-auto max-w-[1140px] px-4 pt-10">
        <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-12">
          {/* ── Left Content (8 Cols / 2-Column Blog Grid) ── */}
          <main className="lg:col-span-8">
            {/* ── Toolbar: Results summary & Sorting ── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#05264E] dark:text-[#F1F5F9]">
                  {categoryParam && categoryParam !== "all"
                    ? `${categories.find((c) => c.slug === categoryParam || c._id === categoryParam)?.name || "Category"} Articles`
                    : searchParam
                    ? `Search results for "${searchParam}"`
                    : "Latest Articles"}
                </h2>
                <p className="mt-0.5 text-xs text-[#66789C] dark:text-slate-400">
                  {isLoading ? (
                    "Loading articles..."
                  ) : totalItems > 0 ? (
                    <>
                      Showing{" "}
                      <span className="font-bold text-[#05264E] dark:text-slate-200">
                        {blogsList.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-[#05264E] dark:text-slate-200">
                        {totalItems}
                      </span>{" "}
                      articles
                    </>
                  ) : (
                    "0 articles found"
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#05264E] transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#131D2E] dark:text-slate-300"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                )}

                {/* Sort selection */}
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#05264E] dark:border-slate-700 dark:bg-[#131D2E] dark:text-[#F1F5F9]">
                  <ArrowUpDown className="h-3.5 w-3.5 text-[#3C65F5]" />
                  <select
                    value={sortParam}
                    onChange={(e) =>
                      handleSortChange(
                        e.target.value as "newest" | "oldest" | "popular" | "trending"
                      )
                    }
                    className="bg-transparent outline-none cursor-pointer"
                  >
                    <option value="newest" className="dark:bg-slate-900">
                      Newest
                    </option>
                    <option value="oldest" className="dark:bg-slate-900">
                      Oldest
                    </option>
                    <option value="popular" className="dark:bg-slate-900">
                      Popular
                    </option>
                    <option value="trending" className="dark:bg-slate-900">
                      Trending
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── 2-Column Blog Grid ── */}
            <div className="mt-8">
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
                    <BlogCardSkeleton key={index} />
                  ))}
                </div>
              ) : blogsList.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
                    {blogsList.map((post) => (
                      <PublicBlogCard key={post._id} post={post} />
                    ))}
                  </div>

                  {/* ── Pagination ── */}
                  {pagination && (
                    <BlogPagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
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
            </div>
          </main>

          {/* ── Right Sidebar (4 Cols) ── */}
          <div className="lg:col-span-4">
            <BlogSidebar
              searchQuery={searchParam}
              onSearch={handleSearch}
              galleryPosts={blogsList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
