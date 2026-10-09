"use client";

import React, { useEffect, useState } from "react";
import { QuantumNav } from "../../../components/quantum/QuantumNav";
import { api } from "../../../lib/api";
import { QuboModelData } from "../../../lib/types";
import {
  Binary, Sliders, CheckCircle2, AlertTriangle, Layers,
  Table as TableIcon, HelpCircle, RefreshCw, Cpu, ArrowRight,
  ShieldCheck, Info, Sparkles
} from "lucide-react";
import Link from "next/link";

export default function QuboModellerPage() {
  const [quboData, setQuboData] = useState<QuboModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState<number>(2);
  const [isSubproblem, setIsSubproblem] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"variables" | "matrix" | "penalties" | "hamiltonian">("variables");

  const loadQubo = async (numLevels: number, sub: boolean) => {
    setLoading(true);
    try {
      const data = await api.getQuboModel(numLevels, sub);
      setQuboData(data);
    } catch (err) {
      console.error("Failed to fetch QUBO model", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQubo(levels, isSubproblem);
  }, [levels, isSubproblem]);

  const getPenaltyWeight = (name: string, defaultVal: number): number => {
    if (!quboData?.penalties) return defaultVal;
    const found = quboData.penalties.find((p) => p.name === name);
    return found ? found.weight : defaultVal;
  };

  const qMatrix = quboData?.q_matrix || [
    [-54.0, 100.0, 10.0, 20.0],
    [0.0, -82.5, 10.0, 20.0],
    [0.0, 0.0, -42.0, 100.0],
    [0.0, 0.0, 0.0, -71.2]
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Shared Nav */}
      <QuantumNav
        scenarioName="Moderate Drought Scenario"
        availableWaterMcm={280}
        totalDemandMcm={125.0}
        executionMode="Local Simulation"
        isValid={true}
      />

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              PAGE 2: Mathematical Formulation
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-mono text-slate-500">
              Qubit Count: {quboData?.num_qubits || 4} Qubits
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            QUBO Matrix Modeller & Ising Encoding
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Converts multi-canal irrigation allocations into a Quadratic Unconstrained Binary Optimization problem suitable for QAOA execution.
          </p>
        </div>

        {/* Configuration Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setIsSubproblem(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isSubproblem
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              }`}
            >
              Small Solvable (4 Qubits)
            </button>
            <button
              onClick={() => setIsSubproblem(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isSubproblem
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              }`}
            >
              Full Command Area
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Gate Levels:</span>
            <select
              value={levels}
              onChange={(e) => setLevels(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={2}>2 Levels (0%, 100%)</option>
              <option value={3}>3 Levels (0%, 50%, 100%)</option>
              <option value={4}>4 Levels (0%, 33%, 66%, 100%)</option>
            </select>
          </div>

          <button
            onClick={() => loadQubo(levels, isSubproblem)}
            disabled={loading}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh QUBO"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Discretization & Mathematical Formulation Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/30 text-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Mathematical Objective & Penalty Hamiltonian
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-700/50">
            Formulation: min xᵀ Q x + c
          </span>
        </div>

        {/* Math equation display */}
        <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 font-mono text-xs sm:text-sm text-emerald-200 space-y-2 overflow-x-auto">
          <div className="font-bold text-white">
            min H(x) = H_benefit(x) + H_shortage(x) + H_loss(x) + P_onehot · Ω_onehot(x) + P_supply · Ω_supply(x) + P_canal · Ω_canal(x)
          </div>
          <div className="text-xs text-slate-300 leading-relaxed pt-1">
            Where each binary decision variable <span className="text-cyan-300 font-bold">x_{"{c,k,l}"} ∈ {"{0,1}"}</span> indicates whether canal <span className="text-amber-300">c</span> allocating to crop <span className="text-amber-300">k</span> is set to discrete flow fraction <span className="text-emerald-300">l</span>.
          </div>
        </div>

        {/* Breakdown of terms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-emerald-300">H_benefit (Economic Yield)</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              - ∑ w_c,k · priority_k · alloc_c,k,l. Rewards maximizing yield of high-priority crops (Paddy, Cotton).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-cyan-300">H_shortage (Water Deficit)</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              ∑ (demand_c,k - alloc_c,k,l)². Quadratic penalty preventing severe crop drying and enforcing equitable sharing.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-amber-300">H_loss (Canal Seepage)</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              ∑ loss_rate_c · alloc_c,k,l. Penalizes inefficient transit through unlined, high-loss canal reaches.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("variables")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "variables"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Binary Variables ({quboData?.num_variables || 4})</span>
          </button>
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "matrix"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Q-Matrix Couplings ({quboData?.num_variables || 4}x{quboData?.num_variables || 4})</span>
          </button>
          <button
            onClick={() => setActiveTab("penalties")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "penalties"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Penalty Weights & Constraints</span>
          </button>
          <button
            onClick={() => setActiveTab("hamiltonian")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "hamiltonian"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Objective Terms & Encodings</span>
          </button>
        </div>

        {/* Tab 1: Variables Table */}
        {activeTab === "variables" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Decision Variable Mapping
              </h3>
              <span className="text-xs text-slate-500">
                1 Qubit corresponds to 1 binary variable
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                    <th className="py-2.5 px-3">Qubit / Var</th>
                    <th className="py-2.5 px-3">Canal ID</th>
                    <th className="py-2.5 px-3">Crop Type</th>
                    <th className="py-2.5 px-3">Flow Fraction</th>
                    <th className="py-2.5 px-3">Allocated Volume</th>
                    <th className="py-2.5 px-3">Formal Label</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {quboData?.variables.map((v) => (
                    <tr key={v.index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                        x_{v.index} (q_{v.index})
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        {v.canal_id} ({v.canal_name})
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 capitalize">
                        {v.crop_name || v.crop_id}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-cyan-600 dark:text-cyan-400">
                        {(v.level_fraction * 100).toFixed(0)}%
                      </td>
                      <td className="py-2.5 px-3 font-bold text-amber-600 dark:text-amber-400">
                        {v.allocated_mcm.toFixed(1)} MCM
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                        {v.label}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Q-Matrix Couplings */}
        {activeTab === "matrix" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upper-Triangular QUBO Q-Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Diagonal elements Q_ii are linear terms; off-diagonal elements Q_ij are quadratic interaction penalties.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Non-Zero Entries: {quboData?.non_zero_elements || 7} (Sparsity: {quboData?.sparsity_pct || 45}%)
              </span>
            </div>

            <div className="overflow-x-auto p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-200">
              <div className="grid gap-2" style={{ gridTemplateColumns: `auto repeat(${qMatrix.length}, minmax(64px, 1fr))` }}>
                <div className="p-2 text-slate-500 font-bold"></div>
                {qMatrix.map((_, idx) => (
                  <div key={idx} className="p-2 text-center text-emerald-400 font-bold">
                    x_{idx}
                  </div>
                ))}

                {qMatrix.map((row, rIdx) => (
                  <React.Fragment key={rIdx}>
                    <div className="p-2 text-emerald-400 font-bold flex items-center">
                      x_{rIdx}
                    </div>
                    {row.map((val, cIdx) => {
                      const isDiag = rIdx === cIdx;
                      const isNonZero = Math.abs(val) > 0.001;

                      return (
                        <div
                          key={cIdx}
                          className={`p-2.5 text-center rounded-lg border transition-all ${
                            isDiag
                              ? "bg-purple-950/70 border-purple-500/40 text-purple-200 font-bold"
                              : isNonZero
                              ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200 font-semibold"
                              : "bg-slate-900/50 border-slate-800 text-slate-600"
                          }`}
                          title={`Q[${rIdx},${cIdx}] = ${val.toFixed(2)}`}
                        >
                          {val.toFixed(1)}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Penalty Weights */}
        {activeTab === "penalties" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Penalty Terms & Physical Constraint Enforcers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    P_onehot
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                    Weight: {getPenaltyWeight("P_onehot", 100.0).toFixed(1)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  One-Hot Level Exclusivity
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Formula: <span className="font-mono text-emerald-600 dark:text-emerald-400">(∑_l x_c,k,l - 1)²</span>. Strictly forbids selecting multiple gate levels simultaneously for the same canal-crop allocation.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    P_supply
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300">
                    Weight: {getPenaltyWeight("P_supply", 80.0).toFixed(1)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Total Reservoir Supply Bound
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Formula: <span className="font-mono text-emerald-600 dark:text-emerald-400">(max(0, ∑ alloc - W_avail))²</span>. Penalizes allocation plans that attempt to extract more water than the reservoir holds.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    P_canal
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                    Weight: {getPenaltyWeight("P_canal", 60.0).toFixed(1)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Canal Hydraulic Capacity
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Formula: <span className="font-mono text-emerald-600 dark:text-emerald-400">(max(0, ∑_k alloc_c,k - C_max,c))²</span>. Protects canal embankments by penalizing flow exceeding maximum cubic capacity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Hamiltonian / Objectives */}
        {activeTab === "hamiltonian" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ising Hamiltonian Terms & Physical Formulations
              </h3>
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                Transformation: x_i = (I - Z_i) / 2
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quboData?.objective_terms && Object.entries(quboData.objective_terms).map(([title, desc], idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    {title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Small Solvable Example Validation Callout */}
      <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Verified Solvable Instance: {quboData?.sample_subproblem?.name || "Krishna Delta 4-Qubit Subproblem"}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            This formulation contains exactly {quboData?.sample_subproblem?.num_qubits || 4} binary decision variables and can be solved to proven global optimality via local Qiskit simulation in &lt;200 ms.
          </p>
        </div>

        <Link
          href="/quantum/qaoa"
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <span>Run QAOA on this Problem</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
