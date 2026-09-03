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

  const maxVisible = 7;
  const startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="paginations mt-10">
      <ul className="pager flex h-[48px] items-center">
        {/* Previous Button (48x48, mr-15) */}
        <li>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage}
            className="pager-prev mr-[15px] inline-flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#F2F6FD] text-[#05264E] transition-colors duration-200 hover:bg-[#3C65F5] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#131D2E] dark:text-[#F1F5F9] dark:hover:bg-[#3C65F5]"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((p) => {
          const isActive = p === page;
          return (
            <li key={p}>
              <button
                type="button"
                onClick={() => onPageChange(p)}
                className={`pager-number inline-flex h-[48px] min-w-[36px] sm:min-w-[40px] px-2 items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-bold transition-colors duration-200 ${
                  isActive
                    ? "text-[#3C65F5] dark:text-[#5E81FF]"
                    : "text-[#A0ABB8] hover:text-[#05264E] dark:text-slate-400 dark:hover:text-[#F1F5F9]"
                }`}
              >
                {p}
              </button>
            </li>
          );
        })}

        {totalPages > maxVisible && endPage < totalPages && (
          <li>
            <span className="inline-flex h-[48px] items-center px-1 text-[14px] font-bold text-[#A0ABB8]">
              ...
            </span>
          </li>
        )}

        {/* Next Button (48x48, ml-15) */}
        <li>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
            className="pager-next ml-[15px] inline-flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#F2F6FD] text-[#05264E] transition-colors duration-200 hover:bg-[#3C65F5] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#131D2E] dark:text-[#F1F5F9] dark:hover:bg-[#3C65F5]"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </li>
      </ul>
    </div>
  );
}
