"use client";

import React, { useState } from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { HonestyBadge } from "../../components/HonestyBadge";
import { AlertTriangle, ShieldCheck, CheckCircle2, Filter, Bell, Clock } from "lucide-react";

export default function AlertsPage() {
  const { alerts, acknowledgeAlert } = useWaterStore();
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;
    if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === "Critical").length;
  const warningCount = alerts.filter((a) => a.severity === "Warning").length;
  const normalCount = alerts.filter((a) => a.severity === "Normal").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-rose-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Smart Alerting System</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Active Hydrological & Operational Alerts</h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous threshold detection across reservoir storage, canal overloading, moisture stress, and drought anomalies
          </p>
        </div>
        <HonestyBadge type="demo" />
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-300 font-semibold uppercase">Critical Alerts</span>
            <div className="text-2xl font-black text-rose-400 mt-1">{criticalCount}</div>
            <span className="text-[11px] text-slate-400">Immediate action required</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-900/60 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-300 font-semibold uppercase">Warning Alerts</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{warningCount}</div>
            <span className="text-[11px] text-slate-400">Precautionary schedule adjustments</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-900/60 text-amber-400">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-300 font-semibold uppercase">Nominal Status</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{normalCount}</div>
            <span className="text-[11px] text-slate-400">Operating within safe buffer</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-900/60 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-ocean-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-semibold">Filter Severity:</span>
          {["all", "Critical", "Warning", "Normal"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                severityFilter === sev
                  ? "bg-cyan-400 text-ocean-950"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {sev.charAt(0).toUpperCase() + sev.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1 text-xs"
          >
            <option value="all">All Categories</option>
            <option value="Reservoir">Reservoirs</option>
            <option value="Canal">Canals</option>
            <option value="Crop">Crops</option>
            <option value="Weather">Weather & Inflow</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-ocean-900/80 border border-slate-800 text-center text-slate-400 text-xs">
            No alerts match the selected filters.
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-4 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                alt.acknowledged
                  ? "bg-slate-900/40 border-slate-800/40 opacity-60"
                  : alt.severity === "Critical"
                  ? "bg-rose-950/30 border-rose-500/40 shadow-sm"
                  : alt.severity === "Warning"
                  ? "bg-amber-950/30 border-amber-500/40 shadow-sm"
                  : "bg-ocean-900/80 border-slate-800"
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      alt.severity === "Critical"
                        ? "bg-rose-950 text-rose-300 border border-rose-800"
                        : alt.severity === "Warning"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    }`}
                  >
                    {alt.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-300">{alt.category}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-semibold text-cyan-400">{alt.entity_name}</span>
                </div>
                <p className="text-xs text-slate-200">{alt.message}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                  <span>Metric: {alt.metric}</span>
                  <span>Value: {alt.current_value}{alt.unit}</span>
                  <span>Threshold: {alt.threshold_value}{alt.unit}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {alt.timestamp}
                </span>
                {!alt.acknowledged ? (
                  <button
                    onClick={() => acknowledgeAlert(alt.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Acknowledge</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Acknowledged
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
