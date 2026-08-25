import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Flag,
  Loader2,
  MessageSquare,
  Pencil,
  Reply,
  Trash2,
  X,
} from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useUpdatePostComment } from "../hooks/useUpdatePostComment";
import { useDeletePostComment } from "../hooks/useDeletePostComment";
import { usePostComments } from "../hooks/usePostComments";
import CommentForm from "./CommentForm";
import ReportModal from "./ReportModal";
import {
  formatPostTimestamp,
  formatExactTimestamp,
} from "../utils/formatTimestamp";
import { useUserProfileModal } from "../context/UserProfileContext";
import type { PostAuthor, PostComment } from "../types/post.types";

const MAX_COMMENT_LENGTH = 2000;

const editCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty.")
    .max(
      MAX_COMMENT_LENGTH,
      `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`
    ),
});

type EditCommentFormValues = z.infer<typeof editCommentSchema>;

interface CommentItemProps {
  postId: string;
  comment: PostComment;
  isReply?: boolean;
}

export default function CommentItem({
  postId,
  comment,
  isReply = false,
}: CommentItemProps) {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { mutate: updateComment, isPending: isUpdating } =
    useUpdatePostComment();
  const { mutate: deleteComment, isPending: isDeleting } =
    useDeletePostComment();

  // Load replies on demand only when expanded (and strictly for top-level comments)
  const {
    data: repliesData,
    isLoading: isLoadingReplies,
  } = usePostComments(
    postId,
    showReplies && !isReply
      ? { parentCommentId: comment._id, limit: 50, sort: "oldest" }
      : undefined
  );

  const replies: PostComment[] = repliesData?.items || [];
  const totalReplies = comment.replyCount || replies.length;

  const currentUserId = user?._id || user?.id;
  const commentAuthorId =
    typeof comment.authorId === "object" && comment.authorId !== null
      ? comment.authorId._id
      : comment.authorId;

  const isDeleted = Boolean(comment.isDeleted);
  const isOwnComment = Boolean(
    !isDeleted &&
      currentUserId &&
      commentAuthorId &&
      String(currentUserId) === String(commentAuthorId)
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditCommentFormValues>({
    resolver: zodResolver(editCommentSchema),
    mode: "onSubmit",
    defaultValues: {
      content: comment.content,
    },
  });

  const contentValue = watch("content") || "";
  const charCount = contentValue.trim().length;
  const isNearLimit = charCount > MAX_COMMENT_LENGTH - 100;
  const isOverLimit = charCount > MAX_COMMENT_LENGTH;
  const isValidEdit = charCount > 0 && !isOverLimit && !isUpdating;

  const handleStartEdit = () => {
    reset({ content: comment.content });
    setIsEditing(true);
    setIsConfirmingDelete(false);
    setIsReplying(false);
  };

  const handleCancelEdit = () => {
    reset({ content: comment.content });
    setIsEditing(false);
  };

  const onSaveEdit = (values: EditCommentFormValues) => {
    updateComment(
      {
        postId,
        commentId: comment._id,
        payload: {
          content: values.content.trim(),
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (isValidEdit) {
        void handleSubmit(onSaveEdit)();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const onConfirmDelete = () => {
    deleteComment(
      {
        postId,
        commentId: comment._id,
      },
      {
        onSuccess: () => {
          setIsConfirmingDelete(false);
        },
      }
    );
  };

  const { openUserProfile } = useUserProfileModal();

  const getAuthorDetails = (authorId: PostAuthor | string) => {
    if (typeof authorId === "object" && authorId !== null) {
      return {
        _id: authorId._id,
        name: authorId.name || "Community Member",
        role: authorId.role || "Member",
        email: authorId.email,
        avatar: authorId.profilePicture,
      };
    }
    return {
      _id: typeof authorId === "string" ? authorId : "",
      name: "Community Member",
      role: "Member",
      email: undefined,
      avatar: undefined,
    };
  };

  const author = getAuthorDetails(comment.authorId);

  const handleOpenCommenterProfile = () => {
    if (isDeleted) return;
    openUserProfile({
      _id: author._id || (typeof comment.authorId === "string" ? comment.authorId : commentAuthorId) || "",
      name: author.name,
      role: author.role,
      email: author.email,
      profilePicture: author.avatar,
    });
  };

  const getRoleBadgeClasses = (role: string) => {
    switch (role.toLowerCase()) {
      case "recruiter":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      case "candidate":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "admin":
        return "bg-amber-50 text-amber-800 border-amber-200/60";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/60";
    }
  };

  const relativeTimestamp = formatPostTimestamp(comment.createdAt);
  const exactTimestamp = formatExactTimestamp(comment.createdAt);

  return (
    <div className={`group/item ${isReply ? "pl-2.5 sm:pl-3" : ""}`}>
      <div className="flex items-start gap-2.5 text-xs sm:text-sm">
        <button
          type="button"
          onClick={handleOpenCommenterProfile}
          disabled={isDeleted}
          className={`text-left rounded-full transition-transform shrink-0 ${
            isDeleted ? "cursor-default" : "cursor-pointer hover:scale-105 active:scale-95"
          }`}
          title={isDeleted ? undefined : `View ${author.name}'s profile`}
        >
          <UserAvatar
            src={isDeleted ? undefined : author.avatar}
            name={isDeleted ? "Deleted" : author.name}
            size="sm"
          />
        </button>

        <div
          className={`flex-1 rounded-2xl border p-3 sm:p-3.5 shadow-2xs transition min-w-0 ${
            isDeleted
              ? "border-slate-200/50 bg-slate-50/40 text-slate-400"
              : isReply
                ? "border-slate-200/60 bg-white/90 hover:border-slate-300/80"
                : "border-slate-200/70 bg-slate-50/80 hover:border-slate-300"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              {isDeleted ? (
                <span className="font-bold text-xs sm:text-sm truncate text-slate-400 italic font-normal">
                  [Deleted Author]
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenCommenterProfile}
                  className="font-bold text-xs sm:text-sm truncate text-slate-900 hover:text-blue-600 hover:underline cursor-pointer transition text-left"
                  title={`View ${author.name}'s profile`}
                >
                  {author.name}
                </button>
              )}
              {!isDeleted && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold capitalize border ${getRoleBadgeClasses(
                    author.role
                  )}`}
                >
                  {author.role}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <time
                dateTime={comment.createdAt}
                title={exactTimestamp}
                className="text-[11px] text-slate-400 cursor-default hover:text-slate-600 transition"
              >
                {relativeTimestamp}
              </time>

              {/* Edit / Delete actions for comment owner only */}
              {isOwnComment && !isEditing && !isConfirmingDelete && (
                <div className="flex items-center gap-0.5 opacity-70 group-hover/item:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    aria-label="Edit comment"
                    title="Edit comment"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 cursor-pointer"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    aria-label="Delete comment"
                    title="Delete comment"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Report action for other users' comments */}
              {!isOwnComment && !isDeleted && (
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      return;
                    }
                    setIsReportModalOpen(true);
                  }}
                  aria-label="Report comment"
                  title="Report comment"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 opacity-0 group-hover/item:opacity-70 hover:!opacity-100 hover:bg-rose-50 hover:text-rose-600 transition focus:opacity-100 cursor-pointer"
                >
                  <Flag className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Delete Confirmation Banner */}
          {isConfirmingDelete && (
            <div className="mt-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-2.5 text-xs text-rose-800 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span className="font-semibold">Delete this comment?</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    disabled={isDeleting}
                    className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onConfirmDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs hover:bg-rose-700 transition disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Inline Edit Form */}
          {isEditing ? (
            <form
              onSubmit={handleSubmit(onSaveEdit)}
              className="mt-2 space-y-2"
              noValidate
            >
              <label htmlFor={`edit-comment-${comment._id}`} className="sr-only">
                Edit comment
              </label>
              <textarea
                id={`edit-comment-${comment._id}`}
                rows={2}
                {...register("content")}
                onKeyDown={handleEditKeyDown}
                disabled={isUpdating}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-2.5 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 leading-relaxed"
              />

              {errors.content && (
                <p className="text-xs font-medium text-red-600">
                  {errors.content.message}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-medium ${
                    isOverLimit
                      ? "text-red-600 font-semibold"
                      : isNearLimit
                        ? "text-amber-600 font-medium"
                        : "text-slate-400"
                  }`}
                >
                  {charCount} / {MAX_COMMENT_LENGTH}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={!isValidEdit}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Normal Comment Display */
            !isConfirmingDelete && (
              <p
                className={`mt-1.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  isDeleted ? "text-slate-400 italic" : "text-slate-700"
                }`}
              >
                {isDeleted ? "[Comment deleted]" : comment.content}
              </p>
            )
          )}

          {/* Action Row: Reply Button (Top-Level Only) & Expand Replies Toggle */}
          {!isEditing && !isConfirmingDelete && (
            <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                {/* Reply button */}
                {!isReply && !isDeleted && isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => setIsReplying((prev) => !prev)}
                    className={`inline-flex items-center gap-1 font-semibold transition hover:text-blue-600 ${
                      isReplying ? "text-blue-600" : "text-slate-500"
                    }`}
                  >
                    <Reply className="h-3 w-3" />
                    <span>{isReplying ? "Cancel Reply" : "Reply"}</span>
                  </button>
                )}

                {/* View Replies Toggle Button */}
                {!isReply && (totalReplies > 0 || showReplies) && (
                  <button
                    type="button"
                    onClick={() => setShowReplies((prev) => !prev)}
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>
                      {showReplies
                        ? "Hide replies"
                        : `${totalReplies} ${totalReplies === 1 ? "reply" : "replies"}`}
                    </span>
                    {showReplies ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline Reply Form (Top-Level Only) */}
      {!isReply && isReplying && (
        <div className="ml-9 sm:ml-10 mt-2.5 pl-3 border-l-2 border-blue-400 animate-in fade-in duration-150">
          <CommentForm
            postId={postId}
            parentCommentId={comment._id}
            replyingToAuthorName={author.name}
            onCancelReply={() => setIsReplying(false)}
            onSuccess={() => {
              setIsReplying(false);
              setShowReplies(true);
            }}
          />
        </div>
      )}

      {/* Nested Replies List */}
      {!isReply && showReplies && (
        <div className="ml-9 sm:ml-10 mt-3 pl-3 border-l-2 border-slate-200 space-y-2.5 animate-in fade-in duration-150">
          {isLoadingReplies && (
            <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
              <span>Loading replies...</span>
            </div>
          )}

          {!isLoadingReplies && replies.length === 0 && (
            <p className="py-1 text-xs text-slate-400 italic">No replies yet.</p>
          )}

          {!isLoadingReplies &&
            replies.map((reply) => (
              <CommentItem
                key={reply._id}
                postId={postId}
                comment={reply}
                isReply={true}
              />
            ))}
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="comment"
        targetId={comment._id}
        targetTitle={comment.content ? (comment.content.slice(0, 60) + "...") : undefined}
      />
    </div>
  );
}
