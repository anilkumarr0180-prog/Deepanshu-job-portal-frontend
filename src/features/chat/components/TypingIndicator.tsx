interface TypingIndicatorProps {
  userName?: string;
}

export default function TypingIndicator({ userName }: TypingIndicatorProps) {
  const displayName = userName && userName !== "User" ? userName : "Participant";

  return (
    <div className="flex items-center gap-2 my-2 animate-fade-in">
      {/* Bouncing dots bubble */}
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white border border-slate-200/80 px-4 py-3 shadow-sm">
        <span
          className="h-2 w-2 rounded-full bg-slate-400"
          style={{ animation: "typingBounce 1.2s ease-in-out infinite", animationDelay: "0ms" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-slate-400"
          style={{ animation: "typingBounce 1.2s ease-in-out infinite", animationDelay: "200ms" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-slate-400"
          style={{ animation: "typingBounce 1.2s ease-in-out infinite", animationDelay: "400ms" }}
        />
      </div>
      <span className="text-[11px] font-medium text-slate-400">
        <span className="font-semibold text-slate-600">{displayName}</span> is typing…
      </span>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.25s ease-out both; }
      `}</style>
    </div>
  );
}
