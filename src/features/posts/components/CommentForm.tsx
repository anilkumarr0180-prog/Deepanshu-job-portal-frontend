import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CornerDownRight, Loader2, Send, X } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useCreatePostComment } from "../hooks/useCreatePostComment";

const MAX_COMMENT_LENGTH = 2000;

const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty.")
    .max(
      MAX_COMMENT_LENGTH,
      `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`
    ),
});

type CreateCommentFormValues = z.infer<typeof createCommentSchema>;

interface CommentFormProps {
  postId: string;
  parentCommentId?: string | null;
  replyingToAuthorName?: string;
  onCancelReply?: () => void;
  onSuccess?: () => void;
}

export default function CommentForm({
  postId,
  parentCommentId = null,
  replyingToAuthorName,
  onCancelReply,
  onSuccess,
}: CommentFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { mutate: createComment, isPending } = useCreatePostComment();

  const isReply = Boolean(parentCommentId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentSchema),
    mode: "onSubmit",
    defaultValues: {
      content: "",
    },
  });

  const contentValue = watch("content") || "";
  const charCount = contentValue.trim().length;
  const isNearLimit = charCount > MAX_COMMENT_LENGTH - 100;
  const isOverLimit = charCount > MAX_COMMENT_LENGTH;
  const isValidComment = charCount > 0 && !isOverLimit && !isPending;

  const onSubmit = (values: CreateCommentFormValues) => {
    createComment(
      {
        postId,
        payload: {
          content: values.content.trim(),
          parentCommentId: parentCommentId || null,
        },
      },
      {
        onSuccess: () => {
          reset({ content: "" });
          if (onSuccess) {
            onSuccess();
          }
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (isValidComment) {
        void handleSubmit(onSubmit)();
      }
    } else if (e.key === "Escape" && isReply && onCancelReply) {
      e.preventDefault();
      onCancelReply();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-center text-xs text-slate-500">
        <span className="font-medium text-slate-700">
          Want to join the conversation?
        </span>{" "}
        Please log in to leave a comment.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2" noValidate>
      {/* Replying Banner */}
      {isReply && replyingToAuthorName && (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-blue-50/80 px-3 py-1.5 text-xs text-blue-700 border border-blue-100/90 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-blue-600" />
            <span>
              Replying to <strong className="font-bold text-blue-900">@{replyingToAuthorName}</strong>
            </span>
          </div>
          {onCancelReply && (
            <button
              type="button"
              onClick={onCancelReply}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <X className="h-3 w-3" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      )}

      <div className="flex items-start gap-2.5">
        <UserAvatar
          src={user?.profilePicture}
          name={user?.name || "User"}
          size="sm"
        />

        <div className="flex-1 space-y-1 min-w-0">
          <label htmlFor={`comment-content-${postId}-${parentCommentId || "root"}`} className="sr-only">
            {isReply ? "Write a reply" : "Write a comment"}
          </label>
            <textarea
            id={`comment-content-${postId}-${parentCommentId || "root"}`}
            rows={isReply ? 2 : 2}
            {...register("content")}
            onKeyDown={handleKeyDown}
            placeholder={
              isReply
                ? `Write a reply to @${replyingToAuthorName || "user"}... (Ctrl+Enter to post)`
                : "Write a constructive comment or reaction... (Ctrl+Enter to post)"
            }
            disabled={isPending}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition hover:bg-slate-50/90 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 leading-relaxed"
            autoFocus={isReply}
          />
        </div>
      </div>

      {errors.content && (
        <p className="text-xs font-medium text-red-600 pl-10">
          {errors.content.message}
        </p>
      )}

      <div className="flex items-center justify-between pl-10">
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

        <div className="flex items-center gap-2">
          {isReply && onCancelReply && (
            <button
              type="button"
              onClick={onCancelReply}
              disabled={isPending}
              className="inline-flex h-8 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={!isValidComment}
            className="inline-flex min-h-[32px] items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{isReply ? "Replying..." : "Posting..."}</span>
              </>
            ) : (
              <>
                <Send className="h-3 w-3" />
                <span>{isReply ? "Reply" : "Comment"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
