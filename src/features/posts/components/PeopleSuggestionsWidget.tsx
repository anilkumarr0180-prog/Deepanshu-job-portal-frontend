import { useState, useMemo } from "react";
import { Users, UserPlus, Clock, Loader2 } from "lucide-react";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { usePeopleSuggestions } from "../hooks/usePeopleSuggestions";
import { useConnectionMutations } from "../hooks/useConnectionMutations";
import { useUserProfileModal } from "../context/UserProfileContext";

const TEST_ACCOUNT_REGEX = /auth_[0-9a-z_]+|recruiter_unauth|candidate_auth|_unauth|test_user|test_\d+|test candidate|polar candidate|hardening candidate|recruiter teammate|recruiter owner|polar recruiter/i;

export default function PeopleSuggestionsWidget() {
  const { data: suggestions, isLoading } = usePeopleSuggestions(10);
  const { sendRequest } = useConnectionMutations();
  const { openUserProfile } = useUserProfileModal();
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());

  // Filter out automated test accounts so genuine registered users appear
  const genuineSuggestions = useMemo(() => {
    const raw = suggestions || [];
    return raw
      .filter((p) => !TEST_ACCOUNT_REGEX.test(p.name) && !TEST_ACCOUNT_REGEX.test(p.email || ""))
      .slice(0, 5);
  }, [suggestions]);

  const handleConnect = (e: React.MouseEvent, user: { _id: string }) => {
    e.stopPropagation();
    sendRequest.mutate(user._id, {
      onSuccess: () => {
        setRequestedIds((prev) => new Set(prev).add(user._id));
      },
    });
  };

  const getRoleBadgeClasses = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "recruiter":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "candidate":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/80";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#3C65F5]">
            <Users className="h-4 w-4" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            People You May Know
          </h4>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 pt-1 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-1.5">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : genuineSuggestions.length > 0 ? (
        <div className="space-y-3 pt-1">
          {genuineSuggestions.map((person) => {
            const isRequested =
              requestedIds.has(person._id) ||
              person.connectionStatus === "pending_sent";
            const isPending = sendRequest.isPending && sendRequest.variables === person._id;
            const headline = person.headline || (person.role === "recruiter" ? "Recruiter" : "JobBox Member");

            return (
              <div
                key={person._id}
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
                className="flex items-start justify-between gap-2.5 rounded-xl border border-slate-100 p-2.5 transition hover:border-blue-200 hover:bg-blue-50/20 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="ring-2 ring-white rounded-full shadow-xs">
                    <UserAvatar
                      src={person.profilePicture}
                      name={person.name}
                      size="md"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#3C65F5] transition truncate">
                      {person.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                      {headline}
                    </p>
                    <span
                      className={
                        "inline-block mt-1 rounded px-1.5 py-0.2 text-[10px] font-semibold capitalize border " +
                        getRoleBadgeClasses(person.role)
                      }
                    >
                      {person.role}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleConnect(e, person)}
                  disabled={isRequested || isPending}
                  className={
                    "shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition shadow-2xs " +
                    (isRequested
                      ? "bg-slate-100 text-slate-500 border border-slate-200 cursor-default"
                      : "bg-[#3C65F5] text-white hover:bg-[#3457D5]")
                  }
                  title={isRequested ? "Request Sent" : "Connect"}
                >
                  {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : isRequested ? (
                    <>
                      <Clock className="h-3 w-3" />
                      <span>Pending</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3 w-3" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400 py-1">No new connection suggestions.</p>
      )}
    </div>
  );
}