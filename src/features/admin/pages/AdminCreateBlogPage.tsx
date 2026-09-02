import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

import AdminBlogForm from "../components/AdminBlogForm";
import { useCreateBlog } from "../hooks/useAdminBlogs";
import type { CreateBlogPayload } from "../types/admin-blog.types";

export default function AdminCreateBlogPage() {
  const navigate = useNavigate();
  const createMutation = useCreateBlog();

  const handleSubmit = (payload: CreateBlogPayload) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/admin/blogs");
      },
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1220] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/blogs"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              title="Back to blogs"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Create New Blog
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Write and publish a new article for candidate guides, recruiter tips, or industry news.
              </p>
            </div>
          </div>

          <Link
            to="/admin/blogs"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Form Container */}
      <AdminBlogForm
        isEdit={false}
        isSubmitting={createMutation.isPending}
        onSubmit={(payload) => handleSubmit(payload as CreateBlogPayload)}
        onCancel={() => navigate("/admin/blogs")}
      />
    </div>
  );
}
