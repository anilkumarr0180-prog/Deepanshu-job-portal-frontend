import { useState } from "react";
import { Check, Clock, UserPlus, Inbox, Send, ArrowRight } from "lucide-react";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useConnections } from "../hooks/useConnections";
import { useConnectionMutations } from "../hooks/useConnectionMutations";
import { useUserProfileModal } from "../context/UserProfileContext";
import { formatPostTimestamp } from "../utils/formatTimestamp";

interface InvitationsManagerProps {
  onExploreSuggestions?: () => void;
}

export default function InvitationsManager({ onExploreSuggestions }: InvitationsManagerProps) {
  const [subTab, setSubTab] = useState<"received" | "sent">("received");
  const { openUserProfile } = useUserProfileModal();
  const { accept, reject, cancel } = useConnectionMutations();

  const { data: receivedData, isLoading: isLoadingReceived } = useConnections({
    status: "pending",
  });

  const { data: sentData, isLoading: isLoadingSent } = useConnections({
    status: "sent",
  });

  const receivedItems = receivedData?.items || [];
  const sentItems = sentData?.items || [];

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
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      {/* Header & Subtabs */}
      <div className="border-b border-slate-200/80 px-5 pt-4 pb-0 bg-slate-50/50">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#3C65F5]">
              <Inbox className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Manage Invitations</h2>
              <p className="text-xs text-slate-500">Review received connection requests and sent invitations.</p>
            </div>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setSubTab("received")}
            className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold border-b-2 transition ${
              subTab === "received"
                ? "border-[#3C65F5] text-[#3C65F5]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>Received</span>
            {receivedItems.length > 0 && (
              <span className="rounded-full bg-[#3C65F5] px-2 py-0.5 text-[10px] font-bold text-white">
                {receivedItems.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab("sent")}
            className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold border-b-2 transition ${
              subTab === "sent"
                ? "border-[#3C65F5] text-[#3C65F5]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>Sent ({sentItems.length})</span>
          </button>
        </div>
      </div>

      {/* Subtab Content */}
      <div className="p-4 sm:p-5 divide-y divide-slate-100">
        {subTab === "received" ? (
          isLoadingReceived ? (
            <div className="space-y-4 py-3 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-200" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                      <div className="h-3 w-48 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : receivedItems.length > 0 ? (
            receivedItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 group hover:bg-slate-50/60 rounded-xl px-2 transition"
              >
                <div
                  onClick={() =>
                    openUserProfile({
                      _id: item.peerUser._id,
                      name: item.peerUser.name,
                      role: item.peerUser.role,
                      email: item.peerUser.email,
                      profilePicture: item.peerUser.profilePicture,
                      headline: item.peerUser.headline,
                      city: item.peerUser.location,
                    })
                  }
                  className="flex items-start gap-3.5 cursor-pointer min-w-0 flex-1"
                >
                  <UserAvatar
                    src={item.peerUser.profilePicture}
                    name={item.peerUser.name}
                    size="lg"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#3C65F5] transition truncate">
                        {item.peerUser.name}
                      </h4>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-semibold capitalize border ${getRoleBadgeClasses(
                          item.peerUser.role
                        )}`}
                      >
                        {item.peerUser.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {item.peerUser.headline || "JobBox Community Member"}
                    </p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Received {formatPostTimestamp(item.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => reject.mutate(item._id)}
                    disabled={reject.isPending}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition disabled:opacity-50"
                  >
                    Ignore
                  </button>
                  <button
                    type="button"
                    onClick={() => accept.mutate(item._id)}
                    disabled={accept.isPending}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
                <UserPlus className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No pending invitations</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You are all caught up! Explore members in your industry to grow your network.
              </p>
              {onExploreSuggestions && (
                <button
                  type="button"
                  onClick={onExploreSuggestions}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#3457D5] transition"
                >
                  <span>Discover People</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )
        ) : (
          isLoadingSent ? (
            <div className="space-y-4 py-3 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-200" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                      <div className="h-3 w-48 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : sentItems.length > 0 ? (
            sentItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 group hover:bg-slate-50/60 rounded-xl px-2 transition"
              >
                <div
                  onClick={() =>
                    openUserProfile({
                      _id: item.peerUser._id,
                      name: item.peerUser.name,
                      role: item.peerUser.role,
                      email: item.peerUser.email,
                      profilePicture: item.peerUser.profilePicture,
                      headline: item.peerUser.headline,
                      city: item.peerUser.location,
                    })
                  }
                  className="flex items-start gap-3.5 cursor-pointer min-w-0 flex-1"
                >
                  <UserAvatar
                    src={item.peerUser.profilePicture}
                    name={item.peerUser.name}
                    size="lg"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#3C65F5] transition truncate">
                        {item.peerUser.name}
                      </h4>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-semibold capitalize border ${getRoleBadgeClasses(
                          item.peerUser.role
                        )}`}
                      >
                        {item.peerUser.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {item.peerUser.headline || "JobBox Community Member"}
                    </p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Sent {formatPostTimestamp(item.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => cancel.mutate(item._id)}
                    disabled={cancel.isPending}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition disabled:opacity-50"
                  >
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No sent requests pending</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You do not have any outgoing connection requests waiting for a response.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
