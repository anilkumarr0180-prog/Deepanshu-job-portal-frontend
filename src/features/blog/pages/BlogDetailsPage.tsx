import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Check,
  Tag,
  AlertCircle,
  RefreshCw,
  BookOpen,
  Sparkles,
  Flame,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import { usePublicBlogBySlug, usePublicBlogs } from "../hooks/usePublicBlogs";
import { renderSafeMarkdown } from "@/features/admin/components/BlogContentEditor";
import PublicBlogCard from "../components/PublicBlogCard";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  } catch {
    return "";
  }
}

function getInitials(name?: string): string {
  if (!name) return "JB";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // 1. Fetch Blog by slug
  const {
    data: blog,
    isLoading,
    isError,
    refetch,
  } = usePublicBlogBySlug(slug);

  // 2. Fetch related blogs from the same category or trending
  const categorySlug =
    blog && typeof blog.categoryId === "object" && blog.categoryId !== null
      ? blog.categoryId.slug
      : undefined;

  const { data: relatedData } = usePublicBlogs({
    category: categorySlug,
    limit: 4,
    sort: "newest",
  });

  const relatedBlogs = (relatedData?.items ?? [])
    .filter((b) => b._id !== blog?._id && b.slug !== blog?.slug)
    .slice(0, 3);

  // 3. Dynamic SEO and Title Management
  useEffect(() => {
    if (blog) {
      const pageTitle = blog.seo?.metaTitle || `${blog.title} | JobBox Blog`;
      document.title = pageTitle;

      if (blog.seo?.metaDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.setAttribute("name", "description");
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", blog.seo.metaDescription);
      }
    }
    return () => {
      document.title = "JobBox - Modern Job Portal & Career Platform";
    };
  }, [blog]);

  // Social share helpers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Article link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(blog?.title || "");
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ---------------- Loading Skeleton State ---------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] dark:bg-[#080E1A] py-10">
        <div className="container mx-auto max-w-4xl px-4 space-y-6 animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />

          {/* Category pill */}
          <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />

          {/* Title skeleton */}
          <div className="space-y-3 pt-2">
            <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-3/4 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Author bar skeleton */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-44 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>

          {/* Cover image skeleton */}
          <div className="aspect-video w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />

          {/* Content lines skeleton */}
          <div className="space-y-4 pt-4">
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Error / Not Found State ---------------- */
  if (isError || !blog) {
    return (
      <div className="min-h-[70vh] bg-[#F8FAFD] dark:bg-[#080E1A] py-16 flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-[#05264E] dark:text-[#F1F5F9]">
            Article Not Found
          </h2>

          <p className="mt-2 text-sm text-[#66789C] dark:text-slate-400 leading-relaxed">
            The article you are looking for may have been moved, unpublished, or is no longer available.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-[#05264E] shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#131D2E] dark:text-slate-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>

            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#05264E]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Articles</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Populated Data Mapping ---------------- */
  const categoryName =
    typeof blog.categoryId === "object" && blog.categoryId !== null
      ? blog.categoryId.name
      : "News & Advice";

  const categorySlugVal =
    typeof blog.categoryId === "object" && blog.categoryId !== null
      ? blog.categoryId.slug
      : "";

  const authorName =
    typeof blog.authorId === "object" && blog.authorId !== null
      ? blog.authorId.name
      : "JobBox Editorial";

  const authorAvatar =
    typeof blog.authorId === "object" && blog.authorId !== null
      ? blog.authorId.profilePicture
      : undefined;

  const authorRole =
    typeof blog.authorId === "object" && blog.authorId !== null
      ? blog.authorId.role === "admin"
        ? "Lead Editor"
        : "Contributor"
      : "Editor";

  const dateFormatted =
    formatDate(blog.publishedAt) || formatDate(blog.createdAt);

  const readingTimeStr = blog.readingTime
    ? `${blog.readingTime} min read`
    : "3 min read";

  return (
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-[#080E1A] pb-24">
      {/* ── Top Header / Breadcrumbs Bar ── */}
      <div className="border-b border-[#E0E6F7] bg-white py-4 dark:border-[#1E293B] dark:bg-[#0B132B]">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-medium text-[#66789C] dark:text-slate-400">
              <Link to="/" className="hover:text-[#3C65F5] transition">
                Home
              </Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-[#3C65F5] transition">
                Blog
              </Link>
              {categorySlugVal && (
                <>
                  <span>/</span>
                  <Link
                    to={`/blog?category=${categorySlugVal}`}
                    className="hover:text-[#3C65F5] transition"
                  >
                    {categoryName}
                  </Link>
                </>
              )}
            </nav>

            <button
              type="button"
              onClick={() => (window.history.length > 2 ? navigate(-1) : navigate("/blog"))}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3C65F5] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Articles</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Article Container ── */}
      <article className="container mx-auto max-w-4xl px-4 pt-8">
        {/* Category Pill + Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {categorySlugVal ? (
            <Link
              to={`/blog?category=${categorySlugVal}`}
              className="inline-flex items-center rounded-full bg-[#EFF3FC] px-3.5 py-1 text-xs font-bold text-[#3C65F5] transition hover:bg-[#3C65F5] hover:text-white dark:bg-[#1E293B] dark:text-[#5E81FF]"
            >
              {categoryName}
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-full bg-[#EFF3FC] px-3.5 py-1 text-xs font-bold text-[#3C65F5] dark:bg-[#1E293B] dark:text-[#5E81FF]">
              {categoryName}
            </span>
          )}

          {blog.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Featured Article
            </span>
          )}

          {blog.isTrending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300">
              <Flame className="h-3.5 w-3.5 text-rose-500" />
              Trending Topic
            </span>
          )}
        </div>

        {/* Main Article Title */}
        <h1 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-[30px] sm:text-[38px] md:text-[44px] font-extrabold leading-[1.2] text-[#05264E] dark:text-[#F1F5F9]">
          {blog.title}
        </h1>

        {/* ── Author Bar & Article Meta ── */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E0E6F7] pb-6 dark:border-[#1E293B]">
          <div className="flex items-center gap-3.5">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EBF1FD] font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#3C65F5] dark:bg-[#1E293B] dark:text-[#5E81FF]">
                <span>{getInitials(authorName)}</span>
              </div>
            )}
            <div>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#05264E] dark:text-[#F1F5F9]">
                {authorName}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-[#66789C] dark:text-slate-400">
                <span className="font-medium text-[#3C65F5] dark:text-[#5E81FF]">
                  {authorRole}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {dateFormatted}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {readingTimeStr}
                </span>
                {blog.viewsCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      {blog.viewsCount} views
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              Share:
            </span>
            <button
              type="button"
              onClick={handleShareTwitter}
              aria-label="Share on X (Twitter)"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E0E6F7] bg-white text-slate-600 transition hover:border-[#3C65F5] hover:text-[#3C65F5] dark:border-[#1E293B] dark:bg-[#131D2E] dark:text-slate-300"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleShareLinkedIn}
              aria-label="Share on LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E0E6F7] bg-white text-slate-600 transition hover:border-[#3C65F5] hover:text-[#3C65F5] dark:border-[#1E293B] dark:bg-[#131D2E] dark:text-slate-300"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0 0-3.34 1.67 1.67 0 0 0 0 3.34m1.39 9.74v-8.37H5.07v8.37h2.78z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleShareFacebook}
              aria-label="Share on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E0E6F7] bg-white text-slate-600 transition hover:border-[#3C65F5] hover:text-[#3C65F5] dark:border-[#1E293B] dark:bg-[#131D2E] dark:text-slate-300"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy article link"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E0E6F7] bg-white text-slate-600 transition hover:border-[#3C65F5] hover:text-[#3C65F5] dark:border-[#1E293B] dark:bg-[#131D2E] dark:text-slate-300"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ── Featured Cover Image ── */}
        <div className="mt-8 overflow-hidden rounded-[20px] border border-[rgba(6,18,36,0.1)] bg-white shadow-sm dark:border-[#1E293B] dark:bg-[#131D2E]">
          {blog.coverImageUrl && !imgError ? (
            <img
              src={blog.coverImageUrl}
              alt={blog.coverImageAlt || blog.title}
              onError={() => setImgError(true)}
              className="h-[320px] sm:h-[420px] md:h-[480px] w-full object-cover"
            />
          ) : (
            <div className="flex h-[280px] w-full flex-col items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-8 text-center text-slate-400 dark:from-slate-800 dark:to-slate-900 dark:text-slate-600">
              <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">JobBox Editorial</p>
            </div>
          )}
        </div>

        {/* ── Lead Excerpt Callout ── */}
        {blog.excerpt && (
          <div className="mt-8 rounded-2xl border-l-4 border-[#3C65F5] bg-[#EFF3FC]/70 p-6 dark:bg-[#1E293B]/60">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-base sm:text-lg font-medium leading-relaxed text-[#05264E] dark:text-[#F1F5F9]">
              {blog.excerpt}
            </p>
          </div>
        )}

        {/* ── Main Article Body (Safe Markdown Rendering) ── */}
        <div className="mt-8 prose prose-slate max-w-none dark:prose-invert">
          <div className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            {renderSafeMarkdown(blog.content)}
          </div>
        </div>

        {/* ── Tags Section ── */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-[#E0E6F7] pt-6 dark:border-[#1E293B]">
            <span className="flex items-center gap-1 text-xs font-bold text-[#05264E] dark:text-[#F1F5F9] mr-2">
              <Tag className="h-3.5 w-3.5 text-[#3C65F5]" />
              Tags:
            </span>
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?search=${encodeURIComponent(tag)}`}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-[#3C65F5] hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-[#3C65F5]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* ── Author Bio Box ── */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#131D2E] sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm dark:border-slate-700"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF1FD] font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#3C65F5] dark:bg-[#1E293B] dark:text-[#5E81FF]">
                <span>{getInitials(authorName)}</span>
              </div>
            )}
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3C65F5] dark:text-[#5E81FF]">
                Written by
              </span>
              <h4 className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#05264E] dark:text-[#F1F5F9]">
                {authorName}
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-[#66789C] dark:text-slate-400 leading-relaxed">
                Sharing expert hiring insights, career preparation advice, and market intelligence to empower both job seekers and talent acquisition leaders.
              </p>
            </div>
          </div>
        </div>

        {/* ── Related Articles Section ── */}
        {relatedBlogs.length > 0 && (
          <section className="mt-16 border-t border-[#E0E6F7] pt-12 dark:border-[#1E293B]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#3C65F5]" />
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#05264E] dark:text-[#F1F5F9]">
                  Related Articles
                </h3>
              </div>
              <Link
                to="/blog"
                className="text-xs font-bold text-[#3C65F5] hover:underline"
              >
                View all articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((post) => (
                <PublicBlogCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
