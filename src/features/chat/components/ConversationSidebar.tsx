import { useState } from "react";

import { Search, MessageSquare, Briefcase, User as UserIcon } from "lucide-react";
import type { ChatConversation, ChatUser } from "../types/chat.types";

interface ConversationSidebarProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  currentUserId: string;
  onlineUserIds: string[];
  onSelectConversation: (conversationId: string) => void;
  isLoading: boolean;
}

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  currentUserId,
  onlineUserIds,
  onSelectConversation,
  isLoading,
}: ConversationSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    const isCandidate = conv.candidateId?._id === currentUserId || conv.candidateId?.id === currentUserId;
    const partner: ChatUser = isCandidate ? conv.recruiterId : conv.candidateId;
    const partnerName = partner?.name || "";
    const jobTitle = conv.jobId?.title || "";

    return (
      partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#3C65F5]" /> Messages
          </h2>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#3C65F5]">
            {conversations.length} Active
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate, recruiter or job..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-11 w-11 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-1/2 rounded bg-slate-200" />
                  <div className="h-3 w-3/4 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No Conversations Found</p>
            <p className="text-xs text-slate-500">
              Conversations start automatically once a candidate applies for a job listing.
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isCandidate =
              conv.candidateId?._id === currentUserId || conv.candidateId?.id === currentUserId;
            const partner: ChatUser = isCandidate ? conv.recruiterId : conv.candidateId;
            const partnerId = partner?._id || partner?.id || "";
            const isOnline = onlineUserIds.includes(partnerId);
            const isSelected = conv._id === activeConversationId;
            const unreadCount = conv.unreadCount || 0;

            const formattedDate = conv.lastMessageAt
              ? new Date(conv.lastMessageAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <button
                key={conv._id}
                type="button"
                onClick={() => onSelectConversation(conv._id)}
                className={`w-full text-left p-4 transition flex items-start gap-3 hover:bg-slate-50/80 ${
                  isSelected ? "bg-blue-50/60 border-l-4 border-l-[#3C65F5]" : ""
                }`}
              >
                {/* Avatar with Online Badge */}
                <div className="relative shrink-0">
                  {partner?.profilePicture ? (
                    <img
                      src={partner.profilePicture}
                      alt={partner.name}
                      className="h-11 w-11 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-xs text-sm">
                      {partner?.name ? partner.name.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
                    </div>
                  )}

                  {/* Online Green Dot */}
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {partner?.name || "User"}
                    </h3>
                    {formattedDate && (
                      <span className="text-[11px] font-medium text-slate-400 shrink-0">
                        {formattedDate}
                      </span>
                    )}
                  </div>

                  {/* Job Title Pill */}
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[#3C65F5]">
                    <Briefcase className="h-3 w-3 shrink-0" />
                    <span className="truncate">{conv.jobId?.title || "Job Listing"}</span>
                  </div>

                  {/* Last Message Preview */}
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500 truncate">
                      {conv.lastMessageId?.message || "No messages yet"}
                    </p>

                    {unreadCount > 0 && (
                      <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-extrabold text-white shadow-xs shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
