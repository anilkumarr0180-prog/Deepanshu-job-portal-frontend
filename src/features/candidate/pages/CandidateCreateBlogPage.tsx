import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AdminBlogForm from "@/features/admin/components/AdminBlogForm";
import { useCreateMyBlog } from "../hooks/useCandidateBlogs";
import type { CreateCandidateBlogPayload } from "../types/candidate-blog.types";

export default function CandidateCreateBlogPage() {
  const navigate = useNavigate();
  const createMutation = useCreateMyBlog();

  const handleSubmit = (payload: unknown) => {
    createMutation.mutate(payload as CreateCandidateBlogPayload, {
      onSuccess: () => {
        void navigate("/candidate/blogs");
      },
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link
              to="/candidate/blogs"
              className="flex items-center gap-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              My Blogs
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">Create</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Write New Blog Post
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Share your engineering insights, interview journeys, and career stories with the entire JobBox community.
          </p>
        </div>

        <Link
          to="/candidate/blogs"
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to My Blogs
        </Link>
      </div>

      {/* Form Container */}
      <AdminBlogForm
        isEdit={false}
        mode="candidate"
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => {
          void navigate("/candidate/blogs");
        }}
      />
    </div>
  );
}
