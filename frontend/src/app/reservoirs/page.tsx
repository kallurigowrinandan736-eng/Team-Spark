"use client";

import React, { useState } from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { HonestyBadge } from "../../components/HonestyBadge";
import { Database, Edit3, Check, Droplets, AlertTriangle, ArrowUpRight } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend
} from "recharts";

export default function ReservoirsPage() {
  const { reservoirs, updateReservoir, runOptimizationPipeline } = useWaterStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempStorage, setTempStorage] = useState<number>(0);

  const startEdit = (id: string, curVal: number) => {
    setEditingId(id);
    setTempStorage(curVal);
  };

  const saveEdit = (id: string) => {
    updateReservoir(id, { current_storage_mcm: tempStorage });
    setEditingId(null);
    runOptimizationPipeline();
  };

  // Mock 12-month historical water level data per reservoir
  const levelHistory = [
    { month: "Jan", Nagarjuna: 172.5, Srisailam: 260.1, Pulichintala: 49.8, Prakasam: 17.2 },
    { month: "Feb", Nagarjuna: 169.8, Srisailam: 256.4, Pulichintala: 48.2, Prakasam: 17.1 },
    { month: "Mar", Nagarjuna: 165.2, Srisailam: 251.0, Pulichintala: 46.5, Prakasam: 17.0 },
    { month: "Apr", Nagarjuna: 160.4, Srisailam: 245.8, Pulichintala: 44.9, Prakasam: 16.9 },
    { month: "May", Nagarjuna: 156.1, Srisailam: 240.2, Pulichintala: 43.1, Prakasam: 16.8 },
    { month: "Jun", Nagarjuna: 162.0, Srisailam: 248.5, Pulichintala: 47.0, Prakasam: 17.2 },
    { month: "Jul", Nagarjuna: 173.8, Srisailam: 263.2, Pulichintala: 51.2, Prakasam: 17.4 },
    { month: "Aug", Nagarjuna: 178.5, Srisailam: 268.4, Pulichintala: 53.0, Prakasam: 17.5 },
    { month: "Sep", Nagarjuna: 177.2, Srisailam: 267.0, Pulichintala: 52.4, Prakasam: 17.5 },
    { month: "Oct", Nagarjuna: 175.5, Srisailam: 265.2, Pulichintala: 51.8, Prakasam: 17.4 },
    { month: "Nov", Nagarjuna: 174.0, Srisailam: 263.0, Pulichintala: 50.9, Prakasam: 17.3 },
    { month: "Dec", Nagarjuna: 173.1, Srisailam: 261.5, Pulichintala: 50.2, Prakasam: 17.3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-sky-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Source Storage</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Reservoir Storage & Hydraulic Levels</h1>
          <p className="text-xs text-slate-400 mt-1">
            Live storage monitoring, minimum environmental reserves, and editable storage capacities
          </p>
        </div>
        <HonestyBadge type="demo" />
      </div>

      {/* Reservoir Cards Grid with Editable Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reservoirs.map((res) => {
          const storagePct = (res.current_storage_mcm / Math.max(1, res.max_capacity_mcm)) * 100;
          const isEditing = editingId === res.id;

          return (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white truncate max-w-[170px]">{res.name}</h3>
                  <span className="text-[11px] text-slate-400">Max Cap: {res.max_capacity_mcm} MCM</span>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                    res.status === "Critical"
                      ? "bg-rose-950 text-rose-300 border border-rose-800/40"
                      : res.status === "Optimal"
                      ? "bg-sky-950 text-sky-300 border border-sky-800/40"
                      : "bg-cyan-950 text-cyan-300 border border-cyan-800/40"
                  }`}
                >
                  {res.status}
                </span>
              </div>

              {/* Storage Gauge */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Live Storage:</span>
                  <span className="font-mono font-bold text-sky-400">{res.current_storage_mcm} MCM ({storagePct.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      storagePct < 30 ? "bg-rose-500" : storagePct > 70 ? "bg-cyan-500" : "bg-sky-500"
                    }`}
                    style={{ width: `${Math.min(100, storagePct)}%` }}
                  />
                </div>
              </div>

              {/* Editable Storage Control */}
              <div className="pt-2 border-t border-slate-800/80">
                {isEditing ? (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Edit Storage:</span>
                      <span className="font-mono text-cyan-400 font-bold">{tempStorage} MCM</span>
                    </div>
                    <input
                      type="range"
                      min={res.min_reserve_mcm}
                      max={res.max_capacity_mcm}
                      step={10}
                      value={tempStorage}
                      onChange={(e) => setTempStorage(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(res.id)}
                        className="px-3 py-1 text-[11px] font-bold rounded-lg bg-cyan-500 text-ocean-950 hover:bg-cyan-400 flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save & Recompute</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(res.id, res.current_storage_mcm)}
                    className="w-full py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Adjust Live Storage</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div>Level: <span className="font-mono text-slate-200">{res.current_level_m}m</span></div>
                <div>Min Res: <span className="font-mono text-rose-400">{res.min_reserve_mcm}MCM</span></div>
                <div>Inflow: <span className="font-mono text-emerald-400">+{res.expected_inflow_mcm}MCM</span></div>
                <div>Outflow: <span className="font-mono text-amber-400">-{res.expected_outflow_mcm}MCM</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Water Level Trend Chart */}
      <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Hydraulic Elevation Levels (12-Month Historical Trajectory)</h3>
            <p className="text-xs text-slate-400">Seasonal water surface level elevation in meters above Mean Sea Level (MSL)</p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            Units: Meters (m)
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={levelHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
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
              <Line type="monotone" dataKey="Nagarjuna" name="Nagarjuna Sagar (m)" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Srisailam" name="Srisailam (m)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Pulichintala" name="Pulichintala (m)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Prakasam" name="Prakasam Barrage (m)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
