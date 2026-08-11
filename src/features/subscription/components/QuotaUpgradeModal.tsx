import { Link } from "react-router-dom";
import { Crown, CheckCircle2, ArrowRight, X } from "lucide-react";

interface QuotaUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  feature?: "job_limit" | "featured_job";
}

export default function QuotaUpgradeModal({
  isOpen,
  onClose,
  title = "Plan Upgrade Required",
  message = "You have reached the maximum allowance on your current plan. Upgrade to unlock unlimited hiring power.",
  feature = "job_limit",
}: QuotaUpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/10 rounded-full filter blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 text-amber-300 border border-indigo-500/30 shadow-lg">
            <Crown className="w-7 h-7 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <span className="text-indigo-400 text-xs font-extrabold uppercase tracking-widest">
              JobsBox Enterprise
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-6 leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
          {message}
        </p>

        {/* Feature Highlights */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>{feature === "featured_job" ? "Pin job at top of search results with ⚡ Featured tag" : "Post up to 5 Active Jobs with Recruiter Lite"}</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Access full candidate resume database & direct messaging</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Cancel or change plans anytime with 1-click</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-1/3 py-3.5 rounded-xl font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 text-xs uppercase tracking-wider transition-colors"
          >
            Not Now
          </button>
          <Link
            to="/pricing"
            onClick={onClose}
            className="w-2/3 py-3.5 rounded-xl font-extrabold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>View Upgrade Plans</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
