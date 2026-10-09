"use client";

import React, { useState } from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { MapView } from "../../components/MapView";
import {
  Globe, Database, GitBranch, Sprout, Layers,
  Building2, Waves, Crosshair, Check, X
} from "lucide-react";

export default function MapPage() {
  const { reservoirs, canals, regions, crops } = useWaterStore();
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const totalStorage = reservoirs.reduce((s, r) => s + r.current_storage_mcm, 0);
  const totalDemand = crops.reduce((s, c) => s + c.total_demand_mcm, 0);

  // If a region is selected, calculate its specific assets
  const selectedRegion = regions.find((r) => r.id === selectedRegionId);
  const regionCanals = selectedRegion
    ? canals.filter((c) => c.destination_region_id === selectedRegion.id)
    : [];
  const feedingResIds = new Set(regionCanals.map((c) => c.source_reservoir_id));
  const regionReservoirs = selectedRegion
    ? reservoirs.filter((res) => {
        const distKm =
          Math.hypot(
            res.lat - selectedRegion.lat,
            (res.lng - selectedRegion.lng) * Math.cos((selectedRegion.lat * Math.PI) / 180)
          ) * 111;
        return feedingResIds.has(res.id) || distKm < 85;
      })
    : [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl dark:bg-[#0a160d]/90 bg-white border dark:border-white/10 border-emerald-200/80 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
              <Globe className="w-3.5 h-3.5" />
              <span>Google Earth Pro Satellite Geospatial Intelligence</span>
            </span>
          </div>
          <h1 className="text-2xl font-black dark:text-white text-slate-900 tracking-tight">
            Realistic GIS Satellite Water Network Map
          </h1>
          <p className="text-xs dark:text-slate-300 text-slate-600 mt-1">
            Search places, fly across satellite imagery, and select any command area to inspect all presenting reservoirs and canals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
            🛰️ High-Resolution Aerial
          </span>
        </div>
      </div>

      {/* Network Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl dark:bg-[#0a160d]/80 bg-white border dark:border-white/10 border-emerald-200/80 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs dark:text-slate-400 text-slate-500">4 Major Reservoirs</div>
            <div className="text-base font-bold dark:text-white text-slate-900 font-mono">{totalStorage.toFixed(0)} MCM Active</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl dark:bg-[#0a160d]/80 bg-white border dark:border-white/10 border-emerald-200/80 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs dark:text-slate-400 text-slate-500">8 Canal Reaches</div>
            <div className="text-base font-bold dark:text-white text-slate-900 font-mono">1,820 MCM Cap</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl dark:bg-[#0a160d]/80 bg-white border dark:border-white/10 border-emerald-200/80 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs dark:text-slate-400 text-slate-500">5 Command Districts</div>
            <div className="text-base font-bold dark:text-white text-slate-900 font-mono">820k ha Irrigated</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl dark:bg-[#0a160d]/80 bg-white border dark:border-white/10 border-emerald-200/80 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs dark:text-slate-400 text-slate-500">10 Crop Zones</div>
            <div className="text-base font-bold dark:text-white text-slate-900 font-mono">{totalDemand.toFixed(0)} MCM Demand</div>
          </div>
        </div>
      </div>

      {/* Interactive Command Area Selector Pills Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl dark:bg-[#0a160d]/80 bg-white border dark:border-white/10 border-emerald-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span>Select Command Area to see presenting Reservoirs & Canals:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedRegionId(null)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              selectedRegionId === null
                ? "bg-slate-800 text-white shadow-sm font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            All Areas
          </button>
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegionId(reg.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedRegionId === reg.id
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-md scale-105"
                  : "bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <span>📍</span>
              <span>{reg.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* When an Area is selected, display high-level banner with asset counts */}
      {selectedRegion && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/40 to-cyan-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{selectedRegion.name} Command Area Selected</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                  Tier {selectedRegion.priority}/5 Priority
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Irrigating {(selectedRegion.total_irrigated_area_ha / 1000).toFixed(0)}k hectares across {selectedRegion.active_farmers.toLocaleString()} farmers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-700/50 text-xs">
              <span className="text-cyan-400 font-bold block">{regionReservoirs.length} Reservoirs</span>
              <span className="text-[10px] text-slate-400 font-mono">Present / Feeding</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-xs">
              <span className="text-emerald-400 font-bold block">{regionCanals.length} Canals</span>
              <span className="text-[10px] text-slate-400 font-mono">Inflow Network</span>
            </div>
            <button
              onClick={() => setSelectedRegionId(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Deselect Area"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Google Earth Pro Satellite Map with Place Search and Area Inspector */}
      <MapView
        reservoirs={reservoirs}
        canals={canals}
        regions={regions}
        crops={crops}
        height="660px"
        initialSelectedRegionId={selectedRegionId}
      />
    </div>
  );
}
