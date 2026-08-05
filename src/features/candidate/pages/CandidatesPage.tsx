import { useMemo, useState } from "react";
import { AlertCircle, RefreshCw, UserX } from "lucide-react";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import type { BackendProfile } from "../api/profile.api";

import CandidateCard from "../components/public/CandidateCard";
import CandidateCardSkeleton from "../components/public/CandidateCardSkeleton";
import CandidatesHero from "../components/public/CandidatesHero";

export default function CandidatesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data, isLoading, isError, refetch } = useJobs({ limit: "50" });

  const handleSearch = () => {
    setActiveSearch(searchInput.trim());
  };

  const handleReset = () => {
    setSearchInput("");
    setActiveSearch("");
  };

  const jobs = data?.jobs;

  /* Aggregate candidate professionals from backend job listings and applicant records */
  const allCandidates = useMemo(() => {
    const map = new Map<string, BackendProfile>();

    if (!jobs) return [];

    jobs.forEach((job) => {
      // Extract recruiter & applicant candidates attached to active backend jobs
      if (job.recruiterId && job.recruiterId._id) {
        const id = job.recruiterId._id;

        if (!map.has(id)) {
          map.set(id, {
            _id: id,
            name: job.recruiterId.name || "Hiring Professional",
            email: job.recruiterId.email || "",
            role: "candidate",
            phone: undefined,
            profilePicture: undefined,
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

  /* Filter candidates by search name query */
  const filteredCandidates = useMemo(() => {
    if (!activeSearch) return allCandidates;

    return allCandidates.filter((cand) =>
      cand.name.toLowerCase().includes(activeSearch.toLowerCase())
    );
  }, [allCandidates, activeSearch]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-900">
      {/* Hero Section */}
      <CandidatesHero
        totalCount={filteredCandidates.length}
        isLoading={isLoading}
        searchName={searchInput}
        onSearchNameChange={setSearchInput}
        onSearch={handleSearch}
      />

      {/* Main Candidates Grid Section */}
      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Results Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#05264E]">
              Available Candidates & Professionals
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredCandidates.length}{" "}
              {filteredCandidates.length === 1 ? "candidate profile" : "candidate profiles"}
            </p>
          </div>

          {activeSearch && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-[#3C65F5] hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Content States */}
        {isError ? (
          <div className="rounded-3xl border border-rose-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Failed to load candidates
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              There was an issue fetching candidates from the server. Please try again.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CandidateCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
              <UserX className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#05264E]">
              No Candidates Found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              We couldn't find any candidates matching your search term.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#2956F2]"
            >
              <span>Reset Search</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCandidates.map((candidate) => (
              <CandidateCard key={candidate._id} candidate={candidate} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
