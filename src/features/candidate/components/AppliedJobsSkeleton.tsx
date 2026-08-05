import { APPLIED_JOBS_PER_PAGE } from "../constants";

export default function AppliedJobsSkeleton() {
  const rowCount = APPLIED_JOBS_PER_PAGE;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {["Job", "Type", "Salary", "Status", "Applied", "Actions"].map(
              (label) => (
                <th
                  key={label}
                  className="px-4 py-3 text-left font-medium text-slate-600"
                >
                  {label}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {Array.from({ length: rowCount }).map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-4">
                <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                <div className="mt-1 h-3 w-24 animate-pulse rounded bg-slate-200" />
              </td>
              <td className="px-4 py-4 hidden sm:table-cell">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              </td>
              <td className="px-4 py-4 hidden sm:table-cell">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              </td>
              <td className="px-4 py-4">
                <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
