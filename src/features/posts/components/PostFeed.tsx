import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquareDashed,
  RefreshCw,
} from "lucide-react";
import { usePosts } from "../hooks/usePosts";
import PostCard from "./PostCard";
import type { Post } from "../types/post.types";

interface PostFeedProps {
  page?: number;
  limit?: number;
  onPageChange?: (newPage: number) => void;
}

export default function PostFeed({
  page = 1,
  limit = 10,
  onPageChange,
}: PostFeedProps) {
  const { data, isLoading, isError, refetch, isFetching } = usePosts({
    page,
    limit,
    sort: "newest",
  });

  const posts: Post[] = data?.items || data?.posts || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading posts feed">
        {/* Toolbar Skeleton */}
        <div className="flex items-center justify-between px-1 py-1 animate-pulse">
          <div className="h-4 w-28 rounded-md bg-slate-200" />
          <div className="h-6 w-24 rounded-lg bg-slate-100" />
        </div>

        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 md:p-6 shadow-xs animate-pulse space-y-4"
          >
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-28 rounded-md bg-slate-200" />
                    <div className="h-3.5 w-16 rounded-md bg-slate-100" />
                  </div>
                  <div className="h-3 w-20 rounded-md bg-slate-100" />
                </div>
              </div>
              <div className="h-6 w-6 rounded-md bg-slate-100" />
            </div>

            {/* Content Lines */}
            <div className="space-y-2 pt-1">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-11/12 rounded bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200" />
            </div>

            {/* Engagement Summary Skeleton */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="h-3 w-16 rounded bg-slate-100" />
              <div className="h-3 w-20 rounded bg-slate-100" />
            </div>

            {/* Action Bar Skeleton */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100/60 pt-2">
              <div className="h-8 flex-1 rounded-xl bg-slate-100" />
              <div className="h-8 flex-1 rounded-xl bg-slate-100" />
              <div className="h-8 flex-1 rounded-xl bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-8 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-3.5 text-base font-semibold text-slate-900">
          Failed to load community feed
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          We encountered an issue fetching the latest discussions. Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-xs transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry Feed</span>
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-10 sm:p-14 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-xs border border-slate-200/60">
          <MessageSquareDashed className="h-7 w-7 text-[#3C65F5]" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No discussions yet
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Be the pioneer! Share a career milestone, hiring advice, or industry question with the JobBox community above.
        </p>
      </div>
    );
  }

  const totalPages = pagination?.totalPages ?? pagination?.pages ?? 1;

  return (
    <div className="space-y-4">
      {/* Feed Toolbar with "Recent" Sorting */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">Recent Discussions</span>
          {pagination?.totalItems !== undefined && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {pagination.totalItems} {pagination.totalItems === 1 ? "post" : "posts"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs">
          <Clock className="h-3.5 w-3.5 text-[#3C65F5]" />
          <span>Sort: <strong className="font-semibold text-slate-900">Recent</strong></span>
        </div>
      </div>

      {/* Posts Listing */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {/* Pagination Navigation */}
      {totalPages > 1 && onPageChange && (
        <nav
          aria-label="Feed pagination"
          className="mt-8 flex items-center justify-center gap-2 pt-2"
        >
          <button
            type="button"
            onClick={() => {
              onPageChange(page - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={page <= 1 || isFetching}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  onPageChange(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={isFetching}
                aria-current={p === page ? "page" : undefined}
                className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl border px-3 text-xs sm:text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30 ${
                  p === page
                    ? "border-[#3C65F5] bg-[#3C65F5] text-white shadow-xs font-semibold"
                    : "border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              onPageChange(page + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={page >= totalPages || isFetching}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
