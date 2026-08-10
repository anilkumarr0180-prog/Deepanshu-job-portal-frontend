import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  MapPin,
  Navigation,
  Search,
  X,
  Check,
  Building2,
  Sparkles,
  Loader2,
  Globe,
  Home,
  Briefcase,
  Bookmark,
  Map as MapIcon,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import { saveUserDetectedLocationApi } from "@/features/candidate/api/location.api";
import { axiosInstance } from "@/lib/axios";

export const LOCATION_STORAGE_KEY = "detected_user_location";
export const LOCATION_UPDATED_EVENT = "user_location_updated";

export interface LocationDetail {
  formattedName: string;
  city: string;
  area: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  labelType?: "CURRENT" | "HOME" | "WORK" | "CUSTOM";
  isIpFallback?: boolean;
}

export function getStoredUserLocation(): LocationDetail | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as LocationDetail;
  } catch {
    return null;
  }
}

export function broadcastLocationUpdate(location: LocationDetail) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
  window.dispatchEvent(
    new CustomEvent(LOCATION_UPDATED_EVENT, { detail: location })
  );
  void saveUserDetectedLocationApi(location);
}

export function resolveExactLocality(address: Record<string, string>): {
  formattedName: string;
  city: string;
  area: string;
  state: string;
  country: string;
} {
  const addr = address || {};

  const area =
    addr.suburb ||
    addr.neighbourhood ||
    addr.quarter ||
    addr.residential ||
    addr.road ||
    addr.village ||
    addr.subdistrict ||
    "";

  const city =
    addr.city ||
    addr.town ||
    addr.city_district ||
    addr.municipality ||
    addr.county ||
    addr.state_district ||
    "";

  const state = addr.state || "";
  const country = addr.country || "India";

  const finalCity = city || (state && state.toLowerCase() !== "punjab" ? state : "Mohali");

  let formattedName = "";
  if (area && finalCity && area.toLowerCase() !== finalCity.toLowerCase()) {
    formattedName = `${area}, ${finalCity}`;
  } else if (finalCity && state && finalCity.toLowerCase() !== state.toLowerCase()) {
    formattedName = `${finalCity}, ${state}`;
  } else {
    formattedName = finalCity || state || "Mohali, Punjab";
  }

  return {
    formattedName,
    city: finalCity,
    area,
    state,
    country,
  };
}

interface CityEntry {
  name: string;
  state: string;
  label: string;
  aliases: string[];
}

const POPULAR_CITIES: CityEntry[] = [
  { name: "Mohali", state: "Punjab", label: "Mohali, Punjab", aliases: ["mohali", "sas nagar", "sahibzada ajit singh nagar"] },
  { name: "Chandigarh", state: "Chandigarh", label: "Chandigarh", aliases: ["chd", "chandigarh"] },
  { name: "Bengaluru", state: "Karnataka", label: "Bengaluru, KA", aliases: ["bangalore", "banglore", "bengaluru", "bengaluru south"] },
  { name: "Delhi NCR", state: "Delhi", label: "Delhi NCR", aliases: ["delhi", "new delhi", "ncr", "delhi ncr"] },
  { name: "Gurugram", state: "Haryana", label: "Gurugram, HR", aliases: ["gurgaon", "gurugram"] },
  { name: "Noida", state: "Uttar Pradesh", label: "Noida, UP", aliases: ["noida", "greater noida"] },
  { name: "Shimla", state: "Himachal Pradesh", label: "Shimla, HP", aliases: ["himachal", "himachal pradesh", "shimla", "manali", "dharamshala", "solan", "kullu", "mandi"] },
  { name: "Ludhiana", state: "Punjab", label: "Ludhiana, Punjab", aliases: ["ludhiana", "ludhiana punjab"] },
  { name: "Jalandhar", state: "Punjab", label: "Jalandhar, Punjab", aliases: ["jalandhar", "jullundhur"] },
  { name: "Amritsar", state: "Punjab", label: "Amritsar, Punjab", aliases: ["amritsar", "ambarsar"] },
  { name: "Mumbai", state: "Maharashtra", label: "Mumbai, MH", aliases: ["mumbai", "bombay"] },
  { name: "Pune", state: "Maharashtra", label: "Pune, MH", aliases: ["pune", "poona"] },
  { name: "Hyderabad", state: "Telangana", label: "Hyderabad, TS", aliases: ["hyderabad", "secunderabad"] },
  { name: "Chennai", state: "Tamil Nadu", label: "Chennai, TN", aliases: ["chennai", "madras"] },
  { name: "Kolkata", state: "West Bengal", label: "Kolkata, WB", aliases: ["kolkata", "calcutta"] },
  { name: "Jaipur", state: "Rajasthan", label: "Jaipur, RJ", aliases: ["jaipur", "pink city"] },
];

interface LocationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation?: (location: LocationDetail) => void;
}

export const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [apiResults, setApiResults] = useState<LocationDetail[]>([]);
  const [currentLoc, setCurrentLoc] = useState<LocationDetail | null>(getStoredUserLocation);
  const [activeTab, setActiveTab] = useState<"SEARCH" | "MAP">("SEARCH");
  const [gpsPermissionState, setGpsPermissionState] = useState<"prompt" | "granted" | "denied" | "unknown">("unknown");
  const inputRef = useRef<HTMLInputElement>(null);

  // Check browser GPS permission status
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((status) => {
        setGpsPermissionState(status.state);
        status.onchange = () => setGpsPermissionState(status.state);
      }).catch(() => {
        setGpsPermissionState("unknown");
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Live Geocoding Autocomplete Search (Debounced 350ms)
  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    if (query.length < 2) {
      setApiResults([]);
      setIsSearchingApi(false);
      return;
    }

    setIsSearchingApi(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=6&countrycodes=in,us,gb,ca,ae`
        );
        if (!res.ok) throw new Error("Search API error");
        const data = (await res.json()) as Array<{
          display_name: string;
          lat: string;
          lon: string;
          address?: Record<string, string>;
        }>;

        const results: LocationDetail[] = data.map((item) => {
          const resolved = resolveExactLocality(item.address || {});
          return {
            formattedName: resolved.formattedName || item.display_name.split(",")[0],
            city: resolved.city || item.display_name.split(",")[0],
            area: resolved.area || "",
            state: resolved.state || "",
            country: resolved.country || "",
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            labelType: "CUSTOM",
          };
        });

        setApiResults(results);
      } catch (err) {
        console.warn("Live location search error:", err);
      } finally {
        setIsSearchingApi(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryLower = searchTerm.trim().toLowerCase();
  const matchedPreindexed = POPULAR_CITIES.filter((c) => {
    if (!queryLower) return false;
    return (
      c.name.toLowerCase().includes(queryLower) ||
      c.state.toLowerCase().includes(queryLower) ||
      c.label.toLowerCase().includes(queryLower) ||
      c.aliases.some((alias) => alias.includes(queryLower) || queryLower.includes(alias))
    );
  });

  const handleSelect = (detail: LocationDetail) => {
    setCurrentLoc(detail);
    broadcastLocationUpdate(detail);
    if (onSelectLocation) onSelectLocation(detail);
    toast.success(`📍 Location set to ${detail.formattedName}`);
    onClose();
  };

  const handleSelectCityName = (cityName: string, stateName: string = "", labelType: LocationDetail["labelType"] = "CUSTOM") => {
    const formattedName = stateName ? `${cityName}, ${stateName}` : cityName;
    const detail: LocationDetail = {
      formattedName,
      city: cityName,
      area: "",
      state: stateName,
      country: "India",
      latitude: 0,
      longitude: 0,
      labelType,
    };
    handleSelect(detail);
  };

  // Enterprise Hybrid Location Auto-Detection Strategy (Backend Proxy + High Accuracy GPS + Zero-Click IP Fallback)
  const handleAutoDetectGPS = useCallback(async () => {
    setIsLocating(true);

    // Try HTML5 Browser Geolocation with high accuracy
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Enterprise Call: Secure Server Proxy Geocoder
            const res = await axiosInstance.post<{ success: boolean; data: LocationDetail }>("/location/reverse-geocode", {
              latitude,
              longitude,
            });

            if (res.data?.success && res.data?.data) {
              const locationDetail: LocationDetail = {
                ...res.data.data,
                labelType: "CURRENT",
              };
              handleSelect(locationDetail);
              return;
            }
            throw new Error("Server proxy geocode failed");
          } catch {
            // Client-side fallback
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
              );
              const data = (await response.json()) as { address?: Record<string, string> };
              const resolved = resolveExactLocality(data.address || {});
              handleSelect({
                ...resolved,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                labelType: "CURRENT",
              });
            } catch {
              handleSelectCityName("Mohali", "Punjab", "CURRENT");
            }
          } finally {
            setIsLocating(false);
          }
        },
        async (err) => {
          console.warn("GPS Permission or Hardware Timeout. Triggering Zero-Click IP Detection:", err.message);
          setGpsPermissionState("denied");

          // Fallback to Backend Zero-Click IP Location Detection
          try {
            const ipRes = await axiosInstance.get<{ success: boolean; data: LocationDetail }>("/location/ip-detect");
            if (ipRes.data?.success && ipRes.data?.data) {
              handleSelect({
                ...ipRes.data.data,
                labelType: "CURRENT",
              });
              toast.success(`📍 Set to ${ipRes.data.data.formattedName} (approx. via network IP)`);
            } else {
              handleSelectCityName("Mohali", "Punjab", "CURRENT");
            }
          } catch {
            handleSelectCityName("Mohali", "Punjab", "CURRENT");
          } finally {
            setIsLocating(false);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 3000,
        }
      );
    } else {
      handleSelectCityName("Mohali", "Punjab", "CURRENT");
      setIsLocating(false);
    }
  }, []);

  if (!isOpen) return null;

  const mapEmbedUrl = currentLoc?.latitude && currentLoc?.longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${currentLoc.longitude - 0.02}%2C${currentLoc.latitude - 0.02}%2C${currentLoc.longitude + 0.02}%2C${currentLoc.latitude + 0.02}&layer=mapnik&marker=${currentLoc.latitude}%2C${currentLoc.longitude}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=76.65%2C30.65%2C76.75%2C30.75&layer=mapnik&marker=30.7046%2C76.7179`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all sm:p-8 animate-enter">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-[#3C65F5] shadow-xs">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">Select Your Location</h2>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200">
                  Live GPS / IP
                </span>
              </div>
              <p className="text-xs text-slate-500">Find jobs & talent near your exact area</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* GPS Permission Warning Guidance Banner (if permission blocked in Chrome) */}
        {gpsPermissionState === "denied" && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold">Browser Location Access Blocked</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Click the 🔒 lock icon in your browser address bar next to <strong>localhost</strong>, set Location to <strong>Allow</strong>, then try Auto Detect.
              </p>
            </div>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="mt-4 flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("SEARCH")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === "SEARCH"
                ? "bg-white text-[#3C65F5] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search & Cities</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("MAP")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === "MAP"
                ? "bg-white text-[#3C65F5] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>Interactive Map</span>
          </button>
        </div>

        {/* TAB 1: SEARCH & QUICK SELECTION */}
        {activeTab === "SEARCH" && (
          <>
            {/* Search Bar Input */}
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchTerm.trim()) {
                    handleSelectCityName(searchTerm.trim());
                  }
                }}
                placeholder="Type your city (e.g. Mohali, Bangalore, Himachal)..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-[#3C65F5] focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Zomato / Swiggy Style Auto-Detect GPS Banner */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleAutoDetectGPS}
                disabled={isLocating}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#3C65F5] to-blue-700 p-4 text-left text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                    <Navigation className={`h-5 w-5 ${isLocating ? "animate-spin" : "group-hover:rotate-45 transition-transform"}`} />
                    {isLocating && (
                      <span className="absolute inset-0 rounded-xl bg-white/40 animate-ping" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">
                      {isLocating ? "Detecting Location (GPS / Network)..." : "🎯 Use Current Location"}
                    </p>
                    <p className="text-[11px] text-blue-100">
                      Hybrid GPS + Server IP auto-detection
                    </p>
                  </div>
                </div>
                <span className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                  {isLocating ? "Detecting..." : "Auto Detect"}
                </span>
              </button>
            </div>

            {/* Zomato/Swiggy Saved Places Shortcuts */}
            {!searchTerm && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => handleSelectCityName("Mohali", "Punjab", "HOME")}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:border-blue-200 hover:text-[#3C65F5]"
                >
                  <Home className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Home (Mohali)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectCityName("Chandigarh", "Chandigarh", "WORK")}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:border-blue-200 hover:text-[#3C65F5]"
                >
                  <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                  <span>Work (Chandigarh)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectCityName("Bengaluru", "Karnataka", "CUSTOM")}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:border-blue-200 hover:text-[#3C65F5]"
                >
                  <Bookmark className="h-3.5 w-3.5 text-purple-500" />
                  <span>Tech Hub (Bengaluru)</span>
                </button>
              </div>
            )}

            {/* Dynamic Location Search Suggestions List */}
            <div className="mt-4 max-h-56 overflow-y-auto pr-1">
              {searchTerm ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Location Results
                    </p>
                    {isSearchingApi && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#3C65F5]">
                        <Loader2 className="h-3 w-3 animate-spin" /> Searching global maps...
                      </span>
                    )}
                  </div>

                  {matchedPreindexed.length > 0 && (
                    <div className="space-y-1">
                      {matchedPreindexed.map((city) => (
                        <button
                          key={city.label}
                          type="button"
                          onClick={() => handleSelectCityName(city.name, city.state)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#3C65F5]"
                        >
                          <div className="flex items-center gap-2.5">
                            <Building2 className="h-4 w-4 text-[#3C65F5]" />
                            <span>{city.label}</span>
                          </div>
                          {currentLoc?.city === city.name && (
                            <Check className="h-4 w-4 text-[#3C65F5]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {apiResults.length > 0 && (
                    <div className="space-y-1">
                      {apiResults.map((res, idx) => (
                        <button
                          key={`${res.formattedName}-${idx}`}
                          type="button"
                          onClick={() => handleSelect(res)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Globe className="h-4 w-4 shrink-0 text-slate-400" />
                            <span className="truncate">{res.formattedName}</span>
                          </div>
                          {currentLoc?.formattedName === res.formattedName && (
                            <Check className="h-4 w-4 shrink-0 text-[#3C65F5]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSelectCityName(searchTerm.trim())}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-[0.99] shadow-sm"
                  >
                    <Check className="h-4 w-4" />
                    <span>Set Location to &quot;{searchTerm.trim()}&quot;</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Popular Hiring Hubs
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {POPULAR_CITIES.map((city) => {
                      const isSelected = currentLoc?.city === city.name;
                      return (
                        <button
                          key={city.name}
                          type="button"
                          onClick={() => handleSelectCityName(city.name, city.state)}
                          className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                            isSelected
                              ? "border-[#3C65F5] bg-blue-50/70 text-[#3C65F5] shadow-xs"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{city.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#3C65F5]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: INTERACTIVE MAP VIEW */}
        {activeTab === "MAP" && (
          <div className="mt-4 space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
              <iframe
                title="Interactive Location Map"
                width="100%"
                height="220"
                src={mapEmbedUrl}
                className="border-0"
              />
              <div className="absolute top-3 left-3 rounded-xl bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-800 backdrop-blur-md border border-white/40 shadow-xs">
                📍 {currentLoc?.formattedName || "Mohali, Punjab"}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoDetectGPS}
              disabled={isLocating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3C65F5] py-3 text-xs font-bold text-white shadow-md hover:bg-[#2A52D4]"
            >
              <Navigation className={`h-4 w-4 ${isLocating ? "animate-spin" : ""}`} />
              <span>Confirm Location &amp; Update Map</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
