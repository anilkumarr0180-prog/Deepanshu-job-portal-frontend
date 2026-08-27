import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  MessageSquare,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Send,
  ExternalLink,
  Search,
  X,
  Loader2,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/features/auth/hooks/useAuth";
import { useRealtime } from "@/shared/context/RealtimeContext";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useCreateConversation,
} from "../hooks/useChat";
import { UserAvatar } from "@/shared/components/UserAvatar";
import useDebounce from "@/shared/hooks/useDebounce";
import { searchUsers } from "@/features/posts/api/connectionApi";
import type { RootState } from "@/app/store/store";
import type { ChatConversation, ChatMessage } from "../types/chat.types";
import { getUserIdString } from "../types/chat.types";

function formatMiniChatTime(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function FloatingMessagingDock() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { joinConversation } = useRealtime();

  // Hide dock if already on the dedicated full messages page
  const isMessagesPage = location.pathname.includes("/messages");

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isStartingChatWithId, setIsStartingChatWithId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [textInput, setTextInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const unreadTotal = useSelector((state: RootState) => state.chat.unreadTotalCount);
  const onlineUsers = useSelector((state: RootState) => state.chat.onlineUsers);
  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations(1, 20);
  const conversations: ChatConversation[] = conversationsData?.conversations || [];

  const createConversation = useCreateConversation();

  // Search users on JobBox network when searching in mini dock
  const isSearchingPeople = debouncedSearchQuery.trim().length >= 2;
  const { data: userSearchResults, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["mini-dock-user-search", debouncedSearchQuery.trim()],
    queryFn: () => searchUsers({ q: debouncedSearchQuery.trim(), limit: 4 }),
    enabled: isSearchingPeople,
    staleTime: 1000 * 30,
  });

  const foundUsers = userSearchResults?.items || [];

  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(
    activeConversation?._id || null,
    1,
    50
  );
  const messages: ChatMessage[] = messagesData?.messages || [];

  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  const currentUserId = user?._id || user?.id;

  const visibleConversations = useMemo(() => {
    try {
      const key = "jobbox_deleted_convs";
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
    if (!searchQuery.trim()) return visibleConversations;
    const q = searchQuery.toLowerCase();
    return visibleConversations.filter((c) => {
      const candidateIdStr = getUserIdString(c.candidateId);
      const otherUser = candidateIdStr === String(currentUserId) ? c.recruiterId : c.candidateId;
      const lastMsg = (c as any).lastMessageId?.message || "";
      const jobTitle = c.jobId?.title || "";
      return (
        otherUser?.name?.toLowerCase().includes(q) ||
        lastMsg.toLowerCase().includes(q) ||
        jobTitle.toLowerCase().includes(q)
      );
    });
  }, [visibleConversations, currentUserId, searchQuery]);

  // Scroll to bottom of mini-chat
  useEffect(() => {
    if (activeConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeConversation]);

  if (isMessagesPage || !user) return null;

  const handleOpenConversation = (conv: ChatConversation) => {
    setActiveConversation(conv);
    const convId = conv._id || conv.id;
    if (convId) {
      joinConversation(convId);
    }
  };

  const handleSelectPerson = async (targetUserItem: any) => {
    const userObj = targetUserItem.user || targetUserItem;
    const targetUserId = String(userObj._id || userObj.id || "");
    if (!targetUserId) return;

    // 1. Check existing conversation
    const existingConv = conversations.find((c) => {
      const candidateIdStr = getUserIdString(c.candidateId);
      const recruiterIdStr = getUserIdString(c.recruiterId);
      const partnerId = candidateIdStr === String(currentUserId) ? recruiterIdStr : candidateIdStr;
      return partnerId === targetUserId;
    });

    if (existingConv) {
      handleOpenConversation(existingConv);
      setSearchQuery("");
      return;
    }

    // 2. Create or find conversation
    try {
      setIsStartingChatWithId(targetUserId);
      const newConv = await createConversation.mutateAsync({ targetUserId });
      handleOpenConversation(newConv);
      setSearchQuery("");
    } catch (err) {
      console.error("Failed to start conversation in dock:", err);
    } finally {
      setIsStartingChatWithId(null);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = textInput.trim();
    if (!trimmed || !activeConversation?._id || isSending) return;

    sendMessage({
      conversationId: activeConversation._id,
      message: trimmed,
      messageType: "text",
    });
    setTextInput("");
  };

  const handleOpenFullChat = () => {
    setIsOpen(false);
    const targetUserId = activeConversation
      ? String(activeConversation.candidateId?._id) === String(currentUserId)
        ? activeConversation.recruiterId?._id
        : activeConversation.candidateId?._id
      : undefined;

    const base = user?.role === "recruiter" ? "/recruiter/messages" : "/candidate/messages";
    navigate(targetUserId ? `${base}?userId=${targetUserId}` : base);
  };

  const activeOtherUser = activeConversation
    ? String(activeConversation.candidateId?._id) === String(currentUserId)
      ? activeConversation.recruiterId
      : activeConversation.candidateId
    : null;

  const activeOtherUserId = getUserIdString(activeOtherUser);
  const isPartnerOnline = Boolean(activeOtherUserId && onlineUsers.includes(activeOtherUserId));
  const isUserOnline = Boolean(currentUserId && onlineUsers.includes(String(currentUserId)));

  return (
    <div className="fixed bottom-0 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* ── Collapsed Dock Bar ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 rounded-t-2xl bg-white dark:bg-slate-900 px-5 py-3 border border-b-0 border-slate-200/90 dark:border-slate-800 shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer group"
          aria-label="Open Messaging Dock"
        >
          <div className="relative">
            <UserAvatar src={user.profilePicture} name={user.name} size="xs" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 transition-colors ${
                isUserOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#3C65F5] dark:group-hover:text-blue-400 transition">
              Messaging
            </span>
            {unreadTotal > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-extrabold text-white animate-pulse">
                {unreadTotal}
              </span>
            )}
          </div>

          <ChevronUp className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 ml-1 transition" />
        </button>
      )}

      {/* ── Expanded Window ── */}
      {isOpen && (
        <div className="w-[330px] sm:w-[360px] h-[460px] bg-white dark:bg-slate-900 rounded-t-2xl border border-b-0 border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
            {activeConversation ? (
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => setActiveConversation(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                  title="Back to conversations"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="relative shrink-0">
                  <UserAvatar
                    src={activeOtherUser?.profilePicture}
                    name={activeOtherUser?.name || "User"}
                    size="xs"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-1 ring-white dark:ring-slate-900 transition-colors ${
                      isPartnerOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {activeOtherUser?.name || "Chat"}
                  </h4>
                  {isPartnerOnline ? (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400">Offline</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <UserAvatar src={user.profilePicture} name={user.name} size="xs" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Messaging</span>
                {unreadTotal > 0 && (
                  <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                    {unreadTotal}
                  </span>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleOpenFullChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#3C65F5] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                title="Open full page chat"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Minimize dock"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {activeConversation ? (
            /* ── Mini-Chat Messages Screen ── */
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950/60">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {isLoadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-[#3C65F5]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center p-4 text-slate-400">
                    <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Start the conversation</p>
                    <p className="text-[10px] text-slate-400">Say hello to {activeOtherUser?.name}!</p>
                  </div>
                ) : (
                  messages.map((m: any) => {
                    const isMe = String(m.senderId?._id || m.senderId) === String(currentUserId);
                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                            isMe
                              ? "bg-[#3C65F5] text-white rounded-br-xs shadow-2xs"
                              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs shadow-2xs"
                          }`}
                        >
                          {m.message}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                          {formatMiniChatTime(m.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 shrink-0"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-[#3C65F5] transition"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim() || isSending}
                  className="p-2 rounded-xl bg-[#3C65F5] text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 cursor-pointer shadow-2xs"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          ) : (
            /* ── Conversation List Screen ── */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search Bar */}
              <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search people or messages..."
                    className="h-8 w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-8 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#3C65F5]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content / Search Results */}
              <div className="flex-1 overflow-y-auto">
                {isLoadingConversations ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2.5 animate-pulse">
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="h-2.5 w-32 bg-slate-100 dark:bg-slate-800/60 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.trim() ? (
                  /* ── Search Mode ── */
                  <div className="pb-3">
                    {/* PEOPLE SECTION */}
                    {(isSearchingPeople || isLoadingUsers || foundUsers.length > 0) && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border-y border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Users className="h-3 w-3 text-[#3C65F5]" />
                            People
                          </span>
                          {isLoadingUsers && <Loader2 className="h-3 w-3 animate-spin text-[#3C65F5]" />}
                        </div>

                        {isLoadingUsers ? (
                          <div className="p-3 space-y-2">
                            {[1, 2].map((i) => (
                              <div key={i} className="flex items-center gap-2 animate-pulse">
                                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                                <div className="space-y-1 flex-1">
                                  <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : foundUsers.length > 0 ? (
                          <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
                            {foundUsers.map((item: any) => {
                              const userObj = item.user || item;
                              const targetUserId = String(userObj._id || userObj.id || "");
                              const isOtherOnline = onlineUsers.includes(targetUserId);
                              const isStartingThis = isStartingChatWithId === targetUserId;

                              return (
                                <div
                                  key={targetUserId}
                                  onClick={() => !isStartingThis && handleSelectPerson(item)}
                                  className="flex items-center justify-between gap-2.5 p-2.5 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="relative shrink-0">
                                      <UserAvatar
                                        src={userObj.profilePicture}
                                        name={userObj.name || "User"}
                                        size="sm"
                                      />
                                      <span
                                        className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white dark:border-slate-900 transition-colors ${
                                          isOtherOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#3C65F5] transition truncate">
                                        {userObj.name}
                                      </h5>
                                      <p className="text-[10px] text-slate-400 truncate">
                                        {isOtherOnline ? "Online" : "Offline"} • {userObj.role || "Member"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="shrink-0">
                                    {isStartingThis ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3C65F5]" />
                                    ) : (
                                      <span className="text-[10px] font-bold text-[#3C65F5] opacity-0 group-hover:opacity-100 transition">
                                        Chat
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-2 px-3 text-[11px] text-slate-400 italic">
                            No people found
                          </div>
                        )}
                      </div>
                    )}

                    {/* CONVERSATIONS SECTION */}
                    <div>
                      <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border-y border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-[#3C65F5]" />
                          Conversations
                        </span>
                      </div>

                      {filteredConversations.length > 0 ? (
                        <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
                          {filteredConversations.map((conv) => {
                            const candidateIdStr = getUserIdString(conv.candidateId);
                            const otherUser =
                              candidateIdStr === String(currentUserId)
                                ? conv.recruiterId
                                : conv.candidateId;
                            const otherUserId = getUserIdString(otherUser);
                            const isOtherOnline = Boolean(otherUserId && onlineUsers.includes(otherUserId));
                            const unreadCount = conv.unreadCount || 0;

                            return (
                              <div
                                key={conv._id || conv.id}
                                onClick={() => {
                                  handleOpenConversation(conv);
                                  setSearchQuery("");
                                }}
                                className={`flex items-center gap-3 p-3 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition cursor-pointer group ${
                                  unreadCount > 0 ? "bg-blue-50/30 dark:bg-blue-950/25" : ""
                                }`}
                              >
                                <div className="relative shrink-0">
                                  <UserAvatar
                                    src={otherUser?.profilePicture}
                                    name={otherUser?.name || "User"}
                                    size="sm"
                                  />
                                  <span
                                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${
                                      isOtherOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <h5 className={`text-xs truncate ${unreadCount > 0 ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-800 dark:text-slate-200"}`}>
                                      {otherUser?.name || "User"}
                                    </h5>
                                    {conv.lastMessageAt && (
                                      <span className={`text-[10px] shrink-0 ${unreadCount > 0 ? "font-bold text-[#3C65F5]" : "text-slate-400"}`}>
                                        {formatMiniChatTime(conv.lastMessageAt)}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between gap-2 mt-0.5">
                                    <p className={`text-[11px] truncate ${unreadCount > 0 ? "font-semibold text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                                      {conv.lastMessageId?.message || "No messages yet"}
                                    </p>
                                    {unreadCount > 0 && (
                                      <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-[#3C65F5] px-1 text-[9px] font-extrabold text-white shadow-xs">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-2 px-3 text-[11px] text-slate-400 italic">
                          No conversations matching "{searchQuery}"
                        </div>
                      )}
                    </div>

                    {!isLoadingUsers && foundUsers.length === 0 && filteredConversations.length === 0 && (
                      <div className="py-6 text-center text-slate-400 px-4">
                        <Search className="h-6 w-6 mx-auto mb-1.5 opacity-30" />
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No results found</p>
                      </div>
                    )}
                  </div>
                ) : filteredConversations.length > 0 ? (
                  /* ── Default Conversation List ── */
                  <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {filteredConversations.map((conv) => {
                      const candidateIdStr = getUserIdString(conv.candidateId);
                      const otherUser =
                        candidateIdStr === String(currentUserId)
                          ? conv.recruiterId
                          : conv.candidateId;
                      const otherUserId = getUserIdString(otherUser);
                      const isOtherOnline = Boolean(otherUserId && onlineUsers.includes(otherUserId));
                      const unreadCount = conv.unreadCount || 0;

                      return (
                        <div
                          key={conv._id || conv.id}
                          onClick={() => handleOpenConversation(conv)}
                          className={`flex items-center gap-3 p-3 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition cursor-pointer group ${
                            unreadCount > 0 ? "bg-blue-50/30 dark:bg-blue-950/25" : ""
                          }`}
                        >
                          <div className="relative shrink-0">
                            <UserAvatar
                              src={otherUser?.profilePicture}
                              name={otherUser?.name || "User"}
                              size="sm"
                            />
                            <span
                              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${
                                isOtherOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                              }`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h5 className={`text-xs truncate ${unreadCount > 0 ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-800 dark:text-slate-200"}`}>
                                {otherUser?.name || "User"}
                              </h5>
                              {conv.lastMessageAt && (
                                <span className={`text-[10px] shrink-0 ${unreadCount > 0 ? "font-bold text-[#3C65F5]" : "text-slate-400"}`}>
                                  {formatMiniChatTime(conv.lastMessageAt)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <p className={`text-[11px] truncate ${unreadCount > 0 ? "font-semibold text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                                {conv.lastMessageId?.message || "No messages yet"}
                              </p>
                              {unreadCount > 0 && (
                                <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-[#3C65F5] px-1 text-[9px] font-extrabold text-white shadow-xs">
                                  {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No conversations</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Search for members above to start chatting
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
