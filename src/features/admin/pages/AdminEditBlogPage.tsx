import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Eye, Clock, Calendar } from "lucide-react";

import AdminBlogForm from "../components/AdminBlogForm";
import StatusBadge from "../components/StatusBadge";
import {
  useAdminBlog,
  useUpdateBlog,
  useUnpublishBlog,
  useArchiveBlog,
} from "../hooks/useAdminBlogs";
import type { UpdateBlogPayload } from "../types/admin-blog.types";

export default function AdminEditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: blog, isLoading, isError, refetch } = useAdminBlog(id);
  const updateMutation = useUpdateBlog();
  const unpublishMutation = useUnpublishBlog();
  const archiveMutation = useArchiveBlog();

  const handleSubmit = (payload: UpdateBlogPayload) => {
    if (!id) return;
    updateMutation.mutate(
      { id, payload },
      {
        onSuccess: () => {
          navigate("/admin/blogs");
        },
      }
    );
  };

  const handleUnpublish = () => {
    if (!id) return;
    unpublishMutation.mutate(id);
  };

  const handleArchive = () => {
    if (!id) return;
    archiveMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800" />
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800" />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center text-sm font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
        <p className="mb-4 text-base">Blog post not found or failed to load.</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/admin/blogs"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            Back to Blogs
          </Link>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3.5">
            <Link
              to="/admin/blogs"
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              title="Back to blogs"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-900 line-clamp-1 dark:text-slate-100">
                  Edit Article: {blog.title}
                </h2>
                <StatusBadge status={blog.status} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {blog.viewsCount ?? 0} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {blog.readingTime ?? 1} min read
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/admin/blogs"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Back to List
          </Link>
        </div>
      </div>

      {/* Form Container */}
      <AdminBlogForm
        initialData={blog}
        isEdit={true}
        isSubmitting={
          updateMutation.isPending ||
          unpublishMutation.isPending ||
          archiveMutation.isPending
        }
        onSubmit={(payload) => handleSubmit(payload as UpdateBlogPayload)}
        onCancel={() => navigate("/admin/blogs")}
        onUnpublish={handleUnpublish}
        onArchive={handleArchive}
      />
    </div>
  );
}
