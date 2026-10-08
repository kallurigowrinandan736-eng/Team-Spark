"use client";

import React, { useState } from "react";
import { AllocationItem, Reservoir, Canal, Region, Crop } from "../lib/types";
import { Droplets, ArrowRight, Info } from "lucide-react";

interface AllocationFlowDiagramProps {
  allocations: AllocationItem[];
  reservoirs: Reservoir[];
  canals: Canal[];
  regions: Region[];
  crops: Crop[];
}

export const AllocationFlowDiagram: React.FC<AllocationFlowDiagramProps> = ({
  allocations,
  reservoirs,
  canals,
  regions,
  crops
}) => {
  const [selectedRoute, setSelectedRoute] = useState<AllocationItem | null>(null);

  // Group allocations by Reservoir
  const resTotals: Record<string, number> = {};
  const regionTotals: Record<string, number> = {};
  const cropTotals: Record<string, number> = {};

  allocations.forEach((a) => {
    resTotals[a.reservoir_id] = (resTotals[a.reservoir_id] || 0) + a.allocated_mcm;
    regionTotals[a.region_id] = (regionTotals[a.region_id] || 0) + a.delivered_mcm;
    cropTotals[a.crop_id] = (cropTotals[a.crop_id] || 0) + a.delivered_mcm;
  });

  return (
    <div className="w-full rounded-2xl bg-ocean-900/80 border border-slate-800 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Water Allocation Network Dispatch Flow</span>
          </h3>
          <p className="text-xs text-slate-400">
            Multi-stage conveyance from Reservoirs through Canals to Regional Crop Command Areas
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
          Units: MCM
        </span>
      </div>

      {/* Network Multi-Column Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {/* Col 1: Reservoirs */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider px-1">
            1. Reservoirs (Source)
          </div>
          {reservoirs.map((r) => {
            const rel = resTotals[r.id] || 0;
            return (
              <div
                key={r.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/30 hover:border-sky-400 transition-all shadow-sm"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200 truncate">{r.name.split(" ")[0]}</span>
                  <span className="font-mono text-sky-300 font-semibold">{rel.toFixed(1)} MCM</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Cap: {r.max_capacity_mcm}</span>
                  <span>Live: {r.current_storage_mcm}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Col 2: Canals */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider px-1">
            2. Canals (Conveyance)
          </div>
          {canals.slice(0, 5).map((c) => {
            const flow = allocations
              .filter((a) => a.canal_id === c.id)
              .reduce((s, a) => s + a.allocated_mcm, 0);
            const util = Math.min(100, (flow / Math.max(1, c.capacity_mcm)) * 100);
            return (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-sm"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200 truncate max-w-[110px]">{c.name}</span>
                  <span className="font-mono text-cyan-300 font-semibold">{flow.toFixed(1)}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      util > 85 ? "bg-amber-400" : "bg-cyan-500"
                    }`}
                    style={{ width: `${util}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Loss: {(c.loss_pct * 100).toFixed(0)}%</span>
                  <span>{util.toFixed(0)}% Load</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Col 3: Regions */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider px-1">
            3. Regions (Districts)
          </div>
          {regions.map((reg) => {
            const deliv = regionTotals[reg.id] || 0;
            return (
              <div
                key={reg.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400 transition-all shadow-sm"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{reg.name}</span>
                  <span className="font-mono text-indigo-300 font-semibold">{deliv.toFixed(1)} MCM</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Priority: Tier {reg.priority}</span>
                  <span>Area: {(reg.total_irrigated_area_ha / 1000).toFixed(0)}k ha</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Col 4: Crops */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider px-1">
            4. Crops (Command Areas)
          </div>
          {crops.slice(0, 5).map((cr) => {
            const deliv = cropTotals[cr.id] || 0;
            const sat = Math.min(100, (deliv / Math.max(0.1, cr.total_demand_mcm)) * 100);
            return (
              <div
                key={cr.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition-all shadow-sm"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{cr.crop}</span>
                  <span className="font-mono text-emerald-300 font-semibold">{sat.toFixed(0)}% Sat</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${sat}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Demand: {cr.total_demand_mcm}</span>
                  <span>Delivered: {deliv.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Allocation Matrix Summary Table */}
      <div className="mt-5 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-semibold text-slate-300 mb-2">Active Dispatch Routes</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ocean-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="px-3 py-2 rounded-l-lg">Reservoir</th>
                <th className="px-3 py-2">Canal</th>
                <th className="px-3 py-2">Region</th>
                <th className="px-3 py-2">Crop</th>
                <th className="px-3 py-2 text-right">Allocated</th>
                <th className="px-3 py-2 text-right">Loss</th>
                <th className="px-3 py-2 text-right">Delivered</th>
                <th className="px-3 py-2 text-right rounded-r-lg">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {allocations.slice(0, 6).map((a, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-3 py-2 font-medium text-sky-400">{a.reservoir_name.split(" ")[0]}</td>
                  <td className="px-3 py-2 text-slate-300 truncate max-w-[120px]">{a.canal_name}</td>
                  <td className="px-3 py-2 text-indigo-300">{a.region_name}</td>
                  <td className="px-3 py-2 text-emerald-300 font-semibold">{a.crop_name}</td>
                  <td className="px-3 py-2 text-right font-mono">{a.allocated_mcm.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right font-mono text-rose-400">-{a.loss_mcm.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-white">{a.delivered_mcm.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right font-mono text-emerald-400 font-bold">{a.satisfaction_pct.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
