import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import {
  LocationSelectionModal,
  getStoredUserLocation,
  LOCATION_UPDATED_EVENT,
  type LocationDetail,
} from "./LocationSelectionModal";

export const SwiggyLocationHeader: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const [location, setLocation] =
    useState<LocationDetail | null>(readInitialLocation);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function readInitialLocation(): LocationDetail | null {
    return getStoredUserLocation();
  }

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<LocationDetail>;

      if (customEvent.detail) {
        setLocation(customEvent.detail);
      }
    };

    window.addEventListener(LOCATION_UPDATED_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(
        LOCATION_UPDATED_EVENT,
        handleUpdate
      );
    };
  }, []);

  const labelType = location?.labelType;

  const labelPrefix =
    labelType === "HOME"
      ? "🏠 Home"
      : labelType === "WORK"
        ? "💼 Work"
        : "📍 Current Location";

  return (
    <div className={`relative ${className}`}>
      {/* Zomato/Swiggy Style Header Pill Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white dark:bg-[#151F32] dark:border-[#2A3850] px-3.5 py-1.5 shadow-2xs transition-all hover:border-[#3C65F5]/40 hover:shadow-xs cursor-pointer"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-[#3C65F5] transition-colors group-hover:bg-[#3C65F5] group-hover:text-white">
          <MapPin className="h-4 w-4" />
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3C65F5]">
              {labelPrefix}
            </span>

            <ChevronDown className="h-3 w-3 text-slate-400 transition group-hover:text-slate-600" />
          </div>

          <p className="max-w-[130px] truncate text-xs font-bold text-slate-800 sm:max-w-[180px]">
            {location
              ? location.formattedName
              : "Select Your Location..."}
          </p>
        </div>
      </button>

      {/* Zomato / Swiggy Style Modal */}
      <LocationSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};