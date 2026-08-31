import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import leftHiringBg from "@/assets/images/jobs/bg-left-hiring.svg";
import rightHiringBg from "@/assets/images/jobs/bg-right-hiring.svg";

export default function HiringBanner() {
  return (
    <div className="relative mx-auto mt-12 sm:mt-16 w-full max-w-[1140px] overflow-hidden rounded-[8px] border border-[#E0E6F7] dark:border-[#2A3850] bg-white dark:bg-[#151F32] shadow-[0_10px_20px_-5px_rgba(10,42,105,0.06)]">
      <div className="flex flex-col items-center justify-between min-h-[160px] px-6 py-6 lg:px-0 lg:py-0 md:flex-row">
        
        {/* Left Illustration */}
        <div className="hidden h-[130px] w-[160px] shrink-0 md:block ml-4 mb-2 self-end">
          <img
            src={leftHiringBg}
            alt="We Are Hiring"
            className="h-full w-full object-contain object-left-bottom select-none pointer-events-none"
          />
        </div>

        {/* Center Content Container */}
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-6 lg:gap-8 md:text-left my-auto">
          
          {/* WE ARE HIRING Text */}
          <div className="flex flex-col items-center md:items-start leading-none">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] font-bold uppercase tracking-[2px] text-[#A0ABB8] dark:text-slate-400 leading-[20px]">
              We are
            </span>
            <span className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-[44px] sm:text-[48px] font-extrabold tracking-[1px] text-[#05264E] dark:text-[#F1F5F9] uppercase leading-[50px]">
              HIRING
            </span>
          </div>

          {/* Tagline */}
          <div className="max-w-[150px] font-['Plus_Jakarta_Sans',sans-serif] text-[17px] font-medium text-[#66789C] dark:text-slate-300 leading-[22px]">
            Let’s <span className="font-bold text-[#05264E] dark:text-white">Work</span> Together<br className="hidden sm:inline" /> &amp; <span className="font-bold text-[#05264E] dark:text-white">Explore</span> Opportunities
          </div>

          {/* CTA Button */}
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#3C65F5] px-6 py-3.5 text-[14px] font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-[#2956F2] hover:shadow-lg hover:shadow-blue-500/30"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Apply now</span>
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="hidden h-[130px] w-[260px] shrink-0 md:block mr-2 mb-2 self-end">
          <img
            src={rightHiringBg}
            alt="Explore Opportunities"
            className="h-full w-full object-contain object-right-bottom select-none pointer-events-none"
          />
        </div>

      </div>
    </div>
  );
}
