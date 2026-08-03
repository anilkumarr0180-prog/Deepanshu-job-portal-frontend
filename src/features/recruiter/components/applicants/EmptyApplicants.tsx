export default function EmptyApplicants() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">No applicants yet</h3>
      <p className="mt-2 text-sm text-slate-500">When applications arrive, they will appear here for review.</p>
    </div>
  );
}
