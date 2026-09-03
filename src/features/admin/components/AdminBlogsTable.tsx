import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Edit,
  Trash2,
  Send,
  EyeOff,
  Archive,
  MoreVertical,
  Sparkles,
  Flame,
  Calendar,
  User,
  Eye,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import type { AdminBlogItem } from "../types/admin-blog.types";

export interface AdminBlogsTableProps {
  blogs: AdminBlogItem[];
  onDelete: (blog: AdminBlogItem) => void;
  onPublish: (blog: AdminBlogItem) => void;
  onUnpublish: (blog: AdminBlogItem) => void;
  onArchive?: (blog: AdminBlogItem) => void;
  isActionLoading?: boolean;
  mode?: "admin" | "candidate";
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  } catch {
    return "—";
  }
}

export default function AdminBlogsTable({
  blogs,
  onDelete,
  onPublish,
  onUnpublish,
  onArchive,
  isActionLoading = false,
  mode = "admin",
}: AdminBlogsTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isCandidate = mode === "candidate";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    if (activeMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuId]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0B1220]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
              <th scope="col" className="py-4 pl-6 pr-3">
                Blog Article
              </th>
              <th scope="col" className="px-3 py-4">
                Category
              </th>
              {!isCandidate ? (
                <th scope="col" className="px-3 py-4">
                  Author
                </th>
              ) : (
                <th scope="col" className="px-3 py-4">
                  Views
                </th>
              )}
              <th scope="col" className="px-3 py-4 text-center">
                Status
              </th>
              {!isCandidate && (
                <th scope="col" className="px-3 py-4 text-center">
                  Flags
                </th>
              )}
              <th scope="col" className="px-3 py-4">
                Published
              </th>
              <th scope="col" className="py-4 pl-3 pr-6 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
            {blogs.map((blog) => {
              const categoryName =
                typeof blog.categoryId === "object" && blog.categoryId !== null
                  ? blog.categoryId.name
                  : "Uncategorized";

              const authorName =
                typeof blog.authorId === "object" && blog.authorId !== null
                  ? blog.authorId.name
                  : "Admin";

              const authorEmail =
                typeof blog.authorId === "object" && blog.authorId !== null
                  ? blog.authorId.email
                  : "";

              const authorAvatar =
                typeof blog.authorId === "object" && blog.authorId !== null
                  ? blog.authorId.profilePicture
                  : undefined;

              const isDraft = String(blog.status).toLowerCase() === "draft";
              const isPublished = String(blog.status).toLowerCase() === "published";
              const isMenuOpen = activeMenuId === blog._id;
              const editUrl = isCandidate
                ? `/candidate/blogs/${blog._id}/edit`
                : `/admin/blogs/${blog._id}/edit`;

              return (
                <tr
                  key={blog._id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                >
                  {/* Article Title & Cover */}
                  <td className="py-4 pl-6 pr-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                        {blog.coverImageUrl ? (
                          <img
                            src={blog.coverImageUrl}
                            alt={blog.coverImageAlt || blog.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-600">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 max-w-xs sm:max-w-sm">
                        <Link
                          to={editUrl}
                          className="font-medium text-slate-900 line-clamp-1 transition-colors hover:text-emerald-600 dark:text-slate-100 dark:hover:text-emerald-400"
                          title={blog.title}
                        >
                          {blog.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-1 dark:text-slate-400">
                          /{blog.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {categoryName}
                    </span>
                  </td>

                  {/* Author / Views */}
                  {!isCandidate ? (
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        {authorAvatar ? (
                          <img
                            src={authorAvatar}
                            alt={authorName}
                            className="h-7 w-7 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            <User className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {authorName}
                          </p>
                          {authorEmail && (
                            <p className="truncate text-[11px] text-slate-400">
                              {authorEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  ) : (
                    <td className="px-3 py-4 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Eye className="h-3.5 w-3.5 text-slate-400" />
                        {blog.viewsCount || 0}
                      </div>
                    </td>
                  )}

                  {/* Status */}
                  <td className="px-3 py-4 text-center">
                    <StatusBadge status={blog.status} />
                  </td>

                  {/* Flags (Featured / Trending - Admin only) */}
                  {!isCandidate && (
                    <td className="px-3 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {blog.isFeatured && (
                          <span
                            title="Featured Post"
                            className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40"
                          >
                            <Sparkles className="h-3 w-3 text-amber-500" />
                            Featured
                          </span>
                        )}
                        {blog.isTrending && (
                          <span
                            title="Trending Post"
                            className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                          >
                            <Flame className="h-3 w-3 text-rose-500" />
                            Trending
                          </span>
                        )}
                        {!blog.isFeatured && !blog.isTrending && (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                  )}

                  {/* Published Date */}
                  <td className="px-3 py-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {blog.publishedAt
                        ? formatDate(blog.publishedAt)
                        : isDraft
                        ? "Draft"
                        : formatDate(blog.createdAt)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pl-3 pr-6 text-right">
                    <div className="relative inline-flex items-center justify-end gap-1">
                      {/* Primary Edit Link */}
                      <Link
                        to={editUrl}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Link>

                      {/* Dropdown Menu Toggle */}
                      <button
                        type="button"
                        aria-label="More actions"
                        disabled={isActionLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : blog._id);
                        }}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu Modal / Popover */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-full z-20 mt-1.5 w-44 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                        >
                          {/* View Live (Published - available for Candidate & Admin) */}
                          {isPublished && (
                            <Link
                              to={`/blog/${blog.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setActiveMenuId(null)}
                              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              View Live
                            </Link>
                          )}

                          {/* Publish (allowed for Draft) */}
                          {isDraft && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onPublish(blog);
                              }}
                              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Publish Blog
                            </button>
                          )}

                          {/* Unpublish (allowed for Published) */}
                          {isPublished && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onUnpublish(blog);
                              }}
                              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium text-amber-600 transition hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                            >
                              <EyeOff className="h-3.5 w-3.5" />
                              Unpublish (Draft)
                            </button>
                          )}

                          {/* Archive (allowed for Published - Admin only) */}
                          {!isCandidate && isPublished && onArchive && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onArchive(blog);
                              }}
                              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/40"
                            >
                              <Archive className="h-3.5 w-3.5" />
                              Archive Blog
                            </button>
                          )}

                          {/* Delete (allowed for all statuses) */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDelete(blog);
                            }}
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Blog
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
