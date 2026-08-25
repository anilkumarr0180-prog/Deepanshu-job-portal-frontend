import { useState } from "react";
import { Search, Users, MessageSquare, MoreHorizontal, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useConnections } from "../hooks/useConnections";
import { useConnectionMutations } from "../hooks/useConnectionMutations";
import { useUserProfileModal } from "../context/UserProfileContext";
import useAuth from "@/features/auth/hooks/useAuth";
import { formatPostTimestamp } from "../utils/formatTimestamp";

export default function MyConnectionsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { openUserProfile } = useUserProfileModal();
  const { remove } = useConnectionMutations();

  const { data: connectionsData, isLoading } = useConnections({
    status: "accepted",
  });

  const connections = connectionsData?.items || [];
  const filteredConnections = connections.filter((conn) => {
    const peer = conn.peerUser || {};
    const name = (peer.name || "").toLowerCase();
    const headline = (peer.headline || "").toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || headline.includes(q);
  });

  const handleMessage = (peerUserId: string) => {
    if (currentUser?.role === "recruiter") {
      navigate(`/recruiter/messages?userId=${peerUserId}`);
    } else {
      navigate(`/candidate/messages?userId=${peerUserId}`);
    }
  };

  const getRoleBadgeClasses = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "recruiter":
        return "bg-purple-50 text-purple-700 border-purple-200/70";
      case "candidate":
        return "bg-blue-50 text-blue-700 border-blue-200/70";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/70";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden space-y-4 p-5">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            My Network ({connections.length})
          </h2>
          <p className="text-xs text-slate-500">
            People you are connected with on JobBox.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search connections..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#3C65F5] focus:outline-none transition"
          />
        </div>
      </div>

      {/* Connections List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100 p-4" />
          ))}
        </div>
      ) : filteredConnections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredConnections.map((conn) => {
            const isMenuOpen = activeMenuId === conn._id;
            const peer = conn.peerUser || {};
            const headline = peer.headline || (peer.role === "recruiter" ? "Recruiter" : "JobBox Member");

            return (
              <div
                key={conn._id}
                className="relative flex items-start justify-between gap-3 rounded-2xl border border-slate-200/80 p-4 transition hover:border-blue-200 hover:shadow-xs group"
              >
                <div
                  onClick={() =>
                    openUserProfile({
                      _id: peer._id,
                      name: peer.name,
                      role: peer.role,
                      email: peer.email,
                      profilePicture: peer.profilePicture,
                      headline: peer.headline,
                      city: peer.location,
                    })
                  }
                  className="flex items-start gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="ring-2 ring-white rounded-full shadow-xs">
                    <UserAvatar
                      src={peer.profilePicture}
                      name={peer.name}
                      size="lg"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#3C65F5] transition truncate">
                        {peer.name}
                      </h4>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-semibold capitalize border ${getRoleBadgeClasses(
                          peer.role
                        )}`}
                      >
                        {peer.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {headline}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Connected {conn.acceptedAt ? formatPostTimestamp(conn.acceptedAt) : "Recently"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-start">
                  <button
                    type="button"
                    onClick={() => handleMessage(peer._id)}
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#3C65F5] hover:bg-blue-100 transition"
                    title="Send message"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Message</span>
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : conn._id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            remove.mutate(conn._id);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                        >
                          <UserX className="h-3.5 w-3.5" />
                          <span>Remove Connection</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {searchTerm ? "No connections match your search" : "No connections yet"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? "Try searching with a different name or keyword."
              : "Connect with recruiters, candidates, and industry peers to grow your circle."}
          </p>
        </div>
      )}
    </div>
  );
}
