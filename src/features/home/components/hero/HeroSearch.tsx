import { useNavigate } from "react-router-dom";
import UniversalSearchBar, { type SearchFilterState } from "@/shared/components/UniversalSearchBar";

const POPULAR_SEARCHES = [
  "Designer",
  "Web",
  "IOS",
  "Developer",
  "PHP",
  "Senior",
  "Engineer",
];

interface HeroSearchProps {
  onSearchChange?: (filters: SearchFilterState) => void;
  initialFilters?: SearchFilterState;
}

export default function HeroSearch({ onSearchChange, initialFilters }: HeroSearchProps) {
  const navigate = useNavigate();

  const handleSearch = (filters: SearchFilterState) => {
    if (onSearchChange) {
      onSearchChange(filters);
    } else {
      const params = new URLSearchParams();
      const query = filters.keyword || filters.industry;
      if (query) params.set("search", query);
      if (filters.location) params.set("location", filters.location);
      void navigate(`/jobs?${params.toString()}`);
    }
  };

  const handlePopularClick = (tag: string) => {
    const filters = { keyword: tag, location: "", industry: "" };
    if (onSearchChange) {
      onSearchChange(filters);
    } else {
      void navigate(`/jobs?search=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <div className="mt-8 max-w-[660px]">
      <UniversalSearchBar
        initialValues={initialFilters}
        onSearch={handleSearch}
        placeholder="Your keyword, title, or skill..."
      />

      {/* Popular Searches */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-bold text-slate-500 dark:text-slate-400">Popular Searches:</span>
        {POPULAR_SEARCHES.map((tag, idx) => (
          <button
            key={tag}
            type="button"
            onClick={() => handlePopularClick(tag)}
            className="font-medium text-slate-600 dark:text-slate-400 transition-colors hover:text-[#3C65F5] dark:hover:text-[#5E81FF] hover:underline"
          >
            {tag}
            {idx < POPULAR_SEARCHES.length - 1 ? "," : ""}
          </button>
        ))}
      </div>
    </div>
  );
}