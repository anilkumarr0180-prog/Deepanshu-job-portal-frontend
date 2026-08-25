import { useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  MessageSquareDashed,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { usePosts } from "../hooks/usePosts";
import PostCard from "./PostCard";
import type { Post } from "../types/post.types";

type FeedTab = "for-you" | "recent" | "my-network";

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
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");

  const { data, isLoading, isError, refetch, isFetching } = usePosts({
    page,
    limit,
    sort: "newest",
    feedType: activeTab,
  });

  const rawPosts: Post[] = data?.items || data?.posts || [];
  const pagination = data?.pagination;

  const handleTabChange = (tab: FeedTab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      onPageChange?.(1);
    }
  };

  // Server provides deterministic ranking and strict chronological sorting per tab
  const displayPosts = rawPosts;

  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading posts feed">
        {/* Tab Skeleton */}
        <div className="flex items-center gap-2 p-1 bg-slate-100/70 rounded-2xl animate-pulse">
          <div className="h-9 w-28 rounded-xl bg-slate-200" />
          <div className="h-9 w-24 rounded-xl bg-slate-200" />
          <div className="h-9 w-28 rounded-xl bg-slate-200" />
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

            {/* Media Box Skeleton */}
            <div className="h-48 w-full rounded-2xl bg-slate-100" />

            {/* Engagement Summary Skeleton */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="h-3 w-16 rounded bg-slate-100" />
              <div className="h-3 w-20 rounded bg-slate-100" />
            </div>

            {/* Action Bar Skeleton */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100/60 pt-2">
              <div className="h-9 flex-1 rounded-xl bg-slate-100" />
              <div className="h-9 flex-1 rounded-xl bg-slate-100" />
              <div className="h-9 flex-1 rounded-xl bg-slate-100" />
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
        <h3 className="mt-3.5 text-base font-bold text-slate-900">
          Failed to load community feed
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          We encountered an issue fetching the latest discussions. Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry Feed</span>
        </button>
      </div>
    );
  }

  const totalPages = pagination?.totalPages ?? pagination?.pages ?? 1;

  return (
    <div className="space-y-4">
      {/* FEED TABS NAVIGATION */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        {/* Tab Pills */}
        <div
          role="tablist"
          aria-label="Feed content filters"
          className="flex items-center gap-1 rounded-2xl bg-slate-100/90 p-1 border border-slate-200/80"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "for-you"}
            onClick={() => handleTabChange("for-you")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
              activeTab === "for-you"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>For You</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "recent"}
            onClick={() => handleTabChange("recent")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
              activeTab === "recent"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span>Recent</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "my-network"}
            onClick={() => handleTabChange("my-network")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
              activeTab === "my-network"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Users className="h-3.5 w-3.5 text-blue-600" />
            <span>My Network</span>
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {displayPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 sm:p-14 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs border border-blue-100">
            {activeTab === "my-network" ? (
              <Users className="h-7 w-7 text-blue-600" />
            ) : (
              <MessageSquareDashed className="h-7 w-7 text-blue-600" />
            )}
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            {activeTab === "my-network"
              ? "No network activity yet"
              : "No discussions found"}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            {activeTab === "my-network"
              ? "Discussions from your recruiters and your own posts will appear here. Switch to 'For You' or 'Recent' to explore the full community."
              : "Be the first to share a career milestone, hiring advice, or industry insight with the JobBox community above."}
          </p>
          {activeTab === "my-network" && (
            <button
              type="button"
              onClick={() => setActiveTab("for-you")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Explore Community Feed</span>
            </button>
          )}
        </div>
      ) : (
        /* POSTS LISTING */
        <div className="space-y-4">
          {displayPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* PAGINATION NAVIGATION */}
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
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
                className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl border px-3 text-xs sm:text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${
                  p === page
                    ? "border-blue-600 bg-blue-600 text-white shadow-xs font-semibold"
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
