import { CalendarDays } from "lucide-react";

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
    <section className="rounded-xl border border-[#E0E6F7] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-[#05264E] sm:text-3xl">
            {greeting}, {name}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#E0E6F7] bg-[#F8FAFC] px-4 py-3 text-sm text-slate-500">
          <CalendarDays className="h-4 w-4 text-[#3C65F5]" />
          <span>{currentDate}</span>
        </div>
      </div>
    </section>
  );
}
