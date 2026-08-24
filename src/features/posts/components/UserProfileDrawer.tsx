import { useState } from "react";
import {
  X,
  MapPin,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useUserProfileModal } from "../context/UserProfileContext";
import useAuth from "@/features/auth/hooks/useAuth";
import { usePosts } from "../hooks/usePosts";
import ConnectionButton from "./ConnectionButton";
import PostCard from "./PostCard";

export default function UserProfileDrawer() {
  const { targetUser, isOpen, closeUserProfile } = useUserProfileModal();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"about" | "activity">("about");

  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwnProfile = Boolean(
    targetUser && currentUserId && String(targetUser._id) === String(currentUserId)
  );

  const { data: postsData, isLoading: isLoadingPosts } = usePosts({
    authorId: targetUser?._id,
    limit: 10,
  });

  if (!isOpen || !targetUser) return null;

  const userPosts = postsData?.items || postsData?.posts || [];

  const handleStartMessage = () => {
    closeUserProfile();
    if (currentUser?.role === "recruiter") {
      navigate(`/recruiter/messages?userId=${targetUser._id}`);
    } else {
      navigate(`/candidate/messages?userId=${targetUser._id}`);
    }
  };

  const getRoleBadgeClasses = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "recruiter":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "candidate":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-[#3C65F5] px-6 pt-10 pb-16 text-white">
            <button
              type="button"
              onClick={closeUserProfile}
              className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Card Header */}
          <div className="relative px-6 pb-4 -mt-12">
            <div className="flex items-end justify-between gap-4">
              <div className="ring-4 ring-white rounded-full bg-white shadow-md">
                <UserAvatar
                  src={targetUser.profilePicture}
                  name={targetUser.name}
                  size="xl"
                />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{targetUser.name}</h3>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold capitalize border ${getRoleBadgeClasses(
                    targetUser.role
                  )}`}
                >
                  {targetUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {targetUser.headline || (targetUser.role === "recruiter" ? "Hiring Partner" : "JobBox Member")}
              </p>
            </div>

            {/* Dynamic Connection Button Bar */}
            {!isOwnProfile && (
              <div className="flex items-center gap-2 pt-3">
                <ConnectionButton
                  targetUserId={targetUser._id}
                  size="md"
                  showDirectMessage={false}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={handleStartMessage}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#3C65F5]" />
                  <span>Message</span>
                </button>
              </div>
            )}

            {/* Profile Navigation Tabs */}
            <div className="flex border-b border-slate-200 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab("about")}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition ${
                  activeTab === "about"
                    ? "border-[#3C65F5] text-[#3C65F5]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                About & Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("activity")}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition ${
                  activeTab === "activity"
                    ? "border-[#3C65F5] text-[#3C65F5]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Discussions ({userPosts.length})
              </button>
            </div>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {activeTab === "about" ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Contact & Info
                  </h4>
                  {targetUser.email && (
                    <div className="flex items-center gap-2.5 text-xs text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{targetUser.email}</span>
                    </div>
                  )}
                  {targetUser.city && (
                    <div className="flex items-center gap-2.5 text-xs text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{targetUser.city}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {isLoadingPosts ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-24 rounded-xl bg-slate-100" />
                    <div className="h-24 rounded-xl bg-slate-100" />
                  </div>
                ) : userPosts.length > 0 ? (
                  userPosts.map((post) => <PostCard key={post._id} post={post} />)
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No public discussions shared yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
