import React from "react";

interface LocationMapContainerProps {
  latitude?: number;
  longitude?: number;
  privacyLevel?: "NONE" | "APPROXIMATE" | "PRECISE";
  status?: "LIVE" | "RECENT" | "STALE" | "OFFLINE";
  city?: string;
}

export const LocationMapContainer: React.FC<LocationMapContainerProps> = ({
  latitude,
  longitude,
  privacyLevel = "APPROXIMATE",
  status = "OFFLINE",
  city,
}) => {
  const isOffline = status === "OFFLINE" || !latitude || !longitude;

  if (isOffline) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-center">
        <span className="text-2xl mb-1">🗺️</span>
        <p className="text-xs font-semibold text-slate-700">Location Map Unavailable</p>
        <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
          Candidate has not enabled real-time location sharing for this application.
        </p>
      </div>
    );
  }

  // Generate OpenStreetMap Embed Embeddable URL
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.03
  }%2C${latitude - 0.03}%2C${longitude + 0.03}%2C${
    latitude + 0.03
  }&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
      {/* Map iframe */}
      <iframe
        title="Candidate Location Map"
        width="100%"
        height="200"
        src={mapUrl}
        className="border-0 filter contrast-[1.05]"
        loading="lazy"
      />

      {/* Floating Status Pill Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 backdrop-blur-md shadow-md border border-white/40">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            status === "LIVE"
              ? "bg-emerald-500 animate-ping"
              : status === "RECENT"
              ? "bg-amber-500"
              : "bg-slate-400"
          }`}
        />
        <span className="text-xs font-bold text-slate-800">
          {privacyLevel === "APPROXIMATE"
            ? `Approximate Area ${city ? `(${city})` : ""}`
            : `Precise Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
        </span>
      </div>
    </div>
  );
};
