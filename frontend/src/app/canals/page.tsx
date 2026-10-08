"use client";

import React from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { HonestyBadge } from "../../components/HonestyBadge";
import { GitBranch, Activity, Droplets, AlertCircle, ArrowRight } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend
} from "recharts";

export default function CanalsPage() {
  const { canals, reservoirs, regions, comparison } = useWaterStore();
  const opt = comparison?.classical;

  const resNameMap = Object.fromEntries(reservoirs.map((r) => [r.id, r.name.split(" ")[0]]));
  const regNameMap = Object.fromEntries(regions.map((reg) => [reg.id, reg.name]));

  // Canal performance chart data
  const canalChartData = canals.map((c) => {
    const allocatedFlow = opt?.allocations
      .filter((a) => a.canal_id === c.id)
      .reduce((s, a) => s + a.allocated_mcm, 0) || c.current_flow_mcm;
    const lossMcm = allocatedFlow * c.loss_pct;
    const deliveredMcm = allocatedFlow - lossMcm;

    return {
      name: c.name.split(" ")[0] + " " + (c.name.split(" ")[1] || ""),
      capacity: c.capacity_mcm,
      allocated: Number(allocatedFlow.toFixed(1)),
      delivered: Number(deliveredMcm.toFixed(1)),
      loss: Number(lossMcm.toFixed(1))
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-cyan-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Conveyance Infrastructure</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Canal Network Conveyance & Seepage Analysis</h1>
          <p className="text-xs text-slate-400 mt-1">
            Hydraulic flow capacities, transit conveyance loss percentages, and channel utilization tracking
          </p>
        </div>
        <HonestyBadge type="demo" />
      </div>

      {/* Visual Canal Network Diagram (SVG Node-Link Architecture) */}
      <div className="p-6 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>Hydraulic Network Topology & Conveyance Corridors</span>
            </h3>
            <p className="text-xs text-slate-400">Canal reach status, design throughput, and conveyance efficiency</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
            {canals.length} Active Corridors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {canals.map((c) => {
            const flow = opt?.allocations
              .filter((a) => a.canal_id === c.id)
              .reduce((s, a) => s + a.allocated_mcm, 0) || c.current_flow_mcm;
            const util = Math.min(100, (flow / Math.max(1, c.capacity_mcm)) * 100);
            const isHighLoss = c.loss_pct >= 0.14;

            return (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-xs text-slate-200 truncate">{c.name}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      util > 85 ? "bg-amber-950 text-amber-300 border border-amber-800" : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                    }`}
                  >
                    {util.toFixed(0)}% Load
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-sky-300 font-semibold">{resNameMap[c.source_reservoir_id]}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className="text-indigo-300 font-semibold">{regNameMap[c.destination_region_id]}</span>
                </div>

                {/* Utilization Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Throughput: {flow.toFixed(1)} / {c.capacity_mcm} MCM</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${util > 85 ? "bg-amber-400" : "bg-cyan-500"}`}
                      style={{ width: `${util}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[11px] pt-1 border-t border-slate-800/80">
                  <span className={`font-medium ${isHighLoss ? "text-rose-400" : "text-slate-400"}`}>
                    Loss: {(c.loss_pct * 100).toFixed(1)}%
                  </span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    {(c.efficiency * 100).toFixed(0)}% Eff
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Canal Flow vs Capacity Bar Chart */}
      <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Canal Design Capacity vs Allocated Throughput</h3>
            <p className="text-xs text-slate-400">Allocated volume, net delivered water, and transit conveyance seepage</p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={canalChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              <Bar dataKey="capacity" name="Max Capacity (MCM)" fill="#475569" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delivered" name="Net Delivered (MCM)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="loss" name="Seepage Loss (MCM)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comprehensive Canal Table */}
      <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md overflow-x-auto">
        <h3 className="text-sm font-bold text-white mb-3">Canal Conveyance Register</h3>
        <table className="w-full text-left text-xs">
          <thead className="bg-ocean-950 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="px-3 py-2 rounded-l-lg">Canal Identifier</th>
              <th className="px-3 py-2">Source Reservoir</th>
              <th className="px-3 py-2">Destination District</th>
              <th className="px-3 py-2 text-right">Max Capacity</th>
              <th className="px-3 py-2 text-right">Allocated Flow</th>
              <th className="px-3 py-2 text-right">Seepage Loss</th>
              <th className="px-3 py-2 text-right">Efficiency</th>
              <th className="px-3 py-2 rounded-r-lg">Operational Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {canals.map((c) => {
              const flow = opt?.allocations
                .filter((a) => a.canal_id === c.id)
                .reduce((s, a) => s + a.allocated_mcm, 0) || c.current_flow_mcm;
              return (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-3 py-2.5 font-bold text-white">{c.name}</td>
                  <td className="px-3 py-2.5 text-sky-400">{resNameMap[c.source_reservoir_id]}</td>
                  <td className="px-3 py-2.5 text-indigo-300">{regNameMap[c.destination_region_id]}</td>
                  <td className="px-3 py-2.5 text-right font-mono">{c.capacity_mcm} MCM</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-cyan-300">{flow.toFixed(1)} MCM</td>
                  <td className="px-3 py-2.5 text-right font-mono text-rose-400">{(c.loss_pct * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2.5 text-right font-mono text-emerald-400">{(c.efficiency * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      {c.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
