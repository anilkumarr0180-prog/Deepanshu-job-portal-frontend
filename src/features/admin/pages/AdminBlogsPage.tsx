import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  BookOpen,
  Sparkles,
  CheckCircle2,
  FileEdit,
  Eye,
  Loader2,
} from "lucide-react";

import AdminBlogsTable from "../components/AdminBlogsTable";
import DeleteModal from "../components/DeleteModal";
import Pagination from "../components/Pagination";

import {
  useAdminBlogs,
  useBlogCategories,
  useDeleteBlog,
  usePublishBlog,
  useUnpublishBlog,
  useArchiveBlog,
} from "../hooks/useAdminBlogs";
import type { AdminBlogItem, BlogStatus } from "../types/admin-blog.types";

export default function AdminBlogsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "views" | "title">("newest");
  const [page, setPage] = useState(1);

  const [blogToDelete, setBlogToDelete] = useState<AdminBlogItem | null>(null);

  // Queries & Mutations
  const { data: categories } = useBlogCategories();

  const queryStatus: BlogStatus | "all" | undefined =
    statusFilter === "Published"
      ? "PUBLISHED"
      : statusFilter === "Draft"
      ? "DRAFT"
      : statusFilter === "Archived"
      ? "ARCHIVED"
      : "all";

  const selectedCategoryObj = (categories ?? []).find(
    (c) => c.name === categoryFilter
  );
  const queryCategory =
    categoryFilter === "All Categories" ? undefined : selectedCategoryObj?._id || categoryFilter;

  const { data, isLoading, isError, refetch } = useAdminBlogs({
    page,
    limit: 10,
    search: search.trim() || undefined,
    status: queryStatus,
    category: queryCategory,
    sort: sortBy,
  });

  const deleteMutation = useDeleteBlog();
  const publishMutation = usePublishBlog();
  const unpublishMutation = useUnpublishBlog();
  const archiveMutation = useArchiveBlog();

  const handleConfirmDelete = () => {
    if (!blogToDelete) return;
    deleteMutation.mutate(blogToDelete._id, {
      onSettled: () => setBlogToDelete(null),
    });
  };

  const handlePublish = (blog: AdminBlogItem) => {
    publishMutation.mutate(blog._id);
  };

  const handleUnpublish = (blog: AdminBlogItem) => {
    unpublishMutation.mutate(blog._id);
  };

  const handleArchive = (blog: AdminBlogItem) => {
    archiveMutation.mutate(blog._id);
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

  const isActionLoading =
    publishMutation.isPending ||
    unpublishMutation.isPending ||
    archiveMutation.isPending ||
    deleteMutation.isPending;

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
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Admin Blog Studio
              </span>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-extrabold text-blue-200 border border-blue-400/30">
                {totalBlogs} Articles
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Blog Management
            </h1>
            <p className="max-w-xl text-sm text-slate-300 leading-relaxed">
              Create, edit, publish, and moderate platform articles, career guides, and resources across JobBox.
            </p>
          </div>

          <Link
            to="/admin/blogs/create"
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Create Blog</span>
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
            <option value="Archived">Archived</option>
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

      {/* 3. Main Content Area */}
      {isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-12 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
            Failed to load blog posts.
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
      ) : isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B1220]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Loading articles...
          </p>
        </div>
      ) : blogsList.length > 0 ? (
        <>
          <AdminBlogsTable
            blogs={blogsList}
            onDelete={(blog) => setBlogToDelete(blog)}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            onArchive={handleArchive}
            isActionLoading={isActionLoading}
            mode="admin"
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#0B1220]">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
            No blog posts found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            {search || statusFilter !== "All" || categoryFilter !== "All Categories"
              ? "No blogs match your filter criteria. Try adjusting your search query."
              : "No articles have been created yet."}
          </p>
          <Link
            to="/admin/blogs/create"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Create First Blog
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <DeleteModal
          open={Boolean(blogToDelete)}
          title="Delete Blog Post"
          description={`Are you sure you want to permanently delete "${blogToDelete.title}"? This will remove the article and delete its associated cover image asset.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setBlogToDelete(null)}
        />
      )}
    </div>
  );
}
