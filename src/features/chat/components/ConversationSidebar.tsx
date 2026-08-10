import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MessageSquareDot, Briefcase, User as UserIcon, X } from "lucide-react";
import type { ChatConversation, ChatUser } from "../types/chat.types";
import { getUserIdString } from "../types/chat.types";

interface ConversationSidebarProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  currentUserId: string;
  onlineUserIds: string[];
  onSelectConversation: (conversationId: string) => void;
  isLoading: boolean;
  userRole?: "candidate" | "recruiter";
}

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  currentUserId,
  onlineUserIds,
  onSelectConversation,
  isLoading,
  userRole = "candidate",
}: ConversationSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    const candidateIdStr = getUserIdString(conv.candidateId);
    const isCandidate = candidateIdStr === currentUserId;
    const partner: ChatUser = isCandidate ? conv.recruiterId : conv.candidateId;
    const partnerName = partner?.name || "";
    const jobTitle = conv.jobId?.title || "";
    const lastMsg = (conv as any).lastMessageId?.message || "";
    const q = searchTerm.toLowerCase();
    return (
      partnerName.toLowerCase().includes(q) ||
      jobTitle.toLowerCase().includes(q) ||
      lastMsg.toLowerCase().includes(q)
    );
  });

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const formatLastMessageDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const msgDate = new Date(dateStr);
    const now = new Date();
    const isToday = msgDate.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() === msgDate.toDateString();
    if (isToday) {
      return msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (isYesterday) return "Yesterday";
    return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="flex h-full w-full flex-col bg-white border-r border-slate-200/80">
      {/* ── Sidebar Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[17px] font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquareDot className="h-5 w-5 text-[#3C65F5]" />
            Messages
          </h2>
          <div className="flex items-center gap-2">
            {totalUnread > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#3C65F5] px-1.5 text-[10px] font-extrabold text-white shadow-sm">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              {onlineUserIds.length} online
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-9 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:bg-white placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Conversation List ── */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 rounded-full bg-slate-200" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                  <div className="h-3 w-1/2 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 space-y-4 text-center px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <MessageSquareDot className="h-8 w-8 text-[#3C65F5]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {searchTerm ? "No results found" : "No Conversations Yet"}
              </p>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {searchTerm
                  ? `No chats matched "${searchTerm}"`
                  : userRole === "candidate"
                  ? "Apply to a job and then click \"Message Recruiter\" to start chatting."
                  : "Conversations will appear here once candidates apply to your jobs."}
              </p>
            </div>
            {!searchTerm && userRole === "candidate" && (
              <Link
                to="/candidate/applied"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition"
              >
                <Briefcase className="h-3.5 w-3.5" />
                Go to Applied Jobs
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100/80">
            {filteredConversations.map((conv) => {
              const convId = conv._id || conv.id || "";
              const candidateIdStr = getUserIdString(conv.candidateId);
              const isCandidate = candidateIdStr === currentUserId;
              const partner: ChatUser = isCandidate ? conv.recruiterId : conv.candidateId;
              const partnerId = getUserIdString(partner);
              const isOnline = onlineUserIds.includes(partnerId);
              const isSelected = convId === activeConversationId;
              const unreadCount = conv.unreadCount || 0;
              const formattedDate = formatLastMessageDate(conv.lastMessageAt);
              const lastMsg = (conv as any).lastMessageId?.message || "";
              const isLastMsgImage = (conv as any).lastMessageId?.messageType === "image";
              const isLastMsgFile = (conv as any).lastMessageId?.messageType === "file";

              return (
                <button
                  key={convId}
                  type="button"
                  onClick={() => onSelectConversation(convId)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 transition-all relative ${
                    isSelected
                      ? "bg-blue-50/60 border-l-[4px] border-l-[#3C65F5] shadow-[inset_0px_1px_4px_rgba(0,0,0,0.02)]"
                      : "bg-white border-l-[4px] border-l-transparent hover:bg-slate-50"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {partner?.profilePicture ? (
                      <img
                        src={partner.profilePicture}
                        alt={partner.name}
                        className="h-12 w-12 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3C65F5] to-indigo-700 font-bold text-white shadow-sm text-sm">
                        {partner?.name ? (
                          partner.name.charAt(0).toUpperCase()
                        ) : (
                          <UserIcon className="h-5 w-5" />
                        )}
                      </div>
                    )}
                    {/* Online Dot */}
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white transition-colors ${
                        isOnline ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <span
                        className={`text-sm truncate ${
                          unreadCount > 0 ? "font-extrabold text-slate-900" : "font-bold text-slate-800"
                        }`}
                      >
                        {partner?.name || "User"}
                      </span>
                      {formattedDate && (
                        <span
                          className={`text-[10px] shrink-0 font-medium ${
                            unreadCount > 0 ? "text-[#3C65F5] font-bold" : "text-slate-400"
                          }`}
                        >
                          {formattedDate}
                        </span>
                      )}
                    </div>

                    {/* Job title pill */}
                    <div className="flex items-center gap-1 mb-0.5">
                      <Briefcase className="h-3 w-3 shrink-0 text-[#3C65F5]" />
                      <span className="text-[11px] font-semibold text-[#3C65F5] truncate">
                        {conv.jobId?.title || "Job Listing"}
                      </span>
                    </div>

                    {/* Last message + unread badge */}
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs truncate ${
                          unreadCount > 0 ? "font-semibold text-slate-700" : "text-slate-400"
                        }`}
                      >
                        {isLastMsgImage
                          ? "📷 Photo"
                          : isLastMsgFile
                          ? "📎 Attachment"
                          : lastMsg || "Start the conversation"}
                      </p>
                      {unreadCount > 0 && (
                        <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#3C65F5] px-1.5 text-[10px] font-extrabold text-white shadow-sm">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
