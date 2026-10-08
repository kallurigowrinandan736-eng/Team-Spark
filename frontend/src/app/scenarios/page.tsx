"use client";

import React, { useState, useEffect } from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { HonestyBadge } from "../../components/HonestyBadge";
import { Compass, Sliders, CheckCircle2, Play, Plus, Save, Sparkles, Activity } from "lucide-react";
import { ScenarioDefinition } from "../../lib/types";
import { api } from "../../lib/api";

export default function ScenariosPage() {
  const {
    scenarios, selectedScenario, setScenario,
    runOptimizationPipeline, addCustomScenario,
    comparison
  } = useWaterStore();

  const [rainfallFactor, setRainfallFactor] = useState<number>(1.0);
  const [tempDelta, setTempDelta] = useState<number>(0.0);
  const [demandFactor, setDemandFactor] = useState<number>(1.0);
  const [storageFactor, setStorageFactor] = useState<number>(1.0);
  const [canalFactor, setCanalFactor] = useState<number>(1.0);

  // What-If live output state
  const [whatIfResults, setWhatIfResults] = useState<{
    total_available_mcm: number;
    total_demand_mcm: number;
    estimated_satisfaction_pct: number;
    deficit_mcm: number;
  }>({
    total_available_mcm: 9762.0,
    total_demand_mcm: 1395.0,
    estimated_satisfaction_pct: 84.5,
    deficit_mcm: 215.0
  });

  // Custom scenario creation modal state
  const [customName, setCustomName] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Debounced live what-if simulation
  useEffect(() => {
    const timer = setTimeout(async () => {
      const res = await api.runWhatIf({
        rainfall_factor: rainfallFactor,
        temperature_delta_c: tempDelta,
        demand_factor: demandFactor,
        reservoir_storage_factor: storageFactor,
        canal_efficiency_factor: canalFactor
      });
      if (res) {
        setWhatIfResults({
          total_available_mcm: res.total_available_mcm,
          total_demand_mcm: res.total_demand_mcm,
          estimated_satisfaction_pct: res.estimated_satisfaction_pct,
          deficit_mcm: res.deficit_mcm
        });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [rainfallFactor, tempDelta, demandFactor, storageFactor, canalFactor]);

  const handleApplyWhatIfAsScenario = () => {
    const customSc: ScenarioDefinition = {
      id: `custom_${Date.now()}`,
      name: "Custom What-If Scenario",
      description: `Rainfall x${rainfallFactor}, Temp +${tempDelta}°C, Demand x${demandFactor}, Storage x${storageFactor}`,
      rainfall_factor: rainfallFactor,
      storage_factor: storageFactor,
      inflow_factor: rainfallFactor * 1.1,
      demand_factor: demandFactor,
      canal_capacity_factor: canalFactor,
      temperature_delta_c: tempDelta
    };
    setScenario(customSc);
  };

  const handleSaveCustom = () => {
    if (!customName) return;
    const newSc: ScenarioDefinition = {
      id: `custom_${Date.now()}`,
      name: customName,
      description: customDesc || "User defined custom operational scenario",
      rainfall_factor: rainfallFactor,
      storage_factor: storageFactor,
      inflow_factor: rainfallFactor * 1.1,
      demand_factor: demandFactor,
      canal_capacity_factor: canalFactor,
      temperature_delta_c: tempDelta
    };
    addCustomScenario(newSc);
    setScenario(newSc);
    setModalOpen(false);
    setCustomName("");
    setCustomDesc("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-indigo-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Simulation Studio</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Scenario Simulator & Live What-If Analysis</h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate climate stress, droughts, monsoon surges, infrastructure bottlenecks, and custom hydrologic policies
          </p>
        </div>
        <HonestyBadge type="demo" />
      </div>

      {/* Preset Scenarios Grid (A - F) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Preset Operational Scenarios</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => setScenario(sc)}
                className={`p-5 rounded-2xl border backdrop-blur-md cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "bg-cyan-950/40 border-cyan-500/60 shadow-glow-cyan"
                    : "bg-ocean-900/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-white">{sc.name}</h4>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{sc.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                  <span>Rain: x{sc.rainfall_factor}</span>
                  <span>Storage: x{sc.storage_factor}</span>
                  <span>Demand: x{sc.demand_factor}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live What-If Sensitivity Sliders */}
      <div className="p-6 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Real-Time What-If Sensitivity Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Drag parameters to evaluate instantaneous system response on water demand, availability, and satisfaction
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-cyan-400" />
              <span>Save Scenario</span>
            </button>
            <button
              onClick={handleApplyWhatIfAsScenario}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-ocean-950 bg-cyan-400 hover:bg-cyan-300 flex items-center gap-1.5 shadow-glow-cyan"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Apply & Optimize</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Feedback */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">Available Water</span>
            <div className="text-lg font-bold text-sky-400 font-mono mt-0.5">
              {whatIfResults.total_available_mcm.toFixed(0)} MCM
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">Total Irrigation Demand</span>
            <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5">
              {whatIfResults.total_demand_mcm.toFixed(0)} MCM
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">Est. Satisfaction</span>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
              {whatIfResults.estimated_satisfaction_pct.toFixed(1)}%
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">System Deficit</span>
            <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">
              {whatIfResults.deficit_mcm.toFixed(0)} MCM
            </div>
          </div>
        </div>

        {/* Sliders Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Rainfall */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold">Monsoon Rainfall Multiplier</span>
              <span className="font-mono text-cyan-400 font-bold">{rainfallFactor.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={2.5}
              step={0.05}
              value={rainfallFactor}
              onChange={(e) => setRainfallFactor(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Temperature */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold">Temperature Delta (ET0 Effect)</span>
              <span className="font-mono text-cyan-400 font-bold">
                {tempDelta > 0 ? `+${tempDelta.toFixed(1)}` : tempDelta.toFixed(1)}°C
              </span>
            </div>
            <input
              type="range"
              min={-3.0}
              max={6.0}
              step={0.5}
              value={tempDelta}
              onChange={(e) => setTempDelta(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Crop Demand Factor */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold">Crop Acreage / Demand Factor</span>
              <span className="font-mono text-cyan-400 font-bold">{demandFactor.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.05}
              value={demandFactor}
              onChange={(e) => setDemandFactor(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Reservoir Storage */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold">Reservoir Storage Scale</span>
              <span className="font-mono text-cyan-400 font-bold">{storageFactor.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.3}
              max={1.2}
              step={0.05}
              value={storageFactor}
              onChange={(e) => setStorageFactor(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Canal Capacity / Loss */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold">Canal Conveying Capacity</span>
              <span className="font-mono text-cyan-400 font-bold">{canalFactor.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.4}
              max={1.2}
              step={0.05}
              value={canalFactor}
              onChange={(e) => setCanalFactor(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Save Custom Scenario Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-ocean-900 border border-slate-700 shadow-glass space-y-4">
            <h3 className="text-base font-bold text-white">Save Custom Simulation Scenario</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Scenario Name</label>
                <input
                  type="text"
                  placeholder="e.g. Extreme Summer Heatwave & 40% Deficit"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Description</label>
                <textarea
                  placeholder="Describe the environmental conditions..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white h-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustom}
                disabled={!customName}
                className="px-4 py-2 rounded-xl text-xs font-bold text-ocean-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
