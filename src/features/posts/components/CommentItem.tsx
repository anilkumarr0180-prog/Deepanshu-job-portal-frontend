import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  Check,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useUpdatePostComment } from "../hooks/useUpdatePostComment";
import { useDeletePostComment } from "../hooks/useDeletePostComment";
import {
  formatPostTimestamp,
  formatExactTimestamp,
} from "../utils/formatTimestamp";
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
}

export default function CommentItem({ postId, comment }: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { mutate: updateComment, isPending: isUpdating } =
    useUpdatePostComment();
  const { mutate: deleteComment, isPending: isDeleting } =
    useDeletePostComment();

  const currentUserId = user?._id || user?.id;
  const commentAuthorId =
    typeof comment.authorId === "object" && comment.authorId !== null
      ? comment.authorId._id
      : comment.authorId;

  const isOwnComment = Boolean(
    currentUserId && commentAuthorId && String(currentUserId) === String(commentAuthorId)
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

  const getAuthorDetails = (authorId: PostAuthor | string) => {
    if (typeof authorId === "object" && authorId !== null) {
      return {
        name: authorId.name || "Community Member",
        role: authorId.role || "Member",
        avatar: authorId.profilePicture,
      };
    }
    return {
      name: "Community Member",
      role: "Member",
      avatar: undefined,
    };
  };

  const author = getAuthorDetails(comment.authorId);

  const getRoleBadgeClasses = (role: string) => {
    switch (role.toLowerCase()) {
      case "recruiter":
        return "bg-purple-50 text-purple-700 border border-purple-200/60";
      case "candidate":
        return "bg-blue-50 text-blue-700 border border-blue-200/60";
      case "admin":
        return "bg-amber-50 text-amber-800 border border-amber-200/60";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200/60";
    }
  };

  const relativeTimestamp = formatPostTimestamp(comment.createdAt);
  const exactTimestamp = formatExactTimestamp(comment.createdAt);

  return (
    <div className="group/item flex items-start gap-2.5 text-xs sm:text-sm">
      <UserAvatar src={author.avatar} name={author.name} size="sm" />

      <div className="flex-1 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 sm:p-3.5 shadow-2xs transition hover:border-slate-300 min-w-0">
        {/* Comment Header: Author, Role, Date, Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
              {author.name}
            </span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize ${getRoleBadgeClasses(
                author.role
              )}`}
            >
              {author.role}
            </span>
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
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  aria-label="Delete comment"
                  title="Delete comment"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Banner */}
        {isConfirmingDelete && (
          <div className="mt-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-2.5 text-xs text-rose-800 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span className="font-medium">
                  Delete this comment?
                </span>
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

        {/* Inline Edit Mode */}
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
              className="w-full resize-none rounded-xl border border-slate-200/90 bg-white p-2.5 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-[#3C65F5]/10 disabled:cursor-not-allowed disabled:opacity-60 leading-relaxed"
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
                      ? "text-amber-600"
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
                  className="inline-flex items-center gap-1 rounded-lg bg-[#3C65F5] px-2.5 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-[#3457D5] transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
          /* Normal Display Mode */
          !isConfirmingDelete && (
            <p className="mt-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          )
        )}
      </div>
    </div>
  );
}
