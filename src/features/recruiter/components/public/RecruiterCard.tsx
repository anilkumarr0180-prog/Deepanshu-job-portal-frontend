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

// Curated avatar background colors matching modern JobBox style
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
      className="item-5 hover-up group block h-full select-none transition-all duration-300 hover:-translate-y-1"
    >
      <div className="item-logo flex h-full min-h-[148px] w-full flex-col justify-between rounded-[12px] border border-[rgba(6,18,36,0.1)] bg-white p-[20px_18px] text-left transition-all duration-300 hover:border-[#3C65F5] hover:shadow-[0_10px_20px_-5px_rgba(10,42,105,0.06)] dark:border-[#1E293B] dark:bg-[#131D2E] dark:hover:border-[#3C65F5]">
        {/* Top Header: Left Logo + Right Text Info */}
        <div className="flex w-full items-center">
          {/* Logo container: 52px x 52px */}
          <div className="image-left mr-[15px] flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#F8FAFC] dark:bg-[#1B2639]">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full object-contain p-1 rounded-[10px]"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center rounded-[10px] text-base font-bold text-white ${getAvatarBg(
                  company.name
                )}`}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Right Info: Company Name + Star Rating */}
          <div className="text-info-right min-w-0 flex-1">
            <h4
              title={company.name}
              className="line-clamp-2 font-['Plus_Jakarta_Sans',sans-serif] text-[15px] sm:text-[16px] font-bold leading-[20px] text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9] dark:group-hover:text-[#5E81FF] break-words"
            >
              {company.name}
            </h4>

            {/* Stars + Rating Count */}
            <div className="mt-1 flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-[12px] w-[12px] ${
                      i < Math.floor(rating)
                        ? "fill-[#FFC107] text-[#FFC107]"
                        : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                    }`}
                  />
                ))}
              </div>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-normal text-[#A0ABB8] dark:text-slate-400">
                ({reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Location (Left) + Open Jobs (Right) */}
        <div className="text-info-bottom mt-5 flex w-full items-center justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#A0ABB8] dark:text-slate-400">
          <div className="flex items-center gap-1 truncate pr-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#A0ABB8] dark:text-slate-400" />
            <span className="truncate">{locationText}</span>
          </div>
          <span className="shrink-0 text-[12px] font-medium text-[#A0ABB8] dark:text-slate-400">
            {company.activeJobsCount}{" "}
            {company.activeJobsCount === 1 ? "Open Job" : "Open Jobs"}
          </span>
        </div>
      </div>
    </Link>
  );
}
