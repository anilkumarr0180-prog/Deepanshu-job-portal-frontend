import { useState, useMemo } from "react";
import { Search, Users, UserPlus, MapPin } from "lucide-react";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { usePeopleSuggestions } from "../hooks/usePeopleSuggestions";
import { useUserProfileModal } from "../context/UserProfileContext";
import ConnectionButton from "./ConnectionButton";

const COVER_GRADIENTS = [
  "from-blue-600 via-blue-700 to-indigo-800",
  "from-slate-700 via-slate-800 to-blue-900",
  "from-indigo-600 via-blue-600 to-slate-800",
  "from-blue-800 via-indigo-700 to-slate-900",
  "from-sky-700 via-blue-700 to-indigo-900",
];

const TEST_ACCOUNT_REGEX = /auth_[0-9a-z_]+|recruiter_unauth|candidate_auth|_unauth|test_user|test_\d+|test candidate|polar candidate|hardening candidate|recruiter teammate|recruiter owner|polar recruiter/i;

export default function GrowNetworkGrid() {
  const [roleFilter, setRoleFilter] = useState<"all" | "candidate" | "recruiter">("all");
  const [search, setSearch] = useState("");
  const { data: suggestions, isLoading } = usePeopleSuggestions(50);
  const { openUserProfile } = useUserProfileModal();

  // Filter out automated test accounts so only genuine real users appear
  const genuinePeople = useMemo(() => {
    const raw = suggestions || [];
    return raw.filter((p) => !TEST_ACCOUNT_REGEX.test(p.name) && !TEST_ACCOUNT_REGEX.test(p.email || ""));
  }, [suggestions]);

  const filtered = useMemo(() => {
    return genuinePeople.filter((p) => {
      const matchesRole = roleFilter === "all" || p.role?.toLowerCase() === roleFilter;
      const q = search.toLowerCase().trim();
      if (!q) return matchesRole;

      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        (p.headline && p.headline.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.skills && p.skills.some((s) => s.toLowerCase().includes(q)));

      return matchesRole && matchesSearch;
    });
  }, [genuinePeople, roleFilter, search]);

  return (
    <div className="space-y-6">
      {/* LinkedIn-Style Network Discovery Header Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <UserPlus className="h-4 w-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Discover & Grow Your Network
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect with professionals, hiring managers, and candidates across the JobBox network.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, skills..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition shadow-2xs"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setRoleFilter("all")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                roleFilter === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Members ({genuinePeople.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("candidate")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                roleFilter === "candidate"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Candidates ({genuinePeople.filter((p) => p.role === "candidate").length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("recruiter")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                roleFilter === "recruiter"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Hiring Partners ({genuinePeople.filter((p) => p.role === "recruiter").length})
            </button>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-700">{filtered.length}</strong> suggestions
          </span>
        </div>
      </div>

      {/* Member Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-white border border-slate-200 overflow-hidden">
              <div className="h-20 bg-slate-200" />
              <div className="p-4 space-y-3 flex flex-col items-center">
                <div className="h-16 w-16 -mt-10 rounded-full bg-slate-300 shadow-md" />
                <div className="h-4 w-28 bg-slate-200 rounded" />
                <div className="h-3 w-36 bg-slate-100 rounded" />
                <div className="h-8 w-full bg-slate-100 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((person, idx) => {
            const gradientClass = COVER_GRADIENTS[idx % COVER_GRADIENTS.length];
            const isRecruiter = person.role?.toLowerCase() === "recruiter";
            const headline = person.headline || (isRecruiter ? "Recruiter" : "JobBox Member");

            const handleCardClick = () => {
              openUserProfile({
                _id: person._id,
                name: person.name,
                role: person.role,
                email: person.email,
                profilePicture: person.profilePicture,
                headline: person.headline,
                city: person.location,
              });
            };

            return (
              <div
                key={person._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div>
                  {/* Subtle Cover Banner */}
                  <div className={`relative h-20 w-full bg-gradient-to-r ${gradientClass} opacity-90 transition-opacity group-hover:opacity-100`}>
                    <div className="absolute inset-0 bg-black/10" />
                    {/* Role Pill in banner */}
                    <span
                      className={`absolute top-2.5 right-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-2xs capitalize ${
                        isRecruiter
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {person.role}
                    </span>
                  </div>

                  {/* Profile Avatar & Details */}
                  <div className="px-4 pb-2 text-center flex flex-col items-center">
                    <button
                      type="button"
                      onClick={handleCardClick}
                      className="relative -mt-10 mb-2 cursor-pointer transition-transform group-hover:scale-105"
                      title={`View ${person.name}'s profile`}
                    >
                      <UserAvatar
                        src={person.profilePicture}
                        name={person.name}
                        size="lg"
                        className="shadow-md"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={handleCardClick}
                      className="cursor-pointer text-center w-full"
                    >
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate max-w-full">
                        {person.name}
                      </h3>
                    </button>

                    {/* Headline */}
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[32px]">
                      {headline}
                    </p>

                    {/* Location Badge */}
                    {person.location && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-full">
                        <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                        <span className="truncate">{person.location}</span>
                      </div>
                    )}

                    {/* Skills Tags */}
                    {person.skills && person.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap justify-center gap-1 max-h-12 overflow-hidden">
                        {person.skills.slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md bg-slate-100/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-3 p-3.5 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                  <ConnectionButton
                    targetUserId={person._id}
                    initialStatus={person.connectionStatus}
                    initialConnectionId={person.connectionId}
                    size="sm"
                    className="w-full justify-center"
                  />
                  <button
                    type="button"
                    onClick={handleCardClick}
                    className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition py-0.5 cursor-pointer"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No member suggestions found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or switching between Candidates and Hiring Partners.
          </p>
        </div>
      )}
    </div>
  );
}
