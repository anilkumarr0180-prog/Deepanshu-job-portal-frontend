import HeroContent from "./HeroContent";
import HeroImages from "./HeroImages";
import type { SearchFilterState } from "@/shared/components/UniversalSearchBar";

interface HeroProps {
  onSearchChange?: (filters: SearchFilterState) => void;
  initialFilters?: SearchFilterState;
}

export default function Hero({ onSearchChange, initialFilters }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F2F6FD] dark:bg-[#0B1220] py-12 lg:py-16">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Content */}
        <HeroContent onSearchChange={onSearchChange} initialFilters={initialFilters} />

        {/* Right Images */}
        <HeroImages />
      </div>
    </section>
  );
}