import { useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Compass,
  RefreshCw,
  Search,
} from "lucide-react";
import { useSavedPosts } from "../hooks/useSavedPosts";
import PostCard from "./PostCard";
import type { Post } from "../types/post.types";

interface SavedPostsFeedProps {
  onExploreFeed?: () => void;
}

export default function SavedPostsFeed({ onExploreFeed }: SavedPostsFeedProps) {
  const [page, setPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useSavedPosts({
    page,
    limit: 10,
    sort: "newest",
  });

  const posts: Post[] = data?.items || [];
  const pagination = data?.pagination;

  const filteredPosts = posts.filter((post) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    const contentMatch = post.content?.toLowerCase().includes(q);
    const authorName =
      typeof post.authorId === "object" && post.authorId?.name
        ? post.authorId.name.toLowerCase()
        : "";
    return contentMatch || authorName.includes(q);
  });

  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading saved posts">
        {/* Header Skeleton */}
        <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs animate-pulse space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-3 w-20 rounded bg-slate-100" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-5/6 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center shadow-xs">
        <Bookmark className="mx-auto h-8 w-8 text-rose-500" />
        <h3 className="mt-3 text-sm font-bold text-slate-900">Failed to load saved posts</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          An error occurred while fetching your bookmarked posts. Please try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Banner & Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 shadow-2xs">
              <Bookmark className="h-4 w-4 fill-blue-600 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Saved Posts</h2>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200/70">
                  {pagination?.totalItems ?? posts.length}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Posts and discussions you have bookmarked for later reference.
              </p>
            </div>
          </div>

          {/* Quick Refresh */}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh saved posts"
            aria-label="Refresh saved posts"
            className="self-end sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin text-blue-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search Filter Input (Shown when items exist) */}
        {posts.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search through saved posts or authors..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 sm:p-14 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs border border-blue-100">
            <Bookmark className="h-7 w-7 text-blue-600" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">No saved posts yet</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            When you see insightful discussions, job announcements, or career advice you want to
            keep handy, click the bookmark icon on any post to save it here.
          </p>
          {onExploreFeed && (
            <button
              type="button"
              onClick={onExploreFeed}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Community Feed</span>
            </button>
          )}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs">
          <Search className="mx-auto h-7 w-7 text-slate-400" />
          <h3 className="mt-2 text-sm font-bold text-slate-900">No matching saved posts</h3>
          <p className="mt-1 text-xs text-slate-500">
            No saved posts match &ldquo;{searchFilter}&rdquo;. Try a different search keyword.
          </p>
          <button
            type="button"
            onClick={() => setSearchFilter("")}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : (
        /* Saved Post Cards List */
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 px-1">
          <p className="text-xs text-slate-500">
            Showing page <span className="font-semibold text-slate-900">{pagination.page}</span> of{" "}
            <span className="font-semibold text-slate-900">{pagination.totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
