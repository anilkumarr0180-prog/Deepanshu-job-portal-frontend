import { Sparkles, Crown, Zap, ShieldCheck } from "lucide-react";

export function FeaturedJobBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm backdrop-blur-md ${className}`}
    >
      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
      <span>Featured Job</span>
    </span>
  );
}

export function TopApplicantBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-sm ${className}`}
    >
      <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
      <span>Top Applicant</span>
    </span>
  );
}

export function ProUserBadge({
  tier = "Pro",
  className = "",
}: {
  tier?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/20 ${className}`}
    >
      <Crown className="w-3 h-3 text-amber-300 fill-amber-300" />
      <span>{tier}</span>
    </span>
  );
}

export function VerifiedEnterpriseBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20 ${className}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
      <span>Verified Recruiter</span>
    </span>
  );
}
