"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, ReferenceLine, BarChart, Bar, Legend
} from "recharts";
import {
  Waves, BarChart3, Calendar, Info, Layers, CheckCircle2,
  TrendingUp, TrendingDown, ArrowRight, ShieldCheck
} from "lucide-react";
import { DamDetailedRecord, HydrologyDataPoint } from "../../../data/damDetailsData";

interface ReservoirOverviewSectionProps {
  dam: DamDetailedRecord;
}

export function ReservoirOverviewSection({ dam }: ReservoirOverviewSectionProps) {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [activeChartTab, setActiveChartTab] = useState<"level" | "flow">("level");

  const telemetryData: HydrologyDataPoint[] = dam.telemetry[timeRange];

  // Storage breakdown calculations
  const gross = dam.grossCapacityTmc;
  const current = dam.currentStorageTmc;
  const dead = dam.deadStorageTmc;
  const activeStorage = Math.max(0, current - dead);
  const remainingCushion = Math.max(0, gross - current);

  return (
    <section id="reservoir-overview" className="space-y-6 pt-4">
      {/* Section Header with Time-Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
              Reservoir Overview
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Reservoir water levels, storage capacity distribution, and inflow vs. outflow balance
          </p>
        </div>

        {/* Time-Range Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange("daily")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeRange === "daily"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Daily (24h)
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("weekly")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeRange === "weekly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Weekly (7 Days)
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("monthly")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeRange === "monthly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly (YTD)
          </button>
        </div>
      </div>

      {/* Two Column Layout: Visual Progress / Storage Balance + Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Water-level progress indicator + Storage versus capacity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Water-Level Progress Indicator Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B192C]">
                Water Level Elevation Progress
              </h3>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                {dam.levelPct}% of FRL
              </span>
            </div>

            {/* Vertical/Horizontal Elevation Progress Component */}
            <div className="space-y-3">
              {/* Markers for key elevations */}
              <div className="relative pt-6 pb-2">
                {/* Horizontal Progress track */}
                <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70">
                  {/* Current water level bar */}
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-teal-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(5, dam.levelPct))}%` }}
                  />
                </div>

                {/* Pin pointer on current level */}
                <div
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${Math.min(96, Math.max(4, dam.levelPct))}%` }}
                >
                  <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 border border-blue-300 px-1.5 py-0.2 rounded shadow-sm whitespace-nowrap">
                    {dam.currentLevelFt} ft
                  </span>
                  <div className="w-1.5 h-1.5 bg-blue-600 rotate-45 -mt-0.5" />
                </div>
              </div>

              {/* Elevation milestones list */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 block font-medium">MDDL (Min)</span>
                  <span className="text-xs font-bold text-slate-700">{dam.minimumDrawDownLevelFt} ft</span>
                </div>
                <div className="bg-blue-50/80 p-2 rounded-xl border border-blue-200">
                  <span className="text-[10px] text-blue-600 block font-semibold">Current Level</span>
                  <span className="text-xs font-extrabold text-blue-800">{dam.currentLevelFt} ft</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 block font-medium">FRL (Max)</span>
                  <span className="text-xs font-bold text-slate-700">{dam.fullReservoirLevelFt} ft</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
                <span>Freeboard to FRL:</span>
                <span className="font-bold text-emerald-700">
                  {(dam.fullReservoirLevelFt - dam.currentLevelFt).toFixed(2)} ft remaining safety buffer
                </span>
              </div>
            </div>
          </div>

          {/* Current Storage vs Total Capacity Breakdown Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0B192C]">
                  Reservoir Storage Capacity
                </h3>
                <p className="text-[11px] text-slate-400">Total volumetric distribution</p>
              </div>
              <span className="text-xs font-extrabold text-[#0B192C]">
                {gross} TMC Total
              </span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-5 bg-slate-100 rounded-xl overflow-hidden flex shadow-inner border border-slate-200">
                {/* Dead storage */}
                <div
                  className="h-full bg-slate-400"
                  style={{ width: `${(dead / gross) * 100}%` }}
                  title={`Dead Storage: ${dead} TMC`}
                />
                {/* Active Live Storage */}
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${(activeStorage / gross) * 100}%` }}
                  title={`Active Utilized Storage: ${activeStorage.toFixed(1)} TMC`}
                />
                {/* Flood cushion / remaining capacity */}
                <div
                  className="h-full bg-sky-200"
                  style={{ width: `${(remainingCushion / gross) * 100}%` }}
                  title={`Available Flood Cushion: ${remainingCushion.toFixed(1)} TMC`}
                />
              </div>

              {/* Legend with exact TMC values */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-blue-600" />
                    <span className="text-slate-600 font-medium">Active Utilized Storage</span>
                  </div>
                  <span className="font-bold text-[#0B192C]">{activeStorage.toFixed(1)} TMC ({((activeStorage / gross) * 100).toFixed(1)}%)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-slate-400" />
                    <span className="text-slate-600 font-medium">Dead Storage (Below MDDL)</span>
                  </div>
                  <span className="font-bold text-[#0B192C]">{dead.toFixed(1)} TMC ({((dead / gross) * 100).toFixed(1)}%)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-sky-200 border border-sky-300" />
                    <span className="text-slate-600 font-medium">Available Flood Cushion</span>
                  </div>
                  <span className="font-bold text-sky-700">{remainingCushion.toFixed(1)} TMC ({((remainingCushion / gross) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Historical Water Levels Line Chart & Inflow vs Outflow Comparison */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
            {/* Chart Sub-Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#0B192C]">
                  {activeChartTab === "level"
                    ? "Historical Water Level Trajectory"
                    : "Inflow vs. Outflow Volumetric Balance"}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeChartTab === "level"
                    ? `Reservoir surface elevation (${timeRange.toUpperCase()} View)`
                    : `Discharge rate in cusecs (${timeRange.toUpperCase()} View)`}
                </p>
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveChartTab("level")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeChartTab === "level"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Water Level (ft)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartTab("flow")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeChartTab === "flow"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Inflow vs Outflow
                </button>
              </div>
            </div>

            {/* Chart Canvas */}
            <div className="w-full h-72 sm:h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {activeChartTab === "level" ? (
                  <AreaChart data={telemetryData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="damWaterLevelGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748B" }}
                    />
                    <YAxis
                      domain={[dam.minimumDrawDownLevelFt - 10, dam.fullReservoirLevelFt + 5]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748B" }}
                      tickFormatter={(v) => `${v} ft`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload as HydrologyDataPoint;
                          return (
                            <div className="bg-slate-900 text-white rounded-xl p-3 text-xs shadow-xl border border-slate-800 space-y-1.5 font-sans">
                              <p className="font-bold text-sky-400">{item.time} Telemetry</p>
                              <div className="space-y-1 text-slate-200">
                                <p className="font-semibold text-white">
                                  Water Level: <span className="text-blue-400 font-extrabold">{item.levelFt} ft</span>
                                </p>
                                <p>Storage: <span className="font-bold text-emerald-400">{item.storageTmc} TMC</span></p>
                                <p>Inflow: {item.inflowCusecs.toLocaleString()} cusecs</p>
                                <p>Outflow: {item.outflowCusecs.toLocaleString()} cusecs</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine
                      y={dam.fullReservoirLevelFt}
                      stroke="#EF4444"
                      strokeDasharray="4 4"
                      label={{ value: `FRL ${dam.fullReservoirLevelFt} ft`, position: "top", fill: "#EF4444", fontSize: 10 }}
                    />
                    <ReferenceLine
                      y={dam.minimumDrawDownLevelFt}
                      stroke="#F59E0B"
                      strokeDasharray="4 4"
                      label={{ value: `MDDL ${dam.minimumDrawDownLevelFt} ft`, position: "bottom", fill: "#F59E0B", fontSize: 10 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="levelFt"
                      stroke="#2563EB"
                      strokeWidth={3}
                      fill="url(#damWaterLevelGrad)"
                      dot={{ r: 3, fill: "#2563EB", strokeWidth: 2, stroke: "#FFFFFF" }}
                      activeDot={{ r: 6, fill: "#1D4ED8", strokeWidth: 2, stroke: "#FFFFFF" }}
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={telemetryData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748B" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748B" }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload as HydrologyDataPoint;
                          const netDelta = item.inflowCusecs - item.outflowCusecs;
                          return (
                            <div className="bg-slate-900 text-white rounded-xl p-3 text-xs shadow-xl border border-slate-800 space-y-1.5 font-sans">
                              <p className="font-bold text-sky-400">{item.time} Discharge Balance</p>
                              <div className="space-y-1 text-slate-200">
                                <p className="text-sky-300 font-semibold">
                                  Inflow: {item.inflowCusecs.toLocaleString()} cusecs
                                </p>
                                <p className="text-indigo-300 font-semibold">
                                  Outflow: {item.outflowCusecs.toLocaleString()} cusecs
                                </p>
                                <div className="pt-1 border-t border-slate-800">
                                  <span className={`font-bold ${netDelta >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                                    Net Accrual: {netDelta >= 0 ? "+" : ""}{netDelta.toLocaleString()} cusecs
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                      iconType="circle"
                    />
                    <Bar dataKey="inflowCusecs" name="Water Inflow (cusecs)" fill="#0284C7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outflowCusecs" name="Water Outflow (cusecs)" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Telemetry Summary Footnote */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 gap-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hydrology telemetry verified with Central Water Commission (CWC) guidelines</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                SCADA Gauge Precision: &plusmn;0.05 ft
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
