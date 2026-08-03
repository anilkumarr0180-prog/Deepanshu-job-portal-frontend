import type { ComponentType } from "react";
import { Link } from "react-router-dom";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  to?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
          <p className="mt-1 text-sm text-slate-500">Jump into the next priority task</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.id}
              to={action.to ?? "/recruiter/dashboard"}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-medium text-slate-900">{action.label}</p>
              <p className="mt-1 text-sm text-slate-500">{action.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
