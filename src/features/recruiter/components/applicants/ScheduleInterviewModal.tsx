import { useState, type FormEvent } from "react";
import { Video, Building2, PhoneCall, X, MapPin, Link as LinkIcon, Phone } from "lucide-react";

export interface ScheduleInterviewDetails {
  mode: "video" | "in-person" | "phone";
  date: string;
  time: string;
  type: string;
  locationOrLink: string;
  notes?: string;
}

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  onSchedule: (details: ScheduleInterviewDetails) => void;
  isSubmitting?: boolean;
}

export function ScheduleInterviewModal({
  isOpen,
  onClose,
  candidateName,
  onSchedule,
  isSubmitting = false,
}: ScheduleInterviewModalProps) {
  const [mode, setMode] = useState<"video" | "in-person" | "phone">("video");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [interviewType, setInterviewType] = useState("Technical Interview");
  const [locationOrLink, setLocationOrLink] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSchedule({
      mode,
      date,
      time,
      type: interviewType,
      locationOrLink:
        locationOrLink.trim() ||
        (mode === "video"
          ? "https://meet.google.com/new"
          : mode === "in-person"
          ? "Main Corporate Office"
          : "Recruiter Phone Line"),
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#3C65F5] border border-indigo-100">
            {mode === "video" ? (
              <Video className="w-6 h-6" />
            ) : mode === "in-person" ? (
              <Building2 className="w-6 h-6" />
            ) : (
              <PhoneCall className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Schedule Interview</h3>
            <p className="text-xs text-slate-500">With {candidateName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Interview Mode Selector */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Interview Mode / Location Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMode("video")}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 border text-xs font-semibold transition ${
                  mode === "video"
                    ? "border-[#3C65F5] bg-blue-50/70 text-[#3C65F5] ring-1 ring-[#3C65F5]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Call</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("in-person")}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 border text-xs font-semibold transition ${
                  mode === "in-person"
                    ? "border-[#3C65F5] bg-blue-50/70 text-[#3C65F5] ring-1 ring-[#3C65F5]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>In-Person</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("phone")}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 border text-xs font-semibold transition ${
                  mode === "phone"
                    ? "border-[#3C65F5] bg-blue-50/70 text-[#3C65F5] ring-1 ring-[#3C65F5]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Phone Call</span>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Interview Format / Stage
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
            >
              <option value="Technical Interview">Technical Interview</option>
              <option value="HR Screening">HR Screening</option>
              <option value="System Design Round">System Design Round</option>
              <option value="On-Site Coding Pair">On-Site Coding Pair</option>
              <option value="Executive Final Round">Executive Final Round</option>
              <option value="Culture & Fit Round">Culture & Fit Round</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Field based on selected Mode */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              {mode === "video"
                ? "Meeting URL (Google Meet / Zoom)"
                : mode === "in-person"
                ? "Office Location Address & Desk Instructions"
                : "Contact Phone Number / Instructions"}
            </label>
            <div className="relative flex items-center">
              {mode === "video" ? (
                <LinkIcon className="absolute left-3.5 h-4 w-4 text-slate-400" />
              ) : mode === "in-person" ? (
                <MapPin className="absolute left-3.5 h-4 w-4 text-slate-400" />
              ) : (
                <Phone className="absolute left-3.5 h-4 w-4 text-slate-400" />
              )}
              <input
                type={mode === "video" ? "url" : "text"}
                value={locationOrLink}
                onChange={(e) => setLocationOrLink(e.target.value)}
                placeholder={
                  mode === "video"
                    ? "https://meet.google.com/abc-defg-hij"
                    : mode === "in-person"
                    ? "e.g. 4th Floor, Sky High HQ, Sector 17, Chandigarh"
                    : "e.g. Recruiter will call candidate at +91 8219678049"
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Instructions for Candidate (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                mode === "in-person"
                  ? "Please bring government ID & report to reception..."
                  : "Please ensure a quiet environment and stable connection..."
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#3C65F5] focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Confirming..." : "Confirm & Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
