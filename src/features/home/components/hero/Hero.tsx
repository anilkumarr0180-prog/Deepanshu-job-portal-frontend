import HeroContent from "./HeroContent";
import HeroImages from "./HeroImages";
import type { SearchFilterState } from "@/shared/components/UniversalSearchBar";

interface HeroProps {
  onSearchChange?: (filters: SearchFilterState) => void;
  initialFilters?: SearchFilterState;
}

export default function Hero({ onSearchChange, initialFilters }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F2F6FD] dark:bg-[#0B1220] pt-10 pb-20 lg:pt-[61px] lg:pb-[120px]">
      {/* Background Soft Organic Ambient Accents */}
      <div className="absolute -left-24 top-1/4 h-[380px] w-[380px] rounded-full bg-[#E5EFFE]/70 dark:bg-[#1E293B]/20 blur-3xl pointer-events-none" />
      <div className="absolute right-0 top-0 h-[320px] w-[320px] rounded-full bg-[#E5EFFE]/60 dark:bg-[#1E293B]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-[924px] flex-col lg:flex-row items-start justify-start gap-8 lg:gap-[32px] px-4 sm:px-6 lg:px-0">
        {/* Left Content Column */}
        <div className="w-full lg:w-[470px] shrink-0 pt-0 lg:pt-[12px]">
          <HeroContent onSearchChange={onSearchChange} initialFilters={initialFilters} />
        </div>

        {/* Right Images Column */}
        <div className="hidden lg:block lg:w-[480px] shrink-0">
          <HeroImages />
        </div>
      </div>

      {/* Slanted Bottom Shape Divider (Slopes upward to the right matching reference) */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-[35px] sm:h-[45px] lg:h-[60px] text-white dark:text-[#0B1220]"
        >
          <path
            d="M0,60 L1440,0 L1440,60 L0,60 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}