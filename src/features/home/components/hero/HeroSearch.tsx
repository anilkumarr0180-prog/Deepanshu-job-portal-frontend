import {
  BriefcaseBusiness,
  MapPin,
  Search,
} from "lucide-react";

export default function HeroSearch() {
  return (
    <form className="mt-10 flex h-[70px] w-[720px] items-center overflow-hidden rounded-2xl bg-white p-[10px] shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
      {/* Industry */}
      <div className="flex h-full shrink-0 items-center gap-2 border-r border-slate-200 px-5">
        <BriefcaseBusiness
          size={18}
          className="text-slate-400"
        />

        <select className="bg-transparent text-[15px] text-slate-700 outline-none">
          <option>Industry</option>
        </select>
      </div>

      {/* Location */}
      <div className="flex h-full shrink-0 items-center gap-2 border-r border-slate-200 px-5">
        <MapPin
          size={18}
          className="text-slate-400"
        />

        <select className="bg-transparent text-[15px] text-slate-700 outline-none">
          <option>Location</option>
        </select>
      </div>

      {/* Keyword */}
      <input
        type="text"
        placeholder="Your keyword..."
        className="min-w-0 flex-1 px-5 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
      />

      {/* Search */}
      <button
        type="submit"
        className="flex h-[50px] w-[122px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3C65F5] text-white transition hover:bg-[#2956F2]"
      >
        <Search size={18} />

        <span className="font-medium">
          Search
        </span>
      </button>
    </form>
  );
}