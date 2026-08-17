import { Link } from "react-router-dom";
import { Crown, CheckCircle2, ArrowRight, X } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";

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
  const { user } = useAuth();
  const pricingRoute =
    user?.role === "candidate"
      ? "/candidate/pricing"
      : user?.role === "recruiter"
      ? "/recruiter/pricing"
      : "/pricing";

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
            <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
              {feature === "job_limit" ? "Monthly Quota Exceeded" : "Premium Feature Request"}
            </span>
          </div>
        </div>

        {/* Message */}
        <p className="text-slate-300 text-sm leading-relaxed mb-6">{message}</p>

        {/* Value Highlights */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-6 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Post unlimited active job listings with top search visibility</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Access direct candidate contact details &amp; resume downloads</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
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
            to={pricingRoute}
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
