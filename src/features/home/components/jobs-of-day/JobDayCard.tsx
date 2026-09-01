import { Briefcase, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import type { BackendJobDetails } from "@/features/jobs/utils/jobMapper";
import { formatRelativeDate, formatSalary } from "@/features/jobs/utils/jobMapper";

interface JobDayCardProps {
  job: BackendJobDetails;
}

function formatCardSalary(min: number, max: number, fallback = "$500"): string {
  const val = min > 0 ? min : max > 0 ? max : 0;
  if (!val) return fallback;
  
  if (val >= 100000) {
    const formatted = (val / 100000).toFixed(val % 100000 === 0 ? 0 : 1);
    return `₹${formatted}L`;
  }
  if (val >= 1000) {
    const formatted = (val / 1000).toFixed(0);
    return `₹${formatted}k`;
  }
  return `$${val}`;
}

function JobBoxFlashBadge() {
  return (
    <svg
      width="12"
      height="16"
      viewBox="0 0 12 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M7 0L0 9.5H5.5L4.5 16L12 6.5H6.5L7 0Z"
        fill="#52D3A2"
      />
    </svg>
  );
}

export default function JobDayCard({ job }: JobDayCardProps) {
  const initials = job.company
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const descriptionPreview = job.description
    ? job.description.split("\n\n")[0]
    : "";

  const defaultSalaryDisplay =
    job.salaryMin > 0 || job.salaryMax > 0
      ? formatSalary(job.salaryMin, job.salaryMax)
      : "Negotiable";

  const salaryDisplay = formatCardSalary(job.salaryMin, job.salaryMax, defaultSalaryDisplay);

  const visibleSkills = job.skills?.slice(0, 3) ?? [];

  const logoUrl =
    job.companyLogo ||
    job.companyId?.logo ||
    job.recruiterId?.profilePicture;

  const isFeaturedCard = Boolean(job.isFeatured);

  return (
    <div
      className={`group relative flex h-[394.25px] w-full flex-col justify-between rounded-[8px] bg-white font-['Plus_Jakarta_Sans',sans-serif] transition-all duration-200 hover:-translate-y-1 hover:border-[#3C65F5]/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:bg-[#151F32] ${
        isFeaturedCard
          ? "border border-[#3C65F5] dark:border-[#3C65F5]"
          : "border border-[#E0E6F7] dark:border-[#2A3850]"
      }`}
    >
      {/* Top-Right Two-Tone Flash Badge (Positioned upward at top: 22px, right: 20px) */}
      <div className="absolute top-[22px] right-[20px]">
        <JobBoxFlashBadge />
      </div>

      {/* 1. Header Block: 52px logo, company name, location */}
      <div className="flex items-center px-[20px] pt-[26px] pb-[6px]">
        <div className="flex min-w-0 flex-1 items-center gap-[14px] pr-6">
          {/* Company Logo: 52px x 52px */}
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#EEF2F6] dark:bg-[#1B2639]">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={job.company}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3C65F5] to-[#1E40AF] text-[18px] font-extrabold text-white">
                {initials || "JB"}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-[15px] font-bold leading-[20px] text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9]">
              {job.company}
            </h4>
            <p className="mt-[3px] flex items-center gap-1 text-[12px] leading-[16px] text-[#A0ABB8] dark:text-slate-400">
              <MapPin className="h-[12px] w-[12px] shrink-0 text-[#A0ABB8]" />
              <span className="truncate">{job.location || "New York, US"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Content Block: Unified 20px padding */}
      <div className="flex flex-1 flex-col justify-between px-[20px] pb-[20px]">
        <div>
          {/* Job Title: 18px bold */}
          <Link to={`/jobs/${job._id}`} className="block mt-[12px]">
            <h3 className="truncate text-[18px] font-bold leading-[24px] text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9]">
              {job.title}
            </h3>
          </Link>

          {/* Job Metadata: Employment Type & Posted Date */}
          <div className="mt-[8px] flex items-center gap-[15px] text-[12px] font-normal text-[#A0ABB8] dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-[13px] w-[13px] text-[#A0ABB8]" />
              <span>{job.employmentType || "Fulltime"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-[13px] w-[13px] text-[#A0ABB8]" />
              <span>{formatRelativeDate(job.createdAt)}</span>
            </span>
          </div>

          {/* Job Description: 14px, #4F5E64, 66px 3-line clamping */}
          <p className="mt-[15px] h-[66px] overflow-hidden text-ellipsis text-[14px] leading-[22px] text-[#4F5E64] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] dark:text-slate-300">
            {descriptionPreview && descriptionPreview.length > 50
              ? descriptionPreview
              : "We are looking for a skilled professional to join our fast-growing team and contribute to building modern web applications."}
          </p>

          {/* Skill Tags */}
          <div className="mt-[18px] flex h-[28px] flex-wrap items-center gap-[6px] overflow-hidden">
            {visibleSkills.length > 0 ? (
              visibleSkills.map((skill, idx) => (
                <span
                  key={`${skill}-${idx}`}
                  className="inline-flex items-center rounded-[4px] bg-[#EFF1F5] px-[10px] py-[4px] text-[12px] font-medium leading-[14px] text-[#4F5E64] transition-colors hover:bg-[#E0E6F7] hover:text-[#3C65F5] dark:bg-[#1E293B] dark:text-slate-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center rounded-[4px] bg-[#EFF1F5] px-[10px] py-[4px] text-[12px] font-medium leading-[14px] text-[#4F5E64] dark:bg-[#1E293B] dark:text-slate-300">
                General
              </span>
            )}
          </div>
        </div>

        {/* 3. Footer: Salary + Apply Now Button (Exact original JobBox styling) */}
        <div className="mt-auto flex items-center justify-between pt-[10px]">
          <div className="flex items-baseline">
            <span className="text-[20px] font-extrabold leading-none text-[#3C65F5]">
              {salaryDisplay}
            </span>
            <span className="text-[12px] font-normal text-[#858585] dark:text-slate-400">
              /Hour
            </span>
          </div>

          <Link
            to={`/jobs/${job._id}`}
            className={`inline-flex h-[36px] w-[92px] shrink-0 items-center justify-center rounded-[4px] text-[12px] font-bold transition-all duration-200 ${
              isFeaturedCard
                ? "bg-[#3C65F5] text-white shadow-xs"
                : "bg-[#E0E6F7] text-[#3C65F5] group-hover:bg-[#3C65F5] group-hover:text-white dark:bg-[#1E2B4D] dark:text-[#5E81FF] dark:group-hover:bg-[#3C65F5] dark:group-hover:text-white"
            }`}
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}
