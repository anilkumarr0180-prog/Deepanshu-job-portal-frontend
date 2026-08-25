import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Flag,
  Loader2,
  Shield,
  X,
} from "lucide-react";
import { useReport } from "../hooks/useReport";
import type { ReportReason, ReportTargetType } from "../types/post.types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle?: string;
}

const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  {
    value: "spam",
    label: "Spam or promotional content",
    description: "Repetitive messages, unwanted ads, or link stuffing.",
  },
  {
    value: "harassment",
    label: "Harassment or bullying",
    description: "Targeted attacks, threats, or abusive language.",
  },
  {
    value: "hate_speech",
    label: "Hate speech or discrimination",
    description: "Slurs, derogatory remarks, or attacking protected groups.",
  },
  {
    value: "inappropriate",
    label: "Inappropriate or graphic content",
    description: "Sexually suggestive, violent, or offensive material.",
  },
  {
    value: "misinformation",
    label: "Misinformation or scam",
    description: "Deceptive career advice, fake job offers, or financial fraud.",
  },
  {
    value: "impersonation",
    label: "Impersonation or fake profile",
    description: "Pretending to be someone else or representing a false organization.",
  },
  {
    value: "other",
    label: "Other violation",
    description: "Any other issue that violates JobBox Community Guidelines.",
  },
];

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason>("spam");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: submitReport, isPending } = useReport();

  useEffect(() => {
    if (isOpen) {
      setSelectedReason("spam");
      setDescription("");
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const targetTypeName =
    targetType === "post" ? "Post" : targetType === "comment" ? "Comment" : "Member Profile";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;

    submitReport(
      {
        targetType,
        targetId,
        reason: selectedReason,
        description: description.trim(),
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Flag className="h-4 w-4" />
            </div>
            <div>
              <h2 id="report-modal-title" className="text-base font-bold text-slate-900">
                Report {targetTypeName}
              </h2>
              {targetTitle && (
                <p className="text-xs text-slate-500 line-clamp-1 max-w-[280px]">
                  {targetTitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Report Received</h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Thank you for helping keep JobBox a safe, professional, and trusted community.
                Our Trust & Safety team will review this {targetTypeName.toLowerCase()} promptly.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Context Note */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50/80 p-3.5 text-xs text-amber-800 border border-amber-200/60">
              <Shield className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Select the reason that best describes why this content violates our community
                guidelines. All reports are strictly confidential.
              </span>
            </div>

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select a reason
              </label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {REPORT_REASONS.map((item) => (
                  <label
                    key={item.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedReason === item.value
                        ? "border-blue-500 bg-blue-50/40 shadow-2xs ring-1 ring-blue-500/30"
                        : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={item.value}
                      checked={selectedReason === item.value}
                      onChange={() => setSelectedReason(item.value)}
                      className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="report-description"
                  className="block text-xs font-bold text-slate-700"
                >
                  Additional Context (Optional)
                </label>
                <span className="text-[11px] text-slate-400">
                  {description.length}/1000
                </span>
              </div>
              <textarea
                id="report-description"
                rows={3}
                value={description}
                maxLength={1000}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide any additional details or context that could assist our review..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Flag className="h-3.5 w-3.5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
