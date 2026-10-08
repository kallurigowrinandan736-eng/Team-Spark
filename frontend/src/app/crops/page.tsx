"use client";

import React, { useState } from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { HonestyBadge } from "../../components/HonestyBadge";
import { Sprout, Edit3, Check, Sparkles, Filter } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend
} from "recharts";

export default function CropsPage() {
  const { crops, regions, updateCrop, runOptimizationPipeline, comparison } = useWaterStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempDemand, setTempDemand] = useState<number>(0);
  const [tempPriority, setTempPriority] = useState<number>(3);
  const [filterRegion, setFilterRegion] = useState<string>("all");

  const regNameMap = Object.fromEntries(regions.map((r) => [r.id, r.name]));
  const opt = comparison?.classical;

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setTempDemand(c.total_demand_mcm);
    setTempPriority(c.priority);
  };

  const saveEdit = (id: string) => {
    updateCrop(id, { total_demand_mcm: tempDemand, priority: tempPriority });
    setEditingId(null);
    runOptimizationPipeline();
  };

  const filteredCrops = filterRegion === "all" ? crops : crops.filter((c) => c.region_id === filterRegion);

  const cropSummaryChartData = crops.map((c) => {
    const delivered = opt?.allocations
      .filter((a) => a.crop_id === c.id)
      .reduce((s, a) => s + a.delivered_mcm, 0) || c.current_allocation_mcm;

    return {
      name: `${c.crop} (${regNameMap[c.region_id]?.split(" ")[0]})`,
      demand: c.total_demand_mcm,
      delivered: Number(delivered.toFixed(1)),
      deficit: Number(Math.max(0, c.total_demand_mcm - delivered).toFixed(1))
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-emerald-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Agricultural Demand</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Crop Command Areas & Irrigation Demand</h1>
          <p className="text-xs text-slate-400 mt-1">
            7 crop types across 5 command districts with inline demand and priority sensitivity editing
          </p>
        </div>
        <HonestyBadge type="demo" />
      </div>

      {/* Crop Satisfaction Breakdown Chart */}
      <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Crop Demand vs Allocated Delivered Water</h3>
            <p className="text-xs text-slate-400">Total volumetric demand (MCM) against net delivered irrigation</p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            10 Command Zones
          </span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cropSummaryChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
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
              <Bar dataKey="demand" name="Total Demand (MCM)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delivered" name="Delivered Water (MCM)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="deficit" name="Deficit Shortage (MCM)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Command Table */}
      <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Crop Command Area Water Register</h3>
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1 text-xs"
            >
              <option value="all">All Districts</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ocean-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="px-3 py-2 rounded-l-lg">Crop</th>
                <th className="px-3 py-2">District</th>
                <th className="px-3 py-2">Growth Stage</th>
                <th className="px-3 py-2 text-right">Area (ha)</th>
                <th className="px-3 py-2 text-right">Base Req (mm)</th>
                <th className="px-3 py-2 text-center">Priority</th>
                <th className="px-3 py-2 text-right">Total Demand</th>
                <th className="px-3 py-2 text-right">Allocated</th>
                <th className="px-3 py-2 text-right">Deficit</th>
                <th className="px-3 py-2 rounded-r-lg text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCrops.map((c) => {
                const isEditing = editingId === c.id;
                const delivered = opt?.allocations
                  .filter((a) => a.crop_id === c.id)
                  .reduce((s, a) => s + a.delivered_mcm, 0) || c.current_allocation_mcm;
                const deficit = Math.max(0, c.total_demand_mcm - delivered);

                return (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-3 py-3 font-bold text-white flex items-center gap-1.5">
                      <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{c.crop}</span>
                    </td>
                    <td className="px-3 py-3 text-indigo-300">{regNameMap[c.region_id]}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {c.growth_stage}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono">{c.area_ha.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-400">{c.base_water_requirement_mm} mm</td>
                    <td className="px-3 py-3 text-center">
                      {isEditing ? (
                        <select
                          value={tempPriority}
                          onChange={(e) => setTempPriority(Number(e.target.value))}
                          className="bg-slate-900 border border-slate-700 text-cyan-300 rounded px-1 text-xs"
                        >
                          {[1, 2, 3, 4, 5].map((p) => (
                            <option key={p} value={p}>Tier {p}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-quantum-950 text-quantum-300 border border-quantum-800/40">
                          Tier {c.priority}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-white">
                      {isEditing ? (
                        <input
                          type="number"
                          value={tempDemand}
                          onChange={(e) => setTempDemand(Number(e.target.value))}
                          className="w-16 bg-slate-900 border border-cyan-500 rounded px-1 text-right text-xs text-cyan-300"
                        />
                      ) : (
                        <span>{c.total_demand_mcm} MCM</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-emerald-400 font-bold">
                      {delivered.toFixed(1)} MCM
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-rose-400 font-semibold">
                      {deficit.toFixed(1)} MCM
                    </td>
                    <td className="px-3 py-3 text-center">
                      {isEditing ? (
                        <button
                          onClick={() => saveEdit(c.id)}
                          className="px-2 py-1 bg-cyan-500 text-ocean-950 rounded-lg text-[10px] font-bold hover:bg-cyan-400 flex items-center gap-1 mx-auto"
                        >
                          <Check className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(c)}
                          className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors"
                          title="Edit Demand & Priority"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
