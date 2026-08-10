import { useState, useRef, useEffect } from "react";
import { CheckCheck, FileText, Download, Info, MoreVertical, Edit2, Trash2, X, Check } from "lucide-react";
import type { ChatMessage } from "../types/chat.types";

interface MessageBubbleProps {
  message: ChatMessage;
  isSelf: boolean;
  showAvatar?: boolean;
  senderName?: string;
  senderAvatar?: string;
  onEditMessage?: (messageId: string, newText: string) => void;
  onDeleteMessage?: (messageId: string, deleteForEveryone: boolean) => void;
}

export default function MessageBubble({
  message,
  isSelf,
  showAvatar = false,
  senderName,
  senderAvatar,
  onEditMessage,
  onDeleteMessage,
}: MessageBubbleProps) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // System messages (e.g. "Conversation started")
  if (message.messageType === "system") {
    return (
      <div className="flex justify-center my-4">
        <div className="flex items-center gap-1.5 rounded-full bg-slate-100/80 backdrop-blur-sm px-4 py-1.5 text-[11px] text-slate-500 border border-slate-200/60 shadow-sm">
          <Info className="h-3 w-3 text-blue-400 shrink-0" />
          <span>{message.message}</span>
        </div>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.message || "");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const handleEditSubmit = () => {
    if (editText.trim() && editText.trim() !== message.message && onEditMessage) {
      onEditMessage(message._id || message.id!, editText.trim());
    }
    setIsEditing(false);
  };

  const hasAttachments = message.attachments && message.attachments.length > 0;
  const isImageOnly =
    message.messageType === "image" && !message.message?.trim();

  return (
    <div
      className={`group flex items-end gap-2 my-[3px] ${
        isSelf ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar (only for partner messages) */}
      {!isSelf && (
        <div className="shrink-0 mb-1">
          {showAvatar ? (
            senderAvatar ? (
              <img
                src={senderAvatar}
                alt={senderName || "User"}
                className="h-7 w-7 rounded-full object-cover border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[10px] font-bold text-white shadow-sm">
                {senderName ? senderName.charAt(0).toUpperCase() : "?"}
              </div>
            )
          ) : (
            <div className="h-7 w-7" />
          )}
        </div>
      )}

      {/* Bubble */}
      <div
        className={`relative max-w-[72%] sm:max-w-[58%] group-hover:brightness-[0.98] transition-all duration-150 ${
          isSelf ? "items-end" : "items-start"
        } flex flex-col`}
        style={{ transformOrigin: isSelf ? "right bottom" : "left bottom" }}
      >
        {/* Bubble Body */}
        <div
          className={`relative rounded-2xl text-sm shadow-sm transition-all ${
            isSelf
              ? "bg-[#3C65F5] text-white rounded-tr-md"
              : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-md"
          } ${hasAttachments && isImageOnly ? "p-1 overflow-hidden" : "px-4 py-2.5"}`}
        >
          {/* Tail for self messages */}
          {isSelf && (
            <span
              className="absolute bottom-0 right-[-6px] w-3 h-3 overflow-hidden pointer-events-none"
              aria-hidden
            >
              <span
                className="absolute bottom-0 right-0 w-4 h-4 bg-[#3C65F5] rounded-bl-xl"
                style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
              />
            </span>
          )}
          {/* Tail for partner messages */}
          {!isSelf && (
            <span
              className="absolute bottom-0 left-[-6px] w-3 h-3 overflow-hidden pointer-events-none"
              aria-hidden
            >
              <span
                className="absolute bottom-0 left-0 w-4 h-4 bg-white border-l border-b border-slate-200/80 rounded-br-xl"
                style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
              />
            </span>
          )}

          {/* Attachments */}
          {hasAttachments && (
            <div className={`${isImageOnly ? "" : "mb-2"} space-y-1.5`}>
              {message.attachments!.map((att, idx) => (
                <div key={idx}>
                  {message.messageType === "image" ||
                  att.mimeType?.startsWith("image/") ? (
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden rounded-xl"
                    >
                      <img
                        src={att.url}
                        alt={att.name || "Image"}
                        className="max-h-64 w-full object-cover hover:opacity-95 transition-opacity"
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-3 rounded-xl p-3 text-xs font-medium border transition-colors ${
                        isSelf
                          ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isSelf ? "bg-white/20" : "bg-blue-50"
                        }`}
                      >
                        <FileText
                          className={`h-4 w-4 ${isSelf ? "text-white" : "text-[#3C65F5]"}`}
                        />
                      </div>
                      <span className="truncate flex-1 font-semibold">
                        {att.name || "Attachment"}
                      </span>
                      <Download
                        className={`h-4 w-4 shrink-0 ${
                          isSelf ? "text-white/70" : "text-slate-400"
                        }`}
                      />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Message Text or Edit Input */}
          {message.message && !isImageOnly && (
            isEditing ? (
              <div className="flex flex-col gap-2 min-w-[200px]">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleEditSubmit();
                    }
                  }}
                  className="w-full resize-none rounded-lg border border-white/40 bg-white/10 px-2 py-1.5 text-sm text-white placeholder-white/60 outline-none focus:border-white/80"
                  rows={2}
                  autoFocus
                />
                <div className="flex justify-end gap-1">
                  <button onClick={() => setIsEditing(false)} className="rounded-md p-1 hover:bg-white/20 transition"><X className="h-4 w-4" /></button>
                  <button onClick={handleEditSubmit} className="rounded-md p-1 hover:bg-white/20 transition"><Check className="h-4 w-4" /></button>
                </div>
              </div>
            ) : (
              <p className={`leading-relaxed whitespace-pre-wrap break-words ${message.isDeleted ? "italic text-slate-500" : ""}`}>
                {message.message}
              </p>
            )
          )}

          {/* Timestamp + Read Receipts */}
          <div
            className={`flex items-center justify-end gap-1 mt-1 select-none ${
              isImageOnly
                ? "absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5"
                : ""
            }`}
          >
            <span
              className={`text-[10px] font-medium tabular-nums flex items-center gap-1 ${
                isSelf
                  ? isImageOnly
                    ? "text-white"
                    : "text-blue-100/90"
                  : "text-slate-400"
              }`}
            >
              {message.isEdited && <span className="italic mr-1">(edited)</span>}
              {formattedTime}
            </span>
            {isSelf && (
              <span
                title={
                  message.isRead
                    ? `Seen at ${
                        message.readAt
                          ? new Date(message.readAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "recently"
                      }`
                    : "Delivered"
                }
                className="inline-flex"
              >
                {message.isRead ? (
                  // Double blue ticks = read (WhatsApp style)
                  <CheckCheck
                    className={`h-3.5 w-3.5 stroke-[2.5] ${
                      isImageOnly ? "text-cyan-300" : "text-cyan-300"
                    }`}
                  />
                ) : (
                  // Double gray tick = sent/delivered (WhatsApp style)
                  <CheckCheck
                    className={`h-3.5 w-3.5 stroke-[2] ${
                      isImageOnly ? "text-white/60" : "text-blue-200/70"
                    }`}
                  />
                )}
              </span>
            )}
          </div>
        </div>
        
        {/* Context Menu for Sender */}
        {isSelf && !message.isDeleted && !isEditing && (
          <div className="absolute top-1 right-full pr-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition shadow-sm bg-white"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
                  <button 
                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Edit2 className="h-4 w-4 text-blue-500" />
                    Edit Message
                  </button>
                  <button 
                    onClick={() => { 
                      if(onDeleteMessage) onDeleteMessage(message._id || message.id!, false);
                      setShowMenu(false); 
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition border-t border-slate-100"
                  >
                    <Trash2 className="h-4 w-4 text-slate-500" />
                    Delete for me
                  </button>
                  <button 
                    onClick={() => { 
                      if(onDeleteMessage) onDeleteMessage(message._id || message.id!, true);
                      setShowMenu(false); 
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t border-slate-100 font-medium"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete for everyone
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
