"use client";

import React from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { HonestyBadge } from "../../components/HonestyBadge";
import { HISTORICAL_CORRELATIONS } from "../../data/demoData";
import { LineChart as LineIcon, Activity, TrendingUp, Sparkles, BarChart2 } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, BarChart, Bar
} from "recharts";

export default function AnalyticsPage() {
  const { crops, regions, canals, comparison } = useWaterStore();

  const opt = comparison?.classical;

  // Correlation matrix mockup
  const correlationMatrix = [
    { var: "Rainfall", Rainfall: 1.0, Inflow: 0.88, Demand: -0.72, ET0: -0.65, Storage: 0.79 },
    { var: "Inflow", Rainfall: 0.88, Inflow: 1.0, Demand: -0.68, ET0: -0.58, Storage: 0.92 },
    { var: "Demand", Rainfall: -0.72, Inflow: -0.68, Demand: 1.0, ET0: 0.84, Storage: -0.74 },
    { var: "ET0", Rainfall: -0.65, Inflow: -0.58, Demand: 0.84, ET0: 1.0, Storage: -0.62 },
    { var: "Storage", Rainfall: 0.79, Inflow: 0.92, Demand: -0.74, ET0: -0.62, Storage: 1.0 }
  ];

  const getHeatmapColor = (val: number) => {
    if (val === 1.0) return "bg-cyan-500 text-white font-bold";
    if (val > 0.7) return "bg-cyan-700 text-cyan-100";
    if (val > 0) return "bg-cyan-900/60 text-cyan-300";
    if (val > -0.6) return "bg-amber-950/60 text-amber-300";
    return "bg-rose-950/80 text-rose-300 font-semibold";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-cyan-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Advanced Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Correlation & Hydrological Network Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical timeseries correlations between rainfall, inflow runoff, evapotranspiration, and multi-district demand
          </p>
        </div>
        <HonestyBadge type="demo" />
      </div>

      {/* Correlation Matrix & 12-Month Historical Seasonality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correlation Heatmap */}
        <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md space-y-3">
          <h3 className="text-sm font-bold text-white">Hydrological Variables Pearson Correlation Matrix</h3>
          <p className="text-xs text-slate-400">Inter-variable coupling across 36-month catchment records</p>
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-center text-xs font-mono">
              <thead className="text-slate-400 text-[11px]">
                <tr>
                  <th className="p-2 text-left font-sans">Variable</th>
                  <th className="p-2">Rainfall</th>
                  <th className="p-2">Inflow</th>
                  <th className="p-2">Demand</th>
                  <th className="p-2">ET0</th>
                  <th className="p-2">Storage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {correlationMatrix.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2 text-left font-sans font-semibold text-slate-300">{row.var}</td>
                    <td className={`p-2 rounded ${getHeatmapColor(row.Rainfall)}`}>{row.Rainfall.toFixed(2)}</td>
                    <td className={`p-2 rounded ${getHeatmapColor(row.Inflow)}`}>{row.Inflow.toFixed(2)}</td>
                    <td className={`p-2 rounded ${getHeatmapColor(row.Demand)}`}>{row.Demand.toFixed(2)}</td>
                    <td className={`p-2 rounded ${getHeatmapColor(row.ET0)}`}>{row.ET0.toFixed(2)}</td>
                    <td className={`p-2 rounded ${getHeatmapColor(row.Storage)}`}>{row.Storage.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 12-Month Rainfall vs Demand Trend Chart */}
        <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Seasonal Monsoon Dynamics (12-Month Trajectory)</h3>
              <p className="text-xs text-slate-400">Catchment precipitation vs net agricultural demand</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_CORRELATIONS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#e2e8f0"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="demand" name="Demand (MCM)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="evapotranspiration" name="ET0 (mm/d)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
