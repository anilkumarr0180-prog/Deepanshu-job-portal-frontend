import HeroSearch from "./HeroSearch";
import type { SearchFilterState } from "@/shared/components/UniversalSearchBar";

interface HeroContentProps {
  onSearchChange?: (filters: SearchFilterState) => void;
  initialFilters?: SearchFilterState;
}

export default function HeroContent({ onSearchChange, initialFilters }: HeroContentProps) {
  return (
    <div className="w-full">
      {/* Heading */}
      <h1 className="heading-banner text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-[#05264E] dark:text-[#F1F5F9] leading-[40px] sm:leading-[50px] lg:leading-[60px] tracking-[-0.015em] max-w-[425px]">
        The{" "}
        <span className="relative inline-block text-[#3C65F5] dark:text-[#5E81FF] px-1 z-0">
          <span className="absolute left-0 right-0 bottom-[4px] lg:bottom-[8px] h-[38%] bg-[#DCE7FC] dark:bg-[#3C65F5]/25 -z-10" />
          Easiest Way
        </span>
        <br />
        to Get Your New
        <br />
        Job
      </h1>

      {/* Description */}
      <div className="banner-description mt-[20px] max-w-[425px] text-[16px] sm:text-[17px] lg:text-[18px] font-normal leading-[28px] lg:leading-[30px] text-[#4F5E64] dark:text-slate-400">
        Each month, more than 3 million job seekers turn to website in their search for work, making over 140,000 applications every single day
      </div>

      {/* Search Bar & Popular Searches */}
      <HeroSearch onSearchChange={onSearchChange} initialFilters={initialFilters} />
    </div>
  );
}