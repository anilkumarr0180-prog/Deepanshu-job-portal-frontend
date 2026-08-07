import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  User as UserIcon,
  Briefcase,
  CheckCircle2,
  Image as ImageIcon,
  X,
} from "lucide-react";

import type { ChatConversation, ChatMessage, ChatUser } from "../types/chat.types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  currentUserId: string;
  onlineUserIds: string[];
  typingUsers: string[];
  onSendMessage: (messageText: string, messageType?: string, attachments?: any[]) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  isLoadingMessages: boolean;
}

export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onlineUserIds,
  typingUsers,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  isLoadingMessages,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const [showQuickEmojis, setShowQuickEmojis] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{
    url: string;
    name: string;
    type: "image" | "file";
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-50/50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5] shadow-xs mb-4">
          <Briefcase className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Select a Conversation</h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Choose a candidate or recruiter conversation from the sidebar to view your job application messaging history.
        </p>
      </div>
    );
  }

  const isCandidate =
    conversation.candidateId?._id === currentUserId ||
    conversation.candidateId?.id === currentUserId;

  const partner: ChatUser = isCandidate ? conversation.recruiterId : conversation.candidateId;
  const partnerId = partner?._id || partner?.id || "";
  const isPartnerOnline = onlineUserIds.includes(partnerId);
  const isPartnerTyping = typingUsers.includes(partnerId);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);

    onTypingStart();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
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

    onSendMessage(inputText.trim() || selectedAttachment?.name || "Attachment", msgType, attachments);
    setInputText("");
    setSelectedAttachment(null);
    onTypingStop();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith("image/");
    const fakeUrl = URL.createObjectURL(file);

    setSelectedAttachment({
      url: fakeUrl,
      name: file.name,
      type: isImg ? "image" : "file",
    });
  };

  const addEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    setShowQuickEmojis(false);
  };

  return (
    <div className="flex h-full w-full flex-col bg-slate-50/30">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            {partner?.profilePicture ? (
              <img
                src={partner.profilePicture}
                alt={partner.name}
                className="h-11 w-11 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-xs">
                {partner?.name ? partner.name.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                isPartnerOnline ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {partner?.name || "Participant"}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                {isCandidate ? "Recruiter" : "Applicant"}
              </span>
            </h3>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-[#3C65F5]">
                {conversation.jobId?.title || "Job Position"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Application Verified
              </span>
            </div>
          </div>
        </div>

        {/* Online Status Label */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span
            className={`h-2 w-2 rounded-full ${
              isPartnerOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
            }`}
          />
          <span>{isPartnerOnline ? "Online Now" : "Offline"}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {isLoadingMessages ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-12 w-48 rounded-2xl bg-slate-200 animate-pulse ${
                  i % 2 === 0 ? "ml-auto" : "mr-auto"
                }`}
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-1">
            <p className="text-sm font-semibold">No messages in this chat yet</p>
            <p className="text-xs">Send a message below to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const senderObj = typeof msg.senderId === "object" ? msg.senderId : null;
            const senderId = senderObj?._id || senderObj?.id || (msg.senderId as string);
            const isSelf = senderId === currentUserId;

            return <MessageBubble key={msg._id} message={msg} isSelf={isSelf} />;
          })
        )}

        {isPartnerTyping && <TypingIndicator userName={partner?.name} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview Box */}
      {selectedAttachment && (
        <div className="mx-6 mb-2 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            {selectedAttachment.type === "image" ? (
              <ImageIcon className="h-4 w-4 text-[#3C65F5]" />
            ) : (
              <Paperclip className="h-4 w-4 text-[#3C65F5]" />
            )}
            <span className="font-medium truncate max-w-xs">{selectedAttachment.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedAttachment(null)}
            className="rounded-full p-1 text-blue-600 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Message Input Box */}
      <div className="relative border-t border-slate-200 bg-white p-4">
        {/* Quick Emoji Picker Floating Panel */}
        {showQuickEmojis && (
          <div className="absolute bottom-full left-4 mb-2 flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl z-20">
            {["👍", "❤️", "😊", "🎉", "💼", "👏", "🙏", "✅"].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => addEmoji(e)}
                className="text-lg hover:scale-125 transition p-1"
              >
                {e}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-end gap-3">
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
            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition shrink-0"
            title="Attach Image or Document"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setShowQuickEmojis((prev) => !prev)}
            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition shrink-0"
            title="Quick Emojis"
          >
            <Smile className="h-5 w-5" />
          </button>

          <textarea
            rows={1}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send)"
            className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition focus:border-[#3C65F5] focus:bg-white max-h-24"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !selectedAttachment}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#2956F2] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
