import { CalendarDays, Link2 } from "lucide-react";

import { recruiterInterviews } from "../constants/company";

export default function RecruiterInterviewsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Interview Schedule</h2>
            <p className="mt-2 text-sm text-slate-500">Coordinate and keep track of upcoming interviews.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">2 upcoming</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-200 pb-5">
            <h3 className="text-lg font-semibold text-slate-900">Calendar</h3>
            <p className="mt-1 text-sm text-slate-500">Calendar placeholder for interview scheduling.</p>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            <CalendarDays className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3">Monthly calendar view will appear here.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-200 pb-5">
            <h3 className="text-lg font-semibold text-slate-900">Upcoming Interviews</h3>
          </div>

          <div className="mt-6 space-y-4">
            {recruiterInterviews.map((interview) => (
              <div key={interview.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{interview.candidate}</p>
                    <p className="mt-1 text-sm text-slate-600">{interview.job}</p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700">{interview.status}</div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span>{interview.time}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    {interview.meetingLink}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
