"use client";

import React from "react";
import { TopNav } from "../../components/aquaflow/TopNav";
import { LiveMap } from "../../components/aquaflow/LiveMap";
import { Map, Layers, ShieldCheck } from "lucide-react";

export default function MapsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <TopNav />

      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C] tracking-tight">
            Geographic Information System (GIS) Basemap
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-layer satellite map showing dams, canals, rivers, check dams, and gauge stations
          </p>
        </div>

        <div className="h-[680px]">
          <LiveMap />
        </div>
      </main>
    </div>
  );
}
