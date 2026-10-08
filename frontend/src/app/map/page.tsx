"use client";

import React from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { MapView } from "../../components/MapView";
import { HonestyBadge } from "../../components/HonestyBadge";
import { Map as MapIcon, Database, GitBranch, Sprout, Layers } from "lucide-react";

export default function MapPage() {
  const { reservoirs, canals, regions, crops, comparison } = useWaterStore();

  const totalStorage = reservoirs.reduce((s, r) => s + r.current_storage_mcm, 0);
  const totalDemand = crops.reduce((s, c) => s + c.total_demand_mcm, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-indigo-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Geospatial Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Geographic Information System (GIS) Water Map</h1>
          <p className="text-xs text-slate-400 mt-1">
            Spatial distribution of Krishna Basin reservoirs, animated conveyance canals, and district irrigation command areas
          </p>
        </div>
        <HonestyBadge type="demo" />
      </div>

      {/* Network Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">4 Reservoirs</div>
            <div className="text-base font-bold text-white font-mono">{totalStorage.toFixed(0)} MCM Active</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">8 Canal Reaches</div>
            <div className="text-base font-bold text-white font-mono">1,820 MCM Cap</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">5 Districts</div>
            <div className="text-base font-bold text-white font-mono">820k ha Irrigated</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">10 Crop Zones</div>
            <div className="text-base font-bold text-white font-mono">{totalDemand.toFixed(0)} MCM Demand</div>
          </div>
        </div>
      </div>

      {/* Main Map */}
      <MapView
        reservoirs={reservoirs}
        canals={canals}
        regions={regions}
        crops={crops}
        height="640px"
      />
    </div>
  );
}
