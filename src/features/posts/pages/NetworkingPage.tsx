import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Briefcase,
  UserCheck,
} from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import { UserAvatar } from "@/shared/components/UserAvatar";
import CreatePostForm from "../components/CreatePostForm";
import PostFeed from "../components/PostFeed";

export default function NetworkingPage() {
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const isCandidate = user?.role === "candidate";
  const profileRoute = isCandidate ? "/candidate/profile" : "/recruiter/profile";
  const jobsRoute = isCandidate ? "/candidate/jobs" : "/recruiter/jobs";
  const messagesRoute = isCandidate ? "/candidate/messages" : "/recruiter/messages";

  const getRoleBadgeClasses = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "recruiter":
        return "bg-purple-50 text-purple-700 border border-purple-200/60";
      case "candidate":
        return "bg-blue-50 text-blue-700 border border-blue-200/60";
      case "admin":
        return "bg-amber-50 text-amber-800 border border-amber-200/60";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200/60";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#3C65F5] shadow-2xs">
              <Globe className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Professional Networking
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#3C65F5] border border-blue-200/60">
              Community
            </span>
          </div>
          <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
            Connect with peers, share career milestones, exchange advice, and engage with the JobBox community.
          </p>
        </div>
      </div>

      {/* Main Layout Grid: Desktop = Feed + Sidebar, Tablet/Mobile = Single-Column Feed Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        {/* Main Feed Column */}
        <main className="min-w-0 space-y-6">
          {/* Create Post Section */}
          <CreatePostForm />

          {/* Posts Feed */}
          <PostFeed page={page} onPageChange={setPage} />
        </main>

        {/* Right Sidebar Area (Desktop only - collapses on Tablet & Mobile) */}
        <aside className="hidden lg:block space-y-5 sticky top-6">
          {/* Authenticated User Identity Card */}
          {user && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-3.5">
                <UserAvatar
                  src={user.profilePicture}
                  name={user.name || "User"}
                  size="lg"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {user.name}
                  </h3>
                  <span
                    className={`inline-block mt-0.5 rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${getRoleBadgeClasses(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3.5">
                <Link
                  to={profileRoute}
                  className="flex items-center justify-between text-xs font-semibold text-[#3C65F5] hover:text-[#3457D5] transition group"
                >
                  <span>View your profile</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Community Guidelines Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Community Standards
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#3C65F5] shrink-0 mt-0.5" />
                <span>Share actionable career advice, tips, and industry insights.</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#3C65F5] shrink-0 mt-0.5" />
                <span>Maintain constructive and respectful professional discourse.</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#3C65F5] shrink-0 mt-0.5" />
                <span>Engage authentically with peer posts through likes and comments.</span>
              </li>
            </ul>
          </div>

          {/* Quick Hub Navigation Links */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick Shortcuts
            </h4>
            <div className="space-y-1.5">
              <Link
                to={jobsRoute}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <Briefcase className="h-4 w-4 text-slate-400" />
                <span>{isCandidate ? "Browse Job Listings" : "Manage Job Postings"}</span>
              </Link>
              <Link
                to={messagesRoute}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span>Direct Messages</span>
              </Link>
              <Link
                to={profileRoute}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <UserCheck className="h-4 w-4 text-slate-400" />
                <span>Profile Settings</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
