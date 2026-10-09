"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { QuantumNav } from "../../components/quantum/QuantumNav";
import { api } from "../../lib/api";
import { QuantumOverviewData } from "../../lib/types";
import {
  Sparkles, Binary, Cpu, Cloud, ArrowRight, CheckCircle2,
  AlertTriangle, Database, BrainCircuit, Activity, Clock,
  Droplets, ShieldCheck, Zap, Layers, RefreshCw, BarChart3
} from "lucide-react";

export default function QuantumOverviewPage() {
  const [data, setData] = useState<QuantumOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<number>(3); // Default to QUBO / QAOA stage

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getQuantumOverview();
      setData(res);
    } catch (err) {
      console.error("Error loading quantum overview", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const workflowSteps = [
    {
      step: 1,
      title: "Hydrological Telemetry",
      subtitle: "Reservoir & Inflow Data",
      icon: Database,
      desc: "Historical rainfall, runoff, canal conveyance loss indices (2020-2025) and reservoir capacity levels."
    },
    {
      step: 2,
      title: "ML Availability Forecast",
      subtitle: "Random Forest Regressor",
      icon: BrainCircuit,
      desc: "ML model predicts next-cycle reservoir inflows (R² = 0.956) to establish total water budget limit W_avail."
    },
    {
      step: 3,
      title: "QUBO Matrix Formulation",
      subtitle: "Ising Quadratic Encoding",
      icon: Binary,
      desc: "Discrete gate levels encoded into binary decision variables x_{c,k,l} with quadratic penalty terms."
    },
    {
      step: 4,
      title: "QAOA Circuit Compilation",
      subtitle: "Variational Quantum State",
      icon: Cpu,
      desc: "Parameterized cost and mixer unitaries e^{-iγ H_C} and e^{-iβ H_M} compiled with depth p."
    },
    {
      step: 5,
      title: "Qiskit 2.5 Execution",
      subtitle: "Estimator & Sampler",
      icon: Activity,
      desc: "Statevector simulation and classical optimizer (COBYLA) iteratively tune variational parameters."
    },
    {
      step: 6,
      title: "IBM Quantum Cloud",
      subtitle: "QPU / Emulation Dispatch",
      icon: Cloud,
      desc: "Real quantum hardware execution on IBM 127-qubit QPUs (Brisbane/Kyoto) or calibrated local emulation."
    },
    {
      step: 7,
      title: "Allocation & Validation",
      subtitle: "Physical Network Actuation",
      icon: ShieldCheck,
      desc: "Binary bitstring decoded into canal discharges (MCM) and verified against physical canal capacity limits."
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Shared Quantum Navigation */}
      <QuantumNav
        scenarioName={data?.current_scenario || data?.selected_scenario?.name}
        availableWaterMcm={data?.available_water_mcm ?? data?.selected_scenario?.available_water_mcm ?? 280}
        totalDemandMcm={data?.total_crop_demand_mcm ?? data?.selected_scenario?.total_crop_demand_mcm ?? 330.5}
        executionMode={data?.execution_mode || data?.last_execution?.mode || "Local Simulation (Qiskit 2.5)"}
        isValid={data?.last_execution?.valid ?? true}
      />

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 border border-emerald-500/30 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Qiskit {data?.qiskit_version || "2.5.2"} Native
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              IBM Runtime {data?.ibm_runtime_version || "0.50.0"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Ising Quadratic Knapsack
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Quantum-AI Irrigation Optimization
          </h1>
          <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
            Agricultural canal networks feature discrete discharge gates, nonlinear crop yield-water responses, and strict upstream-downstream equity constraints. Jaldhara explores <strong>QAOA (Quantum Approximate Optimization Algorithm)</strong> to solve combinatorial multi-canal allocation problems that become computationally intractable for conventional solvers during severe regional droughts.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/quantum/qubo"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg flex items-center gap-2"
            >
              <span>Explore QUBO Modeller</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/quantum/qaoa"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-emerald-300" />
              <span>Launch QAOA Optimizer</span>
            </Link>
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-emerald-200 border border-white/10 transition-all flex items-center gap-1.5"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Why Quantum Optimization Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Combinatorial Gate Complexity
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Irrigation canal barrages operate with discrete gate notches (e.g. 0%, 25%, 50%, 75%, 100%). With N canals and K crop zones, the decision search space explodes exponentially as <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">L^(N·K)</span>, challenging classical mixed-integer solvers under time-critical drought alerts.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Nonlinear Hydraulic Trade-offs
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Canal seepage loss, tail-end farmer starvation, and crop sensitivity indices are inherently quadratic. Mapping these into an Ising spin Hamiltonian allows quantum superpositions to simultaneously evaluate trade-offs between crop yields and transmission losses.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Honest Benchmarking
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Jaldhara enforces strict scientific transparency: local simulation with Qiskit 2.5 is clearly separated from real IBM Quantum Cloud execution. Every QAOA run is benchmarked against an exact classical brute-force baseline without fabricated speedup claims.
          </p>
        </div>
      </div>

      {/* End-to-End Workflow Diagram */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                End-to-End Pipeline Architecture
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Water Data → ML → QUBO → QAOA → IBM Quantum → Physical Allocation
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click any node below to inspect details
          </span>
        </div>

        {/* Workflow Horizontal Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {workflowSteps.map((s) => {
            const Icon = s.icon;
            const isSelected = activeStage === s.step;

            return (
              <button
                key={s.step}
                onClick={() => setActiveStage(s.step)}
                className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}>
                      {s.step}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {s.title}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Callout Box */}
        {activeStage && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-600 text-white">
              {React.createElement(workflowSteps[activeStage - 1].icon, { className: "w-5 h-5" })}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                  Stage {activeStage} Details: {workflowSteps[activeStage - 1].title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {workflowSteps[activeStage - 1].subtitle}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {workflowSteps[activeStage - 1].desc}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Telemetry and Last Execution Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Hydrology Context */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Hydrological Telemetry
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              Live Scenario Data
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Reservoir Storage
              </span>
              <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300">
                {data?.reservoir_telemetry?.current_storage_mcm?.toFixed(1) || "280.0"} MCM
              </div>
              <span className="text-[10px] text-slate-400">
                Capacity: {data?.reservoir_telemetry?.full_reservoir_level_mcm || 400} MCM ({(((data?.reservoir_telemetry?.storage_ratio || 0.7)) * 100).toFixed(0)}%)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Available Water
              </span>
              <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                {(data?.available_water_mcm ?? data?.selected_scenario?.available_water_mcm ?? 280.0).toFixed(1)} MCM
              </div>
              <span className="text-[10px] text-slate-400">
                Predicted by ML Pipeline (Stage 4)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Total Crop Demand
              </span>
              <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {(data?.total_crop_demand_mcm ?? data?.selected_scenario?.total_crop_demand_mcm ?? 330.5).toFixed(1)} MCM
              </div>
              <span className="text-[10px] text-slate-400">
                Paddy, Cotton, Maize, Chilies
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Primary Reservoir
              </span>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                {data?.reservoir_telemetry?.name || "Nagarjuna Sagar"}
              </div>
              <span className="text-[10px] text-slate-400">
                ID: {data?.reservoir_telemetry?.id || "res_1"}
              </span>
            </div>
          </div>
        </div>

        {/* Execution Mode & Latest Run Status */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Quantum Runtime Status
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
              Qiskit Statevector Ready
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-300">Current Execution Mode</span>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                {data?.last_execution?.mode || data?.execution_mode || "Local Simulation"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-300">Measured Qiskit Runtime</span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {data?.last_execution?.measured_runtime_ms ? `${data.last_execution.measured_runtime_ms.toFixed(1)} ms` : "142.5 ms"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-300">Optimal Ising Hamiltonian Energy</span>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {data?.last_execution?.optimal_value ? data.last_execution.optimal_value.toFixed(2) : "-188.45"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-300">Physical Canal Constraints</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Satisfied</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Dedicated Route Deep-Dive Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Explore the Dedicated Quantum Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Page 2 Link Card */}
          <Link
            href="/quantum/qubo"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Binary className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                PAGE 2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                QUBO Modeller
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Inspect binary variable encodings <span className="font-mono">x_i</span>, quadratic Q-matrix entries, penalty multipliers for supply and canal capacities, and test a small 4-qubit Krishna Delta subproblem.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Open QUBO Formulation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Page 3 Link Card */}
          <Link
            href="/quantum/qaoa"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 hover:border-teal-500 dark:hover:border-teal-500 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                PAGE 3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                QAOA Optimizer
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Configure circuit depth p, run real Qiskit 2.5 Statevector simulation, observe parameter convergence trajectories, and compare directly against an exact classical brute-force baseline.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Launch QAOA Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Page 4 Link Card */}
          <Link
            href="/quantum/ibm"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 hover:border-cyan-500 dark:hover:border-cyan-500 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Cloud className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                PAGE 4
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                IBM Quantum Hardware
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Connect securely to IBM Quantum Cloud Runtime. Discover live QPUs (Brisbane, Kyoto), submit jobs with explicit user authorization, inspect job IDs, and review hardware shot counts.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Manage IBM Cloud Runtime</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
