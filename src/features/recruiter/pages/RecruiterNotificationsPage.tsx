import { BellRing, Circle } from "lucide-react";

import { recruiterNotifications } from "../constants/company";

export default function RecruiterNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Notifications</h2>
            <p className="mt-2 text-sm text-slate-500">Stay on top of recruiter activity and candidate updates.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">3 unread</div>
        </div>
      </div>

      {recruiterNotifications.length > 0 ? (
        <div className="space-y-3">
          {recruiterNotifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <BellRing className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{notification.title}</h3>
                  {notification.unread && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Unread</span>}
                </div>
                <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
                <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  <Circle className="h-2.5 w-2.5 fill-current" />
                  <span>{notification.type}</span>
                  <span>•</span>
                  <span>{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">You are all caught up.</p>
        </div>
      )}
    </div>
  );
}
