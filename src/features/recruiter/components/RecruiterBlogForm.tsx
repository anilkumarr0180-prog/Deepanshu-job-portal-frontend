import { useState, useId } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  X,
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
import { useBlogCategories } from "../hooks/useRecruiterBlogs";
import BlogContentEditor from "@/features/admin/components/BlogContentEditor";
import type {
  RecruiterBlogItem,
  RecruiterBlogStatus,
  CreateRecruiterBlogPayload,
  UpdateRecruiterBlogPayload,
} from "../types/recruiter-blog.types";

export interface RecruiterBlogFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  coverImageUrl: string;
  coverImagePublicId: string;
  coverImageAlt: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
}

interface RecruiterBlogFormProps {
  initialData?: RecruiterBlogItem;
  isEdit?: boolean;
  isSubmitting?: boolean;
  onSubmit: (
    payload: CreateRecruiterBlogPayload | UpdateRecruiterBlogPayload,
    targetStatus?: RecruiterBlogStatus
  ) => void;
  onCancel?: () => void;
  onUnpublish?: () => void;
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

export default function RecruiterBlogForm({
  initialData,
  isEdit = false,
  isSubmitting = false,
  onSubmit,
  onCancel,
  onUnpublish,
}: RecruiterBlogFormProps) {
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
  const [form, setForm] = useState<RecruiterBlogFormValues>(() => {
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
      metaTitle: initialData?.seo?.metaTitle ?? "",
      metaDescription: initialData?.seo?.metaDescription ?? "",
      keywords: initialData?.seo?.keywords ?? [],
      canonicalUrl: initialData?.seo?.canonicalUrl ?? "",
    };
  });

  // Track if slug was manually edited by user
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEdit);

  // Tag input buffer
  const [tagInput, setTagInput] = useState("");

  // Keyword input buffer
  const [keywordInput, setKeywordInput] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof RecruiterBlogFormValues>(
    field: K,
    value: RecruiterBlogFormValues[K]
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

  const handleTitleChange = (newTitle: string) => {
    setForm((prev) => ({
      ...prev,
      title: newTitle,
      slug: isSlugManuallyEdited ? prev.slug : slugify(newTitle),
    }));
    if (errors.title) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.title;
        return next;
      });
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    updateField("slug", slugify(e.target.value));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (form.tags.includes(trimmed)) {
      toast.error("Tag already added.");
      return;
    }
    if (form.tags.length >= 10) {
      toast.error("Maximum 10 tags allowed.");
      return;
    }
    updateField("tags", [...form.tags, trimmed]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateField(
      "tags",
      form.tags.filter((t) => t !== tagToRemove)
    );
  };

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (!trimmed) return;
    if (form.keywords.includes(trimmed)) {
      toast.error("Keyword already added.");
      return;
    }
    if (form.keywords.length >= 10) {
      toast.error("Maximum 10 keywords allowed.");
      return;
    }
    updateField("keywords", [...form.keywords, trimmed]);
    setKeywordInput("");
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    updateField(
      "keywords",
      form.keywords.filter((k) => k !== keywordToRemove)
    );
  };

  // Image Upload handler
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG, WebP, GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    try {
      const uploadRes = await uploadFile(file, "blog");
      if (uploadRes?.secure_url) {
        setForm((prev) => ({
          ...prev,
          coverImageUrl: uploadRes.secure_url,
          coverImagePublicId: uploadRes.public_id,
        }));
        toast.success("Cover image uploaded successfully!");
      }
    } catch {
      toast.error("Failed to upload image. Please try again.");
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

  // Validate form
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.title.trim()) {
      errs.title = "Title is required.";
    } else if (form.title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters.";
    } else if (form.title.trim().length > 250) {
      errs.title = "Title cannot exceed 250 characters.";
    }

    if (!form.excerpt.trim()) {
      errs.excerpt = "Excerpt is required.";
    } else if (form.excerpt.trim().length < 10) {
      errs.excerpt = "Excerpt must be at least 10 characters.";
    } else if (form.excerpt.trim().length > 600) {
      errs.excerpt = "Excerpt cannot exceed 600 characters.";
    }

    if (!form.content.trim()) {
      errs.content = "Article content is required.";
    } else if (form.content.trim().length < 10) {
      errs.content = "Article content must be at least 10 characters.";
    }

    if (!form.categoryId) {
      errs.categoryId = "Please select a category.";
    }

    if (form.slug.trim()) {
      const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugPattern.test(form.slug.trim())) {
        errs.slug =
          "Slug must only contain lowercase alphanumeric characters and single hyphens.";
      }
    }

    if (form.canonicalUrl.trim()) {
      try {
        new URL(form.canonicalUrl.trim());
      } catch {
        errs.canonicalUrl = "Please enter a valid URL (e.g. https://example.com/blog).";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAction = (targetStatus?: RecruiterBlogStatus) => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields properly.");
      return;
    }

    const payload: CreateRecruiterBlogPayload | UpdateRecruiterBlogPayload = {
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      excerpt: form.excerpt.trim(),
      content: form.content,
      categoryId: form.categoryId,
      coverImageUrl: form.coverImageUrl.trim() || undefined,
      coverImagePublicId: form.coverImagePublicId.trim() || undefined,
      coverImageAlt: form.coverImageAlt.trim() || undefined,
      tags: form.tags,
      readingTime: estimateReadingTime(form.content),
      status: targetStatus,
      seo: {
        metaTitle: form.metaTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
        keywords: form.keywords.length > 0 ? form.keywords : undefined,
        canonicalUrl: form.canonicalUrl.trim() || undefined,
      },
    };

    onSubmit(payload, targetStatus);
  };

  const currentStatus = String(initialData?.status ?? "draft").toLowerCase();
  const calculatedReadingTime = estimateReadingTime(form.content);

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-8"
    >
      {/* 1. Core Article Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:p-8">
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <BookOpen className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Article Details
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Provide a descriptive title, url slug, summary excerpt, and formatted article content.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Title Input */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-title`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Article Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                {form.title.length}/250 chars
              </span>
            </div>
            <input
              id={`${formId}-title`}
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Master Technical Hiring: Strategies for Engineering Leaders"
              className={`mt-1.5 h-11 w-full rounded-xl border bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-900 dark:text-slate-100 ${
                errors.title
                  ? "border-rose-300 dark:border-rose-800"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Slug Input */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-slug`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                URL Slug <span className="text-xs text-slate-400 font-normal">(Auto-generated, editable)</span>
              </label>
              {!isSlugManuallyEdited && (
                <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  Synced with title
                </span>
              )}
            </div>
            <div className="mt-1.5 flex rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
              <span className="inline-flex items-center px-3.5 text-xs text-slate-400 border-r border-slate-200 dark:border-slate-700">
                /blog/
              </span>
              <input
                id={`${formId}-slug`}
                type="text"
                value={form.slug}
                onChange={handleSlugChange}
                placeholder="master-technical-hiring-strategies-for-engineering-leaders"
                className="h-11 w-full bg-transparent px-3 text-xs font-mono text-slate-800 outline-none transition focus:bg-white dark:text-slate-200 dark:focus:bg-slate-900"
              />
            </div>
            {errors.slug && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.slug}
              </p>
            )}
          </div>

          {/* Excerpt Input */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-excerpt`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Summary Excerpt <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                {form.excerpt.length}/600 chars
              </span>
            </div>
            <textarea
              id={`${formId}-excerpt`}
              rows={3}
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              placeholder="Provide a concise 2-3 sentence teaser summary for search results and blog feed cards..."
              className={`mt-1.5 w-full rounded-xl border bg-white p-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-900 dark:text-slate-100 ${
                errors.excerpt
                  ? "border-rose-300 dark:border-rose-800"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {errors.excerpt && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.excerpt}
              </p>
            )}
          </div>

          {/* Rich Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Article Body Content <span className="text-rose-500">*</span>
              </label>
              <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                Est. ~{calculatedReadingTime} min read
              </span>
            </div>
            <BlogContentEditor
              value={form.content}
              onChange={(val) => updateField("content", val)}
              error={errors.content}
              placeholder="Write your article using markdown formatting or use the visual toolbar..."
              minHeight="420px"
            />
          </div>
        </div>
      </section>

      {/* 2. Cover Media Upload */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:p-8">
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <ImageIcon className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Cover Image
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Upload high-resolution header graphics (16:9 recommended, JPG, PNG, WebP up to 5MB).
          </p>
        </div>

        <div className="mt-6">
          {form.coverImageUrl ? (
            <div className="space-y-4">
              <div className="relative max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <img
                  src={form.coverImageUrl}
                  alt={form.coverImageAlt || "Blog cover preview"}
                  className="h-56 w-full object-cover"
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
                  placeholder="e.g. Executive conference room during team strategic planning"
                  className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
                      if (file) {
                        void handleImageUpload(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition hover:border-blue-500 hover:bg-blue-50/20 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-blue-500">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleImageUpload(file);
                  }
                }}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Uploading image... {progress}%
                  </p>
                  <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full bg-blue-600 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
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

      {/* 3. Category & Tags */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:p-8">
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Tag className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Category & Tags
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Categorize your article so candidates and engineering peers can find it easily.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Category Dropdown */}
          <div>
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
                  className="text-xs text-rose-500 hover:underline"
                >
                  Retry loading categories
                </button>
              )}
            </div>
            <select
              id={`${formId}-category`}
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              disabled={isLoadingCategories}
              className={`mt-1.5 h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 dark:bg-slate-900 dark:text-slate-100 ${
                errors.categoryId
                  ? "border-rose-300 dark:border-rose-800"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <option value="">
                {isLoadingCategories ? "Loading categories..." : "Select category"}
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
          <div>
            <label
              htmlFor={`${formId}-tag-input`}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Tags (Up to 10)
            </label>
            <div className="mt-1.5 flex gap-2">
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
                placeholder="Type tag and press Enter"
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                + Add
              </button>
            </div>

            {form.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-500 hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. SEO & Social Metadata */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:p-8">
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <Globe className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Search Engine Optimization (SEO)
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Customize how your post appears in Google search engine listings and social embeds.
          </p>
        </div>

        <div className="mt-6 space-y-6">
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
              placeholder="Search engine title snippet (defaults to article title)"
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
              placeholder="Search snippet description for Google and social previews (defaults to excerpt)"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Keywords */}
            <div>
              <label
                htmlFor={`${formId}-keyword-input`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                SEO Keywords
              </label>
              <div className="mt-1.5 flex gap-2">
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
                  className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  + Add
                </button>
              </div>
              {form.keywords.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {form.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 border border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-1 text-purple-500 hover:text-rose-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              {errors.canonicalUrl && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.canonicalUrl}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sticky Bottom Action Bar */}
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
              to="/recruiter/blogs"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Edit Mode specific unpublish action */}
          {isEdit && currentStatus === "published" && onUnpublish && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onUnpublish}
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
            >
              Unpublish to Draft
            </button>
          )}

          {/* Draft button */}
          <button
            type="button"
            disabled={isSubmitting || isUploading}
            onClick={() => handleAction("draft")}
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
              onClick={() =>
                handleAction(currentStatus === "published" ? undefined : "published")
              }
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : currentStatus === "published" ? (
                "Update Article"
              ) : (
                "Publish Now"
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting || isUploading}
              onClick={() => handleAction("published")}
              className="flex items-center gap-1.5 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
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
