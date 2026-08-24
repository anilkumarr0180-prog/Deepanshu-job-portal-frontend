import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Image as ImageIcon,
  Loader2,
  Send,
  Sparkles,
  X,
  PlusCircle,
  Trophy,
  Lightbulb,
  HelpCircle,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";
import { UserAvatar } from "@/shared/components/UserAvatar";
import useAuth from "@/features/auth/hooks/useAuth";
import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import { useCreatePost } from "../hooks/useCreatePost";

const MAX_CONTENT_LENGTH = 5000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const POST_SHORTCUTS = [
  {
    id: "milestone",
    label: "Milestone",
    icon: Trophy,
    prefix: "🎉 #Milestone: ",
    placeholder: "Excited to share a major career milestone...",
    colorClass: "text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200/70",
  },
  {
    id: "advice",
    label: "Career Advice",
    icon: Lightbulb,
    prefix: "💡 #CareerAdvice: ",
    placeholder: "Here is a key lesson I learned recently...",
    colorClass: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200/70",
  },
  {
    id: "question",
    label: "Ask Community",
    icon: HelpCircle,
    prefix: "❓ #AskJobBox: ",
    placeholder: "Looking for recommendations or feedback on...",
    colorClass: "text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200/70",
  },
  {
    id: "hiring",
    label: "Hiring / Tips",
    icon: Briefcase,
    prefix: "💼 #HiringTip: ",
    placeholder: "For anyone preparing for job applications...",
    colorClass: "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200/70",
  },
];

const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content cannot be empty.")
    .max(
      MAX_CONTENT_LENGTH,
      `Post content cannot exceed ${MAX_CONTENT_LENGTH} characters.`
    ),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CreatePostForm() {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: createPost, isPending: isPosting } = useCreatePost();
  const {
    uploadFile,
    isUploading,
    progress,
    reset: resetUpload,
  } = useCloudinaryUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    mode: "onSubmit",
    defaultValues: {
      content: "",
    },
  });

  const { ref: formRegisterRef, ...restRegister } = register("content");

  // Revoke object URL on cleanup
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Focus textarea when expanding
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  }, [isExpanded]);

  const contentValue = watch("content") || "";
  const charCount = contentValue.trim().length;
  const isNearLimit = charCount > MAX_CONTENT_LENGTH - 200;
  const isOverLimit = charCount > MAX_CONTENT_LENGTH;
  const isBusy = isUploading || isPosting;
  const isValidToPost = charCount > 0 && !isOverLimit && !isBusy;

  const handleExpand = (defaultPrefix?: string) => {
    setIsExpanded(true);
    if (defaultPrefix) {
      const current = contentValue.trim();
      if (!current.includes(defaultPrefix.trim())) {
        setValue("content", defaultPrefix + (current ? "\n\n" + current : ""));
      }
    }
  };

  const handleCollapse = () => {
    if (isBusy) return;
    if (charCount > 0 || selectedFile) {
      const confirmDiscard = window.confirm("Discard this draft post?");
      if (!confirmDiscard) return;
    }
    reset({ content: "" });
    handleRemoveImage();
    setIsExpanded(false);
  };

  const handleApplyShortcut = (prefix: string) => {
    const current = contentValue.trim();
    if (!current) {
      setValue("content", prefix);
    } else if (!current.includes(prefix.trim())) {
      setValue("content", prefix + "\n\n" + current);
    }
    textareaRef.current?.focus();
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      toast.error(
        "Invalid file format. Only JPG, PNG, WebP, and GIF images are allowed."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image file size exceeds 5MB limit.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    resetUpload();
    setIsExpanded(true);
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: CreatePostFormValues) => {
    if (isBusy) return;

    let mediaUrl: string | undefined = undefined;
    let mediaPublicId: string | undefined = undefined;

    if (selectedFile) {
      const uploadResult = await uploadFile(selectedFile, "post");
      if (!uploadResult) {
        return;
      }
      mediaUrl = uploadResult.secure_url;
      mediaPublicId = uploadResult.public_id;
    }

    createPost(
      {
        content: values.content.trim(),
        mediaUrl,
        mediaPublicId,
      },
      {
        onSuccess: () => {
          reset({ content: "" });
          handleRemoveImage();
          setIsExpanded(false);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (isValidToPost) {
        void handleSubmit(onSubmit)();
      }
    } else if (e.key === "Escape" && !isBusy) {
      if (charCount === 0 && !selectedFile) {
        setIsExpanded(false);
      }
    }
  };

  const getRoleBadgeClasses = (role?: string) => {
    switch (role?.toLowerCase()) {
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

  return (
    <section
      aria-label="Create a post composer"
      className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100"
    >
      {/* Hidden File Input (Always in DOM for trigger) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleImageSelect}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* COMPACT / COLLAPSED STATE */}
      {!isExpanded ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              src={user?.profilePicture}
              name={user?.name || "User"}
              size="md"
            />

            <button
              type="button"
              onClick={() => handleExpand()}
              aria-expanded={false}
              aria-label="Open post composer"
              className="flex-1 flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm text-slate-500 hover:bg-slate-100/70 hover:border-slate-300 transition-all duration-150 cursor-text shadow-2xs group"
            >
              <span className="truncate group-hover:text-slate-700">
                Share a career milestone, insight, or advice...
              </span>
              <Sparkles className="h-4 w-4 text-[#3C65F5] opacity-70 shrink-0 ml-2 group-hover:opacity-100 transition" />
            </button>
          </div>

          {/* Quick Post Type Shortcuts */}
          <div className="flex items-center justify-between gap-1.5 pt-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 flex-wrap">
              {POST_SHORTCUTS.map((shortcut) => {
                const IconComponent = shortcut.icon;
                return (
                  <button
                    key={shortcut.id}
                    type="button"
                    onClick={() => handleExpand(shortcut.prefix)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition active:scale-95 ${shortcut.colorClass}`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{shortcut.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setIsExpanded(true);
                  setTimeout(() => fileInputRef.current?.click(), 100);
                }}
                aria-label="Add photo to new post"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#3C65F5] hover:border-blue-200 transition active:scale-95"
              >
                <ImageIcon className="h-3.5 w-3.5 text-[#3C65F5]" />
                <span>Photo</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleExpand()}
              aria-label="Create a post"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#3457D5] transition shrink-0"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Post</span>
            </button>
          </div>
        </div>
      ) : (
        /* EXPANDED STATE */
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3.5 animate-in fade-in-50 duration-200"
          noValidate
        >
          {/* Header with User Info & Close / Collapse Button */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <UserAvatar
                src={user?.profilePicture}
                name={user?.name || "User"}
                size="md"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {user?.name || "You"}
                  </span>
                  {user?.role && (
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold capitalize ${getRoleBadgeClasses(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-0.5">
                  <Sparkles className="h-3 w-3 text-[#3C65F5]" />
                  Posting to JobBox Professional Network
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCollapse}
              disabled={isBusy}
              aria-label="Collapse post composer"
              title="Close composer (Esc)"
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30 disabled:opacity-40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Tag Insertion Toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400 mr-1">
              Add Tag:
            </span>
            {POST_SHORTCUTS.map((shortcut) => {
              const IconComponent = shortcut.icon;
              return (
                <button
                  key={shortcut.id}
                  type="button"
                  onClick={() => handleApplyShortcut(shortcut.prefix)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition active:scale-95 ${shortcut.colorClass}`}
                >
                  <IconComponent className="h-3 w-3" />
                  <span>{shortcut.label}</span>
                </button>
              );
            })}
          </div>

          {/* Textarea Input */}
          <div className="space-y-1.5">
            <label htmlFor="post-composer-input" className="sr-only">
              What do you want to share with the community?
            </label>
            <textarea
              id="post-composer-input"
              rows={4}
              {...restRegister}
              ref={(e) => {
                formRegisterRef(e);
                textareaRef.current = e;
              }}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind? Share career milestones, job search learnings, or industry insights..."
              disabled={isBusy}
              className="w-full resize-none rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-150 hover:bg-slate-50/80 focus:border-[#3C65F5] focus:bg-white focus:ring-2 focus:ring-[#3C65F5]/10 disabled:cursor-not-allowed disabled:opacity-60 leading-relaxed"
            />
          </div>

          {/* Validation Error */}
          {errors.content && (
            <p className="text-xs font-medium text-red-600">
              {errors.content.message}
            </p>
          )}

          {/* Selected Image Preview Card */}
          {previewUrl && selectedFile && (
            <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50 p-2 group/preview">
              <div className="relative max-h-72 w-full overflow-hidden rounded-lg bg-slate-900/5 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Post attachment preview"
                  className="max-h-72 w-full object-contain sm:object-cover"
                />

                {/* Progress Overlay during active upload */}
                {isUploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xs text-white p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                    <span className="text-xs font-semibold">
                      Uploading image ({progress}%)
                    </span>
                    <div className="mt-2.5 h-1.5 w-48 overflow-hidden rounded-full bg-white/30">
                      <div
                        className="h-full bg-[#3C65F5] transition-all duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Info & Remove Button */}
              {!isUploading && (
                <div className="mt-2 flex items-center justify-between gap-2 px-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 truncate min-w-0">
                    <span className="font-medium text-slate-700 truncate">
                      {selectedFile.name}
                    </span>
                    <span className="shrink-0 text-slate-400">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isBusy}
                    aria-label="Remove image"
                    title="Remove image"
                    className="inline-flex h-7 items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer: Character counter, Media action, Cancel & Submit Button */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Add Photo Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                aria-label="Add an image to post"
                title="Add photo (JPG, PNG, WebP, GIF up to 5MB)"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImageIcon className="h-3.5 w-3.5 text-[#3C65F5]" />
                <span>{selectedFile ? "Change Image" : "Add Image"}</span>
              </button>

              <span
                className={`text-xs font-medium ${
                  isOverLimit
                    ? "text-red-600 font-semibold"
                    : isNearLimit
                      ? "text-amber-600 font-medium"
                      : "text-slate-400"
                }`}
              >
                {charCount} / {MAX_CONTENT_LENGTH}
              </span>

              <span className="hidden text-[11px] text-slate-400 lg:inline">
                (Press{" "}
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 border border-slate-200/60">
                  Ctrl+Enter
                </kbd>{" "}
                to post)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCollapse}
                disabled={isBusy}
                className="inline-flex min-h-[38px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isValidToPost}
                className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-[#3457D5] hover:shadow-sm active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C65F5]/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : isPosting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
