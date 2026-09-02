import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import leftHiringBg from "@/assets/images/jobs/bg-left-hiring.svg";
import rightHiringBg from "@/assets/images/jobs/bg-right-hiring.svg";

export default function HiringBanner() {
  return (
    <div className="box-we-hiring relative mx-auto mt-[40px] lg:mt-[50px] mb-[30px] w-full max-w-full lg:max-w-[85%] overflow-hidden rounded-[4px] border border-[#E0E6F7] dark:border-[#2A3850] bg-white dark:bg-[#151F32] shadow-[0_10px_20px_-5px_rgba(10,42,105,0.06)] px-6 py-8 sm:px-8 md:py-[40px] md:pl-[190px] md:pr-[250px]">
      {/* Left Illustration */}
      <img
        src={leftHiringBg}
        alt="We Are Hiring"
        className="absolute left-[15px] bottom-[15px] h-[120px] w-auto max-w-[150px] object-contain object-left-bottom select-none pointer-events-none hidden md:block"
      />

      {/* Center Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:gap-4 md:text-left">
        {/* WE ARE HIRING Text */}
        <div className="flex flex-col items-center md:items-start leading-none select-none shrink-0">
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] font-bold uppercase tracking-[2px] text-[#A0ABB8] dark:text-slate-400 leading-[20px]">
            We are
          </span>
          <span className="mt-[2px] font-['Plus_Jakarta_Sans',sans-serif] text-[44px] lg:text-[49px] font-extrabold tracking-[1px] text-[#05264E] dark:text-[#F1F5F9] uppercase leading-[48px] lg:leading-[51px]">
            HIRING
          </span>
        </div>

        {/* Tagline */}
        <div className="max-w-[190px] font-['Plus_Jakarta_Sans',sans-serif] text-[17px] lg:text-[18px] font-medium text-[#66789C] dark:text-slate-300 leading-[23px]">
          Let’s <span className="font-bold text-[#05264E] dark:text-white">Work</span> Together<br className="hidden sm:inline" /> &amp; <span className="font-bold text-[#05264E] dark:text-white">Explore</span> Opportunities
        </div>

        {/* CTA Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#3C65F5] px-5 py-3 text-[14px] font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-[#05264E] hover:shadow-lg whitespace-nowrap"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Apply now</span>
        </Link>
      </div>

      {/* Right Illustration */}
      <img
        src={rightHiringBg}
        alt="Explore Opportunities"
        className="absolute right-[-5px] bottom-[15px] h-[120px] w-auto max-w-[250px] object-contain object-right-bottom select-none pointer-events-none hidden md:block"
      />
    </div>
  );
}

