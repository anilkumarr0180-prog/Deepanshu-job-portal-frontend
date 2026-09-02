import { Link } from "react-router-dom";
import type { BlogCategory } from "../types/blog.types";

interface BlogHeroProps {
  categories: BlogCategory[];
  activeCategory: string; // "all" or category slug or id
  onSelectCategory: (categorySlug: string) => void;
  isLoadingCategories?: boolean;
}

export default function BlogHero({
  categories,
  activeCategory,
  onSelectCategory,
  isLoadingCategories = false,
}: BlogHeroProps) {
  return (
    <section className="section-box-2 relative overflow-hidden bg-[#F2F6FD] dark:bg-[#080E1A] pt-[45px] pb-[40px] border-b border-[#E0E6F7] dark:border-[#1E293B]">
      <div className="container mx-auto max-w-[1140px] px-4">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#66789C] dark:text-slate-400">
          <Link to="/" className="hover:text-[#3C65F5] transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#3C65F5] transition">
            Blog
          </Link>
          <span>/</span>
          <span className="text-[#05264E] dark:text-[#F1F5F9]">Blog Grid</span>
        </nav>

        {/* Hero Title & Subtitle */}
        <div className="mx-auto max-w-[700px] text-center">
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-[36px] md:text-[44px] font-extrabold leading-tight text-[#05264E] dark:text-[#F1F5F9]">
            Blog - Grid
          </h1>

          <p className="mt-2 text-base md:text-lg text-[#66789C] dark:text-slate-400">
            Get the latest news, updates and tips
          </p>

          {/* Category Filter Pills / Tabs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onSelectCategory("all")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                activeCategory === "all" || !activeCategory
                  ? "bg-[#3C65F5] text-white shadow-[0_4px_12px_rgba(60,101,245,0.3)]"
                  : "bg-white text-[#4F5E64] hover:bg-[#E0EAFE] hover:text-[#3C65F5] dark:bg-[#131D2E] dark:text-slate-300 dark:hover:bg-[#1E293B]"
              }`}
            >
              All Articles
            </button>

            {isLoadingCategories ? (
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-8 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"
                  />
                ))}
              </div>
            ) : (
              categories.map((cat) => {
                const isSelected =
                  activeCategory === cat.slug || activeCategory === cat._id;

                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? "bg-[#3C65F5] text-white shadow-[0_4px_12px_rgba(60,101,245,0.3)]"
                        : "bg-white text-[#4F5E64] hover:bg-[#E0EAFE] hover:text-[#3C65F5] dark:bg-[#131D2E] dark:text-slate-300 dark:hover:bg-[#1E293B]"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
