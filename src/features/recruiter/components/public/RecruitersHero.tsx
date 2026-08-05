import { Building2, MapPin, Search, Sparkles } from "lucide-react";

interface RecruitersHeroProps {
  totalCount: number;
  isLoading: boolean;
  searchName: string;
  onSearchNameChange: (val: string) => void;
  searchLocation: string;
  onSearchLocationChange: (val: string) => void;
  onSearch: () => void;
}

export default function RecruitersHero({
  totalCount,
  isLoading,
  searchName,
  onSearchNameChange,
  searchLocation,
  onSearchLocationChange,
  onSearch,
}: RecruitersHeroProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF3FF]/70 via-white to-white py-12 sm:py-16">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Counter Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white/80 px-4 py-1.5 text-xs font-bold text-[#3C65F5] shadow-xs backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {isLoading ? "Loading companies..." : `${totalCount} Companies Actively Hiring`}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#05264E] sm:text-5xl">
          Browse Recruiters
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Discover top companies and verified recruiters actively hiring top talent on our platform.
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-slate-200/80 bg-white p-3 shadow-lg shadow-slate-200/50 backdrop-blur-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search by Company Name */}
            <div className="relative flex flex-1 items-center px-3">
              <Building2 className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => onSearchNameChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Company or recruiter name..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="hidden h-8 w-px bg-slate-200 md:block" />

            {/* Search by Location */}
            <div className="relative flex flex-1 items-center px-3">
              <MapPin className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => onSearchLocationChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="City, state, or country..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Search Button */}
            <button
              type="button"
              onClick={onSearch}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-[#2956F2] hover:shadow-lg hover:shadow-blue-500/30"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
