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
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M12 3.67004V20.33L11.2 21.24C10.09 22.5 9.18001 22.16 9.18001 20.48V13.28H6.09001C4.69001 13.28 4.30001 12.42 5.23001 11.37L12 3.67004Z"
        fill="#5BC694"
      />
      <path
        opacity="0.4"
        d="M18.77 12.63L12 20.33V3.67002L12.8 2.76002C13.91 1.50002 14.82 1.84002 14.82 3.52002V10.72H17.91C19.31 10.72 19.7 11.58 18.77 12.63Z"
        fill="#5BC694"
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
      className={`group relative flex h-full w-full flex-col justify-between rounded-[8px] bg-white font-['Plus_Jakarta_Sans',sans-serif] transition-all duration-300 hover:-translate-y-1 hover:border-[#B4C0E0] hover:shadow-[0_10px_20px_-5px_rgba(10,42,105,0.06)] dark:bg-[#151F32] ${
        isFeaturedCard
          ? "border border-[#3C65F5] dark:border-[#3C65F5]"
          : "border border-[#E0E6F7] dark:border-[#2A3850]"
      }`}
    >
      {/* Top-Right Flash Badge (Positioned at top: 30px, right: 20px) */}
      <div className="absolute top-[30px] right-[20px] pointer-events-none">
        <JobBoxFlashBadge />
      </div>

      {/* 1. Header Block (.card-grid-2-image-left): 30px 20px 15px padding */}
      <div className="flex items-start px-[20px] pt-[30px] pb-[15px]">
        <div className="flex min-w-0 flex-1 items-center pr-6">
          {/* Company Logo: 52px x 52px with 15px right spacing */}
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#EEF2F6] dark:bg-[#1B2639] mr-[15px]">
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
            <h4 className="truncate text-[18px] font-bold leading-[26px] text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9]">
              {job.company}
            </h4>
            <p className="mt-[2px] flex items-center gap-1 text-[12px] leading-[16px] text-[#A0ABB8] dark:text-slate-400">
              <MapPin className="h-[12px] w-[12px] shrink-0 text-[#A0ABB8]" />
              <span className="truncate">{job.location || "New York, US"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Content Block (.card-block-info): 20px sides, 25px bottom */}
      <div className="flex flex-1 flex-col justify-between px-[20px] pb-[25px]">
        <div>
          {/* Job Title: 16px bold leading-[22px] */}
          <Link to={`/jobs/${job._id}`} className="block">
            <h3 className="truncate text-[16px] font-bold leading-[22px] text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9]">
              {job.title}
            </h3>
          </Link>

          {/* Job Metadata: Employment Type & Posted Date */}
          <div className="mt-[5px] flex items-center gap-[15px] text-[12px] font-normal text-[#A0ABB8] dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-[13px] w-[13px] text-[#A0ABB8]" />
              <span>{job.employmentType || "Fulltime"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-[13px] w-[13px] text-[#A0ABB8]" />
              <span>{formatRelativeDate(job.createdAt)}</span>
            </span>
          </div>

          {/* Job Description: 14px, #4F5E64, 66px 3-line clamping with 15px top margin */}
          <p className="mt-[15px] h-[66px] overflow-hidden text-ellipsis text-[14px] leading-[22px] text-[#4F5E64] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] dark:text-slate-300">
            {descriptionPreview && descriptionPreview.length > 50
              ? descriptionPreview
              : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur."}
          </p>

          {/* Skill Tags (.btn-grey-small): #EFF3FC, text-[#4F5E64], 12px, rounded 4px */}
          <div className="mt-[20px] flex h-[28px] flex-wrap items-center gap-[5px] overflow-hidden">
            {visibleSkills.length > 0 ? (
              visibleSkills.map((skill, idx) => (
                <span
                  key={`${skill}-${idx}`}
                  className="inline-flex items-center rounded-[4px] bg-[#EFF3FC] px-[10px] py-[5px] text-[12px] font-normal leading-[14px] text-[#4F5E64] transition-colors hover:bg-[#E0E6F7] hover:text-[#3C65F5] dark:bg-[#1E293B] dark:text-slate-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center rounded-[4px] bg-[#EFF3FC] px-[10px] py-[5px] text-[12px] font-normal leading-[14px] text-[#4F5E64] dark:bg-[#1E293B] dark:text-slate-300">
                General
              </span>
            )}
          </div>
        </div>

        {/* 3. Footer (.card-2-bottom): Salary + Apply Now Button */}
        <div className="mt-[25px] flex items-center justify-between pt-[5px]">
          <div className="flex items-baseline">
            <span className="text-[20px] font-bold leading-none text-[#3C65F5]">
              {salaryDisplay}
            </span>
            <span className="text-[12px] font-normal text-[#858585] dark:text-slate-400 ml-[2px]">
              /Hour
            </span>
          </div>

          <Link
            to={`/jobs/${job._id}`}
            className={`inline-flex h-[36px] items-center justify-center rounded-[4px] px-[18px] py-[9px] text-[12px] font-bold transition-all duration-200 ${
              isFeaturedCard
                ? "bg-[#3C65F5] text-white shadow-xs"
                : "bg-[#E0E6F7] text-[#3C65F5] hover:bg-[#3C65F5] hover:text-white dark:bg-[#1E2B4D] dark:text-[#5E81FF] dark:hover:bg-[#3C65F5] dark:hover:text-white"
            }`}
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}
