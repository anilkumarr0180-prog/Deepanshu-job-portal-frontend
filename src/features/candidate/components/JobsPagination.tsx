import { ChevronLeft, ChevronRight } from "lucide-react";

import type { JobsPagination as PaginationData } from "../api/jobs.api";

interface JobsPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export default function JobsPagination({
  pagination,
  onPageChange,
}: JobsPaginationProps) {
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
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl border text-sm font-medium transition ${
            p === page
              ? "border-[#3C65F5] bg-[#3C65F5] text-white"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }}`}
        >
          {p}
        </button>
      ))}

      {totalPages > maxVisible && endPage < totalPages && (
        <span className="text-sm text-slate-400">…</span>
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
