import { CalendarDays, Sparkles } from "lucide-react";

interface DashboardWelcomeProps {
  name: string;
  greeting: string;
  currentDate: string;
  description: string;
}

export default function DashboardWelcome({
  name,
  greeting,
  currentDate,
  description,
}: DashboardWelcomeProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-slate-100">
            <Sparkles className="h-4 w-4" />
            Candidate dashboard
          </div>
          <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
            {greeting}, {name}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{description}</p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100">
          <CalendarDays className="h-4 w-4" />
          <span>{currentDate}</span>
        </div>
      </div>
    </section>
  );
}
