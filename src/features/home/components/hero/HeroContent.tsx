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
      <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold tracking-tight text-[#05264E] dark:text-[#F1F5F9] leading-[1.16] lg:leading-[58px]">
        The{" "}
        <span className="relative inline-block rounded-[4px] bg-[#DCE7FC] dark:bg-[#3C65F5]/25 px-2 py-0.5 text-[#3C65F5] dark:text-[#5E81FF]">
          Easiest Way
        </span>
        <br />
        to Get Your New
        <br />
        Job
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-[460px] text-base lg:text-[18px] font-normal leading-[28px] text-[#4F5E64] dark:text-slate-400">
        Each month, more than 3 million job seekers turn to
        <br />
        website in their search for work, making over
        <br />
        140,000
        <br />
        applications every single day
      </p>

      {/* Search Bar & Popular Searches */}
      <HeroSearch onSearchChange={onSearchChange} initialFilters={initialFilters} />
    </div>
  );
}