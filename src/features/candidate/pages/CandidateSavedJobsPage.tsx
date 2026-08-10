import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Search,
  ArrowRight,
  MapPin,
  Building2,
  DollarSign,
  Loader2,
  X,
  Trash2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useSavedJobs } from "../hooks/useSavedJobs";
import { useToggleSaveJob } from "../hooks/useToggleSaveJob";
import { formatRelativeDate } from "../utils/jobMapper";

export default function CandidateSavedJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: savedItems, isLoading, isError } = useSavedJobs();
  const toggleSaveMutation = useToggleSaveJob();

  const savedJobsList = (savedItems || []).filter((item) => item.jobId);

  const filteredJobs = savedJobsList.filter((item) => {
    const job = item.jobId;
    if (!job) return false;
    const query = searchTerm.toLowerCase();
    const title = job.title?.toLowerCase() || "";
    const company = job.company?.toLowerCase() || "";
    const location = job.location?.toLowerCase() || "";
    return title.includes(query) || company.includes(query) || location.includes(query);
  });

  const handleRemoveBookmark = (jobId: string) => {
    toggleSaveMutation.mutate({ jobId, isCurrentlySaved: true });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Premium Gradient Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        {/* Glow ambient circle background decorations */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-10 right-1/3 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Bookmarked Careers
              </span>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-extrabold text-blue-200 border border-blue-400/30">
                {savedJobsList.length} Saved
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              My Saved Jobs
            </h1>
            <p className="max-w-xl text-sm text-slate-300 leading-relaxed">
              Track roles you are interested in, compare packages, and apply whenever you are ready.
            </p>
          </div>

          <Link
            to="/jobs"
            className="group inline-flex items-center gap-2.5 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition-all hover:bg-blue-50 hover:shadow-white/10 active:scale-95"
          >
            <span>Explore Jobs</span>
            <ArrowRight className="h-4 w-4 text-[#3C65F5] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Live Filter Search Input */}
        {savedJobsList.length > 0 && (
          <div className="relative z-10 mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter saved roles by job title, company name, or city..."
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pl-11 pr-10 text-sm font-medium text-white placeholder-slate-400 backdrop-blur-md outline-none transition focus:border-blue-400 focus:bg-white/15 focus:ring-4 focus:ring-blue-500/20"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white/80 p-8 backdrop-blur-md shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#3C65F5]" />
          <span className="mt-3 text-sm font-semibold text-slate-600">Loading your saved roles...</span>
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-8 text-center text-rose-800">
          <p className="text-sm font-bold">Unable to load saved jobs right now. Please refresh.</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredJobs.map((item) => {
            const job = item.jobId;
            const isRemoving =
              toggleSaveMutation.isPending &&
              toggleSaveMutation.variables?.jobId === job._id;

            return (
              <article
                key={item._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5]/40 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div>
                  {/* Top Bar: Company Badge & Remove Action */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 font-bold text-[#3C65F5] shadow-xs group-hover:scale-105 transition-transform">
                        {job.company?.[0]?.toUpperCase() || <Building2 className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#3C65F5] transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>{job.company}</span>
                        </p>
                      </div>
                    </div>

                    {/* Bookmark / Remove Action Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveBookmark(job._id)}
                      disabled={isRemoving}
                      title="Remove from saved jobs"
                      className="group/btn flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#3C65F5] transition-all hover:bg-rose-50 hover:text-rose-600 hover:scale-110 active:scale-95 shrink-0"
                    >
                      <Bookmark className="h-4 w-4 fill-[#3C65F5] group-hover/btn:hidden" />
                      <Trash2 className="h-4 w-4 hidden group-hover/btn:block text-rose-600" />
                    </button>
                  </div>

                  {/* Metadata Chips */}
                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100/80 px-3 py-1.5 text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100/80 px-3 py-1.5 text-slate-700">
                      {job.employmentType}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-emerald-700 border border-emerald-500/20 font-bold">
                      <DollarSign className="h-3.5 w-3.5" />
                      ${(job.salaryMin ?? 0).toLocaleString()} - ${(job.salaryMax ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                  <span className="font-semibold text-slate-400">
                    Saved {formatRelativeDate(item.createdAt)}
                  </span>

                  <Link
                    to={`/candidate/jobs/${job._id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5]/10 px-3.5 py-2 text-xs font-bold text-[#3C65F5] transition-all hover:bg-[#3C65F5] hover:text-white hover:shadow-md hover:shadow-blue-500/20 active:scale-95"
                  >
                    <span>View Details</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State with Premium Styling */
        <div className="rounded-3xl border border-dashed border-slate-300/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-[#3C65F5] shadow-inner">
            <Bookmark className="h-8 w-8" />
          </div>
          <h3 className="mt-5 text-xl font-extrabold text-slate-900">
            {searchTerm ? "No matching saved jobs found" : "Your Saved Jobs List is Empty"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
            {searchTerm
              ? `We couldn't find any bookmarked jobs matching "${searchTerm}". Try searching for another keyword or clear the search.`
              : "Save interesting career opportunities while exploring to revisit, compare, and apply anytime."}
          </p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600 hover:scale-105 active:scale-95"
            >
              <span>Explore Open Positions</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
