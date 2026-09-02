import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowUpDown, Layers } from "lucide-react";

import Toolbar from "../components/Toolbar";
import SearchInput from "../components/SearchInput";
import FilterDropdown from "../components/FilterDropdown";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import DeleteModal from "../components/DeleteModal";
import AdminBlogsTable from "../components/AdminBlogsTable";

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
  const totalPages = data?.pagination?.totalPages ?? 1;

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
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Toolbar
          title="Blog Management"
          description="Create, edit, publish, and moderate platform articles and resources."
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        <Link
          to="/admin/blogs/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Create Blog
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0B1220]">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        <FilterDropdown
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          options={["All", "Published", "Draft", "Archived"]}
        />

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="bg-transparent outline-none cursor-pointer"
          >
            {categoryOptions.map((opt) => (
              <option key={opt} value={opt} className="dark:bg-slate-900">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="ml-auto flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "newest" | "oldest" | "views" | "title");
              setPage(1);
            }}
            className="bg-transparent outline-none cursor-pointer"
          >
            <option value="newest" className="dark:bg-slate-900">
              Newest First
            </option>
            <option value="oldest" className="dark:bg-slate-900">
              Oldest First
            </option>
            <option value="views" className="dark:bg-slate-900">
              Most Viewed
            </option>
            <option value="title" className="dark:bg-slate-900">
              Title (A-Z)
            </option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <p className="mb-3">Failed to load blog posts.</p>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-600 shadow-xs transition hover:bg-red-50 dark:border-red-800 dark:bg-slate-900 dark:text-red-300"
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60"
            />
          ))}
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
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState
          title="No blog posts found"
          description="Try modifying your keyword search or adjusting your status/category filters."
        />
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
