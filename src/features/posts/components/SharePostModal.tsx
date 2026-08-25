import { useState, useEffect } from "react";
import { X, Share2, Copy, Check, Globe } from "lucide-react";
import toast from "react-hot-toast";
import type { Post } from "../types/post.types";

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export default function SharePostModal({ isOpen, onClose, post }: SharePostModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const authorName =
    typeof post.authorId === "object" && post.authorId !== null
      ? post.authorId.name
      : "JobBox Member";

  const postUrl = window.location.origin + "/posts/" + post._id;
  const shareText = "Check out this discussion by " + authorName + " on JobBox: \"" + post.content.slice(0, 80) + "...\"";

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(postUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = postUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.success("Post link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "JobBox Post by " + authorName,
          text: shareText,
          url: postUrl,
        });
        onClose();
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          toast.error("Sharing cancelled.");
        }
      }
    } else {
      void handleCopyLink();
    }
  };

  const twitterUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&url=" + encodeURIComponent(postUrl);
  const linkedInUrl = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(postUrl);
  const whatsAppUrl = "https://api.whatsapp.com/send?text=" + encodeURIComponent(shareText + " " + postUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 transition-all duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 id="share-modal-title" className="text-base font-bold text-slate-900">
                Share Discussion
              </h3>
              <p className="text-xs text-slate-500">
                Share this post across your professional channels.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Direct Post Link
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-1.5 pl-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition shadow-2xs">
            <input
              type="text"
              readOnly
              value={postUrl}
              className="flex-1 bg-transparent text-xs text-slate-700 outline-none select-all truncate font-mono"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition shadow-xs cursor-pointer " +
                (copied ? "bg-emerald-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95")
              }
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Share To Social Platforms
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 p-3 text-center transition hover:border-[#0A66C2] hover:bg-blue-50/30 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] group-hover:scale-105 transition">
                <span className="font-bold text-xs">in</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-700">LinkedIn</span>
            </a>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 p-3 text-center transition hover:border-slate-800 hover:bg-slate-50 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/10 text-slate-900 group-hover:scale-105 transition">
                <span className="font-bold text-xs">𝕏</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Twitter / X</span>
            </a>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 p-3 text-center transition hover:border-[#25D366] hover:bg-emerald-50/30 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366] group-hover:scale-105 transition">
                <span className="font-bold text-xs">WA</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-700">WhatsApp</span>
            </a>
          </div>
        </div>

        {typeof navigator !== "undefined" && "share" in navigator && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <Globe className="h-4 w-4 text-blue-600" />
              <span>More Share Options (Device Native)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}