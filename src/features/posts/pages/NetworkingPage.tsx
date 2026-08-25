import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Globe,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Briefcase,
  UserCheck,
  TrendingUp,
  Inbox,
  Users,
  UserPlus,
  MapPin,
  Building2,
  ExternalLink,
  Tag,
} from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useJobs } from "@/features/candidate/hooks/useJobs";
import CreatePostForm from "../components/CreatePostForm";
import PostFeed from "../components/PostFeed";
import PeopleSuggestionsWidget from "../components/PeopleSuggestionsWidget";
import InvitationsManager from "../components/InvitationsManager";
import MyConnectionsList from "../components/MyConnectionsList";
import GrowNetworkGrid from "../components/GrowNetworkGrid";
import { useConnections } from "../hooks/useConnections";
import UserProfileDrawer from "../components/UserProfileDrawer";
import { UserProfileProvider, useUserProfileModal } from "../context/UserProfileContext";

const POPULAR_TOPICS = [
  { tag: "#CareerMilestone", count: "Promotions & Wins", color: "text-amber-600 bg-amber-50 border-amber-200/60" },
  { tag: "#CareerAdvice", count: "Tips & Guidance", color: "text-emerald-600 bg-emerald-50 border-emerald-200/60" },
  { tag: "#AskJobBox", count: "Community Q&A", color: "text-purple-600 bg-purple-50 border-purple-200/60" },
  { tag: "#Hiring", count: "Active Openings", color: "text-blue-600 bg-blue-50 border-blue-200/60" },
];

type NetworkTab = "feed" | "grow" | "invitations" | "connections";

function NetworkingContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as NetworkTab) || "feed";

  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const { openUserProfile } = useUserProfileModal();

  const handleTabChange = (tab: NetworkTab) => {
    setSearchParams({ tab });
  };

  const { data: pendingInvitationsData } = useConnections({ status: "pending" });
  const pendingRequestsCount = pendingInvitationsData?.items?.length || 0;

  // Fetch real recommended jobs using existing candidate hook
  const { data: jobsData, isLoading: isLoadingJobs } = useJobs({
    limit: "3",
    sort: "newest",
  });

  const isCandidate = user?.role === "candidate";
  const profileRoute = isCandidate ? "/candidate/profile" : "/recruiter/profile";
  const jobsRoute = isCandidate ? "/candidate/jobs" : "/recruiter/jobs";
  const messagesRoute = isCandidate ? "/candidate/messages" : "/recruiter/messages";

  const recommendedJobs = jobsData?.jobs || [];

  const getRoleBadgeClasses = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "recruiter":
        return "bg-purple-50 text-purple-700 border-purple-200/70";
      case "candidate":
        return "bg-blue-50 text-blue-700 border-blue-200/70";
      case "admin":
        return "bg-amber-50 text-amber-800 border-amber-200/70";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/70";
    }
  };

  const handleOpenOwnProfile = () => {
    if (!user) return;
    openUserProfile({
      _id: user.id || (user as any)._id || "",
      name: user.name || "User",
      role: user.role,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  };

  return (
    <div className="flex flex-col lg:h-[calc(100vh-7.5rem)] lg:overflow-hidden gap-5">
      {/* LinkedIn-Style Page Header & Global Navigation */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 border-b border-slate-200/80 pb-4 shrink-0">
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
            Connect with peers, share career milestones, exchange advice, and build your professional community.
          </p>
        </div>

        {/* Global Network Navigation Tabs - LinkedIn Interactive Segmented Control */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-2xs overflow-x-auto custom-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => handleTabChange("feed")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "feed"
                ? "bg-white text-[#3C65F5] shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Globe className="h-4 w-4 text-[#3C65F5]" />
            <span>Feed & Discussions</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("grow")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "grow"
                ? "bg-white text-[#3C65F5] shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <UserPlus className="h-4 w-4 text-[#3C65F5]" />
            <span>Grow Network</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("invitations")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "invitations"
                ? "bg-white text-[#3C65F5] shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Inbox className="h-4 w-4 text-[#3C65F5]" />
            <span>Invitations</span>
            {pendingRequestsCount > 0 && (
              <span className="rounded-full bg-rose-600 px-2 py-0.2 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("connections")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "connections"
                ? "bg-white text-[#3C65F5] shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Users className="h-4 w-4 text-[#3C65F5]" />
            <span>My Connections</span>
          </button>
        </div>
      </div>

      {activeTab === "feed" && (
        /* Main Layout Grid: Desktop = Dual Independent Scrollable Columns */
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:flex-1 lg:min-h-0 lg:overflow-hidden items-start">
        {/* Main Feed Column - Independent Scroll Container */}
        <div className="min-w-0 space-y-6 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-3 custom-scrollbar pb-8">
          {/* Create Post Section */}
          <CreatePostForm />

          {/* Posts Feed */}
          <PostFeed page={page} onPageChange={setPage} />
        </div>

        {/* Right Sidebar Area - Independent Scroll Container (Desktop only - collapses on Tablet/Mobile) */}
        <aside className="hidden lg:block space-y-5 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-2 custom-scrollbar pb-8">
          {/* Authenticated User Identity Card */}
          {user && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300">
              <button
                type="button"
                onClick={handleOpenOwnProfile}
                className="flex items-center gap-3.5 w-full text-left cursor-pointer group"
                title="View your profile card"
              >
                <div className="transition-transform group-hover:scale-105">
                  <UserAvatar
                    src={user.profilePicture}
                    name={user.name || "User"}
                    size="lg"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#3C65F5] transition">
                    {user.name}
                  </h3>
                  <span
                    className={`inline-block mt-0.5 rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize border ${getRoleBadgeClasses(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </button>

              <div className="mt-4 border-t border-slate-100 pt-3.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleOpenOwnProfile}
                  className="flex items-center justify-between text-xs font-bold text-[#3C65F5] hover:text-[#3457D5] transition group cursor-pointer"
                >
                  <span>Quick profile preview</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 ml-1" />
                </button>
                <Link
                  to={profileRoute}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition"
                  title="Full Profile Page"
                >
                  Full Page
                </Link>
              </div>
            </div>
          )}

          {/* People You May Know Widget (Real DB Connections) */}
          <PeopleSuggestionsWidget />

          {/* Recommended Jobs Widget (Using Real Jobs API) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#3C65F5]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Recommended Jobs
                </h4>
              </div>
              <Link
                to={jobsRoute}
                className="text-xs font-semibold text-[#3C65F5] hover:underline"
              >
                View all
              </Link>
            </div>

            {isLoadingJobs ? (
              <div className="space-y-3 pt-1 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1.5 p-2 rounded-xl bg-slate-50">
                    <div className="h-3.5 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : recommendedJobs.length > 0 ? (
              <div className="space-y-2.5 pt-0.5">
                {recommendedJobs.slice(0, 3).map((job) => {
                  const companyName =
                    typeof job.companyId === "object" && job.companyId !== null
                      ? job.companyId.name
                      : typeof job.company === "object" && job.company !== null
                      ? (job.company as { name?: string }).name
                      : "JobBox Partner";

                  return (
                    <Link
                      key={job._id}
                      to={isCandidate ? `/jobs/${job._id}` : `/recruiter/jobs/${job._id}`}
                      className="group block rounded-xl border border-slate-100 p-2.5 transition hover:border-blue-200 hover:bg-blue-50/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#3C65F5] transition truncate">
                          {job.title}
                        </h5>
                        <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-[#3C65F5] shrink-0 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 truncate">
                        <span className="flex items-center gap-1 truncate">
                          <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{companyName}</span>
                        </span>
                        {job.location && (
                          <>
                            <span aria-hidden="true">•</span>
                            <span className="flex items-center gap-0.5 shrink-0">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>{job.location}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-1">No active job listings right now.</p>
            )}
          </div>

          {/* Real People Discovery Widget */}
          <PeopleSuggestionsWidget />

          {/* Trending Topics / Discussions Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Trending Topics
              </h4>
            </div>

            <div className="space-y-2 pt-1">
              {POPULAR_TOPICS.map((topic) => (
                <div
                  key={topic.tag}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-2 text-xs transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Tag className="h-3.5 w-3.5 text-[#3C65F5] shrink-0" />
                    <span className="font-bold text-slate-800 truncate">
                      {topic.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">
                    {topic.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
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
      )}

      {/* Tab 2: Grow Network */}
      {activeTab === "grow" && (
        <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto custom-scrollbar pb-8">
          <GrowNetworkGrid />
        </div>
      )}

      {/* Tab 3: Invitations Manager */}
      {activeTab === "invitations" && (
        <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto custom-scrollbar pb-8 max-w-4xl mx-auto w-full">
          <InvitationsManager onExploreSuggestions={() => handleTabChange("grow")} />
        </div>
      )}

      {/* Tab 4: My Connections */}
      {activeTab === "connections" && (
        <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto custom-scrollbar pb-8 max-w-4xl mx-auto w-full">
          <MyConnectionsList />
        </div>
      )}
    </div>
  );
}

export default function NetworkingPage() {
  return (
    <UserProfileProvider>
      <NetworkingContent />
      <UserProfileDrawer />
    </UserProfileProvider>
  );
}

