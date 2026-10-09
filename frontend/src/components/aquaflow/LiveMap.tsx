"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MAP_INFRASTRUCTURE } from "../../data/aquaFlowConfig";
import { MapPin, Info, Layers } from "lucide-react";

// Client-only dynamic wrapper for Leaflet to prevent Next.js SSR hydration crashes
const LeafletMapInner = dynamic(
  () => import("./LeafletMapInner").then((mod) => mod.LeafletMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[220px] bg-slate-900 flex flex-col items-center justify-center text-slate-400 text-xs rounded-xl animate-pulse">
        <MapPin className="w-6 h-6 text-blue-400 mb-1 animate-bounce" />
        <span>Loading Satellite Water Infrastructure Map...</span>
      </div>
    )
  }
);

export function LiveMap() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#0B192C]">
            Live Map – Dams & Canals
          </h3>
          <p className="text-[11px] text-slate-400">
            Krishna-Godavari inter-basin GIS monitoring
          </p>
        </div>

        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
          OSM Satellite Basemap
        </span>
      </div>

      {/* Map Canvas with Top-Right Legend */}
      <div className="relative w-full h-56 sm:h-60 rounded-xl overflow-hidden border border-slate-200">
        <LeafletMapInner />
      </div>
    </div>
  );
}
