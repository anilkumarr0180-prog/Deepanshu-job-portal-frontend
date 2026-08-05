import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { AdminQuickAction } from "../types";

interface AdminQuickActionsProps {
  actions: AdminQuickAction[];
}

export default function AdminQuickActions({ actions }: AdminQuickActionsProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#05264E]">Quick Actions</h3>
          <p className="mt-0.5 text-sm font-medium text-slate-500">
            Jump into priority admin workflows
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.id}
              to={action.to}
              className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-md"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#3C65F5] shadow-sm transition-colors duration-300 group-hover:bg-[#3C65F5] group-hover:text-white group-hover:shadow-blue-500/25">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mt-4 font-bold text-[#05264E] group-hover:text-[#3C65F5]">
                  {action.label}
                </h4>
                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
                  {action.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#3C65F5]">
                <span>Launch</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
