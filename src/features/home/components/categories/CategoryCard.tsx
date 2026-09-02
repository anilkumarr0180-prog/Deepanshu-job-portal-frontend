import { useNavigate } from "react-router-dom";
import type { Category } from "./types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();
  const Icon = category.icon;
  const isHorizontal = category.variant === "horizontal";

  const handleClick = () => {
    const query = category.searchKey || category.title;
    void navigate(`/jobs?search=${encodeURIComponent(query)}`);
  };

  if (isHorizontal) {
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
        className="item-logo group flex h-[94px] w-full cursor-pointer flex-row items-center gap-[14px] rounded-[8px] border border-[#E0E6F7] dark:border-[#2A3850] bg-white dark:bg-[#151F32] px-[18px] py-[22px] transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5] hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:hover:shadow-blue-500/10 select-none"
      >
        {/* Left Icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center">
          <Icon className="h-7 w-7 text-[#3C65F5] dark:text-[#5E81FF] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.75} />
        </div>

        {/* Right Text Info */}
        <div className="min-w-0 flex-1 flex flex-col justify-center text-left">
          <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] sm:text-[16px] font-bold text-[#05264E] dark:text-[#F1F5F9] transition-colors duration-200 group-hover:text-[#3C65F5] leading-[20px] sm:leading-[22px] truncate">
            {category.title}
          </h4>
          <p className="mt-[2px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] sm:text-[13px] font-normal text-[#66789C] dark:text-[#94A3B8] leading-[16px] sm:leading-[18px] truncate">
            {category.jobs} {category.jobs === 1 ? "Job Available" : "Jobs Available"}
          </p>
        </div>
      </div>
    );
  }

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
      className="item-logo group flex h-[141px] w-full cursor-pointer flex-col justify-between rounded-[8px] border border-[#E0E6F7] dark:border-[#2A3850] bg-white dark:bg-[#151F32] px-[18px] py-[22px] transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5] hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:hover:shadow-blue-500/10 select-none text-left"
    >
      {/* Top Icon */}
      <div className="flex h-8 w-8 items-center justify-start">
        <Icon className="h-7 w-7 text-[#3C65F5] dark:text-[#5E81FF] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.75} />
      </div>

      {/* Bottom Text Info */}
      <div>
        <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] sm:text-[16px] font-bold text-[#05264E] dark:text-[#F1F5F9] transition-colors duration-200 group-hover:text-[#3C65F5] leading-[20px] sm:leading-[22px]">
          {category.title}
        </h4>
        <p className="mt-[4px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] sm:text-[13px] font-normal text-[#66789C] dark:text-[#94A3B8] leading-[16px] sm:leading-[18px]">
          {category.jobs} {category.jobs === 1 ? "Job Available" : "Jobs Available"}
        </p>
      </div>
    </div>
  );
}