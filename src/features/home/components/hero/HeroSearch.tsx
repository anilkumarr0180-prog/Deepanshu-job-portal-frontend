import { useState } from "react";
import { BriefcaseBusiness, MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const POPULAR_SEARCHES = [
  "Designer",
  "Web",
  "IOS",
  "Developer",
  "PHP",
  "Senior",
  "Engineer",
];

export default function HeroSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const query = keyword || industry;
    if (query) params.set("search", query);
    if (location && location !== "Location") params.set("location", location);

    void navigate(`/jobs?${params.toString()}`);
  };

  const handlePopularClick = (tag: string) => {
    void navigate(`/jobs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="mt-8 max-w-[660px]">
      {/* Search Bar Container */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-xl shadow-blue-500/5 sm:flex-row sm:items-center sm:gap-0"
      >
        {/* Industry Select */}
        <div className="flex h-12 items-center gap-2 border-b border-slate-100 px-3.5 sm:border-b-0 sm:border-r sm:border-slate-200">
          <BriefcaseBusiness className="h-4 w-4 shrink-0 text-slate-400" />
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer sm:w-28"
          >
            <option value="">Industry</option>
            <option value="Software">Software</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Management">Management</option>
            <option value="Design">Design</option>
          </select>
        </div>

        {/* Location Select */}
        <div className="flex h-12 items-center gap-2 border-b border-slate-100 px-3.5 sm:border-b-0 sm:border-r sm:border-slate-200">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer sm:w-28"
          >
            <option value="">Location</option>
            <option value="Remote">Remote</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
            <option value="London">London</option>
          </select>
        </div>

        {/* Keyword Input */}
        <div className="flex h-12 flex-1 items-center px-3.5">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Your keyword..."
            className="w-full text-xs font-medium text-slate-700 placeholder:text-slate-400 outline-none"
          />
        </div>

        {/* Search CTA Button */}
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3C65F5] px-6 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-[#2956F2] hover:shadow-lg hover:shadow-blue-500/30"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </form>

      {/* Popular Searches */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-bold text-slate-500">Popular Searches:</span>
        {POPULAR_SEARCHES.map((tag, idx) => (
          <button
            key={tag}
            type="button"
            onClick={() => handlePopularClick(tag)}
            className="font-medium text-slate-600 transition-colors hover:text-[#3C65F5] hover:underline"
          >
            {tag}
            {idx < POPULAR_SEARCHES.length - 1 ? "," : ""}
          </button>
        ))}
      </div>
    </div>
  );
}