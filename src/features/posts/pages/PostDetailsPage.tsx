import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, AlertCircle, RefreshCw } from "lucide-react";
import { usePost } from "../hooks/usePost";
import PostCard from "../components/PostCard";
import UserProfileDrawer from "../components/UserProfileDrawer";
import { UserProfileProvider } from "../context/UserProfileContext";
import useAuth from "@/features/auth/hooks/useAuth";

export default function PostDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: post, isLoading, isError, refetch } = usePost(id || "");

  const backRoute = user
    ? user.role === "candidate"
      ? "/candidate/networking"
      : "/recruiter/networking"
    : "/posts";

  return (
    <UserProfileProvider>
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <button
            type="button"
            onClick={() => (window.history.length > 2 ? navigate(-1) : navigate(backRoute))}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <ArrowLeft className="h-4 w-4 text-slate-500" />
            <span>Back to Feed</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#3C65F5]">
              <Globe className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 hidden sm:inline">Discussion Thread</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-5/6 bg-slate-200 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 rounded" />
            </div>
            <div className="h-48 w-full bg-slate-100 rounded-2xl" />
          </div>
        ) : isError || !post ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-8 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-3.5 text-base font-bold text-slate-900">
              Discussion not found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              This discussion may have been removed by its author or is no longer available.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </button>
              <Link
                to={backRoute}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#3457D5] transition"
              >
                <span>Go to Community Feed</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Post Render */
          <PostCard post={post} />
        )}

        <UserProfileDrawer />
      </div>
    </UserProfileProvider>
  );
}