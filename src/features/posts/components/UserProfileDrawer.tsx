import { useState, useRef, useEffect } from "react";
import {
  X,
  MapPin,
  Mail,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Sparkles,
  Building2,
  MoreHorizontal,
  Share2,
  Bell,
  BellOff,
  Flag,
  Send,
  BadgeCheck,
  Zap,
  Activity,
  Layers,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useUserProfileModal } from "../context/UserProfileContext";
import useAuth from "@/features/auth/hooks/useAuth";
import { usePosts } from "../hooks/usePosts";
import { useUserProfile, type FullUserProfile } from "../hooks/useUserProfile";
import ConnectionButton from "./ConnectionButton";
import PostCard from "./PostCard";
import ReportModal from "./ReportModal";
import toast from "react-hot-toast";

export default function UserProfileDrawer() {
  const { targetUser, isOpen, closeUserProfile } = useUserProfileModal();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"about" | "activity">("about");
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const currentUserId = currentUser?._id || currentUser?.id;
  const targetUserId = targetUser?._id;

  // Fetch full rich profile from backend
  const { data: fullProfile, isLoading: isLoadingProfile } = useUserProfile(
    targetUserId,
    isOpen && Boolean(targetUserId)
  );

  const isOwnProfile = Boolean(
    targetUser && currentUserId && String(targetUserId) === String(currentUserId)
  );

  const { data: postsData, isLoading: isLoadingPosts } = usePosts(
    { authorId: targetUserId, limit: 10 },
    { enabled: Boolean(isOpen && targetUserId) }
  );

  // Close more menu on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    if (moreMenuOpen) {
      document.addEventListener("mousedown", handleOutside);
    }
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [moreMenuOpen]);

  if (!isOpen || !targetUser) return null;

  // Merge modal input with freshly fetched full database profile
  const profile: FullUserProfile = (fullProfile || targetUser) as FullUserProfile;
  const userPosts = postsData?.items || postsData?.posts || [];

  const handleStartMessage = () => {
    closeUserProfile();
    if (currentUser?.role === "recruiter") {
      navigate(`/recruiter/messages?userId=${targetUser._id}`);
    } else {
      navigate(`/candidate/messages?userId=${targetUser._id}`);
    }
  };

  const handleShareProfile = () => {
    setMoreMenuOpen(false);
    const profileUrl = `${window.location.origin}/candidate/profile/${targetUser._id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopiedLink(true);
      toast.success("Profile link copied to clipboard");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleToggleFollow = () => {
    setMoreMenuOpen(false);
    setIsFollowing((prev) => {
      const next = !prev;
      if (next) {
        toast.success(`You are now following ${profile.name}`);
      } else {
        toast.success(`Unfollowed ${profile.name}`);
      }
      return next;
    });
  };

  const handleReportUser = () => {
    setMoreMenuOpen(false);
    setIsReportModalOpen(true);
  };

  const handleSendProfileInMessage = () => {
    setMoreMenuOpen(false);
    closeUserProfile();
    const base = currentUser?.role === "recruiter" ? "/recruiter/messages" : "/candidate/messages";
    navigate(base);
    toast.success(`Share ${profile.name}'s profile in your conversations`);
  };

  const isRecruiter = profile.role?.toLowerCase() === "recruiter";
  const headline =
    profile.headline ||
    (isRecruiter
      ? profile.designation
        ? `${profile.designation}${
            typeof profile.companyId === "object" && profile.companyId?.name
              ? ` at ${profile.companyId.name}`
              : ""
          }`
        : "Talent Acquisition Partner & Recruiter"
      : "Professional Community Member & Specialist");

  const locationStr =
    profile.city || profile.state || profile.country
      ? [profile.city, profile.state, profile.country].filter(Boolean).join(", ")
      : targetUser.city || undefined;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-3 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#F8FAFC] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 border-l border-slate-200/80">
          
          {/* ── Top Cover Banner ── */}
          <div className="relative h-36 sm:h-40 w-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 shrink-0 overflow-hidden">
            {/* Subtle glow accent */}
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />
            
            {/* Glassmorphic Close Button */}
            <button
              type="button"
              onClick={closeUserProfile}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 text-white border border-white/15 transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              aria-label="Close drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Profile Header Section Card ── */}
          <div className="relative px-6 pb-5 -mt-14 bg-white border-b border-slate-200/80 shadow-xs shrink-0 rounded-t-3xl">
            
            {/* Avatar & Status Row */}
            <div className="flex items-end justify-between gap-4">
              
              {/* Crisp Elevated Avatar with Ring & Status */}
              <div className="relative -mt-4">
                <div className="p-1 rounded-full bg-white shadow-md ring-4 ring-white">
                  <div className="rounded-full overflow-hidden ring-1 ring-slate-200/80">
                    <UserAvatar
                      src={profile.profilePicture}
                      name={profile.name}
                      size="xl"
                    />
                  </div>
                </div>
                
                {/* Live Online Presence Indicator */}
                <span className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs" />
              </div>

              {/* Status Pill Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide border shadow-2xs ${
                    isRecruiter
                      ? "bg-purple-50 text-purple-700 border-purple-200/80"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                  }`}
                >
                  <Zap className="h-3 w-3 fill-current" />
                  {isRecruiter ? "#Hiring" : "#OpenToWork"}
                </span>

                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize bg-slate-100 text-slate-700 border border-slate-200/80">
                  {profile.role || "Member"}
                </span>
              </div>
            </div>

            {/* Name, Headline & Metadata */}
            <div className="mt-3.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {profile.name}
                </h3>
                <div className="flex items-center text-blue-600" title="Verified Member">
                  <BadgeCheck className="h-5 w-5 fill-blue-50" />
                </div>
              </div>

              <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed max-w-md">
                {headline}
              </p>

              {/* Location & Network Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {locationStr && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200/80">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{locationStr}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                  <Activity className="h-3.5 w-3.5 shrink-0" />
                  <span>Active Member</span>
                </span>
              </div>
            </div>

            {/* Action Bar (Connect, Message, Three-Dots Menu) */}
            {!isOwnProfile && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5">
                <ConnectionButton
                  targetUserId={profile._id}
                  size="md"
                  showDirectMessage={false}
                  className="flex-1 min-w-[140px] shadow-xs font-semibold"
                />

                <button
                  type="button"
                  onClick={handleStartMessage}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span>Message</span>
                </button>

                {/* ── Three-Dots (•••) Modern Dropdown Menu ── */}
                <div ref={moreMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setMoreMenuOpen((prev) => !prev)}
                    className={`inline-flex items-center justify-center rounded-xl border p-2.5 text-slate-600 transition-all cursor-pointer shadow-2xs ${
                      moreMenuOpen
                        ? "border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    title="More options"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {moreMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={handleShareProfile}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition text-left cursor-pointer"
                      >
                        {copiedLink ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Share2 className="h-4 w-4 text-slate-400" />
                        )}
                        <span>Share profile link</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSendProfileInMessage}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition text-left cursor-pointer"
                      >
                        <Send className="h-4 w-4 text-slate-400" />
                        <span>Send in a message</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleFollow}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition text-left cursor-pointer"
                      >
                        {isFollowing ? (
                          <>
                            <BellOff className="h-4 w-4 text-amber-500" />
                            <span>Unfollow updates</span>
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4 text-slate-400" />
                            <span>Follow updates</span>
                          </>
                        )}
                      </button>

                      <div className="my-1.5 border-t border-slate-100" />

                      <button
                        type="button"
                        onClick={handleReportUser}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                      >
                        <Flag className="h-4 w-4 text-rose-500" />
                        <span>Report member</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Modern Segmented Pill Tabs ── */}
            <div className="mt-4 pt-1">
              <div className="flex rounded-xl bg-slate-100/90 p-1 border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("about")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === "about"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>About & Experience</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("activity")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === "activity"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Discussions ({userPosts.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Scrollable Body Content with Refined Cards ── */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-5">
            {activeTab === "about" ? (
              isLoadingProfile ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-32 rounded-2xl bg-white border border-slate-200" />
                  <div className="h-36 rounded-2xl bg-white border border-slate-200" />
                  <div className="h-44 rounded-2xl bg-white border border-slate-200" />
                </div>
              ) : (
                <div className="space-y-5">
                  {/* 1. About / Bio Card */}
                  <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          About & Summary
                        </h4>
                        <p className="text-[10px] text-slate-400">Professional overview</p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                      {profile.bio ||
                        `${profile.name} is an active professional member of the JobBox community, collaborating and networking with industry peers.`}
                    </p>
                  </div>

                  {/* 2. Skills & Technologies Card */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Skills & Expertise
                          </h4>
                          <p className="text-[10px] text-slate-400">Core technologies & abilities</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {profile.skills.map((skill: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-150 cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Work Experience Timeline Card */}
                  {profile.experience && profile.experience.length > 0 && (
                    <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Work Experience
                          </h4>
                          <p className="text-[10px] text-slate-400">Career history and roles</p>
                        </div>
                      </div>

                      <div className="space-y-4 divide-y divide-slate-100 pt-1">
                        {profile.experience.map((exp: any, idx: number) => (
                          <div key={idx} className={idx > 0 ? "pt-4" : ""}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="text-sm font-bold text-slate-900">{exp.title}</h5>
                                <p className="text-xs font-semibold text-blue-600 mt-0.5">{exp.company}</p>
                              </div>
                              {exp.current && (
                                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                  Present
                                </span>
                              )}
                            </div>
                            {exp.location && (
                              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{exp.location}</span>
                              </p>
                            )}
                            {exp.description && (
                              <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Recruiter Company Details Card (if applicable) */}
                  {isRecruiter && typeof profile.companyId === "object" && profile.companyId?.name && (
                    <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Company Affiliation
                          </h4>
                          <p className="text-[10px] text-slate-400">Verified hiring organization</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 pt-1">
                        {profile.companyId.logo && (
                          <img
                            src={profile.companyId.logo}
                            alt={profile.companyId.name}
                            className="h-12 w-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                        )}
                        <div>
                          <h5 className="text-sm font-bold text-slate-900">{profile.companyId.name}</h5>
                          {profile.companyId.description && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                              {profile.companyId.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Education Timeline Card */}
                  {profile.education && profile.education.length > 0 && (
                    <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Education & Credentials
                          </h4>
                          <p className="text-[10px] text-slate-400">Academic background</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-1">
                        {profile.education.map((edu: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <div>
                              <h5 className="text-sm font-bold text-slate-900">{edu.institution}</h5>
                              <p className="text-xs text-slate-600 font-medium">
                                {edu.degree} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ""}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. Contact & Verified Details Card */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Verified Contact Details
                      </h4>
                    </div>

                    <div className="space-y-2.5 pt-1 text-xs text-slate-600">
                      {profile.email && (
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="truncate font-medium">{profile.email}</span>
                        </div>
                      )}
                      {locationStr && (
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="font-medium">{locationStr}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="space-y-4">
                {isLoadingPosts ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-28 rounded-2xl bg-white border border-slate-200" />
                    <div className="h-28 rounded-2xl bg-white border border-slate-200" />
                  </div>
                ) : userPosts.length > 0 ? (
                  userPosts.map((post: any) => <PostCard key={post._id} post={post} />)
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-2 shadow-xs">
                    <MessageSquare className="h-8 w-8 mx-auto text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">No public discussions yet</p>
                    <p className="text-xs text-slate-400">
                      When {profile.name} publishes posts or milestones, they will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="user"
        targetId={profile._id}
        targetTitle={`${profile.name} (${profile.role})`}
      />
    </div>
  );
}
