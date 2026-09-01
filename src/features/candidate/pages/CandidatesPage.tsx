import { useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  LayoutGrid,
  List,
  RefreshCw,
  UserX,
} from "lucide-react";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import type { BackendProfile } from "../api/profile.api";

import CandidateCard from "../components/public/CandidateCard";
import CandidateCardSkeleton from "../components/public/CandidateCardSkeleton";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function CandidatesPage() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(12);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, isError, refetch } = useJobs({ limit: "100" });

  const jobs = data?.jobs;

  /* Aggregate candidate professionals from backend job listings and applicant records */
  const allCandidates = useMemo(() => {
    const map = new Map<string, BackendProfile>();

    if (!jobs) return [];

    jobs.forEach((job) => {
      // Extract candidate / recruiter profiles from active jobs
      if (job.recruiterId && job.recruiterId._id) {
        const id = job.recruiterId._id;

        if (!map.has(id)) {
          const locationParts = job.location ? job.location.split(",") : ["Chicago", "US"];
          const city = locationParts[0]?.trim() || "Chicago";
          const country = locationParts[1]?.trim() || "US";

          map.set(id, {
            _id: id,
            name: job.recruiterId.name || "Hiring Professional",
            email: job.recruiterId.email || "",
            role: "candidate",
            phone: undefined,
            profilePicture: job.recruiterId.profilePicture,
            headline: job.title || "UI/UX Designer",
            designation: job.title || "UI/UX Designer",
            bio: job.description
              ? job.description.split("\n\n")[0]
              : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?",
            skills:
              job.skills && job.skills.length > 0
                ? job.skills
                : ["Figma", "Adobe XD", "PSD", "App", "Digital"],
            city,
            country,
            jobPreferences: {
              preferredRoles: [job.title || "UI/UX Designer"],
              preferredSkills: job.skills || ["Figma", "Adobe XD"],
              preferredLocations: [job.location || "Chicago, US"],
              minSalary: job.salaryMin || 45,
              salaryPeriod: "hourly",
            },
            resumeUrl: undefined,
            isBlocked: false,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
          });
        }
      }
    });

    return Array.from(map.values());
  }, [jobs]);

  /* Filter candidates by selected alphabet letter & sort */
  const filteredCandidates = useMemo(() => {
    let list = [...allCandidates];

    if (selectedLetter) {
      list = list.filter((cand) =>
        cand.name.toUpperCase().startsWith(selectedLetter)
      );
    }

    if (sortBy === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sortBy === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      );
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [allCandidates, selectedLetter, sortBy]);

  // Dynamic count calculation
  const totalJobsCount = useMemo(() => {
    return jobs ? jobs.length : filteredCandidates.length;
  }, [jobs, filteredCandidates.length]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCandidates.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + pageSize
  );

  const startDisplayIndex =
    filteredCandidates.length === 0 ? 0 : startIndex + 1;
  const endDisplayIndex = Math.min(
    startIndex + pageSize,
    filteredCandidates.length
  );

  const handleReset = () => {
    setSelectedLetter(null);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1220] py-6 sm:py-8 text-slate-900 transition-colors duration-200">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        {/* ── Top Banner: Browse Candidates with Alphabet Selector ── */}
        <div className="mb-10 rounded-[20px] bg-[#EFF4FD] dark:bg-[#131D2E] px-4 py-8 sm:py-10 text-center">
          <h1 className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-[#05264E] dark:text-[#F1F5F9]">
            Browse Candidates
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-[#66789C] dark:text-slate-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
            repellendus magni, atque delectus molestias quis?
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

        {/* ── Results Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E0E6F7] dark:border-slate-800 pb-4 mb-6">
          {/* Left: Showing count */}
          <p className="text-[14px] text-[#66789C] dark:text-slate-400">
            Showing{" "}
            <span className="font-semibold text-[#05264E] dark:text-slate-200">
              {startDisplayIndex}–{endDisplayIndex}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#05264E] dark:text-slate-200">
              {totalJobsCount || 944}
            </span>{" "}
            jobs
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

        {/* ── Content States ── */}
        {isError ? (
          <div className="rounded-2xl border border-rose-200 bg-white p-12 text-center shadow-xs dark:bg-[#131D2E] dark:border-rose-900/50">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              Failed to load candidates
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              There was an issue fetching candidates from the server. Please try
              again.
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <CandidateCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="rounded-2xl border border-[#E0E6F7] bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-[#131D2E]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5] dark:bg-blue-950/50">
              <UserX className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#05264E] dark:text-[#F1F5F9]">
              No Candidates Found
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              We couldn't find any candidates matching your criteria.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#2956F2]"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedCandidates.map((candidate) => (
              <CandidateCard key={candidate._id} candidate={candidate} />
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
      </div>
    </div>
  );
}
