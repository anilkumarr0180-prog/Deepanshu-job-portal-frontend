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
      {/* 
        Pixel-perfect Centered Recruiter Card:
        White background, rounded-2xl, subtle light-blue border, hover shadow
      */}
      <div className="flex h-full min-h-[290px] flex-col items-center justify-between rounded-2xl border border-[#E0E6F7] bg-white p-6 text-center transition-all duration-200 hover:border-[#B0C4F8] hover:shadow-[0_4px_20px_rgba(60,101,245,0.08)] dark:border-[#1E293B] dark:bg-[#131D2E] dark:hover:border-[#3C65F5]/60">
        
        {/* Top & Middle Information */}
        <div className="flex w-full flex-col items-center">
          
          {/* Centered Logo — 56×56px rounded-xl */}
          <div className="mb-3.5 flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800/80 dark:bg-[#1B2639]">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full rounded-xl object-contain p-1.5"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center rounded-xl text-base font-bold text-white ${getAvatarBg(
                  company.name
                )}`}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Centered Company Name */}
          <h3 className="w-full truncate text-[17px] font-bold leading-snug text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9] dark:group-hover:text-[#5E81FF]">
            {company.name}
          </h3>

          {/* Centered Rating Stars & Review Count */}
          <div className="mt-1.5 flex items-center justify-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(rating)
                      ? "fill-[#FFC107] text-[#FFC107]"
                      : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-[12px] text-slate-400 dark:text-slate-400">
              ({reviewCount})
            </span>
          </div>

          {/* Centered Location with MapPin Icon */}
          <div className="mt-2.5 flex max-w-full items-center justify-center gap-1.5 text-[13px] text-[#66789C] dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-400" />
            <span className="truncate">{locationText}</span>
          </div>

        </div>

        {/* Bottom: Open Jobs Button / Pill */}
        <div className="mt-5 w-full">
          <span className="block w-full rounded-lg bg-[#EFF4FD] py-2.5 px-4 text-center text-[13px] font-semibold text-[#3C65F5] transition-colors duration-200 group-hover:bg-[#3C65F5] group-hover:text-white dark:bg-[#1B2639] dark:text-[#5E81FF] dark:group-hover:bg-[#3C65F5] dark:group-hover:text-white">
            {company.activeJobsCount}{" "}
            {company.activeJobsCount === 1 ? "Job Open" : "Jobs Open"}
          </span>
        </div>

      </div>
    </Link>
  );
}
