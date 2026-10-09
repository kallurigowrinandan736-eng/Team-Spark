"use client";

import React from "react";
import { Database, Cpu, Sliders, Sparkles, LayoutDashboard, Lightbulb, ArrowDown, CheckCircle2 } from "lucide-react";

export const SystemArchitectureDiagram: React.FC = () => {
  return (
    <div className="w-full rounded-3xl bg-white/95 dark:bg-ocean-900/90 border border-emerald-200/80 dark:border-slate-800 p-7 shadow-xl shadow-emerald-600/5 backdrop-blur-md">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 dark:text-cyan-400 dark:bg-cyan-950/60 px-3.5 py-1.5 rounded-full border border-emerald-300/80 dark:border-cyan-800/40 shadow-sm">
          System Architecture
        </span>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-3">End-to-End Quantum-AI Decision Pipeline</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
          Hierarchical integration of agronomic ML, mathematical optimization, and hybrid quantum simulation
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Layer 1: Data Ingestion */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-slate-900/80 border border-emerald-200/70 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-slate-300 uppercase tracking-wider mb-3">
            <Database className="w-4 h-4 text-emerald-600 dark:text-cyan-400" />
            <span>Layer 1: Multimodal Hydrological &amp; Agronomic Data Sources</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-sm">
              <div className="font-bold text-emerald-700 dark:text-cyan-300">4 Reservoirs</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Live storage &amp; Min reserves</div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-sm">
              <div className="font-bold text-emerald-700 dark:text-cyan-300">8 Canal Reaches</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Flow capacities &amp; Seepage %</div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-sm">
              <div className="font-bold text-emerald-700 dark:text-cyan-300">10 Crop Zones</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Growth stage &amp; Kc coeff</div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-sm">
              <div className="font-bold text-emerald-700 dark:text-cyan-300">36-Mo Timeseries</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Monsoon rainfall &amp; Inflows</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-emerald-600 dark:text-cyan-500">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Layer 2: AI / ML Inference */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-cyan-950/30 border border-emerald-300/80 dark:border-cyan-500/30 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-cyan-300 uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4 text-emerald-600 dark:text-cyan-400" />
            <span>Layer 2: AI &amp; Probabilistic Machine Learning</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 shadow-sm">
              <div className="font-bold text-slate-900 dark:text-white flex justify-between">
                <span>Crop Water Demand Predictor</span>
                <span className="text-emerald-600 dark:text-cyan-400 font-mono text-[11px] font-bold">R² = 0.941</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                GradientBoosting Regressor with FAO-56 Penman-Monteith ET0 proxy (Kc × ET0 - Peff)
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 shadow-sm">
              <div className="font-bold text-slate-900 dark:text-white flex justify-between">
                <span>Catchment Inflow Forecaster</span>
                <span className="text-emerald-600 dark:text-cyan-400 font-mono text-[11px] font-bold">P10 / P50 / P90</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                RandomForest hydrological model with seasonal decomposition and uncertainty intervals
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-emerald-600 dark:text-quantum-500">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Layer 3: Optimization Solvers */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-quantum-950/30 border border-emerald-200/80 dark:border-quantum-500/30 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-quantum-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-quantum-400" />
            <span>Layer 3: Multi-Objective Mathematical &amp; Quantum-Inspired Optimization</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 shadow-sm">
              <div className="font-bold text-slate-800 dark:text-slate-300">1. Baseline Allocator</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Manual proportional allocation clipped to capacity constraints
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-300 dark:border-cyan-500/40 shadow-sm">
              <div className="font-bold text-emerald-700 dark:text-cyan-300">2. Classical LP / Simplex</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Exact continuous linear program solved with SciPy HiGHS simplex
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-teal-300 dark:border-quantum-500/40 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-bold text-teal-700 dark:text-quantum-300">3. Quantum-Inspired (Qiskit QAOA)</div>
                <a
                  href="https://github.com/Qiskit/qiskit.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-teal-700 dark:text-cyan-300 hover:underline bg-teal-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded border border-teal-200 dark:border-purple-800"
                >
                  Qiskit/qiskit ↗
                </a>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Hamiltonian encoding via Qiskit SDK + Simulated Quantum Annealing (SQA)
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-emerald-600 dark:text-emerald-500">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Layer 4: Operations & Explainability */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-500/30 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-3">
            <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Layer 4: Real-time Operational Insights &amp; Explainable AI (XAI)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-sm">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">Jain&apos;s Fairness Index</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Equity across all agricultural districts</div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950/90 border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-sm">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">Explainable AI (XAI)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Feature contribution reasoning bars</div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950/90 border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-sm">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">GIS Interactive Map</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Dynamic canal flow animations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
