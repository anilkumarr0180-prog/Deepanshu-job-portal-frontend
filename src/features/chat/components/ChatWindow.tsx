import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Send,
  Paperclip,
  Smile,
  User as UserIcon,
  Briefcase,
  X,
  ArrowLeft,
  MoreVertical,
  Mic,
  Search,
  ExternalLink,
  Copy,
  Check,
  BellOff,
  Bell,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import type { ChatConversation, ChatMessage, ChatUser } from "../types/chat.types";
import { getUserIdString } from "../types/chat.types";
import type { TypingUserEntry } from "../store/chatSlice";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import DeleteConversationModal from "./DeleteConversationModal";
import { useUserProfileModal } from "@/features/posts/context/UserProfileContext";
import { useConnectionStatus } from "@/features/posts/hooks/useConnectionStatus";
import { useClearChatMessages } from "../hooks/useChat";

interface ChatWindowProps {
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  currentUserId: string;
  onlineUserIds: string[];
  typingUsers: (TypingUserEntry | string)[];
  onSendMessage: (messageText: string, messageType?: string, attachments?: any[]) => void;
  onEditMessage?: (messageId: string, newText: string) => void;
  onDeleteMessage?: (messageId: string, deleteForEveryone: boolean) => void;
  onDeleteConversation?: (conversationId: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  isLoadingMessages: boolean;
  onBackToSidebar?: () => void;
}

const QUICK_EMOJIS = ["👍", "❤️", "😊", "😂", "🎉", "💼", "👏", "🙏", "✅", "🔥", "💯", "👀"];

// Check if two consecutive messages are from same sender (for bubble grouping)
function isSameSender(a: ChatMessage, b: ChatMessage): boolean {
  return getUserIdString(a.senderId) === getUserIdString(b.senderId);
}

export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onlineUserIds,
  typingUsers,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onTypingStart,
  onTypingStop,
  isLoadingMessages,
  onBackToSidebar,
}: ChatWindowProps) {
  const { openUserProfile } = useUserProfileModal();
  const clearChat = useClearChatMessages();

  const [inputText, setInputText] = useState("");
  const [showQuickEmojis, setShowQuickEmojis] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  const [selectedAttachment, setSelectedAttachment] = useState<{
    url: string;
    name: string;
    type: "image" | "file";
    preview?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPanelRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!isSearching) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingUsers, isSearching]);

  // Close emoji panel and 3-dots menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiPanelRef.current && !emojiPanelRef.current.contains(e.target as Node)) {
        setShowQuickEmojis(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-resize textarea
  const autoResizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  // Filter messages when searching (declared before early return to respect React rules of hooks)
  const displayedMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter((m) => m.message?.toLowerCase().includes(q));
  }, [messages, searchQuery]);

  const candidateIdStr = getUserIdString(conversation?.candidateId);
  const isCandidate = candidateIdStr === currentUserId;
  const partner: ChatUser | undefined = isCandidate
    ? (conversation?.recruiterId as ChatUser)
    : (conversation?.candidateId as ChatUser);
  const partnerId = getUserIdString(partner);
  const isPartnerOnline = onlineUserIds.includes(partnerId);

  // Query live connection status
  const { data: connectionStatusData } = useConnectionStatus(partnerId, Boolean(partnerId && partnerId !== currentUserId));
  const isDirectConnected = connectionStatusData?.status === "connected";

  const isPartnerTyping = typingUsers.some((u) => {
    if (typeof u === "string") return u === partnerId;
    return u.userId === partnerId;
  });

  const partnerTypingEntry = typingUsers.find((entry) => {
    const id = typeof entry === "string" ? entry : entry.userId;
    return id === partnerId;
  });

  const typingName =
    typeof partnerTypingEntry === "object" && partnerTypingEntry?.userName
      ? partnerTypingEntry.userName
      : partner?.name;

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-[#030712] dark:to-slate-900 p-8 text-center">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#3C65F5] to-indigo-600 shadow-xl shadow-blue-500/30">
            <Briefcase className="h-9 w-9 text-white" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white shadow border-2 border-white dark:border-slate-900">✓</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select a Conversation</h3>
        <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Pick a conversation from the sidebar to start messaging. Real-time updates are active.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Chat Connected
        </div>
      </div>
    );
  }

  const handleOpenPartnerProfile = () => {
    if (!partner) return;
    openUserProfile({
      _id: partnerId,
      name: partner.name,
      role: partner.role,
      email: partner.email,
      profilePicture: partner.profilePicture,
    });
    setShowMenu(false);
  };

  const handleCopyEmail = () => {
    if (partner?.email) {
      navigator.clipboard.writeText(partner.email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        toast(`Notifications muted for ${partner?.name || "this chat"}`, { icon: "🔕" });
      } else {
        toast.success("Notifications unmuted");
      }
      return next;
    });
    setShowMenu(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    autoResizeTextarea();
    onTypingStart();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, 2000);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && !selectedAttachment) || !conversation) return;

    const attachments = selectedAttachment
      ? [
          {
            url: selectedAttachment.url,
            name: selectedAttachment.name,
            mimeType: selectedAttachment.type === "image" ? "image/png" : "application/pdf",
          },
        ]
      : [];

    const msgType = selectedAttachment ? selectedAttachment.type : "text";

    onSendMessage(
      inputText.trim() || (selectedAttachment ? "Attachment" : ""),
      msgType,
      attachments
    );
    setInputText("");
    setSelectedAttachment(null);
    setShowQuickEmojis(false);
    onTypingStop();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImg = file.type.startsWith("image/");
    const objectUrl = URL.createObjectURL(file);
    setSelectedAttachment({
      url: objectUrl,
      name: file.name,
      type: isImg ? "image" : "file",
      preview: isImg ? objectUrl : undefined,
    });
    // Reset input for re-selection
    e.target.value = "";
  };

  const handleEmojiClick = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleConfirmClearChat = async () => {
    if (!conversation?._id) return;
    try {
      await clearChat.mutateAsync(conversation._id);
      setShowDeleteModal(false);
      toast.success("Chat messages deleted");
    } catch (err) {
      toast.error("Failed to delete chat messages");
    }
  };

  // Build message list with date headers & grouping
  const renderMessages = () => {
    if (displayedMessages.length === 0) {
      if (searchQuery) {
        return (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
            <Search className="h-7 w-7 mb-2 opacity-40" />
            <p className="text-sm font-semibold text-slate-600">No messages matching "{searchQuery}"</p>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center h-full py-16 space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Briefcase className="h-7 w-7 text-[#3C65F5]" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No messages yet</p>
          <p className="text-xs text-slate-400">Send a message below to start the conversation!</p>
        </div>
      );
    }

    const elements: React.ReactNode[] = [];
    let lastDateStr = "";

    displayedMessages.forEach((msg, idx) => {
      const msgDate = new Date(msg.createdAt);
      const now = new Date();
      const isToday = msgDate.toDateString() === now.toDateString();
      const isYesterday =
        new Date(now.setDate(now.getDate() - 1)).toDateString() === msgDate.toDateString();

      const dateStr = isToday
        ? "Today"
        : isYesterday
        ? "Yesterday"
        : msgDate.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });

      if (dateStr !== lastDateStr) {
        lastDateStr = dateStr;
        elements.push(
          <div key={`date-${dateStr}`} className="flex justify-center my-5">
            <span className="rounded-full bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/60 px-4 py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 shadow-sm">
              {dateStr}
            </span>
          </div>
        );
      }

      const senderIdStr = getUserIdString(msg.senderId);
      const isSelf = senderIdStr === currentUserId;
      const nextMsg = idx < displayedMessages.length - 1 ? displayedMessages[idx + 1] : null;
      const showAvatar = !isSelf && (!nextMsg || !isSameSender(msg, nextMsg));

      elements.push(
        <MessageBubble
          key={msg._id || msg.id || idx}
          message={msg}
          isSelf={isSelf}
          showAvatar={showAvatar}
          senderName={partner?.name}
          senderAvatar={partner?.profilePicture}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
        />
      );
    });

    return elements;
  };

  const canSend = inputText.trim().length > 0 || selectedAttachment !== null;

  return (
    <div className="flex h-full w-full flex-col bg-[#f0f2f5] dark:bg-[#030712]">
      {/* ── Production LinkedIn-Standard Header ── */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-5 py-3 shadow-xs">
        {/* Left Side: Avatar, Name + Meta & Status */}
        <div className="flex items-center gap-3 min-w-0">
          {onBackToSidebar && (
            <button
              type="button"
              onClick={onBackToSidebar}
              className="sm:hidden rounded-xl p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          {/* Avatar with click trigger */}
          <button
            type="button"
            onClick={handleOpenPartnerProfile}
            className="relative cursor-pointer group shrink-0 text-left p-0 border-0 bg-transparent"
            title={`View ${partner?.name || "User"}'s profile`}
          >
            {partner?.profilePicture ? (
              <img
                src={partner.profilePicture}
                alt={partner?.name}
                className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3C65F5] to-indigo-700 font-bold text-white shadow-2xs text-sm group-hover:scale-105 transition-transform">
                {partner?.name ? partner.name.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
              </div>
            )}
            {/* Online Status Dot */}
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${
                isPartnerOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          </button>

          {/* Name + Inline 1st badge + Role & Status */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleOpenPartnerProfile}
                className="text-left font-bold text-[15px] text-slate-900 dark:text-white hover:text-[#3C65F5] dark:hover:text-blue-400 transition truncate leading-none cursor-pointer"
              >
                {partner?.name || "Participant"}
              </button>

              {/* Subtle inline 1st degree connection tag */}
              {isDirectConnected && (
                <span className="inline-flex items-center rounded px-1.5 py-0.2 text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-[#3C65F5] dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20 leading-tight">
                  1st
                </span>
              )}

              {/* Role descriptor */}
              <span className="text-xs text-slate-400 font-normal truncate hidden sm:inline">
                • {partner?.role === "recruiter" ? "Hiring Partner" : "Candidate"}
              </span>

              {/* Job context pill (if conversation belongs to an application) */}
              {conversation.jobId?.title && (
                <span className="text-xs text-slate-400 font-normal truncate hidden md:inline">
                  • {conversation.jobId.title}
                </span>
              )}
            </div>

            {/* Subtitle / Active Status */}
            <p className="text-[11px] font-medium mt-1 leading-none">
              {isPartnerTyping ? (
                <span className="text-[#3C65F5] italic animate-pulse">typing...</span>
              ) : isPartnerOnline ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              ) : (
                <span className="text-slate-400">Offline</span>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Icons & 3-Dots Menu */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Search in Chat Button */}
          <button
            type="button"
            onClick={() => {
              setIsSearching((prev) => !prev);
              if (isSearching) setSearchQuery("");
            }}
            className={`rounded-xl p-2 transition ${
              isSearching
                ? "bg-blue-50 dark:bg-blue-500/10 text-[#3C65F5] dark:text-blue-400"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
            title="Search in conversation"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* View Profile Quick Icon */}
          <button
            type="button"
            onClick={handleOpenPartnerProfile}
            className="rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#3C65F5] dark:hover:text-blue-400 transition"
            title="View Profile"
          >
            <ExternalLink className="h-4 w-4" />
          </button>

          {/* 3-Dots Utility Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className={`rounded-xl p-2 transition ${
                showMenu
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
              title="Conversation options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 z-30 mt-1.5 w-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl animate-in fade-in zoom-in-95">
                {/* View Full Profile */}
                <button
                  type="button"
                  onClick={handleOpenPartnerProfile}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#3C65F5] dark:hover:text-blue-400 transition"
                >
                  <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>View Member Profile</span>
                </button>

                {/* Search In Chat */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSearching(true);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                  <span>Search in Chat</span>
                </button>

                {/* Mute Notifications */}
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  {isMuted ? (
                    <>
                      <Bell className="h-3.5 w-3.5 text-slate-400" />
                      <span>Unmute Notifications</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="h-3.5 w-3.5 text-slate-400" />
                      <span>Mute Notifications</span>
                    </>
                  )}
                </button>

                {/* Copy Email */}
                {partner?.email && (
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                        <span>Copy Email Address</span>
                      </>
                    )}
                  </button>
                )}

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                {/* Delete Chat */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteModal(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  <span>Delete Chat</span>
                </button>

                {/* Safety / Report */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    toast.success("Report submitted to trust & safety team.");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                  <span>Report / Block</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── In-Chat Search Bar (when active) ── */}
      {isSearching && (
        <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 text-xs shadow-xs animate-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this conversation..."
              autoFocus
              className="w-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>
          {searchQuery && (
            <span className="text-[11px] text-slate-400 shrink-0">
              {displayedMessages.length} results
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setIsSearching(false);
              setSearchQuery("");
            }}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Messages Area ── */}
      <div
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-0.5 bg-slate-100/60 dark:bg-[#030712]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {isLoadingMessages ? (
          <div className="space-y-4 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`h-10 rounded-2xl bg-white/80 dark:bg-slate-800/80 animate-pulse shadow-sm ${
                    i % 2 === 0 ? "w-48 bg-blue-200/50 dark:bg-blue-900/40" : "w-56"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : (
          renderMessages()
        )}

        {isPartnerTyping && <TypingIndicator userName={typingName} />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Attachment Preview ── */}
      {selectedAttachment && (
        <div className="mx-3 mb-2 rounded-2xl border border-[#3C65F5]/30 bg-[#3C65F5]/5 dark:bg-[#3C65F5]/10 p-3 flex items-center gap-3 shadow-sm">
          {selectedAttachment.type === "image" && selectedAttachment.preview ? (
            <img
              src={selectedAttachment.preview}
              alt="Preview"
              className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#3C65F5]/10 border border-[#3C65F5]/20">
              <Paperclip className="h-5 w-5 text-[#3C65F5]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{selectedAttachment.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 capitalize">{selectedAttachment.type} attachment</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedAttachment(null)}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Input Area ── */}
      <div className="relative bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 px-3 py-3">
        {/* Emoji Panel */}
        {showQuickEmojis && (
          <div
            ref={emojiPanelRef}
            className="absolute bottom-full left-3 mb-2 z-30 flex flex-wrap gap-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-xl w-[220px]"
          >
            {QUICK_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => handleEmojiClick(e)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90 transition-all"
              >
                {e}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-end gap-2">
          {/* Attach */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 rounded-2xl p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#3C65F5] transition"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* Emoji */}
          <button
            type="button"
            onClick={() => setShowQuickEmojis((v) => !v)}
            className={`shrink-0 rounded-2xl p-2.5 transition ${
              showQuickEmojis
                ? "text-[#3C65F5] bg-blue-50 dark:bg-blue-500/10"
                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#3C65F5]"
            }`}
            title="Emoji"
          >
            <Smile className="h-5 w-5" />
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send)"
              className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all focus:border-[#3C65F5] focus:bg-white dark:focus:bg-slate-800 focus:shadow-sm placeholder:text-slate-400 leading-relaxed"
              style={{ minHeight: "42px", maxHeight: "120px" }}
            />
          </div>

          {/* Send / Mic button */}
          <button
            type={canSend ? "submit" : "button"}
            className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all active:scale-90 ${
              canSend
                ? "bg-[#3C65F5] text-white shadow-blue-500/30 hover:bg-[#2954ea]"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
            }`}
            title={canSend ? "Send" : "Voice message"}
          >
            {canSend ? (
              <Send className="h-4 w-4 translate-x-[1px]" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
        </form>

        <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500 select-none">
          🔒 Messages are secured end-to-end for your job application
        </p>
      </div>

      {/* Delete Chat Confirmation Modal */}
      <DeleteConversationModal
        open={showDeleteModal}
        userName={partner?.name || "this contact"}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmClearChat}
        isLoading={clearChat.isPending}
      />
    </div>
  );
}
