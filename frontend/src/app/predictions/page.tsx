"use client";

import React, { useState } from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { HonestyBadge } from "../../components/HonestyBadge";
import { BrainCircuit, Cpu, Droplets, Calendar, BarChart2, ShieldAlert, Sparkles } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, AreaChart, Area
} from "recharts";

export default function PredictionsPage() {
  const { demandPredictions, inflowForecasts, reservoirs } = useWaterStore();
  const [activeTab, setActiveTab] = useState<"demand" | "inflow">("demand");
  const [horizon, setHorizon] = useState<number>(30);

  const scale = horizon / 30;

  // Demand predictions chart data
  const demandData = (demandPredictions?.predictions || []).map((p) => ({
    name: `${p.crop_name} (${p.region_name.split(" ")[0]})`,
    current: Number((p.current_demand_mcm * scale).toFixed(1)),
    predicted: Number((p.predicted_demand_mcm * scale).toFixed(1)),
    lower: Number((p.confidence_lower_mcm * scale).toFixed(1)),
    upper: Number((p.confidence_upper_mcm * scale).toFixed(1))
  }));

  // Feature importance data
  const featData = demandPredictions?.feature_importance || [
    { feature: "Cultivated Area (ha)", importance: 0.42 },
    { feature: "Evapotranspiration (ET0)", importance: 0.28 },
    { feature: "Temperature (°C)", importance: 0.15 },
    { feature: "Rainfall (mm)", importance: 0.09 },
    { feature: "Soil Moisture (%)", importance: 0.06 }
  ];

  // Inflow forecast chart data
  const inflowData = (inflowForecasts?.forecasts || reservoirs.map((r) => ({
    reservoir_name: r.name.split(" ")[0],
    p10_inflow_mcm: r.expected_inflow_mcm * 0.75,
    p50_inflow_mcm: r.expected_inflow_mcm,
    p90_inflow_mcm: r.expected_inflow_mcm * 1.35,
    historical_avg_mcm: r.expected_inflow_mcm * 0.95
  }))).map((f) => ({
    name: f.reservoir_name.split(" ")[0],
    P10: Number((f.p10_inflow_mcm * scale).toFixed(1)),
    P50: Number((f.p50_inflow_mcm * scale).toFixed(1)),
    P90: Number((f.p90_inflow_mcm * scale).toFixed(1)),
    Historical: Number((f.historical_avg_mcm * scale).toFixed(1))
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-cyan-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Machine Learning Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Water Demand & Inflow Prediction Studio</h1>
          <p className="text-xs text-slate-400 mt-1">
            FAO-56 Penman-Monteith crop demand modeling and probabilistic reservoir inflow quantile forecasting
          </p>
        </div>
        <HonestyBadge type="simulated-ml" />
      </div>

      {/* Horizon Selector and Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-ocean-900/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("demand")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "demand"
                ? "bg-gradient-to-r from-cyan-500 to-water-500 text-white shadow-glow-cyan"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Crop Demand Prediction (GBR)
          </button>
          <button
            onClick={() => setActiveTab("inflow")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "inflow"
                ? "bg-gradient-to-r from-quantum-600 to-indigo-600 text-white shadow-glow-purple"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Reservoir Inflow Forecasting (RF)
          </button>
        </div>

        {/* Horizon Tabs */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Forecast Horizon:
          </span>
          {[7, 30, 90].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                horizon === h
                  ? "bg-cyan-400 text-ocean-950 font-extrabold shadow-sm"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              {h} Days
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Water Demand Prediction */}
      {activeTab === "demand" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Model Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Model Architecture</span>
              <div className="text-lg font-bold text-white mt-1">GradientBoosting Regressor</div>
              <span className="text-[11px] text-cyan-400">120 Estimators, Max Depth 4</span>
            </div>
            <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Validation Accuracy (R²)</span>
              <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">
                {demandPredictions?.model_metrics.r2_score || 0.941}
              </div>
              <span className="text-[11px] text-slate-400">High Agronomic Generalization</span>
            </div>
            <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Mean Absolute Error (MAE)</span>
              <div className="text-lg font-bold text-cyan-400 mt-1 font-mono">
                ±{demandPredictions?.model_metrics.mae || 4.82} MCM
              </div>
              <span className="text-[11px] text-slate-400">RMSE: {demandPredictions?.model_metrics.rmse || 6.45} MCM</span>
            </div>
          </div>

          {/* Demand Prediction Chart */}
          <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Crop Demand: Current vs Predicted ({horizon}-Day Forecast)</h3>
                <p className="text-xs text-slate-400">Predicted crop evapotranspiration demand (MCM) across command areas</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  <Bar dataKey="current" name="Current Baseline (MCM)" fill="#475569" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted" name="AI Predicted Demand (MCM)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Importance */}
          <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white mb-3">Model Feature Importance (Agronomic Key Drivers)</h3>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featData} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" fontSize={10} domain={[0, 0.5]} />
                  <YAxis dataKey="feature" type="category" stroke="#cbd5e1" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#e2e8f0"
                    }}
                  />
                  <Bar dataKey="importance" name="Relative Weight" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reservoir Inflow Forecasting */}
      {activeTab === "inflow" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Model Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Model Architecture</span>
              <div className="text-lg font-bold text-white mt-1">RandomForest Quantile Forecaster</div>
              <span className="text-[11px] text-quantum-400">100 Trees with Residual Estimator</span>
            </div>
            <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Validation Accuracy (R²)</span>
              <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">
                {inflowForecasts?.model_metrics.r2_score || 0.915}
              </div>
              <span className="text-[11px] text-slate-400">Seasonal Catchment Tracking</span>
            </div>
            <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Quantile Confidence Bounds</span>
              <div className="text-lg font-bold text-cyan-400 mt-1">P10 — P50 — P90</div>
              <span className="text-[11px] text-slate-400">Hydrological Uncertainty Envelope</span>
            </div>
          </div>

          {/* Inflow Quantile Area Chart */}
          <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Reservoir Inflow Forecast with P10/P50/P90 Uncertainty Envelope</h3>
                <p className="text-xs text-slate-400">{horizon}-day probabilistic inflow projections for upstream catchment runoff</p>
              </div>
            </div>
            <div className="h-72 w-full">
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
                  <Area type="monotone" dataKey="P90" name="P90 Upper Inflow (MCM)" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="P50" name="P50 Expected Inflow (MCM)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.35} />
                  <Area type="monotone" dataKey="P10" name="P10 Lower Inflow (MCM)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
