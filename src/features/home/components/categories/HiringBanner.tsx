import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import leftHiringBg from "@/assets/images/jobs/left-job-head.svg";
import rightHiringBg from "@/assets/images/jobs/right-job-head.svg";

export default function HiringBanner() {
  return (
    <div className="relative mt-8 sm:mt-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <div className="flex flex-col items-center justify-between min-h-[140px] px-6 py-6 md:flex-row md:px-0 md:py-0">
        
        {/* Left Illustration */}
        <div className="hidden h-[140px] w-[220px] shrink-0 md:block">
          <img
            src={leftHiringBg}
            alt="We Are Hiring"
            className="h-full w-full object-contain object-left-bottom"
          />
        </div>

        {/* Center Content Container */}
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-8 md:text-left">
          
          {/* WE ARE HIRING Text */}
          <div className="flex flex-col items-center md:items-start leading-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              WE ARE
            </span>
            <span className="mt-1 text-3xl font-extrabold tracking-tight text-[#05264E]">
              HIRING
            </span>
          </div>

          {/* Tagline */}
          <div className="max-w-[200px] text-sm font-semibold text-[#05264E] leading-snug">
            Let's <span className="font-bold">Work Together</span> &amp; Explore Opportunities
          </div>

          {/* CTA Button */}
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-[#2956F2] hover:shadow-lg hover:shadow-blue-500/30"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Apply now</span>
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="hidden h-[140px] w-[220px] shrink-0 md:block">
          <img
            src={rightHiringBg}
            alt="Explore Opportunities"
            className="h-full w-full object-contain object-right-bottom"
          />
        </div>

      </div>
    </div>
  );
}
