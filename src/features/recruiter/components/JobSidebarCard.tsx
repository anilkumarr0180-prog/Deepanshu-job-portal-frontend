import { Share2 } from "lucide-react";

interface SidebarItem {
  label: string;
  value: string;
}

interface JobSidebarCardProps {
  status: string;
  postedDate: string;
  recruiter: string;
  items?: SidebarItem[];
}

export default function JobSidebarCard({ status, postedDate, recruiter, items }: JobSidebarCardProps) {
  const detailItems = items ?? [
    { label: "Posting Date", value: postedDate },
    { label: "Recruiter", value: recruiter },
  ];

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <h3 className="text-lg font-semibold text-slate-900">Job Summary</h3>
          <p className="mt-1 text-sm text-slate-500">Key information at a glance.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Status</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{status}</p>
          </div>

          {detailItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <button type="button" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
          <Share2 className="h-4 w-4" />
          Share Job
        </button>
      </div>
    </aside>
  );
}
