import { Check, CheckCheck, FileText, Download } from "lucide-react";

import type { ChatMessage } from "../types/chat.types";

interface MessageBubbleProps {
  message: ChatMessage;
  isSelf: boolean;
}

export default function MessageBubble({ message, isSelf }: MessageBubbleProps) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex flex-col my-1.5 ${isSelf ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-sm shadow-xs transition-all ${
          isSelf
            ? "bg-[#3C65F5] text-white rounded-br-none"
            : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
        }`}
      >
        {/* Attachments rendering */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 space-y-1.5">
            {message.attachments.map((att, idx) => (
              <div key={idx}>
                {message.messageType === "image" ? (
                  <img
                    src={att.url}
                    alt="attachment"
                    className="max-h-56 rounded-xl object-cover border border-black/10"
                  />
                ) : (
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 rounded-xl p-2 text-xs font-semibold ${
                      isSelf ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate flex-1">{att.name || "Attachment File"}</span>
                    <Download className="h-3.5 w-3.5 shrink-0 opacity-80" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message Text */}
        <p className="leading-relaxed whitespace-pre-wrap break-words">{message.message}</p>

        {/* Timestamp & Read Receipts */}
        <div
          className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
            isSelf ? "text-blue-100 opacity-90" : "text-slate-400"
          }`}
        >
          <span>{formattedTime}</span>
          {isSelf && (
            <span>
              {message.isRead ? (
                <CheckCheck className="h-3.5 w-3.5 text-blue-200" />
              ) : (
                <Check className="h-3.5 w-3.5 text-blue-200 opacity-70" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
