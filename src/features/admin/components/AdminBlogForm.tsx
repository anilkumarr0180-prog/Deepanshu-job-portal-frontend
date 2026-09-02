import { useState, useId, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  X,
  Sparkles,
  Flame,
  Globe,
  Tag,
  BookOpen,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import { useBlogCategories } from "../hooks/useAdminBlogs";
import BlogContentEditor from "./BlogContentEditor";
import type {
  AdminBlogItem,
  BlogStatus,
  CreateBlogPayload,
  UpdateBlogPayload,
} from "../types/admin-blog.types";

export interface AdminBlogFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  coverImageUrl: string;
  coverImagePublicId: string;
  coverImageAlt: string;
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
}

interface AdminBlogFormProps {
  initialData?: AdminBlogItem;
  isEdit?: boolean;
  isSubmitting?: boolean;
  onSubmit: (
    payload: CreateBlogPayload | UpdateBlogPayload,
    targetStatus?: BlogStatus
  ) => void;
  onCancel?: () => void;
  onUnpublish?: () => void;
  onArchive?: () => void;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadingTime(content: string): number {
  if (!content) return 1;
  const clean = content.replace(/<[^>]*>?/gm, "").replace(/[#*`_~[\]]/g, "");
  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function AdminBlogForm({
  initialData,
  isEdit = false,
  isSubmitting = false,
  onSubmit,
  onCancel,
  onUnpublish,
  onArchive,
}: AdminBlogFormProps) {
  const formId = useId();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useBlogCategories();

  // Cloudinary Upload hook
  const { uploadFile, isUploading, progress } = useCloudinaryUpload();

  // Form state
  const [form, setForm] = useState<AdminBlogFormValues>(() => {
    const rawCategory = initialData?.categoryId;
    const initialCategoryId =
      typeof rawCategory === "object" && rawCategory !== null
        ? rawCategory._id
        : typeof rawCategory === "string"
        ? rawCategory
        : "";

    return {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      excerpt: initialData?.excerpt ?? "",
      content: initialData?.content ?? "",
      categoryId: initialCategoryId,
      coverImageUrl: initialData?.coverImageUrl ?? "",
      coverImagePublicId: initialData?.coverImagePublicId ?? "",
      coverImageAlt: initialData?.coverImageAlt ?? "",
      tags: initialData?.tags ?? [],
      isFeatured: initialData?.isFeatured ?? false,
      isTrending: initialData?.isTrending ?? false,
      metaTitle: initialData?.seo?.metaTitle ?? "",
      metaDescription: initialData?.seo?.metaDescription ?? "",
      keywords: initialData?.seo?.keywords ?? [],
      canonicalUrl: initialData?.seo?.canonicalUrl ?? "",
    };
  });

  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(Boolean(isEdit && initialData?.slug));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync state if initialData loads after mount
  useEffect(() => {
    if (initialData) {
      const rawCategory = initialData.categoryId;
      const catId =
        typeof rawCategory === "object" && rawCategory !== null
          ? rawCategory._id
          : typeof rawCategory === "string"
          ? rawCategory
          : "";

      setForm({
        title: initialData.title ?? "",
        slug: initialData.slug ?? "",
        excerpt: initialData.excerpt ?? "",
        content: initialData.content ?? "",
        categoryId: catId,
        coverImageUrl: initialData.coverImageUrl ?? "",
        coverImagePublicId: initialData.coverImagePublicId ?? "",
        coverImageAlt: initialData.coverImageAlt ?? "",
        tags: initialData.tags ?? [],
        isFeatured: initialData.isFeatured ?? false,
        isTrending: initialData.isTrending ?? false,
        metaTitle: initialData.seo?.metaTitle ?? "",
        metaDescription: initialData.seo?.metaDescription ?? "",
        keywords: initialData.seo?.keywords ?? [],
        canonicalUrl: initialData.seo?.canonicalUrl ?? "",
      });
      setIsSlugManual(true);
    }
  }, [initialData]);

  const updateField = <K extends keyof AdminBlogFormValues>(
    field: K,
    value: AdminBlogFormValues[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Title change with auto-slug
  const handleTitleChange = (newTitle: string) => {
    updateField("title", newTitle);
    if (!isSlugManual) {
      updateField("slug", slugify(newTitle));
    }
  };

  // Slug change
  const handleSlugChange = (newSlug: string) => {
    setIsSlugManual(true);
    updateField("slug", slugify(newSlug));
  };

  // Image upload
  const handleImageUpload = async (file: File) => {
    const result = await uploadFile(file, "blog");
    if (result) {
      setForm((prev) => ({
        ...prev,
        coverImageUrl: result.secure_url,
        coverImagePublicId: result.public_id,
      }));
      toast.success("Cover image uploaded successfully.");
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      coverImageUrl: "",
      coverImagePublicId: "",
      coverImageAlt: "",
    }));
  };

  // Tags management
  const handleAddTag = () => {
    const val = tagInput.trim().toLowerCase();
    if (!val) return;
    if (form.tags.includes(val)) {
      toast.error("Tag already added.");
      return;
    }
    updateField("tags", [...form.tags, val]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateField(
      "tags",
      form.tags.filter((t) => t !== tagToRemove)
    );
  };

  // Keyword management
  const handleAddKeyword = () => {
    const val = keywordInput.trim();
    if (!val) return;
    if (form.keywords.includes(val)) {
      toast.error("Keyword already added.");
      return;
    }
    updateField("keywords", [...form.keywords, val]);
    setKeywordInput("");
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    updateField(
      "keywords",
      form.keywords.filter((k) => k !== keywordToRemove)
    );
  };

  // Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.title.trim() || form.title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters long.";
    } else if (form.title.trim().length > 250) {
      errs.title = "Title cannot exceed 250 characters.";
    }

    if (form.slug.trim() && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
      errs.slug = "Slug must contain only lowercase letters, numbers, and hyphens.";
    }

    if (!form.excerpt.trim() || form.excerpt.trim().length < 10) {
      errs.excerpt = "Excerpt must be at least 10 characters long.";
    } else if (form.excerpt.trim().length > 600) {
      errs.excerpt = "Excerpt cannot exceed 600 characters.";
    }

    if (!form.content.trim() || form.content.trim().length < 10) {
      errs.content = "Content must be at least 10 characters long.";
    }

    if (!form.categoryId) {
      errs.categoryId = "Please select a category for this blog.";
    }

    if (form.canonicalUrl.trim()) {
      try {
        new URL(form.canonicalUrl.trim());
      } catch {
        errs.canonicalUrl = "Please enter a valid canonical URL (e.g. https://example.com/blog).";
      }
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      toast.error(errs[firstKey]);
      return false;
    }

    return true;
  };

  const buildPayload = (statusOverride?: BlogStatus): CreateBlogPayload => {
    const payload: CreateBlogPayload = {
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      categoryId: form.categoryId,
      coverImageUrl: form.coverImageUrl.trim() || undefined,
      coverImagePublicId: form.coverImagePublicId.trim() || undefined,
      coverImageAlt: form.coverImageAlt.trim() || undefined,
      tags: form.tags,
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      seo: {
        metaTitle: form.metaTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
        keywords: form.keywords.length > 0 ? form.keywords : undefined,
        canonicalUrl: form.canonicalUrl.trim() || undefined,
      },
    };

    if (statusOverride) {
      payload.status = statusOverride;
    }

    return payload;
  };

  const handleAction = (statusOverride?: BlogStatus) => {
    if (!validateForm()) return;
    const payload = buildPayload(statusOverride);
    onSubmit(payload, statusOverride);
  };

  const currentStatus = initialData?.status ?? "DRAFT";
  const readingTimeEst = estimateReadingTime(form.content);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAction();
      }}
      className="space-y-8 pb-32"
    >
      {/* 1. Article Content Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:p-8">
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Article Content
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Write the primary title, slug, excerpt summary, and full body content.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor={`${formId}-title`}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Blog Title <span className="text-rose-500">*</span>
            </label>
            <input
              id={`${formId}-title`}
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. 10 Proven Job Hunting Strategies for 2026"
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            {errors.title && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-slug`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                URL Slug
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsSlugManual(false);
                  updateField("slug", slugify(form.title));
                }}
                className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Reset from title
              </button>
            </div>
            <div className="mt-1.5 flex rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              <span className="inline-flex items-center rounded-l-xl bg-slate-50 px-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                /blog/
              </span>
              <input
                id={`${formId}-slug`}
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="10-proven-job-hunting-strategies"
                className="h-11 flex-1 rounded-r-xl bg-transparent px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:text-slate-100"
              />
            </div>
            {errors.slug && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.slug}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-excerpt`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Excerpt Summary <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                {form.excerpt.length}/600 chars
              </span>
            </div>
            <textarea
              id={`${formId}-excerpt`}
              rows={3}
              required
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              placeholder="A concise summary of the article displayed on blog cards and search engines."
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            {errors.excerpt && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.excerpt}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-content`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Article Body Content <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Est. reading time: ~{readingTimeEst} min</span>
              </div>
            </div>
            <div className="mt-1.5">
              <BlogContentEditor
                value={form.content}
                onChange={(val) => updateField("content", val)}
                disabled={isSubmitting}
                error={errors.content}
                placeholder="Write your article in Markdown or structured rich text format with headings, bold, bullet points, links, and code blocks..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Media & Cover Image Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:p-8">
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Cover Image & Media
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Upload a banner image to represent this blog post across the platform.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {form.coverImageUrl ? (
            <div className="space-y-4">
              <div className="relative aspect-video max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                <img
                  src={form.coverImageUrl}
                  alt={form.coverImageAlt || "Blog cover preview"}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-3 top-3 rounded-full bg-slate-900/75 p-2 text-white shadow-md transition hover:bg-rose-600"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-w-xl">
                <label
                  htmlFor={`${formId}-alt`}
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Cover Image Alt Text (for SEO & accessibility)
                </label>
                <input
                  id={`${formId}-alt`}
                  type="text"
                  value={form.coverImageAlt}
                  onChange={(e) => updateField("coverImageAlt", e.target.value)}
                  placeholder="e.g. Modern workspace with a laptop showing job dashboard"
                  className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Upload className="h-3.5 w-3.5" />
                  Replace Image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleImageUpload(file);
                    }}
                  />
                </label>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition hover:border-emerald-500 hover:bg-emerald-50/20 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-emerald-500">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImageUpload(file);
                }}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Uploading image... {progress}%
                  </p>
                  <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Click to upload cover image
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    JPG, PNG, WebP or GIF up to 5MB
                  </p>
                </div>
              )}
            </label>
          )}
        </div>
      </section>

      {/* 3. Classification & Flags */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:p-8">
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Category, Tags & Visibility
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Organize the article into categories, assign keywords, and set promotional highlights.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Category Dropdown */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-category`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Category <span className="text-rose-500">*</span>
              </label>
              {isCategoriesError && (
                <button
                  type="button"
                  onClick={() => {
                    void refetchCategories();
                  }}
                  className="text-xs font-medium text-rose-600 hover:underline dark:text-rose-400"
                >
                  Retry loading categories
                </button>
              )}
            </div>
            <select
              id={`${formId}-category`}
              required
              disabled={isLoadingCategories}
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">
                {isLoadingCategories
                  ? "Loading categories..."
                  : isCategoriesError
                  ? "Unable to load categories. Please try again."
                  : (categories ?? []).length === 0
                  ? "No categories available"
                  : "Select a Category"}
              </option>
              {(categories ?? []).map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.categoryId}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label
              htmlFor={`${formId}-tag-input`}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Tags
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Tag className="h-3 w-3 text-slate-400" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-slate-400 hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                id={`${formId}-tag-input`}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type tag (e.g. career, interview, resume) and press Enter"
                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                + Add Tag
              </button>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Featured Post
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Display prominently on top banners & home page.
                </p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-slate-700" />
            </label>
          </div>

          {/* Trending Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Trending Post
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pin to trending feeds and recommended reading sidebar.
                </p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={form.isTrending}
                onChange={(e) => updateField("isTrending", e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-rose-500 peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-slate-700" />
            </label>
          </div>
        </div>
      </section>

      {/* 4. SEO & Metadata */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:p-8">
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              SEO & Social Metadata
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Configure how this article looks in Google search results and shared social cards.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {/* Meta Title */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-meta-title`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Meta Title
              </label>
              <span className="text-xs text-slate-400">
                {form.metaTitle.length}/150 chars
              </span>
            </div>
            <input
              id={`${formId}-meta-title`}
              type="text"
              value={form.metaTitle}
              onChange={(e) => updateField("metaTitle", e.target.value)}
              placeholder={form.title || "Custom search title (defaults to blog title)"}
              className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-meta-description`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Meta Description
              </label>
              <span className="text-xs text-slate-400">
                {form.metaDescription.length}/300 chars
              </span>
            </div>
            <textarea
              id={`${formId}-meta-description`}
              rows={2}
              value={form.metaDescription}
              onChange={(e) => updateField("metaDescription", e.target.value)}
              placeholder="Search snippet description for Google and social previews"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Keywords */}
          <div>
            <label
              htmlFor={`${formId}-keyword-input`}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              SEO Keywords
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-1 text-emerald-500 hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                id={`${formId}-keyword-input`}
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="Type keyword and press Enter"
                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                + Add Keyword
              </button>
            </div>
          </div>

          {/* Canonical URL */}
          <div>
            <label
              htmlFor={`${formId}-canonical`}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Canonical URL
            </label>
            <input
              id={`${formId}-canonical`}
              type="url"
              value={form.canonicalUrl}
              onChange={(e) => updateField("canonicalUrl", e.target.value)}
              placeholder="https://example.com/original-article-source"
              className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            {errors.canonicalUrl && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.canonicalUrl}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. Sticky Bottom Form Action Bar */}
      <div className="sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md dark:border-slate-800/90 dark:bg-[#0B1220]/95 dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] sm:p-5">
        <div className="flex items-center gap-2">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          ) : (
            <Link
              to="/admin/blogs"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Edit Mode specific lifecycle transitions */}
          {isEdit && currentStatus === "PUBLISHED" && (
            <>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onUnpublish}
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              >
                Unpublish to Draft
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onArchive}
                className="rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                Archive Post
              </button>
            </>
          )}

          {/* Draft button */}
          <button
            type="button"
            disabled={isSubmitting || isUploading}
            onClick={() => handleAction("DRAFT")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </span>
            ) : isEdit ? (
              "Save Draft"
            ) : (
              "Save as Draft"
            )}
          </button>

          {/* Primary Action / Publish button */}
          {isEdit ? (
            <button
              type="button"
              disabled={isSubmitting || isUploading}
              onClick={() => handleAction(currentStatus === "PUBLISHED" ? undefined : "PUBLISHED")}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : currentStatus === "PUBLISHED" ? (
                "Update Article"
              ) : (
                "Publish Now"
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting || isUploading}
              onClick={() => handleAction("PUBLISHED")}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <BookOpen className="h-3.5 w-3.5" />
                  Publish Article
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
