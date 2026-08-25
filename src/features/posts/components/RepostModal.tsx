import { useState, useEffect } from "react";
import { X, Repeat, MessageSquare, Send, Loader2 } from "lucide-react";
import { UserAvatar } from "@/shared/components/UserAvatar";
import useAuth from "@/features/auth/hooks/useAuth";
import { useRepost } from "../hooks/useRepost";
import type { Post } from "../types/post.types";

interface RepostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export default function RepostModal({ isOpen, onClose, post }: RepostModalProps) {
  const { user } = useAuth();
  const [isQuoteMode, setIsQuoteMode] = useState(false);
  const [commentary, setCommentary] = useState("");
  const { mutate: repost, isPending } = useRepost();

  useEffect(() => {
    if (!isOpen) {
      setIsQuoteMode(false);
      setCommentary("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onClose]);

  if (!isOpen) return null;

  const originalPost =
    typeof post.originalPostId === "object" && post.originalPostId !== null
      ? post.originalPostId
      : post;

  const authorName =
    typeof originalPost.authorId === "object" && originalPost.authorId !== null
      ? originalPost.authorId.name
      : "Community Member";

  const authorAvatar =
    typeof originalPost.authorId === "object" && originalPost.authorId !== null
      ? originalPost.authorId.profilePicture
      : undefined;

  const authorRole =
    typeof originalPost.authorId === "object" && originalPost.authorId !== null
      ? originalPost.authorId.role
      : "Member";

  const handleInstantRepost = () => {
    repost(
      { postId: post._id },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleQuoteRepost = () => {
    repost(
      { postId: post._id, payload: { content: commentary.trim() } },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="repost-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 transition-all duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Repeat className="h-5 w-5" />
            </div>
            <div>
              <h3 id="repost-modal-title" className="text-base font-bold text-slate-900">
                {isQuoteMode ? "Quote Post with Thoughts" : "Repost to Your Network"}
              </h3>
              <p className="text-xs text-slate-500">
                Share this discussion with your connections and community.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {isQuoteMode ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <UserAvatar
                  src={user?.profilePicture}
                  name={user?.name || "User"}
                  size="sm"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900">{user?.name}</span>
                  <span className="block text-[11px] text-slate-400 capitalize">{user?.role}</span>
                </div>
              </div>

              <textarea
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                placeholder="What are your thoughts on this? (optional)"
                rows={3}
                maxLength={5000}
                autoFocus
                className="w-full resize-none rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition shadow-2xs"
              />
              <div className="flex justify-end text-[11px] text-slate-400 font-medium">
                {commentary.length}/5000
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <UserAvatar
                src={authorAvatar}
                name={authorName}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{authorName}</h4>
                <span className="text-[10px] text-slate-500 font-medium capitalize">{authorRole}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
              {originalPost.content || "Attached media discussion"}
            </p>

            {originalPost.mediaUrl && (
              <div className="relative h-24 w-full overflow-hidden rounded-lg bg-slate-200">
                <img
                  src={originalPost.mediaUrl}
                  alt="Post preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
          {!isQuoteMode ? (
            <>
              <button
                type="button"
                onClick={() => setIsQuoteMode(true)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                <span>Quote with Thoughts</span>
              </button>

              <button
                type="button"
                onClick={handleInstantRepost}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Repeat className="h-3.5 w-3.5" />
                )}
                <span>Instant Repost</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsQuoteMode(false)}
                disabled={isPending}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Back
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleQuoteRepost}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span>Post Repost</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}