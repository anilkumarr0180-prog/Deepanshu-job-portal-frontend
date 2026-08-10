import { useState, useCallback, useEffect } from "react";
import { BriefcaseBusiness, MapPin, Search, Navigation, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  getStoredUserLocation,
  LOCATION_UPDATED_EVENT,
  broadcastLocationUpdate,
  resolveExactLocality,
  type LocationDetail,
} from "./LocationSelectionModal";

export interface SearchFilterState {
  keyword: string;
  location: string;
  industry: string;
}

interface UniversalSearchBarProps {
  initialValues?: Partial<SearchFilterState>;
  onSearch: (filters: SearchFilterState) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export default function UniversalSearchBar({
  initialValues,
  onSearch,
  onClear,
  placeholder = "Your keyword, role, or title...",
  className = "",
  compact = false,
}: UniversalSearchBarProps) {
  const [keyword, setKeyword] = useState(initialValues?.keyword ?? "");
  const [location, setLocation] = useState(() => {
    if (initialValues?.location) return initialValues.location;
    const stored = getStoredUserLocation();
    return stored?.city || stored?.formattedName || "";
  });
  const [industry, setIndustry] = useState(initialValues?.industry ?? "");
  const [isLocating, setIsLocating] = useState(false);

  // Sync with SwiggyLocationHeader location updates
  useEffect(() => {
    const handleLocationEvent = (e: Event) => {
      const customEvt = e as CustomEvent<LocationDetail>;
      if (customEvt.detail?.city || customEvt.detail?.formattedName) {
        const detected = customEvt.detail.city || customEvt.detail.formattedName;
        setLocation(detected);
        onSearch({
          keyword: keyword.trim(),
          location: detected.trim(),
          industry: industry.trim(),
        });
      }
    };
    window.addEventListener(LOCATION_UPDATED_EVENT, handleLocationEvent);
    return () => window.removeEventListener(LOCATION_UPDATED_EVENT, handleLocationEvent);
  }, [keyword, industry, onSearch]);

  const isFiltered = Boolean(keyword.trim() || location.trim() || industry.trim());

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({
      keyword: keyword.trim(),
      location: location.trim(),
      industry: industry.trim(),
    });
  };

  const handleClear = useCallback(() => {
    setKeyword("");
    setLocation("");
    setIndustry("");
    if (onClear) {
      onClear();
    } else {
      onSearch({ keyword: "", location: "", industry: "" });
    }
  }, [onClear, onSearch]);

  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = (await response.json()) as {
            address?: Record<string, string>;
          };

          const resolved = resolveExactLocality(data.address || {});

          setLocation(resolved.formattedName);
          broadcastLocationUpdate({
            ...resolved,
            latitude,
            longitude,
          });
          toast.success(`📍 Location set to ${resolved.formattedName}`);
          onSearch({ keyword: keyword.trim(), location: resolved.formattedName, industry: industry.trim() });
        } catch {
          setLocation("Mohali");
          toast.success("Location set to Mohali");
          onSearch({ keyword: keyword.trim(), location: "Mohali", industry: industry.trim() });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Location error:", error);
        toast.error("Unable to retrieve your location");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    );
  }, [keyword, industry, onSearch]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-lg shadow-slate-200/50 backdrop-blur-md sm:flex-row sm:items-center ${className}`}
    >
      {/* Industry / Category Select */}
      <div className="flex h-11 items-center gap-2 border-b border-slate-100 px-3 sm:border-b-0 sm:border-r sm:border-slate-200">
        <BriefcaseBusiness className="h-4 w-4 shrink-0 text-slate-400" />
        <select
          value={industry}
          onChange={(e) => {
            const val = e.target.value;
            setIndustry(val);
            onSearch({ keyword: keyword.trim(), location: location.trim(), industry: val });
          }}
          className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer sm:w-28"
        >
          <option value="">Industry</option>
          <option value="Software">Software</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Management">Management</option>
          <option value="Design">Design</option>
          <option value="Engineering">Engineering</option>
        </select>
      </div>

      {/* Location Field with Geolocation Trigger */}
      <div className="flex h-11 items-center gap-2 border-b border-slate-100 px-3 sm:border-b-0 sm:border-r sm:border-slate-200">
        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={location}
          onChange={(e) => {
            const val = e.target.value;
            setLocation(val);
            onSearch({ keyword: keyword.trim(), location: val.trim(), industry: industry.trim() });
          }}
          placeholder="Location..."
          className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none placeholder:text-slate-400 sm:w-28"
        />
        <button
          type="button"
          onClick={handleDetectLocation}
          title="Detect My Location"
          disabled={isLocating}
          className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-[#3C65F5]"
        >
          <Navigation className={`h-3.5 w-3.5 ${isLocating ? "animate-spin text-[#3C65F5]" : ""}`} />
        </button>
      </div>

      {/* Keyword Input */}
      <div className="flex h-11 flex-1 items-center px-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            const val = e.target.value;
            setKeyword(val);
            onSearch({ keyword: val.trim(), location: location.trim(), industry: industry.trim() });
          }}
          placeholder={placeholder}
          className="w-full text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none"
        />
        {isFiltered && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            title="Clear filters"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#3C65F5] font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-[#2956F2] hover:shadow-lg ${
          compact ? "h-9 px-4 text-xs" : "h-10 px-6 text-xs"
        }`}
      >
        <Search className="h-4 w-4" />
        <span>Search</span>
      </button>
    </form>
  );
}
