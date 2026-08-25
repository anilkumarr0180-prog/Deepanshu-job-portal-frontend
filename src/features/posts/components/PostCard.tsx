import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  Check,
  Heart,
  Loader2,
  Maximize2,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Repeat,
  Share2,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "@/features/auth/hooks/useAuth";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import {
  useLikePost,
  useUnlikePost,
  useUpdatePost,
  useDeletePost,
} from "../hooks";
import {
  formatPostTimestamp,
  formatExactTimestamp,
} from "../utils/formatTimestamp";
import { useUserProfileModal } from "../context/UserProfileContext";
import PostComments from "./PostComments";
import RepostModal from "./RepostModal";
import SharePostModal from "./SharePostModal";
import type { Post, PostAuthor } from "../types/post.types";

const MAX_POST_LENGTH = 5000;
const CONTENT_TRUNCATE_LENGTH = 320;

const editPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content cannot be empty.")
    .max(MAX_POST_LENGTH, "Post content cannot exceed " + MAX_POST_LENGTH + " characters."),
});

type EditPostFormValues = z.infer<typeof editPostSchema>;

interface PostCardProps {
  post: Post;
}

function renderFormattedContent(text: string) {
  const parts = text.split(/(\s+)/);
  return parts.map((part, idx) => {
    if (part.startsWith("#") && part.length > 1) {
      return (
        <span
          key={idx}
          className="font-semibold text-[#3C65F5] hover:underline cursor-pointer"
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function PostCard({ post }: PostCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { openUserProfile } = useUserProfileModal();

  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isExpandedText, setIsExpandedText] = useState(false);

  // Modals
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Edit Mode Media State
  const [selectedNewFile, setSelectedNewFile] = useState<File | null>(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);
  const [removeExistingMedia, setRemoveExistingMedia] = useState(false);

  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const {
    uploadFile,
    isUploading,
    reset: resetUpload,
  } = useCloudinaryUpload();

  const currentUserId = user?._id || user?.id;
  const postAuthorId =
    typeof post.authorId === "object" && post.authorId !== null
      ? post.authorId._id
      : post.authorId;

  const isOwnPost = Boolean(
    currentUserId &&
      postAuthorId &&
      String(currentUserId) === String(postAuthorId)
  );

  const isLiked = Boolean(post.isLiked);
  const isReposted = Boolean(post.isReposted);
  const isLikePending = likeMutation.isPending || unlikeMutation.isPending;
  const isBusySaving = isUpdating || isUploading;

  // Repost info
  const isRepost = Boolean(post.originalPostId);
  const originalPost =
    typeof post.originalPostId === "object" && post.originalPostId !== null
      ? post.originalPostId
      : null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsLightboxOpen(false);
      }
    }

    if (isMenuOpen || isLightboxOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, isLightboxOpen]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset: resetForm,
    formState: { errors },
  } = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: { content: post.content },
  });

  const watchedContent = watch("content");
  const charCount = watchedContent ? watchedContent.length : 0;
  const isOverLimit = charCount > MAX_POST_LENGTH;
  const isValidEdit =
    Boolean(watchedContent && watchedContent.trim().length > 0) &&
    !isOverLimit &&
    !isBusySaving;

  const handleStartEdit = () => {
    setValue("content", post.content);
    setSelectedNewFile(null);
    setNewPreviewUrl(null);
    setRemoveExistingMedia(false);
    resetUpload();
    setIsEditing(true);
    setIsConfirmingDelete(false);
    setIsMenuOpen(false);
  };

  const handleCancelEdit = () => {
    resetForm({ content: post.content });
    if (newPreviewUrl) URL.revokeObjectURL(newPreviewUrl);
    setSelectedNewFile(null);
    setNewPreviewUrl(null);
    setRemoveExistingMedia(false);
    resetUpload();
    setIsEditing(false);
  };

  const onSaveEdit = async (data: EditPostFormValues) => {
    let finalMediaUrl: string | null | undefined = undefined;
    let finalMediaPublicId: string | null | undefined = undefined;

    if (selectedNewFile) {
      const uploadResult = await uploadFile(selectedNewFile, "post");
      if (!uploadResult) return;
      finalMediaUrl = (uploadResult as any).secure_url || (uploadResult as any).secureUrl;
      finalMediaPublicId = (uploadResult as any).public_id || (uploadResult as any).publicId;
    } else if (removeExistingMedia) {
      finalMediaUrl = null;
      finalMediaPublicId = null;
    }

    updatePost(
      {
        postId: post._id,
        payload: {
          content: data.content.trim(),
          mediaUrl: finalMediaUrl,
          mediaPublicId: finalMediaPublicId,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setSelectedNewFile(null);
          setNewPreviewUrl(null);
          setRemoveExistingMedia(false);
          resetUpload();
        },
      }
    );
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (isValidEdit) void handleSubmit(onSaveEdit)();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const onConfirmDelete = () => {
    deletePost(post._id, {
      onSuccess: () => {
        setIsConfirmingDelete(false);
      },
    });
  };

  const handleToggleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLikePending) return;
    if (!isAuthenticated) {
      toast.error("Please log in to like posts.");
      return;
    }
    if (isLiked) {
      unlikeMutation.mutate(post._id);
    } else {
      likeMutation.mutate(post._id);
    }
  };

  const handleOpenRepostModal = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to repost.");
      return;
    }
    setIsRepostModalOpen(true);
  };

  const handleOpenShareModal = () => {
    setIsShareModalOpen(true);
  };

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

  const author = getAuthorDetails(post.authorId);

  const handleOpenAuthorProfile = () => {
    openUserProfile({
      _id: author._id || (typeof post.authorId === "string" ? post.authorId : postAuthorId) || "",
      name: author.name,
      role: author.role,
      email: author.email,
      profilePicture: author.avatar,
    });
  };

  const getRoleBadgeClasses = (role: string) => {
    switch (role.toLowerCase()) {
      case "recruiter":
        return "bg-purple-50 text-purple-700 border-purple-200/70";
      case "candidate":
        return "bg-blue-50 text-blue-700 border-blue-200/70";
      case "admin":
        return "bg-amber-50 text-amber-800 border-amber-200/70";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/70";
    }
  };

  const exactTimestamp = formatExactTimestamp(post.createdAt);
  const relativeTimestamp = formatPostTimestamp(post.createdAt);

  const isLongContent = post.content.length > CONTENT_TRUNCATE_LENGTH;
  const displayedContent =
    isLongContent && !isExpandedText
      ? post.content.slice(0, CONTENT_TRUNCATE_LENGTH) + "..."
      : post.content;

  return (
    <>
      <article
        id={"post-" + post._id}
        className="group rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 md:p-6 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
      >
        {/* REPOST HEADER BANNER */}
        {isRepost && (
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-2.5">
            <Repeat className="h-3.5 w-3.5 text-[#3C65F5]" />
            <button
              type="button"
              onClick={handleOpenAuthorProfile}
              className="hover:text-[#3C65F5] hover:underline font-bold text-slate-800 transition"
            >
              {author.name}
            </button>
            <span>reposted</span>
          </div>
        )}

        {/* 1. AUTHOR HEADER & 3-DOT MENU */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={handleOpenAuthorProfile}
              className="text-left cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-full shrink-0"
              title={"View " + author.name + "'s profile"}
            >
              <UserAvatar src={author.avatar} name={author.name} size="md" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleOpenAuthorProfile}
                  className="font-bold text-slate-900 text-sm sm:text-base truncate leading-snug hover:text-[#3C65F5] hover:underline cursor-pointer transition text-left"
                  title={"View " + author.name + "'s profile"}
                >
                  {author.name}
                </button>
                <span
                  className={
                    "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold capitalize border " +
                    getRoleBadgeClasses(author.role)
                  }
                >
                  {author.role}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <Link
                  to={"/posts/" + post._id}
                  title={exactTimestamp}
                  className="hover:text-[#3C65F5] hover:underline transition-colors"
                >
                  {relativeTimestamp}
                </Link>
                {post.updatedAt && post.updatedAt !== post.createdAt && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span
                      className="text-[11px] text-slate-400 italic"
                      title={"Edited on " + formatExactTimestamp(post.updatedAt)}
                    >
                      Edited
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Clean 3-Dot Options Dropdown */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-label="Post actions menu"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-150"
              >
                <Link
                  to={"/posts/" + post._id}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  <span>Open Post View</span>
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleOpenShareModal();
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Share2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>Share Post</span>
                </button>

                {isOwnPost && (
                  <>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleStartEdit}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Pencil className="h-3.5 w-3.5 text-[#3C65F5]" />
                      <span>Edit Post</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsConfirmingDelete(true);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      <span>Delete Post</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* INLINE DELETE CONFIRMATION BAR */}
        {isConfirmingDelete && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-medium text-rose-800">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>Are you sure you want to delete this post?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
                className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 transition disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                <span>Delete</span>
              </button
            ></div>
          </div>
        )}

        {/* 2. POST CONTENT / INLINE EDIT FORM */}
        {isEditing ? (
          <form onSubmit={handleSubmit(onSaveEdit)} className="mt-4 space-y-3" noValidate>
            <textarea
              id={"edit-post-" + post._id}
              rows={4}
              {...register("content")}
              onKeyDown={handleEditKeyDown}
              disabled={isBusySaving}
              className="w-full resize-none rounded-xl border border-slate-200/90 bg-white p-3.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-[#3C65F5]/10 disabled:opacity-60 leading-relaxed"
            />
            {errors.content && <p className="text-xs font-medium text-red-600">{errors.content.message}</p>}

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">{charCount} / {MAX_POST_LENGTH}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isBusySaving}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValidEdit}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#3457D5] transition disabled:opacity-50"
                >
                  {isBusySaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          !isConfirmingDelete && (
            <div className="mt-3.5 text-sm sm:text-[15px] text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
              {displayedContent ? renderFormattedContent(displayedContent) : null}
              {isLongContent && (
                <button
                  type="button"
                  onClick={() => setIsExpandedText((prev) => !prev)}
                  className="ml-1.5 text-xs font-semibold text-[#3C65F5] hover:underline cursor-pointer"
                >
                  {isExpandedText ? "Show less" : "See more"}
                </button>
              )}
            </div>
          )
        )}

        {/* 3. REPOST EMBEDDED ORIGINAL POST */}
        {!isEditing && isRepost && (
          <div className="mt-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-3">
            {originalPost ? (
              <>
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    src={
                      typeof originalPost.authorId === "object" && originalPost.authorId !== null
                        ? originalPost.authorId.profilePicture
                        : undefined
                    }
                    name={
                      typeof originalPost.authorId === "object" && originalPost.authorId !== null
                        ? originalPost.authorId.name
                        : "Author"
                    }
                    size="sm"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {typeof originalPost.authorId === "object" && originalPost.authorId !== null
                        ? originalPost.authorId.name
                        : "Original Author"}
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      {formatPostTimestamp(originalPost.createdAt)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {originalPost.content}
                </p>

                {originalPost.mediaUrl && (
                  <div className="relative max-h-64 overflow-hidden rounded-xl bg-slate-200">
                    <img
                      src={originalPost.mediaUrl}
                      alt="Original post media"
                      className="max-h-64 w-full object-cover"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-slate-400 italic py-2">
                This original post has been removed or is no longer available.
              </div>
            )}
          </div>
        )}

        {/* 4. POST MEDIA ATTACHMENT */}
        {!isEditing && !isRepost && post.mediaUrl && !imageError && (
          <div className="mt-4 relative group/media overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900/5 shadow-2xs flex items-center justify-center max-h-96 sm:max-h-[440px]">
            <img
              src={post.mediaUrl}
              alt="Post attachment"
              className="max-h-96 sm:max-h-[440px] w-full object-contain cursor-pointer transition duration-300 group-hover/media:brightness-95"
              loading="lazy"
              onClick={() => setIsLightboxOpen(true)}
              onError={() => setImageError(true)}
            />
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="View fullscreen"
              className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/70 text-white backdrop-blur-xs opacity-0 group-hover/media:opacity-100 transition duration-200 hover:bg-slate-900"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 5. ENGAGEMENT SUMMARY ROW */}
        {((post.likesCount || 0) > 0 || (post.commentsCount || 0) > 0 || (post.repostsCount || 0) > 0) && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100/90 pt-3 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              {(post.likesCount || 0) > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-rose-500 border border-rose-100">
                    <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                  </span>
                  <span className="font-bold text-slate-800">{post.likesCount}</span>
                </span>
              )}

              {(post.repostsCount || 0) > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[#3C65F5] border border-blue-100">
                    <Repeat className="h-3 w-3 text-[#3C65F5]" />
                  </span>
                  <span className="font-bold text-slate-800">{post.repostsCount}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {(post.commentsCount || 0) > 0 && (
                <button
                  type="button"
                  onClick={() => setShowComments((prev) => !prev)}
                  className="text-slate-500 hover:text-slate-900 transition"
                >
                  <span className="font-semibold text-slate-800">{post.commentsCount}</span>{" "}
                  <span>{post.commentsCount === 1 ? "comment" : "comments"}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 6. ACTION BAR: LIKE / COMMENT / REPOST / SHARE */}
        <div
          className={
            "grid grid-cols-4 gap-1 sm:gap-2 pt-2 text-xs font-semibold text-slate-600 " +
            ((post.likesCount || 0) === 0 && (post.commentsCount || 0) === 0 && (post.repostsCount || 0) === 0
              ? "mt-4 border-t border-slate-100"
              : "border-t border-slate-100/60 mt-2")
          }
        >
          {/* Like Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isLikePending}
            className={
              "group inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 transition-all duration-150 active:scale-95 disabled:opacity-60 " +
              (isLiked
                ? "bg-rose-50 text-rose-600 font-bold hover:bg-rose-100"
                : "hover:bg-slate-50 hover:text-rose-600 text-slate-600")
            }
          >
            <Heart
              className={
                "h-4 w-4 transition-transform duration-200 group-hover:scale-115 " +
                (isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-400 group-hover:text-rose-500")
              }
            />
            <span className="hidden sm:inline">{isLiked ? "Liked" : "Like"}</span>
            <span className="sm:hidden">{post.likesCount || (isLiked ? "1" : "Like")}</span>
          </button>

          {/* Comment Button */}
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className={
              "group inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 transition-all duration-150 active:scale-95 " +
              (showComments
                ? "bg-blue-50 text-[#3C65F5] font-bold hover:bg-blue-100"
                : "hover:bg-slate-50 hover:text-[#3C65F5] text-slate-600")
            }
          >
            <MessageSquare
              className={
                "h-4 w-4 transition-transform duration-200 group-hover:scale-110 " +
                (showComments ? "text-[#3C65F5]" : "text-slate-400 group-hover:text-[#3C65F5]")
              }
            />
            <span className="hidden sm:inline">Comment</span>
            <span className="sm:hidden">{post.commentsCount || "Comment"}</span>
          </button>

          {/* Repost Button */}
          <button
            type="button"
            onClick={handleOpenRepostModal}
            className={
              "group inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 transition-all duration-150 active:scale-95 " +
              (isReposted
                ? "bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100"
                : "hover:bg-slate-50 hover:text-emerald-700 text-slate-600")
            }
          >
            <Repeat
              className={
                "h-4 w-4 transition-transform duration-200 group-hover:scale-115 " +
                (isReposted ? "text-emerald-600 font-bold scale-110" : "text-slate-400 group-hover:text-emerald-600")
              }
            />
            <span className="hidden sm:inline">{isReposted ? "Reposted" : "Repost"}</span>
            <span className="sm:hidden">{post.repostsCount || "Repost"}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleOpenShareModal}
            className="group inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 transition-all duration-150 text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            <Share2 className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:scale-110 group-hover:text-slate-700" />
            <span>Share</span>
          </button>
        </div>

        {/* 7. EXPANDABLE COMMENTS */}
        {showComments && (
          <div
            id={"post-comments-" + post._id}
            className="mt-4 border-t border-slate-100 pt-4 animate-in fade-in-50 duration-200"
          >
            <PostComments postId={post._id} />
          </div>
        )}
      </article>

      {/* Lightbox Modal */}
      {isLightboxOpen && post.mediaUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-black shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={post.mediaUrl}
              alt="Full size attachment"
              className="max-h-[85vh] max-w-[85vw] object-contain"
            />
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <RepostModal
        isOpen={isRepostModalOpen}
        onClose={() => setIsRepostModalOpen(false)}
        post={post}
      />
      <SharePostModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        post={post}
      />
    </>
  );
}