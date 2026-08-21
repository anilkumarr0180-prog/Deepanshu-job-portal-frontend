import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  Check,
  Heart,
  Image as ImageIcon,
  ImageOff,
  Link2,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  X,
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
import PostComments from "./PostComments";
import type { Post, PostAuthor } from "../types/post.types";

const MAX_POST_LENGTH = 5000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const editPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content cannot be empty.")
    .max(
      MAX_POST_LENGTH,
      `Post content cannot exceed ${MAX_POST_LENGTH} characters.`
    ),
});

type EditPostFormValues = z.infer<typeof editPostSchema>;

interface PostCardProps {
  post: Post;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PostCard({ post }: PostCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

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
    progress: uploadProgress,
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
  const isLikePending = likeMutation.isPending || unlikeMutation.isPending;
  const isBusySaving = isUpdating || isUploading;

  // Close 3-dot dropdown menu on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  // Cleanup object URL on unmount or URL change
  useEffect(() => {
    return () => {
      if (newPreviewUrl) {
        URL.revokeObjectURL(newPreviewUrl);
      }
    };
  }, [newPreviewUrl]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
    mode: "onSubmit",
    defaultValues: {
      content: post.content,
    },
  });

  const contentValue = watch("content") || "";
  const charCount = contentValue.trim().length;
  const isNearLimit = charCount > MAX_POST_LENGTH - 200;
  const isOverLimit = charCount > MAX_POST_LENGTH;
  const isValidEdit = charCount > 0 && !isOverLimit && !isBusySaving;

  const handleStartEdit = () => {
    setIsMenuOpen(false);
    reset({ content: post.content });
    setSelectedNewFile(null);
    if (newPreviewUrl) {
      URL.revokeObjectURL(newPreviewUrl);
      setNewPreviewUrl(null);
    }
    setRemoveExistingMedia(false);
    resetUpload();
    setIsEditing(true);
    setIsConfirmingDelete(false);
  };

  const handleCancelEdit = () => {
    reset({ content: post.content });
    setSelectedNewFile(null);
    if (newPreviewUrl) {
      URL.revokeObjectURL(newPreviewUrl);
      setNewPreviewUrl(null);
    }
    setRemoveExistingMedia(false);
    resetUpload();
    setIsEditing(false);
  };

  const handleEditImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      toast.error(
        "Invalid file format. Only JPG, PNG, WebP, and GIF images are allowed."
      );
      if (editFileInputRef.current) editFileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image file size exceeds 5MB limit.");
      if (editFileInputRef.current) editFileInputRef.current.value = "";
      return;
    }

    if (newPreviewUrl) {
      URL.revokeObjectURL(newPreviewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedNewFile(file);
    setNewPreviewUrl(objectUrl);
    setRemoveExistingMedia(false);
    resetUpload();
  };

  const handleRemoveNewImage = () => {
    if (newPreviewUrl) {
      URL.revokeObjectURL(newPreviewUrl);
    }
    setSelectedNewFile(null);
    setNewPreviewUrl(null);
    resetUpload();
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const handleRemoveExistingImage = () => {
    setRemoveExistingMedia(true);
    handleRemoveNewImage();
  };

  const onSaveEdit = async (values: EditPostFormValues) => {
    if (isBusySaving) return;

    let mediaUrl: string | null | undefined = undefined;
    let mediaPublicId: string | null | undefined = undefined;

    // Case 1: User uploaded a new replacement image
    if (selectedNewFile) {
      const uploadRes = await uploadFile(selectedNewFile, "post");
      if (!uploadRes) {
        return;
      }
      mediaUrl = uploadRes.secure_url;
      mediaPublicId = uploadRes.public_id;
    } else if (removeExistingMedia) {
      // Case 2: User explicitly removed the existing image
      mediaUrl = null;
      mediaPublicId = null;
    }

    updatePost(
      {
        postId: post._id,
        payload: {
          content: values.content.trim(),
          ...(mediaUrl !== undefined && { mediaUrl }),
          ...(mediaPublicId !== undefined && { mediaPublicId }),
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setSelectedNewFile(null);
          setNewPreviewUrl(null);
          setRemoveExistingMedia(false);
          setImageError(false);
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

  const handleCopyLink = async () => {
    setIsMenuOpen(false);
    try {
      const postUrl = `${window.location.origin}/posts#post-${post._id}`;
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(postUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = postUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      toast.success("Post link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
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

  const author = getAuthorDetails(post.authorId);

  const getRoleBadgeClasses = (role: string) => {
    switch (role.toLowerCase()) {
      case "recruiter":
        return "bg-purple-50 text-purple-700 border border-purple-200/70";
      case "candidate":
        return "bg-blue-50 text-blue-700 border border-blue-200/70";
      case "admin":
        return "bg-amber-50 text-amber-800 border border-amber-200/70";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200/70";
    }
  };

  const hasExistingMediaInEdit =
    Boolean(post.mediaUrl) && !removeExistingMedia && !selectedNewFile;

  const exactTimestamp = formatExactTimestamp(post.createdAt);
  const relativeTimestamp = formatPostTimestamp(post.createdAt);

  return (
    <article
      id={`post-${post._id}`}
      className="group rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 md:p-6 shadow-xs transition-all duration-200 hover:border-slate-300/90 hover:shadow-sm"
    >
      {/* 1. AUTHOR HEADER & 3-DOT MENU */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: Avatar + Name + Role Badge + Timestamp */}
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar src={author.avatar} name={author.name} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate leading-snug">
                {author.name}
              </h4>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-medium capitalize ${getRoleBadgeClasses(
                  author.role
                )}`}
              >
                {author.role}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <time
                dateTime={post.createdAt}
                title={exactTimestamp}
                className="hover:text-slate-600 transition-colors cursor-default"
              >
                {relativeTimestamp}
              </time>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <>
                  <span aria-hidden="true">•</span>
                  <span
                    className="text-[11px] text-slate-400 italic"
                    title={`Edited on ${formatExactTimestamp(post.updatedAt)}`}
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
            aria-haspopup="menu"
            aria-label="Post options"
            title="More options"
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {/* Accessible Dropdown Menu */}
          {isMenuOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 top-full mt-1.5 z-30 w-44 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/50 animate-in fade-in-50 zoom-in-95 duration-150"
            >
              {/* Copy Link (Available to everyone) */}
              <button
                type="button"
                role="menuitem"
                onClick={handleCopyLink}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <Link2 className="h-4 w-4 text-slate-400" />
                <span>Copy link</span>
              </button>

              {/* Owner Options */}
              {isOwnPost && !isEditing && (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleStartEdit}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Pencil className="h-4 w-4 text-slate-400" />
                    <span>Edit post</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsConfirmingDelete(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="h-4 w-4 text-rose-500" />
                    <span>Delete post</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Banner */}
      {isConfirmingDelete && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span className="font-medium text-sm text-rose-900">
                Are you sure you want to delete this post? This cannot be undone.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 transition disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Post</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. POST CONTENT / INLINE EDIT FORM */}
      {isEditing ? (
        <form
          onSubmit={handleSubmit(onSaveEdit)}
          className="mt-4 space-y-3"
          noValidate
        >
          <label htmlFor={`edit-post-${post._id}`} className="sr-only">
            Edit post content
          </label>
          <textarea
            id={`edit-post-${post._id}`}
            rows={4}
            {...register("content")}
            onKeyDown={handleEditKeyDown}
            disabled={isBusySaving}
            className="w-full resize-none rounded-xl border border-slate-200/90 bg-white p-3.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:ring-2 focus:ring-[#3C65F5]/10 disabled:cursor-not-allowed disabled:opacity-60 leading-relaxed"
          />

          {errors.content && (
            <p className="text-xs font-medium text-red-600">
              {errors.content.message}
            </p>
          )}

          {/* Edit Mode: Newly Selected Image Preview */}
          {newPreviewUrl && selectedNewFile && (
            <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50 p-2">
              <div className="relative max-h-60 w-full overflow-hidden rounded-lg bg-slate-900/5 flex items-center justify-center">
                <img
                  src={newPreviewUrl}
                  alt="New attachment preview"
                  className="max-h-60 w-full object-contain sm:object-cover"
                />

                {isUploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xs text-white p-4">
                    <Loader2 className="h-7 w-7 animate-spin text-white mb-2" />
                    <span className="text-xs font-semibold">
                      Uploading image ({uploadProgress}%)
                    </span>
                    <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-white/30">
                      <div
                        className="h-full bg-[#3C65F5] transition-all duration-150"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {!isUploading && (
                <div className="mt-2 flex items-center justify-between gap-2 px-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-700 truncate">
                    {selectedNewFile.name} ({formatFileSize(selectedNewFile.size)})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveNewImage}
                    disabled={isBusySaving}
                    className="inline-flex h-6 items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 transition disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Edit Mode: Existing Image Preview */}
          {hasExistingMediaInEdit && (
            <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50 p-2">
              <div className="relative max-h-60 w-full overflow-hidden rounded-lg bg-slate-900/5 flex items-center justify-center">
                <img
                  src={post.mediaUrl}
                  alt="Current attachment"
                  className="max-h-60 w-full object-contain sm:object-cover"
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 px-1 text-xs text-slate-500">
                <span className="font-medium text-slate-600">
                  Current image attachment
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={isBusySaving}
                    className="inline-flex h-6 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    <ImageIcon className="h-3 w-3 text-[#3C65F5]" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveExistingImage}
                    disabled={isBusySaving}
                    className="inline-flex h-6 items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 transition disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hidden File Input for Edit Mode */}
          <input
            ref={editFileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleEditImageSelect}
            className="hidden"
            tabIndex={-1}
            aria-hidden="true"
          />

          {/* Edit Form Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {!hasExistingMediaInEdit && !newPreviewUrl && (
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  disabled={isBusySaving}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition disabled:opacity-50"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-[#3C65F5]" />
                  <span>Add Image</span>
                </button>
              )}

              <span
                className={`text-xs font-medium ${
                  isOverLimit
                    ? "text-red-600 font-semibold"
                    : isNearLimit
                      ? "text-amber-600"
                      : "text-slate-400"
                }`}
              >
                {charCount} / {MAX_POST_LENGTH}
              </span>
              <span className="hidden sm:inline text-[11px] text-slate-400">
                (Press{" "}
                <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-600 border border-slate-200/60">
                  Esc
                </kbd>{" "}
                to cancel)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isBusySaving}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={!isValidEdit}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#3457D5] transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        !isConfirmingDelete && (
          <div className="mt-3.5 text-sm sm:text-[15px] text-slate-800 leading-relaxed whitespace-pre-wrap break-words selection:bg-blue-100">
            {post.content}
          </div>
        )
      )}

      {/* 3. POST MEDIA ATTACHMENT DISPLAY (VIEW MODE) */}
      {!isEditing && post.mediaUrl && !imageError && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-slate-900/5 shadow-2xs flex items-center justify-center">
          <img
            src={post.mediaUrl}
            alt="Post attachment"
            className="max-h-[480px] sm:max-h-[520px] w-full object-contain transition-transform duration-300"
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Fallback for Broken Media Link */}
      {!isEditing && post.mediaUrl && imageError && (
        <div className="mt-3.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-400 flex items-center gap-2">
          <ImageOff className="h-4 w-4 shrink-0 text-slate-400" />
          <span>Image attachment could not be loaded.</span>
        </div>
      )}

      {/* 4. ENGAGEMENT SUMMARY ROW */}
      {((post.likesCount || 0) > 0 || (post.commentsCount || 0) > 0) && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100/90 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            {(post.likesCount || 0) > 0 && (
              <span className="flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500" />
                </span>
                <span className="font-medium text-slate-700">
                  {post.likesCount}
                </span>
                <span className="text-slate-400">
                  {post.likesCount === 1 ? "like" : "likes"}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(post.commentsCount || 0) > 0 && (
              <button
                type="button"
                onClick={() => setShowComments((prev) => !prev)}
                className="text-slate-500 hover:text-slate-800 hover:underline transition cursor-pointer"
              >
                <span>{post.commentsCount}</span>{" "}
                <span>{post.commentsCount === 1 ? "comment" : "comments"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. ACTION BAR: LIKE / COMMENT / SHARE */}
      <div className={`flex items-center justify-between gap-1 sm:gap-2 pt-2 text-xs font-medium text-slate-600 ${((post.likesCount || 0) === 0 && (post.commentsCount || 0) === 0) ? 'mt-4 border-t border-slate-100' : 'border-t border-slate-100/60 mt-2'}`}>
        {/* Like Button */}
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isLikePending}
          aria-label={isLiked ? "Unlike this post" : "Like this post"}
          aria-pressed={isLiked}
          title={isLiked ? "Unlike post" : "Like post"}
          className={`flex-1 group inline-flex min-h-[38px] items-center justify-center gap-2 rounded-xl px-3 py-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
            isLiked
              ? "bg-rose-50/90 text-rose-600 font-semibold hover:bg-rose-100/90"
              : "hover:bg-slate-50 hover:text-rose-600 text-slate-600"
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
              isLikePending ? "animate-pulse" : ""
            } ${
              isLiked
                ? "fill-rose-500 text-rose-500"
                : "text-slate-400 group-hover:text-rose-500"
            }`}
          />
          <span className="hidden sm:inline">
            {isLiked ? "Liked" : "Like"}
          </span>
          <span className="sm:hidden">
            {post.likesCount || (isLiked ? "1" : "Like")}
          </span>
        </button>

        {/* Comment Button */}
        <button
          type="button"
          onClick={() => setShowComments((prev) => !prev)}
          aria-expanded={showComments}
          aria-controls={`post-comments-${post._id}`}
          aria-label={
            showComments
              ? "Hide comments"
              : `View comments (${post.commentsCount || 0})`
          }
          title={showComments ? "Hide comments" : "View comments"}
          className={`flex-1 group inline-flex min-h-[38px] items-center justify-center gap-2 rounded-xl px-3 py-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30 active:scale-95 ${
            showComments
              ? "bg-blue-50/90 text-[#3C65F5] font-semibold hover:bg-blue-100/90"
              : "hover:bg-slate-50 hover:text-[#3C65F5] text-slate-600"
          }`}
        >
          <MessageSquare
            className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
              showComments
                ? "text-[#3C65F5]"
                : "text-slate-400 group-hover:text-[#3C65F5]"
            }`}
          />
          <span className="hidden sm:inline">Comment</span>
          <span className="sm:hidden">
            {post.commentsCount || "Comment"}
          </span>
        </button>

        {/* Share / Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Share or copy link to this post"
          title="Copy link to post"
          className="flex-1 group inline-flex min-h-[38px] items-center justify-center gap-2 rounded-xl px-3 py-2 transition-all duration-150 text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30 active:scale-95"
        >
          <Share2 className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:scale-110 group-hover:text-slate-700" />
          <span className="hidden sm:inline">Share</span>
          <span className="sm:hidden">Share</span>
        </button>
      </div>

      {/* 6. EXPANDABLE ON-DEMAND COMMENTS SECTION */}
      {showComments && (
        <div
          id={`post-comments-${post._id}`}
          className="mt-4 border-t border-slate-100 pt-4 animate-in fade-in-50 duration-200"
        >
          <PostComments postId={post._id} />
        </div>
      )}
    </article>
  );
}
