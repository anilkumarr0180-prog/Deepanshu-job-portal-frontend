interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const classes = {
    Active: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Suspended: "bg-rose-50 text-rose-700",
    Published: "bg-emerald-50 text-emerald-700",
    Draft: "bg-slate-100 text-slate-700",
    Archived: "bg-zinc-100 text-zinc-700",
  } as const;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${classes[status as keyof typeof classes] ?? "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
