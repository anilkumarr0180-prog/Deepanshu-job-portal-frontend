import { useNavigate } from "react-router-dom";
import type { Category } from "./types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();
  const Icon = category.icon;

  const handleClick = () => {
    const query = category.searchKey || category.title;
    void navigate(`/jobs?search=${encodeURIComponent(query)}`);
  };

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
      className="group flex h-[141px] w-full cursor-pointer flex-col justify-between rounded-[8px] border border-[#E0E6F7] dark:border-[#2A3850] bg-white dark:bg-[#151F32] px-[18px] py-[22px] transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5] hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:hover:shadow-blue-500/10 select-none"
    >
      {/* Top Icon */}
      <div className="flex h-9 w-9 items-center justify-start">
        <Icon className="h-8 w-8 text-[#3C65F5] dark:text-[#5E81FF] transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Bottom Text Info */}
      <div>
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] font-bold text-[#05264E] dark:text-[#F1F5F9] transition-colors duration-200 group-hover:text-[#3C65F5] leading-[22px]">
          {category.title}
        </h3>
        <p className="mt-[4px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-normal text-[#66789C] dark:text-slate-400 leading-[18px]">
          {category.jobs} {category.jobs === 1 ? "Job Available" : "Jobs Available"}
        </p>
      </div>
    </div>
  );
}