import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";

export interface DerivedCompany {
  id: string;
  name: string;
  logo?: string;
  location: string;
  description: string;
  activeJobsCount: number;
  rating?: number;
  reviewCount?: number;
  recruiterName?: string;
  recruiterEmail?: string;
  createdAt: string;
  jobs: BackendJobDetails[];
}

interface RecruiterCardProps {
  company: DerivedCompany;
}

// Consistent curated background colors for initial avatars when company has no logo image
const AVATAR_BG_COLORS = [
  "bg-[#3C65F5]",
  "bg-[#0E82EE]",
  "bg-[#6366F1]",
  "bg-[#8B5CF6]",
  "bg-[#0EA5E9]",
  "bg-[#10B981]",
  "bg-[#F59E0B]",
  "bg-[#EC4899]",
  "bg-[#14B8A6]",
  "bg-[#F97316]",
];

function getAvatarBg(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_BG_COLORS.length;
  return AVATAR_BG_COLORS[index];
}

export default function RecruiterCard({ company }: RecruiterCardProps) {
  const initials =
    company.name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CO";

  const rating = company.rating || 5;
  const reviewCount =
    company.reviewCount ??
    (Math.abs(
      company.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    ) % 70 + 15);

  const locationText = company.location?.trim() || "New York, US";

  return (
    <Link
      to={`/recruiters/${encodeURIComponent(company.id)}`}
      className="group block h-full select-none"
    >
      <div className="flex h-full flex-col justify-between rounded-2xl border border-[#E0E6F7] bg-white p-4.5 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5] hover:shadow-[0_8px_20px_rgba(60,101,245,0.08)] dark:border-[#1E293B] dark:bg-[#131D2E] dark:hover:border-[#3C65F5]/70 dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        {/* Top: Logo + Name & Rating */}
        <div className="flex items-start gap-3.5">
          {/* Company Logo or Fallback initials */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-100 dark:border-slate-800/80 dark:bg-[#1B2639]">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full object-contain p-1.5 rounded-xl"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center text-sm font-bold text-white ${getAvatarBg(
                  company.name
                )}`}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Company Name & Rating */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-bold leading-snug text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9] dark:group-hover:text-[#5E81FF]">
              {company.name}
            </h3>

            {/* Rating Stars */}
            <div className="mt-1 flex items-center gap-1">
              <div className="flex items-center text-[#FFC107]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(rating)
                        ? "fill-[#FFC107] text-[#FFC107]"
                        : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-xs font-normal text-slate-400 dark:text-slate-400">
                ({reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Location + Open Jobs Count */}
        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-[#66789C] dark:text-slate-400">
          <div className="flex min-w-0 items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-400" />
            <span className="truncate">{locationText}</span>
          </div>

          <span className="shrink-0 font-medium whitespace-nowrap">
            {company.activeJobsCount}{" "}
            {company.activeJobsCount === 1 ? "Open Job" : "Open Jobs"}
          </span>
        </div>
      </div>
    </Link>
  );
}

