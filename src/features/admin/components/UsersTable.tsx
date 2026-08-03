import { Eye, PencilLine, Trash2 } from "lucide-react";

import StatusBadge from "./StatusBadge";
import type { AdminUser } from "../types";

interface UsersTableProps {
  users: AdminUser[];
  onDelete: (user: AdminUser) => void;
}

export default function UsersTable({ users, onDelete }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Role</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Joined</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="transition hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{user.name}</div>
                <div className="mt-1 text-xs text-slate-500">{user.email}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">{user.role}</td>
              <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
              <td className="px-4 py-3 text-slate-600">{user.joinedAt}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50" aria-label={`View ${user.name}`}>
                    <Eye className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50" aria-label={`Edit ${user.name}`}>
                    <PencilLine className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => onDelete(user)} className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50" aria-label={`Delete ${user.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
