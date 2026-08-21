import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import { usePosts } from "../hooks/usePosts";
import PostCard from "./PostCard";
import type { Post } from "../types/post.types";

interface RecentPostsProps {
  limit?: number;
  title?: string;
  description?: string;
}

export default function RecentPosts({
  limit = 3,
  title = "Community Discussions",
  description = "Recent insights and career updates from across JobBox",
}: RecentPostsProps) {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = usePosts({
    limit,
    sort: "newest",
  });

  const posts: Post[] = data?.items || data?.posts || [];

  const networkingRoute =
    user?.role === "candidate"
      ? "/candidate/networking"
      : user?.role === "recruiter"
      ? "/recruiter/networking"
      : "/posts";

  return (
    <section aria-labelledby="recent-posts-heading" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#3C65F5]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3
              id="recent-posts-heading"
              className="text-base sm:text-lg font-bold text-slate-900"
            >
              {title}
            </h3>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>

        <Link
          to={networkingRoute}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold text-[#3C65F5] hover:text-[#3457D5] transition group"
        >
          <span>View all posts</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4" role="status" aria-label="Loading recent posts">
          {Array.from({ length: limit }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 md:p-6 shadow-xs animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200" />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-28 rounded bg-slate-200" />
                      <div className="h-3.5 w-16 rounded bg-slate-100" />
                    </div>
                    <div className="h-3 w-20 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-6 w-6 rounded bg-slate-100" />
              </div>
              <div className="space-y-2 pt-1">
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-4/5 rounded bg-slate-200" />
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="h-3 w-16 rounded bg-slate-100" />
                <div className="h-3 w-20 rounded bg-slate-100" />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-100/60 pt-2">
                <div className="h-8 flex-1 rounded-xl bg-slate-100" />
                <div className="h-8 flex-1 rounded-xl bg-slate-100" />
                <div className="h-8 flex-1 rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 text-center shadow-xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            Failed to load community posts
          </p>
          <p className="mt-0.5 text-xs text-slate-600">
            Unable to fetch recent discussions. Please try again.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center shadow-xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-2xs border border-slate-200/60">
            <MessageSquare className="h-5 w-5 text-[#3C65F5]" />
          </div>
          <p className="mt-2.5 text-sm font-semibold text-slate-900">
            No community posts yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Be the first to share an insight or milestone with the community.
          </p>
          <Link
            to={networkingRoute}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#3457D5]"
          >
            Go to Community
          </Link>
        </div>
      )}

      {/* Posts List */}
      {!isLoading && !isError && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
