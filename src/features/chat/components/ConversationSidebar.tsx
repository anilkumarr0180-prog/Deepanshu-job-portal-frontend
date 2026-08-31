import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MessageSquareDot,
  Briefcase,
  X,
  Users,
  Loader2,
  MapPin,
  MessageSquare,
  MoreVertical,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ChatConversation, ChatUser } from "../types/chat.types";
import { getUserIdString } from "../types/chat.types";
import useDebounce from "@/shared/hooks/useDebounce";
import { searchUsers } from "@/features/posts/api/connectionApi";
import {
  useCreateConversation,
  useDeleteConversation,
  useMarkConversationRead,
} from "../hooks/useChat";
import { UserAvatar } from "@/shared/components/UserAvatar";
import DeleteConversationModal from "./DeleteConversationModal";

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
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [isStartingChatWithId, setIsStartingChatWithId] = useState<string | null>(null);
  const [openMenuConvId, setOpenMenuConvId] = useState<string | null>(null);
  const [convToDelete, setConvToDelete] = useState<{ id: string; name: string } | null>(null);

  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const markConversationRead = useMarkConversationRead();

  // Close item options menu on outside click
  useEffect(() => {
    const handler = () => setOpenMenuConvId(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  // Search users on JobBox network when searching
  const isSearchingPeople = debouncedSearch.trim().length >= 2;
  const { data: userSearchResults, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["chat-user-search", debouncedSearch.trim()],
    queryFn: () => searchUsers({ q: debouncedSearch.trim(), limit: 5 }),
    enabled: isSearchingPeople,
    staleTime: 1000 * 30,
  });

  const foundUsers = userSearchResults?.items || [];

  const visibleConversations = useMemo(() => {
    try {
      const key = "jobbox_deleted_convs_" + currentUserId;
      const deletedMap: Record<string, number> = JSON.parse(localStorage.getItem(key) || "{}");
      return conversations.filter((conv) => {
        const id = conv._id || conv.id;
        if (!id || !deletedMap[id]) return true;
        const deletedAt = deletedMap[id];
        const lastMsgTime = new Date(conv.lastMessageAt || 0).getTime();
        return lastMsgTime > deletedAt;
      });
    } catch {
      return conversations;
    }
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return visibleConversations;
    const q = searchTerm.toLowerCase();
    return visibleConversations.filter((conv) => {
      const candidateIdStr = getUserIdString(conv.candidateId);
      const isCandidate = candidateIdStr === currentUserId;
      const partner: ChatUser = isCandidate ? conv.recruiterId : conv.candidateId;
      const partnerName = partner?.name || "";
      const jobTitle = conv.jobId?.title || "";
      const lastMsg = (conv as any).lastMessageId?.message || "";
      return (
        partnerName.toLowerCase().includes(q) ||
        jobTitle.toLowerCase().includes(q) ||
        lastMsg.toLowerCase().includes(q)
      );
    });
  }, [visibleConversations, currentUserId, searchTerm]);

  const totalUnread = visibleConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const onlineContactsCount = useMemo(() => {
    const partnerIds = new Set(
      visibleConversations
        .map((conv) => {
          const candidateIdStr = getUserIdString(conv.candidateId);
          const isCandidate = candidateIdStr === currentUserId;
          const partner = isCandidate ? conv.recruiterId : conv.candidateId;
          return getUserIdString(partner);
        })
        .filter(Boolean)
    );
    return Array.from(partnerIds).filter((id) => onlineUserIds.includes(id)).length;
  }, [visibleConversations, currentUserId, onlineUserIds]);

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

  const handleSelectPerson = async (targetUserItem: any) => {
    const userObj = targetUserItem.user || targetUserItem;
    const targetUserId = String(userObj._id || userObj.id || "");
    if (!targetUserId) return;

    // 1. Check if conversation already exists in local list
    const existingConv = conversations.find((c) => {
      const candidateIdStr = getUserIdString(c.candidateId);
      const recruiterIdStr = getUserIdString(c.recruiterId);
      const partnerId = candidateIdStr === currentUserId ? recruiterIdStr : candidateIdStr;
      return partnerId === targetUserId;
    });

    if (existingConv) {
      const id = existingConv._id || existingConv.id || "";
      onSelectConversation(id);
      setSearchTerm("");
      return;
    }

    // 2. Safe create or find conversation via backend
    try {
      setIsStartingChatWithId(targetUserId);
      const newConv = await createConversation.mutateAsync({ targetUserId });
      const id = newConv._id || newConv.id || "";
      setSearchTerm("");
      onSelectConversation(id);
    } catch (err) {
      console.error("Failed to start conversation:", err);
    } finally {
      setIsStartingChatWithId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!convToDelete) return;
    try {
      await deleteConversation.mutateAsync(convToDelete.id);
      if (convToDelete.id === activeConversationId) {
        onSelectConversation("");
      }
      toast.success("Conversation deleted");
      setConvToDelete(null);
    } catch (err) {
      toast.error("Failed to delete conversation");
    }
  };

  const isSearchActive = Boolean(searchTerm.trim());

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800">
      {/* ── Sidebar Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[17px] font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareDot className="h-5 w-5 text-[#3C65F5]" />
            Messages
          </h2>
          <div className="flex items-center gap-2">
            {totalUnread > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#3C65F5] px-1.5 text-[10px] font-extrabold text-white shadow-sm">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              {onlineContactsCount} online
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations or people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-9 pr-9 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800/60" />
                  <div className="h-3 w-1/2 rounded-full bg-slate-100 dark:bg-slate-800/60" />
                </div>
              </div>
            ))}
          </div>
        ) : isSearchActive ? (
          /* ── Search Results Mode ── */
          <div className="pb-4">
            {/* 1. PEOPLE SECTION */}
            {(isSearchingPeople || isLoadingUsers || foundUsers.length > 0) && (
              <div className="mb-2">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50/70 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#3C65F5]" />
                    People
                  </span>
                  {isLoadingUsers && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3C65F5]" />}
                </div>

                {isLoadingUsers ? (
                  <div className="p-3 space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="h-2.5 w-40 bg-slate-100 dark:bg-slate-800/60 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : foundUsers.length > 0 ? (
                  <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {foundUsers.map((item: any) => {
                      const userObj = item.user || item;
                      const targetUserId = String(userObj._id || userObj.id || "");
                      const isOnline = onlineUserIds.includes(targetUserId);
                      const role = userObj.role || "Member";
                      const isRecruiter = role.toLowerCase() === "recruiter";
                      const isStartingThis = isStartingChatWithId === targetUserId;

                      return (
                        <div
                          key={targetUserId}
                          onClick={() => !isStartingThis && handleSelectPerson(item)}
                          className="group flex items-center justify-between gap-3 px-4 py-3 hover:bg-blue-50/60 dark:hover:bg-slate-800/60 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="relative shrink-0">
                              <UserAvatar
                                src={userObj.profilePicture}
                                name={userObj.name || "User"}
                                size="md"
                              />
                              <span
                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${
                                  isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#3C65F5] transition truncate">
                                  {userObj.name}
                                </h5>
                                <span
                                  className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wide border shrink-0 ${
                                    isRecruiter
                                      ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                      : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                  }`}
                                >
                                  {role}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                <span className={isOnline ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""}>
                                  {isOnline ? "● Online" : "Offline"}
                                </span>
                                {item.headline && <span>•</span>}
                                {item.headline && <span className="truncate">{item.headline}</span>}
                              </div>

                              {item.location && (
                                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span>{item.location}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center">
                            {isStartingThis ? (
                              <Loader2 className="h-4 w-4 animate-spin text-[#3C65F5]" />
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3C65F5] opacity-0 group-hover:opacity-100 transition">
                                <MessageSquare className="h-3.5 w-3.5" />
                                Chat
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-3 px-4 text-xs text-slate-400 italic">
                    No people found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}

            {/* 2. CONVERSATIONS SECTION */}
            <div>
              <div className="px-4 py-2 bg-slate-50/70 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-[#3C65F5]" />
                  Conversations
                </span>
              </div>

              {filteredConversations.length > 0 ? (
                <div className="divide-y divide-slate-100/80 dark:divide-slate-800/80">
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
                    const isLastMsgVoice = (conv as any).lastMessageId?.messageType === "voice";

                    return (
                      <div
                        key={convId}
                        onClick={() => {
                          onSelectConversation(convId);
                          setSearchTerm("");
                        }}
                        className={`w-full text-left flex items-center gap-3 px-4 py-3.5 transition-all duration-150 relative group cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/70 dark:bg-blue-950/40 border-l-[3.5px] border-l-[#3C65F5]"
                            : "bg-white dark:bg-slate-900 border-l-[3.5px] border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <UserAvatar
                            src={partner?.profilePicture}
                            name={partner?.name || "User"}
                            size="md"
                          />
                          <span
                            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${
                              isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1 mb-0.5">
                            <span
                              className={`text-sm truncate ${
                                unreadCount > 0
                                  ? "font-extrabold text-slate-900 dark:text-white"
                                  : "font-bold text-slate-800 dark:text-slate-200"
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

                          {conv.jobId?.title && (
                            <div className="flex items-center gap-1 mb-1">
                              <Briefcase className="h-3 w-3 shrink-0 text-[#3C65F5]" />
                              <span className="text-[11px] font-semibold text-[#3C65F5] dark:text-blue-400 truncate max-w-[200px]">
                                {conv.jobId.title}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <p
                              className={`text-xs truncate ${
                                unreadCount > 0
                                  ? "font-semibold text-slate-800 dark:text-slate-300"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {isLastMsgVoice
                                ? "🎤 Voice message"
                                : isLastMsgImage
                                ? "📷 Photo"
                                : isLastMsgFile
                                ? "📎 Attachment"
                                : lastMsg || "Start the conversation"}
                            </p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {unreadCount > 0 && (
                                <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#3C65F5] px-1.5 text-[10px] font-extrabold text-white shadow-xs">
                                  {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                              )}

                              {/* Quick 3-dots action menu */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuConvId((prev) => (prev === convId ? null : convId));
                                  }}
                                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition focus:opacity-100 cursor-pointer"
                                  title="Conversation options"
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </button>

                                {openMenuConvId === convId && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 bottom-full mb-1 z-30 w-40 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xl animate-in fade-in zoom-in-95"
                                  >
                                    {unreadCount > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenMenuConvId(null);
                                          markConversationRead.mutate(convId);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#3C65F5] transition cursor-pointer"
                                      >
                                        <CheckCheck className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Mark as Read</span>
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenMenuConvId(null);
                                        setConvToDelete({ id: convId, name: partner?.name || "User" });
                                      }}
                                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                      <span>Delete Chat</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-3 px-4 text-xs text-slate-400 italic">
                  No existing conversations matching "{searchTerm}"
                </div>
              )}
            </div>

            {/* Global Empty State if neither people nor conversations found */}
            {!isLoadingUsers && foundUsers.length === 0 && filteredConversations.length === 0 && (
              <div className="py-10 text-center text-slate-400 px-6">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  No results found
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  No people or conversations matching "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        ) : filteredConversations.length === 0 ? (
          /* ── No Conversations at all Empty State ── */
          <div className="flex flex-col items-center justify-center h-full py-10 space-y-4 text-center px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-slate-800">
              <MessageSquareDot className="h-8 w-8 text-[#3C65F5]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Conversations Yet
              </p>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Search for a member above or connect with colleagues to start messaging.
              </p>
            </div>
            {userRole === "candidate" && (
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
            /* ── Default Conversation List ── */
          <div className="divide-y divide-slate-100/80 dark:divide-slate-800/80">
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
              const isLastMsgVoice = (conv as any).lastMessageId?.messageType === "voice";

              return (
                <div
                  key={convId}
                  onClick={() => onSelectConversation(convId)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 transition-all duration-150 relative group cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/70 dark:bg-blue-950/40 border-l-[3.5px] border-l-[#3C65F5]"
                      : "bg-white dark:bg-slate-900 border-l-[3.5px] border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="relative shrink-0">
                    <UserAvatar
                      src={partner?.profilePicture}
                      name={partner?.name || "User"}
                      size="md"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${
                        isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <span
                        className={`text-sm truncate ${
                          unreadCount > 0
                            ? "font-extrabold text-slate-900 dark:text-white"
                            : "font-bold text-slate-800 dark:text-slate-200"
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

                    {conv.jobId?.title && (
                      <div className="flex items-center gap-1 mb-1">
                        <Briefcase className="h-3 w-3 shrink-0 text-[#3C65F5]" />
                        <span className="text-[11px] font-semibold text-[#3C65F5] dark:text-blue-400 truncate max-w-[200px]">
                          {conv.jobId.title}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p
                        className={`text-xs truncate ${
                          unreadCount > 0
                            ? "font-semibold text-slate-800 dark:text-slate-300"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {isLastMsgVoice
                          ? "🎤 Voice message"
                          : isLastMsgImage
                          ? "📷 Photo"
                          : isLastMsgFile
                          ? "📎 Attachment"
                          : lastMsg || "Start the conversation"}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {unreadCount > 0 && (
                          <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#3C65F5] px-1.5 text-[10px] font-extrabold text-white shadow-xs">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}

                        {/* Quick 3-dots action menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuConvId((prev) => (prev === convId ? null : convId));
                            }}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition focus:opacity-100 cursor-pointer"
                            title="Conversation options"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>

                          {openMenuConvId === convId && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 bottom-full mb-1 z-30 w-40 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xl animate-in fade-in zoom-in-95"
                            >
                              {unreadCount > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuConvId(null);
                                    markConversationRead.mutate(convId);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#3C65F5] transition cursor-pointer"
                                >
                                  <CheckCheck className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Mark as Read</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuConvId(null);
                                  setConvToDelete({ id: convId, name: partner?.name || "User" });
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                <span>Delete Chat</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Conversation Confirmation Modal */}
      <DeleteConversationModal
        open={Boolean(convToDelete)}
        userName={convToDelete?.name || "this contact"}
        onClose={() => setConvToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteConversation.isPending}
      />
    </div>
  );
}
