import { Link } from "react-router-dom";
import { ChevronRight, UserCheck } from "lucide-react";
import type { AdminUser } from "../types";

interface AdminRecentUsersTableProps {
  users: AdminUser[];
  isLoading?: boolean;
}

const roleBadgeMap: Record<string, { bg: string; text: string }> = {
  candidate: { bg: "bg-blue-50", text: "text-blue-700" },
  recruiter: { bg: "bg-purple-50", text: "text-purple-700" },
  admin: { bg: "bg-slate-100", text: "text-slate-700" },
};

export default function AdminRecentUsersTable({
  users,
  isLoading,
}: AdminRecentUsersTableProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <div>
          <h3 className="text-lg font-bold text-[#05264E]">Recent Users</h3>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Latest account registrations on the platform
          </p>
        </div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline"
        >
          <span>View All</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex animate-pulse items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="h-3 w-40 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-6 w-16 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
            <UserCheck className="h-7 w-7" />
          </div>
          <h4 className="mt-3 font-bold text-[#05264E]">No users yet</h4>
          <p className="mt-1 max-w-xs text-xs font-medium text-slate-400">
            New account registrations will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const roleKey = user.role.toLowerCase();
                const roleStyle = roleBadgeMap[roleKey] ?? {
                  bg: "bg-slate-100",
                  text: "text-slate-700",
                };
                const initial = user.name?.charAt(0)?.toUpperCase() ?? "U";

                return (
                  <tr
                    key={user.id}
                    className="group transition-colors duration-150 hover:bg-[#F8FAFC]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3C65F5]/10 text-xs font-extrabold text-[#3C65F5]">
                          {initial}
                        </div>
                        <div>
                          <p className="font-bold text-[#05264E]">{user.name}</p>
                          <p className="mt-0.5 text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${roleStyle.bg} ${roleStyle.text}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-400">
                      {user.joinedAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
