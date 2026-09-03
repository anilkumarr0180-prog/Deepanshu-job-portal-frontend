import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  BookOpen,
  Sparkles,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileEdit,
  ExternalLink,
  Send,
  ArchiveRestore,
  Loader2,
} from "lucide-react";

import {
  useRecruiterBlogs,
  useBlogCategories,
  useDeleteRecruiterBlog,
  usePublishRecruiterBlog,
  useUnpublishRecruiterBlog,
} from "../hooks/useRecruiterBlogs";
import type { RecruiterBlogItem, RecruiterBlogStatus } from "../types/recruiter-blog.types";

export default function RecruiterBlogsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "views" | "title">("newest");
  const [page, setPage] = useState(1);

  const [blogToDelete, setBlogToDelete] = useState<RecruiterBlogItem | null>(null);

  // Queries & Mutations
  const { data: categories } = useBlogCategories();

  const queryStatus: RecruiterBlogStatus | "all" =
    statusFilter === "Published"
      ? "published"
      : statusFilter === "Draft"
      ? "draft"
      : "all";

  const selectedCategoryObj = (categories ?? []).find(
    (c) => c.name === categoryFilter
  );
  const queryCategory =
    categoryFilter === "All Categories" ? undefined : selectedCategoryObj?._id || categoryFilter;

  const { data, isLoading, isError, refetch } = useRecruiterBlogs({
    page,
    limit: 10,
    search: search.trim() || undefined,
    status: queryStatus,
    category: queryCategory,
    sort: sortBy,
  });

  const deleteMutation = useDeleteRecruiterBlog();
  const publishMutation = usePublishRecruiterBlog();
  const unpublishMutation = useUnpublishRecruiterBlog();

  const handleConfirmDelete = () => {
    if (!blogToDelete) return;
    deleteMutation.mutate(blogToDelete._id, {
      onSettled: () => setBlogToDelete(null),
    });
  };

  const handlePublish = (blog: RecruiterBlogItem) => {
    publishMutation.mutate(blog._id);
  };

  const handleUnpublish = (blog: RecruiterBlogItem) => {
    unpublishMutation.mutate(blog._id);
  };

  const blogsList = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  // Compute summary stats
  const totalBlogs = pagination?.totalItems ?? 0;
  const publishedCount = blogsList.filter((b) => String(b.status).toLowerCase() === "published").length;
  const draftCount = blogsList.filter((b) => String(b.status).toLowerCase() === "draft").length;
  const totalViews = blogsList.reduce((acc, b) => acc + (b.viewsCount || 0), 0);

  const categoryOptions = [
    "All Categories",
    ...(categories ?? []).map((c) => c.name),
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-10 right-1/3 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Recruiter Author Studio
              </span>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-extrabold text-blue-200 border border-blue-400/30">
                {totalBlogs} Articles
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              My Blogs
            </h1>
            <p className="max-w-xl text-sm text-slate-300 leading-relaxed">
              Publish company culture insights, hiring guides, and leadership articles across the entire JobBox community.
            </p>
          </div>

          <Link
            to="/recruiter/blogs/create"
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Write New Blog</span>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm sm:p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <BookOpen className="h-3.5 w-3.5 text-blue-400" /> Total Posts
            </div>
            <p className="mt-1.5 text-2xl font-black text-white">{totalBlogs}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm sm:p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Published
            </div>
            <p className="mt-1.5 text-2xl font-black text-emerald-400">{publishedCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm sm:p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <FileEdit className="h-3.5 w-3.5 text-amber-400" /> Drafts
            </div>
            <p className="mt-1.5 text-2xl font-black text-amber-400">{draftCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm sm:p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Eye className="h-3.5 w-3.5 text-purple-400" /> Total Views
            </div>
            <p className="mt-1.5 text-2xl font-black text-white">{totalViews}</p>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="flex flex-col gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search blogs by title, keywords, or content..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {categoryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {/* Sort filter */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "newest" | "oldest" | "views" | "title");
              setPage(1);
            }}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="views">Most Views</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      {/* 3. Blogs Content */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B1220]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Loading your articles...
          </p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-12 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
            Failed to load articles.
          </p>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      ) : blogsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#0B1220]">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
            No articles found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            {search || statusFilter !== "All" || categoryFilter !== "All Categories"
              ? "No blogs match your filter criteria. Try adjusting your search query."
              : "You haven't written any recruiter blogs yet. Share your hiring strategies and company culture insights!"}
          </p>
          <Link
            to="/recruiter/blogs/create"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Write Your First Blog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0B1220]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Article</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Views</th>
                    <th className="px-4 py-3.5">Dates</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {blogsList.map((blog) => {
                    const catName =
                      typeof blog.categoryId === "object" && blog.categoryId !== null
                        ? blog.categoryId.name
                        : "General";
                    const isPublished = String(blog.status).toLowerCase() === "published";

                    return (
                      <tr
                        key={blog._id}
                        className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                      >
                        {/* Title & Cover */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            {blog.coverImageUrl ? (
                              <img
                                src={blog.coverImageUrl}
                                alt={blog.title}
                                className="h-12 w-16 flex-shrink-0 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                              />
                            ) : (
                              <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                                <BookOpen className="h-5 w-5" />
                              </div>
                            )}
                            <div className="min-w-0 max-w-sm">
                              <Link
                                to={`/recruiter/blogs/${blog._id}/edit`}
                                className="line-clamp-1 font-bold text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
                              >
                                {blog.title}
                              </Link>
                              <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                                {blog.excerpt}
                              </p>
                              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                                <span className="flex items-center gap-1 font-mono">
                                  /blog/{blog.slug}
                                </span>
                                <span>•</span>
                                <span>~{blog.readingTime || 1} min read</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {catName}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Draft
                            </span>
                          )}
                        </td>

                        {/* Views */}
                        <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <Eye className="h-3.5 w-3.5 text-slate-400" />
                            {blog.viewsCount || 0}
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="px-4 py-4 whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400">
                          <div>
                            Created: {new Date(blog.createdAt).toLocaleDateString()}
                          </div>
                          {blog.publishedAt && (
                            <div className="text-emerald-600 dark:text-emerald-400">
                              Pub: {new Date(blog.publishedAt).toLocaleDateString()}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPublished && (
                              <Link
                                to={`/blog/${blog.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                                title="View Live Blog"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            )}

                            {isPublished ? (
                              <button
                                type="button"
                                onClick={() => handleUnpublish(blog)}
                                disabled={unpublishMutation.isPending}
                                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/40"
                                title="Unpublish to Draft"
                              >
                                <ArchiveRestore className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handlePublish(blog)}
                                disabled={publishMutation.isPending}
                                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40"
                                title="Publish Article"
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            )}

                            <Link
                              to={`/recruiter/blogs/${blog._id}/edit`}
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                              title="Edit Article"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setBlogToDelete(blog)}
                              disabled={deleteMutation.isPending}
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                              title="Delete Article"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3.5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
                <span>
                  Page {page} of {totalPages} ({totalBlogs} articles)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 font-semibold disabled:opacity-40 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 font-semibold disabled:opacity-40 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0B1220] sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              Delete Article?
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{blogToDelete.title}"</span>? This will soft-delete your article and remove it from public search feeds.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                disabled={deleteMutation.isPending}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
