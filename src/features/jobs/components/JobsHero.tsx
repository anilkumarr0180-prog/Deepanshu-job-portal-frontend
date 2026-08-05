import leftJobHead from "@/assets/images/jobs/left-job-head.svg";
import rightJobHead from "@/assets/images/jobs/right-job-head.svg";

interface JobsHeroProps {
  isLoading: boolean;
  totalResults: number;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  heroLocation: string;
  onHeroLocationChange: (value: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function JobsHero({
  isLoading,
  totalResults,
  searchInput,
  onSearchInputChange,
  heroLocation,
  onHeroLocationChange,
  onSearch,
  onKeyDown,
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
            Find your next opportunity from our latest job listings.
          </p>
        </div>

        {/* Search Box */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex h-[70px] flex-col overflow-hidden rounded-2xl bg-white p-[10px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] sm:flex-row">
            <div className="flex-1 border-b border-slate-200 sm:border-b-0 sm:border-r">
              <select
                disabled
                className="h-full w-full cursor-not-allowed bg-white px-4 text-sm text-slate-400 outline-none"
              >
                <option>All Industries</option>
              </select>
            </div>

            <div className="flex-1 border-b border-slate-200 sm:border-b-0 sm:border-r">
              <input
                type="text"
                placeholder="Location"
                value={heroLocation}
                onChange={(e) => onHeroLocationChange(e.target.value)}
                onKeyDown={onKeyDown}
                className="h-full w-full bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white"
              />
            </div>

            <div className="flex-1 border-b border-slate-200 sm:border-b-0 sm:border-r">
              <input
                type="text"
                placeholder="Keyword Search"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                className="h-full w-full bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={onSearch}
              className="flex h-[50px] w-full shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-[#3C65F5] px-6 text-sm font-medium text-white transition hover:bg-[#2956F2] sm:my-auto sm:w-[122px]"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
