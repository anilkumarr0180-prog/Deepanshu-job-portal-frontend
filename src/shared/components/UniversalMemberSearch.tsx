import { useState, useRef, useEffect } from "react";
import { Search, X, Users, User, Loader2, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/features/posts/api/connectionApi";
import { useUserProfileModal } from "@/features/posts/context/UserProfileContext";
import { UserAvatar } from "@/shared/components/UserAvatar";
import ConnectionButton from "@/features/posts/components/ConnectionButton";
import useDebounce from "@/shared/hooks/useDebounce";

export default function UniversalMemberSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const { openUserProfile } = useUserProfileModal();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["universal-member-search", debouncedQuery],
    queryFn: () => searchUsers({ q: debouncedQuery.trim(), limit: 6 }),
    enabled: Boolean(debouncedQuery.trim().length >= 2),
    staleTime: 1000 * 30,
  });

  const members = searchResults?.items || [];

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectMember = (member: any) => {
    openUserProfile({
      _id: member.user?._id || member._id,
      name: member.user?.name || member.name,
      role: member.user?.role || member.role,
      email: member.user?.email || member.email,
      profilePicture: member.user?.profilePicture || member.profilePicture,
      headline: member.headline,
      city: member.location,
    });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs md:max-w-sm lg:max-w-md">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search members, skills, roles..."
          className="h-10 w-full rounded-2xl border border-slate-200/90 bg-slate-50/80 pl-9 pr-8 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#3C65F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-2.5 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Floating Instant Results Panel */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 top-full mt-2 w-full min-w-[320px] sm:min-w-[380px] rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#3C65F5]" />
              Members & Professionals
            </span>
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3C65F5]" />}
          </div>

          {isLoading ? (
            <div className="space-y-2 py-2 px-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/60 animate-pulse">
                  <div className="h-9 w-9 rounded-full bg-slate-200" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3.5 w-24 bg-slate-200 rounded" />
                    <div className="h-2.5 w-36 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : members.length > 0 ? (
            <div className="space-y-1 max-h-[340px] overflow-y-auto">
              {members.map((item: any) => {
                const userObj = item.user || item;
                const role = userObj.role || "Member";
                const isRecruiter = role.toLowerCase() === "recruiter";

                return (
                  <div
                    key={userObj._id}
                    onClick={() => handleSelectMember(item)}
                    className="group flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 transition cursor-pointer border border-transparent hover:border-blue-100"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="shrink-0">
                        <UserAvatar
                          src={userObj.profilePicture}
                          name={userObj.name}
                          size="md"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#3C65F5] transition truncate">
                            {userObj.name}
                          </h5>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wide border shrink-0 ${
                              isRecruiter
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-blue-50 text-[#3C65F5] border-blue-200"
                            }`}
                          >
                            {role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.headline || (isRecruiter ? "Hiring Partner" : "JobBox Member")}
                        </p>
                        {item.location && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{item.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <ConnectionButton
                        targetUserId={userObj._id}
                        initialStatus={item.connectionStatus}
                        initialConnectionId={item.connectionId}
                        size="sm"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">
              <User className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-semibold text-slate-600">No members matching "{query}"</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try searching by name or role</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
