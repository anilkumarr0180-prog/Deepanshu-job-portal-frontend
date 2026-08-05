import { Link } from "react-router-dom";
import { CalendarDays, LayoutDashboard, Sparkles } from "lucide-react";

interface AdminWelcomeProps {
  name: string;
  greeting: string;
  currentDate: string;
  description: string;
}

export default function AdminWelcome({
  name,
  greeting,
  currentDate,
  description,
}: AdminWelcomeProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#05264E] via-[#09356B] to-[#3C65F5] p-6 text-white shadow-xl shadow-blue-900/10 sm:p-8">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-purple-500/10 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          {/* Greeting Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-blue-100 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Admin Control Centre
          </div>

          {/* Heading */}
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            {greeting}, <span className="text-blue-200">{name}</span> 👋
          </h1>

          {/* Description */}
          <p className="mt-2 text-sm leading-relaxed text-blue-100/90 sm:text-base">
            {description}
          </p>
        </div>

        {/* Right Action & Date Badge */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-white backdrop-blur-md border border-white/10">
            <CalendarDays className="h-4 w-4 text-blue-300" />
            <span>{currentDate}</span>
          </div>

          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#05264E] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-lg"
          >
            <LayoutDashboard className="h-4 w-4 text-[#3C65F5]" />
            <span>Manage Platform</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
