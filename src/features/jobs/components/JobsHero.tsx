import UniversalSearchBar, { type SearchFilterState } from "@/shared/components/UniversalSearchBar";
import leftJobHead from "@/assets/images/jobs/left-job-head.svg";
import rightJobHead from "@/assets/images/jobs/right-job-head.svg";

interface JobsHeroProps {
  isLoading: boolean;
  totalResults: number;
  initialFilters?: SearchFilterState;
  onSearch: (filters: SearchFilterState) => void;
  onClear?: () => void;
}

export default function JobsHero({
  isLoading,
  totalResults,
  initialFilters,
  onSearch,
  onClear,
}: JobsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F2F6FD]">
      {/* Left Illustration */}
      <img
        src={leftJobHead}
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 hidden md:block md:w-44 lg:w-64"
      />

      {/* Right Illustration */}
      <img
        src={rightJobHead}
        alt=""
        className="pointer-events-none absolute bottom-0 right-0 hidden md:block md:w-44 lg:w-64"
      />

      <div className="mx-auto max-w-[1320px] px-8 pb-16 pt-16 md:pt-20">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold leading-tight text-[#05264E] md:text-5xl">
            {isLoading ? (
              <span className="inline-block h-10 w-56 animate-pulse rounded bg-slate-200" />
            ) : (
              `${totalResults.toLocaleString()} Jobs Available Now`
            )}
          </h1>
          <p className="mt-4 text-lg text-[#66789C]">
            Explore top opportunities tailored to your skills and preferences.
          </p>
        </div>

        {/* Universal Search Bar */}
        <div className="mx-auto mt-8 max-w-3xl">
          <UniversalSearchBar
            initialValues={initialFilters}
            onSearch={onSearch}
            onClear={onClear}
            placeholder="Search by job title, skill, or keyword..."
          />
        </div>
      </div>
    </section>
  );
}
