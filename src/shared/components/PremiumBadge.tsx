import { Sparkles, Crown, ShieldCheck } from "lucide-react";

export interface PremiumBadgeProps {
  planCode?: string;
  tier?: "pro" | "premium" | "lite" | "enterprise" | "candidate_pro" | "candidate_premium" | "recruiter_lite" | "recruiter_enterprise" | string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function PremiumBadge({
  planCode = "",
  tier = "",
  size = "md",
  showLabel = true,
  className = "",
}: PremiumBadgeProps) {
  const code = (planCode || tier || "").toLowerCase();

  // If free or missing, return null or subtle default
  if (!code || code.includes("free")) {
    return null;
  }

  const isCandidatePremium = code.includes("candidate_premium") || code.includes("premium");
  const isCandidatePro = code.includes("candidate_pro") || code.includes("pro");
  const isRecruiterLite = code.includes("recruiter_lite") || code.includes("lite");
  const isRecruiterEnterprise = code.includes("recruiter_enterprise") || code.includes("enterprise");

  // Size mapping
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-xs sm:text-sm gap-2",
  }[size];

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  let badgeLabel = "PREMIUM";
  let bgGradient = "from-amber-500/20 via-yellow-500/20 to-amber-600/20 border-amber-400/40 text-amber-300";
  let icon = <Crown className={`${iconSizes} text-amber-300 fill-amber-300`} />;

  if (isCandidatePremium) {
    badgeLabel = "TOP APPLICANT";
    bgGradient = "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black border-amber-300 shadow-md shadow-amber-500/20";
    icon = <Crown className={`${iconSizes} text-slate-950 fill-slate-950`} />;
  } else if (isCandidatePro) {
    badgeLabel = "CAREER PRO";
    bgGradient = "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-extrabold border-indigo-400/80 shadow-md shadow-indigo-500/20";
    icon = <Sparkles className={`${iconSizes} text-amber-300 fill-amber-300`} />;
  } else if (isRecruiterEnterprise) {
    badgeLabel = "ENTERPRISE HIRING";
    bgGradient = "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-black border-purple-400/80 shadow-md shadow-purple-500/25";
    icon = <Crown className={`${iconSizes} text-amber-300 fill-amber-300`} />;
  } else if (isRecruiterLite) {
    badgeLabel = "PRO EMPLOYER";
    bgGradient = "bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white font-extrabold border-indigo-400/80 shadow-md shadow-indigo-500/20";
    icon = <ShieldCheck className={`${iconSizes} text-amber-300 fill-amber-300`} />;
  }

  return (
    <div
      title={`Verified ${badgeLabel} Subscriber`}
      className={`inline-flex items-center rounded-full border backdrop-blur-md transition-all duration-300 ${sizeClasses} ${bgGradient} ${className}`}
    >
      {icon}
      {showLabel && <span className="uppercase tracking-wider font-extrabold whitespace-nowrap">{badgeLabel}</span>}
    </div>
  );
}

export default PremiumBadge;
