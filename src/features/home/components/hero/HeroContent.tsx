import HeroSearch from "./HeroSearch";
import type { SearchFilterState } from "@/shared/components/UniversalSearchBar";

interface HeroContentProps {
  onSearchChange?: (filters: SearchFilterState) => void;
  initialFilters?: SearchFilterState;
}

export default function HeroContent({ onSearchChange, initialFilters }: HeroContentProps) {
  return (
    <div className="max-w-[600px]">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-[#05264E] sm:text-5xl lg:text-[56px]">
        The{" "}
        <span className="relative inline-block rounded-xl bg-[#3C65F5]/10 px-3 py-0.5 text-[#3C65F5]">
          Easiest Way
        </span>
        <br />
        to Get Your New Job
      </h1>

      {/* Description */}
      <p className="mt-5 max-w-[560px] text-base leading-relaxed text-slate-500 sm:text-lg">
        Each month, more than 3 million job seekers turn to website in their
        search for work, making over 140,000 applications every single day.
      </p>

      {/* Search Bar & Popular Searches */}
      <HeroSearch onSearchChange={onSearchChange} initialFilters={initialFilters} />
    </div>
  );
}