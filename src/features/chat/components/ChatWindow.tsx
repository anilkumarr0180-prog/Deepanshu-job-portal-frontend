import { useState, useRef, useEffect, useCallback } from "react";
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
} from "lucide-react";

import type { ChatConversation, ChatMessage, ChatUser } from "../types/chat.types";
import { getUserIdString } from "../types/chat.types";
import type { TypingUserEntry } from "../store/chatSlice";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  currentUserId: string;
  onlineUserIds: string[];
  typingUsers: (TypingUserEntry | string)[];
  onSendMessage: (messageText: string, messageType?: string, attachments?: any[]) => void;
  onEditMessage?: (messageId: string, newText: string) => void;
  onDeleteMessage?: (messageId: string, deleteForEveryone: boolean) => void;
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
  const [inputText, setInputText] = useState("");
  const [showQuickEmojis, setShowQuickEmojis] = useState(false);
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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Close emoji panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiPanelRef.current && !emojiPanelRef.current.contains(e.target as Node)) {
        setShowQuickEmojis(false);
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

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 text-center">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#3C65F5] to-indigo-600 shadow-xl shadow-blue-500/30">
            <Briefcase className="h-9 w-9 text-white" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white shadow border-2 border-white">✓</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Select a Conversation</h3>
        <p className="mt-2 max-w-xs text-sm text-slate-500 leading-relaxed">
          Pick a conversation from the sidebar to start messaging. Real-time updates are active.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Chat Connected
        </div>
      </div>
    );
  }

  const candidateIdStr = getUserIdString(conversation.candidateId);
  const isCandidate = candidateIdStr === currentUserId;
  const partner: ChatUser = isCandidate ? conversation.recruiterId : conversation.candidateId;
  const partnerId = getUserIdString(partner);
  const isPartnerOnline = onlineUserIds.includes(partnerId);

  const partnerTypingEntry = typingUsers.find((entry) => {
    const id = typeof entry === "string" ? entry : entry.userId;
    return id === partnerId;
  });
  const isPartnerTyping = Boolean(partnerTypingEntry);
  const typingName =
    typeof partnerTypingEntry === "object" && partnerTypingEntry.userName
      ? partnerTypingEntry.userName
      : partner?.name;

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

    const msgType = selectedAttachment
      ? selectedAttachment.type === "image"
        ? "image"
        : "file"
      : "text";

    onSendMessage(
      inputText.trim() || selectedAttachment?.name || "Attachment",
      msgType,
      attachments
    );
    setInputText("");
    setSelectedAttachment(null);
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

  const addEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    setShowQuickEmojis(false);
    textareaRef.current?.focus();
  };

  // Build message list with date headers & grouping
  const renderMessages = () => {
    if (messages.length === 0) {
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

    messages.forEach((msg, idx) => {
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
            <span className="rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/70 px-4 py-1 text-[11px] font-semibold text-slate-500 shadow-sm">
              {dateStr}
            </span>
          </div>
        );
      }

      const senderIdStr = getUserIdString(msg.senderId);
      const isSelf = senderIdStr === currentUserId;
      const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;
      // Show avatar only if next message is from a different sender (bottom of a group)
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
    <div className="flex h-full w-full flex-col bg-[#f0f2f5]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-white border-b border-slate-200/80 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          {onBackToSidebar && (
            <button
              type="button"
              onClick={onBackToSidebar}
              className="sm:hidden rounded-xl p-1.5 text-slate-500 hover:bg-slate-100 transition"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          {/* Avatar */}
          <div className="relative">
            {partner?.profilePicture ? (
              <img
                src={partner.profilePicture}
                alt={partner.name}
                className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3C65F5] to-indigo-700 font-bold text-white shadow-sm text-sm">
                {partner?.name ? partner.name.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
              </div>
            )}
            {/* Online dot */}
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white transition-colors ${
                isPartnerOnline ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
          </div>

          {/* Name & Status */}
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 leading-none flex items-center gap-2">
              {partner?.name || "Participant"}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                {isCandidate ? "Recruiter" : "Applicant"}
              </span>
            </h3>
            <p className={`text-[11px] font-medium mt-0.5 ${isPartnerOnline ? "text-emerald-600" : "text-slate-400"}`}>
              {isPartnerTyping ? (
                <span className="text-[#3C65F5] italic animate-pulse">typing...</span>
              ) : isPartnerOnline ? (
                "Online"
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-1 mr-1">
            <div className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[11px] font-semibold text-[#3C65F5]">
              <Briefcase className="h-3.5 w-3.5" />
              <span className="truncate max-w-[120px]">{conversation.jobId?.title || "Job Position"}</span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            title="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-0.5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.35'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                  className={`h-10 rounded-2xl bg-white/80 animate-pulse shadow-sm ${
                    i % 2 === 0 ? "w-48 bg-blue-200/50" : "w-56"
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
        <div className="mx-3 mb-2 rounded-2xl border border-[#3C65F5]/30 bg-[#3C65F5]/5 p-3 flex items-center gap-3 shadow-sm">
          {selectedAttachment.type === "image" && selectedAttachment.preview ? (
            <img
              src={selectedAttachment.preview}
              alt="Preview"
              className="h-12 w-12 rounded-lg object-cover border border-slate-200 shadow-sm"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#3C65F5]/10 border border-[#3C65F5]/20">
              <Paperclip className="h-5 w-5 text-[#3C65F5]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{selectedAttachment.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 capitalize">{selectedAttachment.type} attachment</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedAttachment(null)}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Input Area ── */}
      <div className="relative bg-white border-t border-slate-200/80 px-3 py-3">
        {/* Emoji Panel */}
        {showQuickEmojis && (
          <div
            ref={emojiPanelRef}
            className="absolute bottom-full left-3 mb-2 z-30 flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl w-[220px]"
          >
            {QUICK_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => addEmoji(e)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg hover:bg-slate-100 active:scale-90 transition-all"
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
            className="shrink-0 rounded-2xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-[#3C65F5] transition"
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
                ? "text-[#3C65F5] bg-blue-50"
                : "text-slate-400 hover:bg-slate-100 hover:text-[#3C65F5]"
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
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-[#3C65F5] focus:bg-white focus:shadow-sm placeholder:text-slate-400 leading-relaxed"
              style={{ minHeight: "42px", maxHeight: "120px" }}
            />
          </div>

          {/* Send / Mic button */}
          <button
            type={canSend ? "submit" : "button"}
            className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all active:scale-90 ${
              canSend
                ? "bg-[#3C65F5] text-white shadow-blue-500/30 hover:bg-[#2954ea]"
                : "bg-slate-200 text-slate-400"
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

        <p className="mt-1.5 text-center text-[10px] text-slate-400 select-none">
          🔒 Messages are secured end-to-end for your job application
        </p>
      </div>
    </div>
  );
}
