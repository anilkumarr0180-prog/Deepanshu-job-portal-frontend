import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Search, ArrowRight, Briefcase } from "lucide-react";

export default function CandidateSavedJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // Currently zero saved jobs by default until user bookmarks
  const savedJobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    savedAt: string;
  }> = [];

  const filteredJobs = savedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Saved Jobs</h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep track of roles you are interested in and apply when ready.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Explore Jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {savedJobs.length > 0 && (
          <div className="mt-6 relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved jobs by title or company..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm focus:border-[#3C65F5] focus:bg-white focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-sm font-medium text-slate-600">{job.company}</p>
                </div>
                <button
                  type="button"
                  aria-label="Remove from saved jobs"
                  className="text-slate-400 hover:text-red-500"
                >
                  <Bookmark className="h-5 w-5 fill-slate-400 text-slate-400" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1">{job.location}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{job.type}</span>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1">
                  {job.salary}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">Saved {job.savedAt}</span>
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-xs font-semibold text-[#3C65F5] hover:underline"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#3C65F5]">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No saved jobs yet
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            When you find opportunities that match your experience and career goals, bookmark them to review and apply anytime.
          </p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90"
            >
              Browse Open Positions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
