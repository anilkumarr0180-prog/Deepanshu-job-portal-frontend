import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Globe, LogIn, UserPlus } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import PostFeed from "../components/PostFeed";

export default function PostsPage() {
  const [page, setPage] = useState(1);
  const { user, isAuthenticated } = useAuth();

  // Smart redirection for authenticated users to their dashboard Networking view
  if (isAuthenticated && user) {
    if (user.role === "candidate") {
      return <Navigate to="/candidate/networking" replace />;
    }
    if (user.role === "recruiter") {
      return <Navigate to="/recruiter/networking" replace />;
    }
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8 space-y-6">
      {/* Public Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#3C65F5]">
              <Globe className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Community Feed
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Discover discussions, industry updates, and professional insights from across JobBox.
          </p>
        </div>
      </div>

      {/* Guest Authentication Callout */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">
              Join the JobBox Professional Network
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Sign in to share career milestones, publish posts, like, and comment.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Log In</span>
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#3457D5] transition"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Public Read-Only Feed */}
      <PostFeed page={page} onPageChange={setPage} />
    </div>
  );
}
