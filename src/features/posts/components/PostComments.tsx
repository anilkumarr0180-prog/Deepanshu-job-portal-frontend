import { useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { usePostComments } from "../hooks/usePostComments";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import type { PostComment } from "../types/post.types";

interface PostCommentsProps {
  postId: string;
}

export default function PostComments({ postId }: PostCommentsProps) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = usePostComments(postId, {
    page,
    limit,
    sort: "newest",
  });

  const comments: PostComment[] = data?.items || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      {/* Create Comment Form */}
      <CommentForm postId={postId} />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3 pt-2" role="status" aria-label="Loading comments">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="flex items-start gap-2.5 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2 rounded-2xl border border-slate-200/60 bg-slate-50/80 p-3 sm:p-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-24 rounded bg-slate-200" />
                  <div className="h-3 w-12 rounded bg-slate-100" />
                </div>
                <div className="h-3 w-3/4 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-center">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertCircle className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xs font-bold text-slate-800">
            Failed to load comments
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Comments</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && comments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
          <MessageSquare className="mx-auto h-6 w-6 text-slate-300" />
          <p className="mt-2 text-xs font-bold text-slate-700">
            No comments yet
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Be the first to share your thoughts and join the discussion!
          </p>
        </div>
      )}

      {/* Comments List */}
      {!isLoading && !isError && comments.length > 0 && (
        <div className="space-y-3 pt-1">
          {comments
            .filter((c) => !c.isDeleted)
            .map((comment) => (
              <CommentItem
                key={comment._id}
                postId={postId}
                comment={comment}
              />
            ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30"
                aria-label="Previous page of comments"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              <span className="px-2 text-xs font-medium text-slate-500">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30"
                aria-label="Next page of comments"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
