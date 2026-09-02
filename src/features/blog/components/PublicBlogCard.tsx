import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Flame, Image as ImageIcon } from "lucide-react";
import type { PublicBlogItem } from "../types/blog.types";

interface PublicBlogCardProps {
  post: PublicBlogItem;
}

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

export default function PublicBlogCard({ post }: PublicBlogCardProps) {
  const [imgError, setImgError] = useState(false);

  const categoryName =
    typeof post.categoryId === "object" && post.categoryId !== null
      ? post.categoryId.name
      : "Articles";

  const authorName =
    typeof post.authorId === "object" && post.authorId !== null
      ? post.authorId.name
      : "JobBox Team";

  const authorAvatar =
    typeof post.authorId === "object" && post.authorId !== null
      ? post.authorId.profilePicture
      : undefined;

  const dateFormatted =
    formatDate(post.publishedAt) || formatDate(post.createdAt);

  const readTimeStr = post.readingTime
    ? `${post.readingTime} min read`
    : "3 min read";

  // Public target link: /blog/:slug (or fallback /blog/:id)
  const blogLink = `/blog/${post.slug || post._id}`;

  return (
    <article className="card-grid-3 hover-up group flex h-full flex-col overflow-hidden rounded-[16px] border border-[rgba(6,18,36,0.1)] bg-white transition-all duration-300 hover:border-[#3C65F5] hover:shadow-[0_10px_25px_rgba(6,18,36,0.06)] hover:-translate-y-1 dark:border-[#1E293B] dark:bg-[#131D2E] select-none">
      {/* Image Container with 10px outer padding matching JobBox card-grid-3-image */}
      <div className="card-grid-3-image relative w-full p-[10px]">
        <Link to={blogLink} className="block relative h-[210px] w-full overflow-hidden rounded-[12px] bg-slate-100 dark:bg-slate-800">
          {post.coverImageUrl && !imgError ? (
            <img
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-[12px]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-4 text-center text-slate-400 dark:from-slate-800 dark:to-slate-900 dark:text-slate-600">
              <ImageIcon className="h-8 w-8 mb-1 opacity-50" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">JobBox Blog</span>
            </div>
          )}
        </Link>

        {/* Featured / Trending Overlay Badges */}
        <div className="absolute left-[20px] top-[20px] flex flex-col gap-1 z-10 pointer-events-none">
          {post.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs backdrop-blur-xs">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
          {post.isTrending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs backdrop-blur-xs">
              <Flame className="h-3 w-3" />
              Trending
            </span>
          )}
        </div>
      </div>

      {/* Card Body Info */}
      <div className="card-block-info flex flex-1 flex-col px-[20px] pb-[20px] pt-[10px]">
        {/* Category Badge */}
        <div className="tags-mb mb-[12px]">
          <span className="inline-block rounded-[6px] bg-[#EFF3FC] px-[12px] py-[4px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-bold text-[#3C65F5] dark:bg-[#1E293B] dark:text-[#5E81FF]">
            {categoryName}
          </span>
        </div>

        {/* Blog Title: 20px font-bold */}
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[20px] font-bold leading-[28px] text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9] dark:group-hover:text-[#5E81FF] line-clamp-2 min-h-[56px]">
          <Link to={blogLink} title={post.title}>
            {post.title}
          </Link>
        </h3>

        {/* Blog Excerpt */}
        <p className="mt-[10px] mb-[15px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#4F5E64] dark:text-slate-400 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* Author + Reading Time row */}
        <div className="card-2-bottom mt-auto flex items-center justify-between border-t border-[#E0E6F7] pt-[15px] dark:border-[#1E293B]">
          {/* Author info */}
          <div className="flex items-center gap-[10px]">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-[36px] w-[36px] shrink-0 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EBF1FD] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-bold text-[#3C65F5] dark:bg-[#1E293B] dark:text-[#5E81FF]">
                <span>{getInitials(authorName)}</span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-bold leading-[18px] text-[#05264E] dark:text-[#F1F5F9] truncate max-w-[120px] sm:max-w-[140px]">
                {authorName}
              </span>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] leading-[16px] text-[#A0ABB8] dark:text-slate-400">
                {dateFormatted}
              </span>
            </div>
          </div>

          {/* Reading time */}
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-[#A0ABB8] dark:text-slate-400 shrink-0">
            {readTimeStr}
          </span>
        </div>
      </div>
    </article>
  );
}
