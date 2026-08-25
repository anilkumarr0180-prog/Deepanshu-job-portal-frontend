import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "@/features/auth/hooks/useAuth";
import { useConversations, useMessages, useSendMessage, useMarkConversationRead } from "../hooks/useChat";
import { UserAvatar } from "@/shared/components/UserAvatar";
import type { RootState } from "@/app/store/store";
import type { ChatConversation, ChatMessage } from "../types/chat.types";

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

  // Hide dock if already on the dedicated full messages page
  const isMessagesPage = location.pathname.includes("/messages");

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [textInput, setTextInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const unreadTotal = useSelector((state: RootState) => state.chat.unreadTotalCount);
  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations(1, 20);
  const conversations: ChatConversation[] = conversationsData?.conversations || [];

  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(
    activeConversation?._id || null,
    1,
    50
  );
  const messages: ChatMessage[] = messagesData?.messages || [];

  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: markRead } = useMarkConversationRead();

  const currentUserId = user?._id || user?.id;

  // Mark active conversation read
  useEffect(() => {
    if (isOpen && activeConversation?._id) {
      markRead(activeConversation._id);
    }
  }, [isOpen, activeConversation, markRead]);

  // Scroll to bottom of mini-chat
  useEffect(() => {
    if (activeConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeConversation]);

  if (isMessagesPage || !user) return null;

  const filteredConversations = conversations.filter((c) => {
    const otherUser = String(c.candidateId?._id) === String(currentUserId) ? c.recruiterId : c.candidateId;
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenConversation = (conv: ChatConversation) => {
    setActiveConversation(conv);
    markRead(conv._id);
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

  return (
    <div className="fixed bottom-0 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* ── Collapsed Dock Bar ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 rounded-t-2xl bg-white px-5 py-3 border border-b-0 border-slate-200/90 shadow-2xl hover:bg-slate-50 transition cursor-pointer group"
          aria-label="Open Messaging Dock"
        >
          <div className="relative">
            <UserAvatar src={user.profilePicture} name={user.name} size="xs" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#3C65F5] transition">
              Messaging
            </span>
            {unreadTotal > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-extrabold text-white animate-pulse">
                {unreadTotal}
              </span>
            )}
          </div>

          <ChevronUp className="h-4 w-4 text-slate-400 group-hover:text-slate-600 ml-1 transition" />
        </button>
      )}

      {/* ── Expanded Window ── */}
      {isOpen && (
        <div className="w-[330px] sm:w-[360px] h-[460px] bg-white rounded-t-2xl border border-b-0 border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shrink-0">
            {activeConversation ? (
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => setActiveConversation(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition"
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
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {activeOtherUser?.name || "Chat"}
                  </h4>
                  <span className="text-[10px] font-semibold text-emerald-600">Active</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <UserAvatar src={user.profilePicture} name={user.name} size="xs" />
                <span className="text-xs font-bold text-slate-900">Messaging</span>
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#3C65F5] hover:bg-blue-50 transition"
                title="Open full page chat"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Minimize dock"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {activeConversation ? (
            /* ── Mini-Chat Messages Screen ── */
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {isLoadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-[#3C65F5]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center p-4 text-slate-400">
                    <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-xs font-semibold text-slate-600">Start the conversation</p>
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
                              : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs"
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
                className="p-2 bg-white border-t border-slate-200/80 flex items-center gap-1.5 shrink-0"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-[#3C65F5] transition"
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
              <div className="p-2.5 border-b border-slate-100 bg-slate-50/50">
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="h-8 w-full rounded-xl bg-white border border-slate-200 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#3C65F5]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                {isLoadingConversations ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2.5 animate-pulse">
                        <div className="h-8 w-8 rounded-full bg-slate-200" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 w-20 bg-slate-200 rounded" />
                          <div className="h-2.5 w-32 bg-slate-100 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => {
                    const otherUser =
                      String(conv.candidateId?._id) === String(currentUserId)
                        ? conv.recruiterId
                        : conv.candidateId;
                    const unread = conv.unreadCount && conv.unreadCount > 0;

                    return (
                      <div
                        key={conv._id}
                        onClick={() => handleOpenConversation(conv)}
                        className={`flex items-center gap-3 p-3 hover:bg-blue-50/50 transition cursor-pointer group ${
                          unread ? "bg-blue-50/20" : ""
                        }`}
                      >
                        <div className="relative shrink-0">
                          <UserAvatar
                            src={otherUser?.profilePicture}
                            name={otherUser?.name || "User"}
                            size="sm"
                          />
                          {unread && (
                            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#3C65F5] ring-2 ring-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className={`text-xs truncate ${unread ? "font-bold text-slate-900" : "font-semibold text-slate-800"}`}>
                              {otherUser?.name}
                            </h5>
                            {conv.lastMessageAt && (
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {formatMiniChatTime(conv.lastMessageAt)}
                              </span>
                            )}
                          </div>

                          <p className={`text-[11px] truncate mt-0.5 ${unread ? "font-semibold text-[#3C65F5]" : "text-slate-500"}`}>
                            {conv.lastMessageId?.message || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-semibold text-slate-600">No conversations</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Connect with members to chat directly
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
