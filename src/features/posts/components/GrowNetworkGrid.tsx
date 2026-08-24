import { useState } from "react";
import { Search, Users } from "lucide-react";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { usePeopleSuggestions } from "../hooks/usePeopleSuggestions";
import { useUserProfileModal } from "../context/UserProfileContext";
import ConnectionButton from "./ConnectionButton";

export default function GrowNetworkGrid() {
  const [roleFilter, setRoleFilter] = useState<"all" | "candidate" | "recruiter">("all");
  const [search, setSearch] = useState("");
  const { data: suggestions, isLoading } = usePeopleSuggestions(20);
  const { openUserProfile } = useUserProfileModal();

  const people = suggestions || [];
  const filtered = people.filter((p) => {
    const matchesRole = roleFilter === "all" || p.role.toLowerCase() === roleFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.headline && p.headline.toLowerCase().includes(search.toLowerCase())) ||
      (p.skills && p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())));
    return matchesRole && matchesSearch;
  });

  const getRoleBadgeClasses = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "recruiter":
        return "bg-purple-50 text-purple-700 border-purple-200/70";
      case "candidate":
        return "bg-blue-50 text-blue-700 border-blue-200/70";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/70";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRoleFilter("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              roleFilter === "all"
                ? "bg-[#3C65F5] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Members
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("candidate")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              roleFilter === "candidate"
                ? "bg-[#3C65F5] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Candidates
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("recruiter")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              roleFilter === "recruiter"
                ? "bg-[#3C65F5] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Hiring Partners
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or skills..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#3C65F5] focus:outline-none transition"
          />
        </div>
      </div>

      {/* Suggestions Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-white border border-slate-200 p-5" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((person) => (
            <div
              key={person._id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-blue-200 hover:shadow-md transition duration-200 group"
            >
              <div>
                <div
                  onClick={() =>
                    openUserProfile({
                      _id: person._id,
                      name: person.name,
                      role: person.role,
                      email: person.email,
                      profilePicture: person.profilePicture,
                      headline: person.headline,
                      city: person.location,
                    })
                  }
                  className="flex flex-col items-center text-center cursor-pointer space-y-2"
                >
                  <div className="relative transition-transform group-hover:scale-105">
                    <UserAvatar
                      src={person.profilePicture}
                      name={person.name}
                      size="xl"
                    />
                  </div>
                  <div className="min-w-0 w-full">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#3C65F5] transition truncate">
                      {person.name}
                    </h4>
                    <span
                      className={`inline-block mt-0.5 rounded px-2 py-0.5 text-[10px] font-semibold capitalize border ${getRoleBadgeClasses(
                        person.role
                      )}`}
                    >
                      {person.role}
                    </span>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed min-h-[32px]">
                      {person.headline || (person.role === "recruiter" ? "Hiring & Talent Acquisition" : "Engineering & Design Professional")}
                    </p>
                  </div>
                </div>

                {person.skills && person.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1">
                    {person.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-center">
                <ConnectionButton
                  targetUserId={person._id}
                  initialStatus={person.connectionStatus}
                  initialConnectionId={person.connectionId}
                  size="sm"
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No member suggestions found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or role filters.
          </p>
        </div>
      )}
    </div>
  );
}
