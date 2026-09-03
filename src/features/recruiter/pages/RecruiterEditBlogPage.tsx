import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import RecruiterBlogForm from "../components/RecruiterBlogForm";
import {
  useRecruiterBlog,
  useUpdateRecruiterBlog,
  useUnpublishRecruiterBlog,
} from "../hooks/useRecruiterBlogs";
import type {
  UpdateRecruiterBlogPayload,
  CreateRecruiterBlogPayload,
} from "../types/recruiter-blog.types";

export default function RecruiterEditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: blog, isLoading, isError, refetch } = useRecruiterBlog(id);
  const updateMutation = useUpdateRecruiterBlog();
  const unpublishMutation = useUnpublishRecruiterBlog();

  const handleSubmit = (
    payload: CreateRecruiterBlogPayload | UpdateRecruiterBlogPayload
  ) => {
    if (!id) return;
    updateMutation.mutate(
      { id, payload },
      {
        onSuccess: () => {
          void navigate("/recruiter/blogs");
        },
      }
    );
  };

  const handleUnpublish = () => {
    if (!id) return;
    unpublishMutation.mutate(id, {
      onSuccess: () => {
        void refetch();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-xs font-medium text-slate-500">Loading blog details...</p>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50/50 p-12 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-bold text-rose-800 dark:text-rose-300">
          Article Not Found or Unauthorized
        </h3>
        <p className="mt-1 max-w-sm text-xs text-rose-600 dark:text-rose-400">
          The requested article does not exist, was deleted, or belongs to another author.
        </p>
        <Link
          to="/recruiter/blogs"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to My Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link
              to="/recruiter/blogs"
              className="flex items-center gap-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              My Blogs
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">Edit</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Edit Blog Post
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Update your article content, category tags, SEO metadata, or publish status.
          </p>
        </div>

        <Link
          to="/recruiter/blogs"
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to My Blogs
        </Link>
      </div>

      {/* Form Card */}
      <RecruiterBlogForm
        initialData={blog}
        isEdit={true}
        isSubmitting={updateMutation.isPending || unpublishMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => {
          void navigate("/recruiter/blogs");
        }}
        onUnpublish={handleUnpublish}
      />
    </div>
  );
}
