import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import type { BlogCategory } from "../types/blog.types";

interface BlogHeroProps {
  categories?: BlogCategory[];
  activeCategory?: string;
  onSelectCategory?: (categorySlug: string) => void;
  isLoadingCategories?: boolean;
}

export default function BlogHero({}: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F2F6FD] dark:bg-[#080E1A] py-9 md:py-11 border-b border-[#E0E6F7] dark:border-[#1E293B]">
      {/* Background Subtle Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#3C65F5 1px, transparent 1px), radial-gradient(#3C65F5 1px, #F2F6FD 1px)`,
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 16px 16px",
        }}
      />

      <div className="container relative mx-auto max-w-[1140px] px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Heading & Subtitle */}
          <div>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-[32px] sm:text-[38px] md:text-[42px] font-extrabold tracking-tight text-[#05264E] dark:text-[#F1F5F9] leading-tight">
              Blog
            </h1>
            <p className="mt-1 text-sm sm:text-base text-[#66789C] dark:text-slate-400 font-normal">
              Get the latest news, updates and tips
            </p>
          </div>

          {/* Right: Breadcrumb Card */}
          <div>
            <nav
              aria-label="Breadcrumb"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E0E6F7]/90 bg-white px-3.5 py-2 text-xs md:text-[13px] font-medium text-[#66789C] shadow-[0_2px_6px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-[#131D2E] dark:text-slate-400"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-1 hover:text-[#3C65F5] transition-colors"
              >
                <Home className="h-3.5 w-3.5 text-[#66789C] dark:text-slate-400" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-[#94A3B8]" />
              <span className="text-[#05264E] dark:text-[#F1F5F9] font-medium">
                Blog
              </span>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
