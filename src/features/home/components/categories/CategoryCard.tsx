import { useNavigate } from "react-router-dom";
import type { Category } from "./types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();
  const Icon = category.icon;
  const isVertical = category.variant === "vertical";

  const handleClick = () => {
    const query = category.searchKey || category.title;
    void navigate(`/jobs?search=${encodeURIComponent(query)}`);
  };

  if (isVertical) {
    return (
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
        className="group flex h-[142px] w-full cursor-pointer flex-col justify-between rounded-[16px] border border-[#E0E6F7] dark:border-[#2A3850] bg-white dark:bg-[#151F32] p-4.5 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5] hover:shadow-xl hover:shadow-blue-500/10"
      >
        {/* Top Icon */}
        <div className="flex h-9 w-9 items-center justify-start">
          <Icon className="h-8 w-8 text-[#3C65F5] dark:text-[#5E81FF] transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Bottom Text Info */}
        <div>
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] font-bold text-[#05264E] dark:text-[#F1F5F9] transition-colors duration-200 group-hover:text-[#3C65F5] leading-tight">
            {category.title}
          </h3>
          <p className="mt-1 font-['Inter',sans-serif] text-[12px] font-normal text-[#66789C] dark:text-slate-400 leading-none">
            {category.jobs} {category.jobs === 1 ? "Job Available" : "Jobs Available"}
          </p>
        </div>
      </div>
    );
  }

  // Horizontal Compact Card Layout
  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
      className="group flex h-[88px] w-full cursor-pointer items-center gap-3.5 rounded-[14px] border border-[#E0E6F7] dark:border-[#2A3850] bg-white dark:bg-[#151F32] px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5] hover:shadow-lg hover:shadow-blue-500/10"
    >
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        <Icon className="h-8 w-8 text-[#3C65F5] dark:text-[#5E81FF] transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-['Plus_Jakarta_Sans',sans-serif] text-[15px] font-bold text-[#05264E] dark:text-[#F1F5F9] transition-colors duration-200 group-hover:text-[#3C65F5] leading-tight">
          {category.title}
        </h3>
        <p className="mt-0.5 font-['Inter',sans-serif] text-[12px] font-normal text-[#66789C] dark:text-slate-400 leading-none">
          {category.jobs} {category.jobs === 1 ? "Job Available" : "Jobs Available"}
        </p>
      </div>
    </div>
  );
}