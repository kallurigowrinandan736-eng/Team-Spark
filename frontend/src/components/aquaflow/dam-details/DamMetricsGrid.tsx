"use client";

import React from "react";
import {
  Waves, ArrowUpRight, ArrowDownRight, Droplets, CloudRain,
  Database, Gauge, Sliders, Info, ShieldAlert
} from "lucide-react";
import { DamDetailedRecord } from "../../../data/damDetailsData";

interface DamMetricsGridProps {
  dam: DamDetailedRecord;
}

export function DamMetricsGrid({ dam }: DamMetricsGridProps) {
  return (
    <section className="space-y-3">
      {/* Section Header with Demo Data Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
            Key Dam Hydrology &amp; Operations
          </h2>
          <p className="text-xs text-slate-500">
            Real-time telemetry and supervisory indicators from CWC &amp; AP WRD SCADA
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200/70 text-[11px] font-semibold self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Demonstration Hydrology Telemetry Feed</span>
        </div>
      </div>

      {/* 6 Clean Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Current Water Level */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Water Level Elevation
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-[#0B192C]">
                  {dam.currentLevelFt.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-slate-500">ft MSL</span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Full Reservoir Level (FRL)</span>
              <span className="font-bold text-slate-800">{dam.fullReservoirLevelFt} ft</span>
            </div>

            {/* Visual Level Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full"
                style={{ width: `${Math.min(100, dam.levelPct)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] pt-0.5">
              <span className="text-slate-400">MDDL: {dam.minimumDrawDownLevelFt} ft</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                +{dam.level24hDeltaPct}% (24h)
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Reservoir Storage Capacity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Reservoir Storage
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-[#0B192C]">
                  {dam.currentStorageTmc.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-slate-500">TMC</span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Gross Storage Capacity</span>
              <span className="font-bold text-slate-800">{dam.grossCapacityTmc} TMC</span>
            </div>

            {/* Split Storage Bar: Current vs Remaining */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${(dam.currentStorageTmc / dam.grossCapacityTmc) * 100}%` }}
              />
              <div
                className="h-full bg-amber-400"
                style={{ width: `${(dam.floodCushionTmc / dam.grossCapacityTmc) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] pt-0.5">
              <span className="text-slate-500">
                Live: <strong className="text-slate-700">{dam.liveCapacityTmc} TMC</strong>
              </span>
              <span className="text-amber-700 font-semibold">
                Cushion: {dam.floodCushionTmc} TMC
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Water Inflow */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Catchment Water Inflow
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-blue-600">
                  {dam.inflowCusecs.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-500">cusecs</span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Waves className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Metric Flow Rate</span>
              <span className="font-bold text-slate-800">{dam.inflowCumecs.toLocaleString()} m³/s</span>
            </div>

            <p className="text-[11px] text-slate-500 truncate" title={dam.inflowSource}>
              {dam.inflowSource}
            </p>

            <div className="flex justify-between items-center text-[11px] pt-0.5">
              <span className="text-slate-400">Trend vs 24h Mean</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                +{dam.inflowTrendPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Water Outflow */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Total Water Outflow
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-indigo-600">
                  {dam.outflowCusecs.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-500">cusecs</span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Metric Discharge Rate</span>
              <span className="font-bold text-slate-800">{dam.outflowCumecs.toLocaleString()} m³/s</span>
            </div>

            <p className="text-[11px] text-slate-500 truncate" title={dam.outflowDestination}>
              {dam.outflowDestination}
            </p>

            <div className="flex justify-between items-center text-[11px] pt-0.5">
              <span className="text-slate-400">Regulated Dispatch</span>
              <span className="inline-flex items-center gap-1 font-bold text-slate-600">
                {dam.outflowTrendPct >= 0 ? "+" : ""}{dam.outflowTrendPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Current Rainfall */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Catchment 24h Rainfall
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-[#0B192C]">
                  {dam.rainfallMm.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-slate-500">mm</span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Rainfall Intensity</span>
              <span className="font-bold text-teal-700">Moderate Showers</span>
            </div>

            <p className="text-[11px] text-slate-500 truncate" title={dam.catchmentRainfallDesc}>
              {dam.catchmentRainfallDesc}
            </p>

            <div className="flex justify-between items-center text-[11px] pt-0.5">
              <span className="text-slate-400">Deviation from Normal</span>
              <span className="font-bold text-emerald-600">
                +{dam.rainfallTrendPct}% surplus
              </span>
            </div>
          </div>
        </div>

        {/* Card 6: Number of Dam Gates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Active Spillway Gates
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {dam.openGates}
                </span>
                <span className="text-base font-bold text-slate-400">/ {dam.totalGates}</span>
                <span className="text-xs font-bold text-slate-500 ml-1">Open</span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Spillway Discharge</span>
              <span className="font-bold text-slate-800">
                {dam.spillwayDischargeCusecs.toLocaleString()} cusecs
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Hydro Power Release</span>
              <span className="font-bold text-slate-700">
                {dam.powerhouseDischargeCusecs.toLocaleString()} cusecs
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] pt-0.5">
              <span className="text-slate-400">Operational Mode</span>
              <span className="font-bold text-emerald-600">
                Radial Crest Synchronized
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
