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
    <section className="rounded-xl border border-[#E0E6F7] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#05264E]">Quick actions</h3>
          <p className="mt-1 text-sm text-slate-500">Jump into the next priority task</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.id}
              to={action.to ?? "/recruiter/dashboard"}
              className="group flex flex-col gap-4 rounded-xl border border-[#E0E6F7] bg-white p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#3C65F5] hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2F6FD] text-[#3C65F5] transition-colors duration-200 group-hover:bg-[#3C65F5] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-[#05264E]">{action.label}</p>
                <p className="mt-1 text-sm text-slate-500">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
