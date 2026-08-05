import { Search, Sparkles, UserCheck } from "lucide-react";

interface CandidatesHeroProps {
  totalCount: number;
  isLoading: boolean;
  searchName: string;
  onSearchNameChange: (val: string) => void;
  onSearch: () => void;
}

export default function CandidatesHero({
  totalCount,
  isLoading,
  searchName,
  onSearchNameChange,
  onSearch,
}: CandidatesHeroProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF3FF]/70 via-white to-white py-12 sm:py-16">
      {/* Background blurs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Dynamic Count Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white/80 px-4 py-1.5 text-xs font-bold text-[#3C65F5] shadow-xs backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {isLoading ? "Loading professionals..." : `${totalCount} Professionals Available`}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#05264E] sm:text-5xl">
          Browse Candidates
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Discover talented professionals available on our platform and connect with qualified job seekers.
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-3 shadow-lg shadow-slate-200/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative flex flex-1 items-center px-3">
              <UserCheck className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => onSearchNameChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search candidate by name..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

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
