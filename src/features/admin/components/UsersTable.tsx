import { Ban, ShieldCheck } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { AdminUser } from "../types";

interface UsersTableProps {
  users: AdminUser[];
  onBlock: (user: AdminUser) => void;
  onUnblock: (user: AdminUser) => void;
}

export default function UsersTable({ users, onBlock, onUnblock }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600">User</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Role</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Joined</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {users.map((user) => {
            const isAdmin = user.role.toLowerCase() === "admin";
            const isBlocked = user.isBlocked || user.status === "Blocked";

            return (
              <tr key={user.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{user.name}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{user.email}</div>
                </td>
                <td className="px-4 py-3 capitalize text-slate-600">{user.role}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={isBlocked ? "Suspended" : "Active"} />
                </td>
                <td className="px-4 py-3 text-slate-600">{user.joinedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isBlocked ? (
                      <button
                        type="button"
                        onClick={() => onUnblock(user)}
                        disabled={isAdmin}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title={isAdmin ? "Cannot unblock admin" : "Unblock User"}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Unblock
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onBlock(user)}
                        disabled={isAdmin}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title={isAdmin ? "Cannot block admin" : "Block User"}
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Block
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
