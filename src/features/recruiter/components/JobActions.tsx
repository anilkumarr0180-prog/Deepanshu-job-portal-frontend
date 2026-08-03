import { Eye, PencilLine, Trash2 } from "lucide-react";

import type { RecruiterJobAction } from "../types";

interface JobActionsProps {
  onAction: (action: RecruiterJobAction) => void;
}

const actions: Array<{ id: RecruiterJobAction; icon: typeof Eye; label: string }> = [
  { id: "view", icon: Eye, label: "View" },
  { id: "edit", icon: PencilLine, label: "Edit" },
  { id: "delete", icon: Trash2, label: "Delete" },
];

export default function JobActions({ onAction }: JobActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {actions.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          aria-label={label}
          onClick={() => onAction(id)}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
