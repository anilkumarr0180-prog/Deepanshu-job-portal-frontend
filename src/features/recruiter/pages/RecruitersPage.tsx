import { useMemo, useState } from "react";
import { AlertCircle, RefreshCw, SearchX } from "lucide-react";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import RecruiterCard, { type DerivedCompany } from "../components/public/RecruiterCard";
import RecruiterCardSkeleton from "../components/public/RecruiterCardSkeleton";
import RecruitersHero from "../components/public/RecruitersHero";

export default function RecruitersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const { data, isLoading, isError, refetch } = useJobs({
    limit: "100",
  });

  const handleSearch = () => {
    // Real-time filtering handled by useMemo
  };

  const handleReset = () => {
    setSearchInput("");
    setSearchLocation("");
  };

  /* Group backend jobs into distinct hiring companies & filter by searchInput/searchLocation */
  const companies = useMemo(() => {
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

    let list = Array.from(map.values());

    // Apply real-time search & location filters
    const query = searchInput.trim().toLowerCase();
    const loc = searchLocation.trim().toLowerCase();

    if (query) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.recruiterName?.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      );
    }

    if (loc) {
      list = list.filter((c) => c.location.toLowerCase().includes(loc));
    }

    return list;
  }, [data, searchInput, searchLocation]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-900">
      {/* Hero Section */}
      <RecruitersHero
        totalCount={companies.length}
        isLoading={isLoading}
        searchName={searchInput}
        onSearchNameChange={setSearchInput}
        searchLocation={searchLocation}
        onSearchLocationChange={setSearchLocation}
        onSearch={handleSearch}
      />

      {/* Main Recruiter Grid */}
      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Results Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#05264E]">
              Hiring Companies & Recruiters
            </h2>
            <p className="text-xs text-slate-500">
              Showing {companies.length} active hiring {companies.length === 1 ? "organization" : "organizations"}
            </p>
          </div>

          {(searchInput || searchLocation) && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-[#3C65F5] hover:underline"
            >
              Clear Search Filters
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
              Failed to load recruiters
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              There was an issue fetching recruiters from the server. Please try again.
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RecruiterCardSkeleton key={i} />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
              <SearchX className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#05264E]">
              No Recruiters Found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              We couldn't find any companies matching your search criteria.
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((comp) => (
              <RecruiterCard key={comp.id} company={comp} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
