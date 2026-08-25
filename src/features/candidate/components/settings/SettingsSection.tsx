import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description: string;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export default function SettingsSection({
  title,
  description,
  badge,
  actions,
  className = "",
  children,
}: SettingsSectionProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {badge}
          </div>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
