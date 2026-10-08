"use client";

import React from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { KpiCard } from "../../components/KpiCard";
import { HonestyBadge } from "../../components/HonestyBadge";
import { AllocationFlowDiagram } from "../../components/AllocationFlowDiagram";
import {
  Droplets, Database, Sprout, TrendingUp,
  AlertTriangle, ShieldCheck, Activity, BarChart3,
  Sliders, ArrowUpRight
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, AreaChart, Area,
  PieChart, Pie, Cell
} from "recharts";
import Link from "next/link";

const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#38bdf8", "#ec4899", "#6366f1"];

export default function DashboardPage() {
  const {
    reservoirs, canals, crops, regions,
    comparison, alerts, inflowForecasts,
    selectedScenario
  } = useWaterStore();

  const opt = comparison?.classical;
  const metrics = opt?.metrics;

  const totalCapacity = reservoirs.reduce((s, r) => s + r.max_capacity_mcm, 0);
  const totalStorage = reservoirs.reduce((s, r) => s + r.current_storage_mcm, 0);
  const totalInflow = reservoirs.reduce((s, r) => s + r.expected_inflow_mcm, 0);
  const totalDemand = crops.reduce((s, c) => s + c.total_demand_mcm, 0);
  const totalDelivered = metrics?.total_delivered_mcm || 1180.0;
  const totalShortage = metrics?.total_shortage_mcm || Math.max(0, totalDemand - totalDelivered);
  const avgSatisfaction = metrics?.demand_satisfaction_pct || 84.5;
  const fairnessIndex = metrics?.jains_fairness_index || 0.962;

  // Chart 1: Reservoir Storage Levels vs Min Reserve
  const reservoirData = reservoirs.map((r) => ({
    name: r.name.split(" ")[0],
    storage: r.current_storage_mcm,
    minReserve: r.min_reserve_mcm,
    maxCap: r.max_capacity_mcm,
    status: r.status
  }));

  // Chart 2: Demand vs Delivered by Region
  const regionData = regions.map((reg) => {
    const regDemand = crops
      .filter((c) => c.region_id === reg.id)
      .reduce((s, c) => s + c.total_demand_mcm, 0);
    const regDelivered = opt?.allocations
      .filter((a) => a.region_id === reg.id)
      .reduce((s, a) => s + a.delivered_mcm, 0) || regDemand * 0.85;

    return {
      name: reg.name,
      demand: Number(regDemand.toFixed(1)),
      delivered: Number(regDelivered.toFixed(1))
    };
  });

  // Chart 3: Crop Allocation Share for Donut
  const cropShareData = crops.map((c) => {
    const deliv = opt?.allocations
      .filter((a) => a.crop_id === c.id)
      .reduce((s, a) => s + a.delivered_mcm, 0) || c.current_allocation_mcm;
    return {
      name: `${c.crop} (${c.region_id})`,
      value: Number(deliv.toFixed(1))
    };
  });

  // Chart 4: Inflow Forecast with Confidence Intervals
  const inflowData = (inflowForecasts?.forecasts || reservoirs.map((r) => ({
    reservoir_name: r.name.split(" ")[0],
    p10_inflow_mcm: r.expected_inflow_mcm * 0.75,
    p50_inflow_mcm: r.expected_inflow_mcm,
    p90_inflow_mcm: r.expected_inflow_mcm * 1.35
  }))).map((f) => ({
    name: f.reservoir_name.split(" ")[0],
    P10: f.p10_inflow_mcm,
    P50: f.p50_inflow_mcm,
    P90: f.p90_inflow_mcm
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-cyan-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Operations Center
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold text-slate-300">
              {selectedScenario.name.split(":")[0]}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Krishna Basin Water Resource & Allocation Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-reservoir hydrological balancing, canal conveyance routing, and AI crop demand satisfaction
          </p>
        </div>

        <div className="flex items-center gap-3">
          <HonestyBadge type="demo" />
          <Link
            href="/optimization"
            className="px-4 py-2 rounded-xl text-xs font-bold text-ocean-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-1 shadow-glow-cyan"
          >
            <span>Adjust Weights</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Active Live Storage"
          value={totalStorage.toFixed(0)}
          unit="MCM"
          subtitle={`Max ${totalCapacity} MCM`}
          icon={Database}
          variant="blue"
        />
        <KpiCard
          title="Predicted Inflow"
          value={totalInflow.toFixed(0)}
          unit="MCM"
          subtitle="30-Day Catchment Runoff"
          icon={Droplets}
          variant="cyan"
        />
        <KpiCard
          title="Crop Water Demand"
          value={totalDemand.toFixed(0)}
          unit="MCM"
          subtitle="10 Crop Command Zones"
          icon={Sprout}
          variant="purple"
        />
        <KpiCard
          title="Allocated Delivered"
          value={totalDelivered.toFixed(0)}
          unit="MCM"
          subtitle={`${avgSatisfaction.toFixed(1)}% Satisfied`}
          icon={TrendingUp}
          variant="emerald"
          delta={{ value: "+18.5%", isPositive: true, text: "vs baseline" }}
        />
        <KpiCard
          title="System Deficit"
          value={totalShortage.toFixed(0)}
          unit="MCM"
          subtitle="Shortage Gap"
          icon={AlertTriangle}
          variant="rose"
        />
        <KpiCard
          title="Jain's Fairness"
          value={fairnessIndex.toFixed(3)}
          subtitle="District Equity Index"
          icon={ShieldCheck}
          variant="emerald"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Reservoir Storage Levels */}
        <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Reservoir Live Storage vs Minimum Reserve</h3>
              <p className="text-xs text-slate-400">Current storage levels (MCM) against ecological reserve floors</p>
            </div>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
              4 Active Basins
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reservoirData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
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
                <Bar dataKey="storage" name="Current Storage (MCM)" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="minReserve" name="Min Ecological Reserve (MCM)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Demand vs Delivered by Region */}
        <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Regional Irrigation Demand vs Delivered</h3>
              <p className="text-xs text-slate-400">Delivered volume per district after canal conveyance loss</p>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
              5 Districts
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
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
                <Bar dataKey="demand" name="Total Demand (MCM)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="delivered" name="Delivered Water (MCM)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Network Dispatch Flow Diagram */}
      <AllocationFlowDiagram
        allocations={opt?.allocations || []}
        reservoirs={reservoirs}
        canals={canals}
        regions={regions}
        crops={crops}
      />

      {/* Secondary Charts: Inflow Quantiles & Crop Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inflow Uncertainty Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Probabilistic Catchment Inflow Forecast</h3>
              <p className="text-xs text-slate-400">P10 (Low), P50 (Expected Median), and P90 (High) inflow quantiles</p>
            </div>
            <HonestyBadge type="simulated-ml" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inflowData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
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
                <Area type="monotone" dataKey="P90" name="P90 High Inflow (MCM)" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} />
                <Area type="monotone" dataKey="P50" name="P50 Expected Inflow (MCM)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.35} />
                <Area type="monotone" dataKey="P10" name="P10 Low Inflow (MCM)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Share Donut Chart */}
        <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white">Crop Water Share</h3>
              <p className="text-xs text-slate-400">Distribution by crop & district</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropShareData.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {cropShareData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    fontSize: "11px",
                    color: "#e2e8f0"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400 mt-1">
            {cropShareData.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="truncate">{c.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Active Operational Alerts ({alerts.length})</h3>
          </div>
          <Link href="/alerts" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
            View All Alerts →
          </Link>
        </div>
        <div className="space-y-2">
          {alerts.slice(0, 3).map((alt) => (
            <div
              key={alt.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    alt.severity === "Critical"
                      ? "bg-rose-950 text-rose-300 border border-rose-800/40"
                      : alt.severity === "Warning"
                      ? "bg-amber-950 text-amber-300 border border-amber-800/40"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                  }`}
                >
                  {alt.severity}
                </span>
                <span className="font-semibold text-slate-200">{alt.entity_name}:</span>
                <span className="text-slate-400">{alt.message}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{alt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
