interface TypingIndicatorProps {

  userName?: string;
}

export default function TypingIndicator({ userName }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 py-2 px-3 text-xs text-slate-500 italic">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#3C65F5]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#3C65F5] [animation-delay:0.2s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#3C65F5] [animation-delay:0.4s]" />
      </div>
      <span>{userName || "Someone"} is typing...</span>
    </div>
  );
}
