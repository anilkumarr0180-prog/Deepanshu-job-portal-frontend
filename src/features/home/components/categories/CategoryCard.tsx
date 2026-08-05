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
      className="group flex h-[120px] w-full cursor-pointer items-center gap-4.5 rounded-2xl border border-slate-200/90 bg-white px-5 py-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3C65F5] hover:shadow-xl hover:shadow-blue-500/10"
    >
      {/* Icon Container */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3FF] transition-all duration-300 group-hover:bg-[#3C65F5] group-hover:shadow-md group-hover:shadow-blue-500/20">
        <Icon className="h-7 w-7 text-[#3C65F5] transition-colors duration-300 group-hover:text-white" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold text-[#05264E] transition-colors duration-300 group-hover:text-[#3C65F5]">
          {category.title}
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500">
          {category.jobs} {category.jobs === 1 ? "Job Available" : "Jobs Available"}
        </p>
      </div>
    </div>
  );
}