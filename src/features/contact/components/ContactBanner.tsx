import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

export default function ContactBanner() {
  return (
    <section className="section-box relative w-full">
      {/* Banner background with office workspace imagery matching JobBox template */}
      <div
        className="relative h-[220px] sm:h-[260px] md:h-[300px] w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        {/* Soft overlay for better contrast & theme support */}
        <div className="absolute inset-0 bg-[#05264E]/10 dark:bg-[#0B1220]/40" />

        {/* Container for aligned Breadcrumbs on the bottom right */}
        <div className="container relative mx-auto flex h-full max-w-[1140px] items-end justify-end px-[12px] pb-6">
          <nav
            aria-label="Breadcrumb"
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E0E6F7] bg-white px-4 py-2 text-[13px] font-medium text-[#66789C] shadow-sm dark:border-slate-800 dark:bg-[#131D2E] dark:text-slate-400"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#3C65F5] dark:hover:text-[#5E81FF]"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#94A3B8]" />
            <span className="font-semibold text-[#05264E] dark:text-[#F1F5F9]">
              Contact
            </span>
          </nav>
        </div>
      </div>
    </section>
  );
}
