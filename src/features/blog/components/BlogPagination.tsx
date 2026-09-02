import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPagination as PaginationData } from "../types/blog.types";

interface BlogPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export default function BlogPagination({
  pagination,
  onPageChange,
}: BlogPaginationProps) {
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  const maxVisible = 5;
  const startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E0E6F7] bg-white text-sm font-semibold text-[#05264E] transition-all duration-200 hover:border-[#3C65F5] hover:bg-[#EFF3FC] hover:text-[#3C65F5] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#1E293B] dark:bg-[#131D2E] dark:text-[#F1F5F9] dark:hover:bg-[#1E293B]"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`inline-flex h-10 min-w-[40px] px-3 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${
            p === page
              ? "border border-[#3C65F5] bg-[#3C65F5] text-white shadow-[0_4px_12px_rgba(60,101,245,0.3)]"
              : "border border-[#E0E6F7] bg-white text-[#05264E] hover:border-[#3C65F5] hover:bg-[#EFF3FC] hover:text-[#3C65F5] dark:border-[#1E293B] dark:bg-[#131D2E] dark:text-[#F1F5F9] dark:hover:bg-[#1E293B]"
          }`}
        >
          {p}
        </button>
      ))}

      {totalPages > maxVisible && endPage < totalPages && (
        <span className="px-1 text-sm font-bold text-slate-400">...</span>
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E0E6F7] bg-white text-sm font-semibold text-[#05264E] transition-all duration-200 hover:border-[#3C65F5] hover:bg-[#EFF3FC] hover:text-[#3C65F5] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#1E293B] dark:bg-[#131D2E] dark:text-[#F1F5F9] dark:hover:bg-[#1E293B]"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
