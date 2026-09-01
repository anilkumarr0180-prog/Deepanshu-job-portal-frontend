import { useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  LayoutGrid,
  List,
  MapPin,
  RefreshCw,
  SearchX,
} from "lucide-react";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import RecruiterCard, { type DerivedCompany } from "../components/public/RecruiterCard";
import RecruiterCardSkeleton from "../components/public/RecruiterCardSkeleton";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const INDUSTRIES = [
  { id: "software", label: "Software", baseCount: 12 },
  { id: "finance", label: "Finance", baseCount: 23 },
  { id: "recruiting", label: "Recruiting", baseCount: 43 },
  { id: "management", label: "Management", baseCount: 65 },
  { id: "advertising", label: "Advertising", baseCount: 76 },
];

const SALARY_RANGES = [
  { id: "0-20", label: "$0k - $20k" },
  { id: "20-40", label: "$20k - $40k" },
  { id: "40-60", label: "$40k - $60k" },
  { id: "60-80", label: "$60k - $80k" },
  { id: "80-plus", label: "$80k+" },
];

export default function RecruitersPage() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(12);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, isError, refetch } = useJobs({
    limit: "100",
  });

  /* Group backend jobs into unique hiring organizations */
  const allCompanies: DerivedCompany[] = useMemo(() => {
    const map = new Map<string, DerivedCompany>();

    if (!data?.jobs) return [];

    data.jobs.forEach((job) => {
      const companyName = job.company?.trim() || "Hiring Company";
      const key = companyName.toLowerCase();
      const logo = job.companyLogo || job.companyId?.logo;

      if (!map.has(key)) {
        map.set(key, {
          id: job.companyId?._id || companyName,
          name: companyName,
          logo: logo,
          location: job.location || "New York, US",
          description: job.description
            ? job.description.split("\n\n")[0]
            : "",
          activeJobsCount: 1,
          rating: 5,
          reviewCount: 25 + (companyName.length * 7) % 65,
          recruiterName: job.recruiterId?.name,
          recruiterEmail: job.recruiterId?.email,
          createdAt: job.createdAt,
          jobs: [job],
        });
      } else {
        const existing = map.get(key)!;
        existing.activeJobsCount += 1;
        if (job.location && (!existing.location || existing.location === "New York, US")) {
          existing.location = job.location;
        }
        if (!existing.logo && logo) {
          existing.logo = logo;
        }
        existing.jobs.push(job);
        if (!existing.recruiterName && job.recruiterId?.name) {
          existing.recruiterName = job.recruiterId.name;
        }
      }
    });

    return Array.from(map.values());
  }, [data]);

  /* Filter & Sort companies dynamically */
  const filteredCompanies = useMemo(() => {
    let list = [...allCompanies];

    // Alphabet Filter
    if (selectedLetter) {
      list = list.filter((c) =>
        c.name.toUpperCase().startsWith(selectedLetter)
      );
    }

    // Location Filter
    if (locationInput.trim()) {
      const loc = locationInput.trim().toLowerCase();
      list = list.filter((c) => c.location.toLowerCase().includes(loc));
    }

    // Industry Filter (mock/dynamic matching on description/name/industry)
    if (selectedIndustries.length > 0) {
      list = list.filter((c) => {
        const text = `${c.name} ${c.description}`.toLowerCase();
        return selectedIndustries.some((ind) => text.includes(ind));
      });
    }

    // Sorting
    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "jobs") {
      list.sort((a, b) => b.activeJobsCount - a.activeJobsCount);
    }

    return list;
  }, [allCompanies, selectedLetter, locationInput, selectedIndustries, sortBy]);

  // Total active jobs across filtered companies
  const totalJobsCount = useMemo(() => {
    return filteredCompanies.reduce((acc, c) => acc + c.activeJobsCount, 0);
  }, [filteredCompanies]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCompanies.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + pageSize);

  const startDisplayIndex = filteredCompanies.length === 0 ? 0 : startIndex + 1;
  const endDisplayIndex = Math.min(startIndex + pageSize, filteredCompanies.length);

  const handleReset = () => {
    setSelectedLetter(null);
    setLocationInput("");
    setSelectedIndustries([]);
    setSelectedSalaries([]);
    setCurrentPage(1);
  };

  const toggleIndustry = (id: string) => {
    setCurrentPage(1);
    setSelectedIndustries((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSalary = (id: string) => {
    setCurrentPage(1);
    setSelectedSalaries((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1220] py-6 sm:py-8 text-slate-900 transition-colors duration-200">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">

        {/* ── Top Banner: Browse Companies with Alphabet Selector ── */}
        <div className="mb-10 rounded-[20px] bg-[#EFF4FD] dark:bg-[#131D2E] px-4 py-8 sm:py-10 text-center">
          <h1 className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-[#05264E] dark:text-[#F1F5F9]">
            Browse Companies
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-[#66789C] dark:text-slate-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?
          </p>

          {/* Alphabet Filter Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2 rounded-xl bg-white dark:bg-[#0B1220] px-3 sm:px-5 py-2 shadow-xs border border-[#E0E6F7] dark:border-slate-800">
            {ALPHABET.map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => {
                    setSelectedLetter(isSelected ? null : letter);
                    setCurrentPage(1);
                  }}
                  className={`h-7 w-7 rounded-md text-[13px] font-semibold transition-colors duration-150 ${
                    isSelected
                      ? "bg-[#3C65F5] text-white"
                      : "text-[#4F5E64] hover:bg-[#EFF4FD] hover:text-[#3C65F5] dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Main Layout: Sidebar (240px) + Results Area ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* ─────────────────────────────────────────────
              LEFT SIDEBAR — Advance Filter
          ───────────────────────────────────────────── */}
          <aside className="w-full lg:w-[240px] shrink-0">
            
            {/* Header: Advance Filter + Reset */}
            <div className="flex items-center justify-between border-b border-[#E0E6F7] dark:border-slate-800 pb-3 mb-5">
              <h2 className="text-[17px] font-bold text-[#05264E] dark:text-[#F1F5F9]">
                Advance Filter
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-[13px] font-medium text-[#66789C] hover:text-[#3C65F5] dark:text-slate-400 dark:hover:text-[#5E81FF] transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Location Input Filter */}
            <div className="mb-6">
              <div className="relative flex items-center rounded-lg border border-[#E0E6F7] bg-white dark:border-slate-800 dark:bg-[#131D2E] px-3 py-2">
                <MapPin className="mr-2 h-4 w-4 shrink-0 text-[#66789C] dark:text-slate-400" />
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="New York, US"
                  className="w-full bg-transparent text-[13px] text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <div className="mb-6">
              <h3 className="mb-3.5 text-[15px] font-bold text-[#05264E] dark:text-[#F1F5F9]">
                Industry
              </h3>

              <div className="flex flex-col gap-2.5">
                {/* All Industry Option */}
                <label className="flex items-center justify-between cursor-pointer group select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIndustries.length === 0}
                      onChange={() => {
                        setSelectedIndustries([]);
                        setCurrentPage(1);
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-[#3C65F5] focus:ring-[#3C65F5] cursor-pointer accent-[#3C65F5]"
                    />
                    <span className="text-[13px] text-[#4F5E64] dark:text-slate-300 group-hover:text-[#3C65F5] transition-colors">
                      All
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      selectedIndustries.length === 0
                        ? "bg-[#3C65F5] text-white"
                        : "bg-[#EFF4FD] dark:bg-slate-800 text-[#3C65F5] dark:text-blue-400"
                    }`}
                  >
                    180
                  </span>
                </label>

                {/* Specific Industries */}
                {INDUSTRIES.map((ind) => {
                  const isChecked = selectedIndustries.includes(ind.id);
                  return (
                    <label
                      key={ind.id}
                      className="flex items-center justify-between cursor-pointer group select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleIndustry(ind.id)}
                          className="h-4 w-4 rounded border-slate-300 text-[#3C65F5] focus:ring-[#3C65F5] cursor-pointer accent-[#3C65F5]"
                        />
                        <span className="text-[13px] text-[#4F5E64] dark:text-slate-300 group-hover:text-[#3C65F5] transition-colors">
                          {ind.label}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isChecked
                            ? "bg-[#3C65F5] text-white"
                            : "bg-[#EFF4FD] dark:bg-slate-800 text-[#3C65F5] dark:text-blue-400"
                        }`}
                      >
                        {ind.baseCount}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Salary Range Filter */}
            <div className="mb-6">
              <h3 className="mb-3.5 text-[15px] font-bold text-[#05264E] dark:text-[#F1F5F9]">
                Salary Range
              </h3>

              <div className="flex flex-col gap-2.5">
                {SALARY_RANGES.map((sal) => {
                  const isChecked = selectedSalaries.includes(sal.id);
                  return (
                    <label
                      key={sal.id}
                      className="flex items-center gap-2.5 cursor-pointer group select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSalary(sal.id)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3C65F5] focus:ring-[#3C65F5] cursor-pointer accent-[#3C65F5]"
                      />
                      <span className="text-[13px] text-[#4F5E64] dark:text-slate-300 group-hover:text-[#3C65F5] transition-colors">
                        {sal.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* ─────────────────────────────────────────────
              RIGHT CONTENT AREA — Toolbar + 3-Col Grid
          ───────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* ── Top Results Toolbar ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E0E6F7] dark:border-slate-800 pb-4 mb-6">
              
              {/* Left: Showing count */}
              <p className="text-[14px] text-[#66789C] dark:text-slate-400">
                Showing <span className="font-semibold text-[#05264E] dark:text-slate-200">{startDisplayIndex}–{endDisplayIndex}</span> of{" "}
                <span className="font-semibold text-[#05264E] dark:text-slate-200">{totalJobsCount || allCompanies.length}</span> jobs
              </p>

              {/* Right: Show / Sort / View Controls */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Show Select */}
                <div className="relative inline-flex items-center">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none rounded-lg border border-[#E0E6F7] bg-white dark:border-slate-800 dark:bg-[#131D2E] pl-3 pr-7 py-1.5 text-[13px] font-medium text-[#05264E] dark:text-slate-200 outline-none cursor-pointer hover:border-[#3C65F5]"
                  >
                    <option value={6}>Show: 6</option>
                    <option value={12}>Show: 12</option>
                    <option value={18}>Show: 18</option>
                    <option value={24}>Show: 24</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* Sort By Select */}
                <div className="relative inline-flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-lg border border-[#E0E6F7] bg-white dark:border-slate-800 dark:bg-[#131D2E] pl-3 pr-7 py-1.5 text-[13px] font-medium text-[#05264E] dark:text-slate-200 outline-none cursor-pointer hover:border-[#3C65F5]"
                  >
                    <option value="newest">Sort by: Newest Post</option>
                    <option value="oldest">Sort by: Oldest</option>
                    <option value="name">Sort by: Name A-Z</option>
                    <option value="jobs">Sort by: Most Jobs</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* View Mode Toggle Buttons */}
                <div className="flex items-center gap-1 border-l border-[#E0E6F7] dark:border-slate-800 pl-3">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                      viewMode === "list"
                        ? "bg-[#3C65F5] text-white border-[#3C65F5]"
                        : "bg-white text-[#66789C] border-[#E0E6F7] hover:border-[#3C65F5] hover:text-[#3C65F5] dark:bg-[#131D2E] dark:border-slate-800"
                    }`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                      viewMode === "grid"
                        ? "bg-[#3C65F5] text-white border-[#3C65F5]"
                        : "bg-white text-[#66789C] border-[#E0E6F7] hover:border-[#3C65F5] hover:text-[#3C65F5] dark:bg-[#131D2E] dark:border-slate-800"
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* ── Content States: Loading / Error / Empty / Grid ── */}
            {isError ? (
              <div className="rounded-2xl border border-rose-200 bg-white p-12 text-center shadow-xs dark:bg-[#131D2E] dark:border-rose-900/50">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                  Failed to load recruiters
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  There was an issue fetching recruiters from the server. Please try again.
                </p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-slate-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Retry</span>
                </button>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: pageSize }).map((_, i) => (
                  <RecruiterCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="rounded-2xl border border-[#E0E6F7] bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-[#131D2E]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5] dark:bg-blue-950/50">
                  <SearchX className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#05264E] dark:text-[#F1F5F9]">
                  No Recruiters Found
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  We couldn't find any companies matching your filter criteria.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#2956F2]"
                >
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedCompanies.map((comp) => (
                  <RecruiterCard key={comp.id} company={comp} />
                ))}
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E0E6F7] bg-white text-[13px] font-semibold text-[#05264E] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#3C65F5] hover:text-[#3C65F5] dark:bg-[#131D2E] dark:border-slate-800 dark:text-slate-200"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-[#3C65F5] text-white"
                        : "border border-[#E0E6F7] bg-white text-[#05264E] hover:border-[#3C65F5] hover:text-[#3C65F5] dark:bg-[#131D2E] dark:border-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E0E6F7] bg-white text-[13px] font-semibold text-[#05264E] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#3C65F5] hover:text-[#3C65F5] dark:bg-[#131D2E] dark:border-slate-800 dark:text-slate-200"
                >
                  &gt;
                </button>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
