"use client";

import React from "react";
import { Database, Cpu, Sliders, Sparkles, LayoutDashboard, Lightbulb, ArrowDown, CheckCircle2 } from "lucide-react";

export const SystemArchitectureDiagram: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-ocean-900/90 border border-slate-800 p-6 backdrop-blur-md">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
          System Architecture
        </span>
        <h3 className="text-xl font-bold text-white mt-2">End-to-End Quantum-AI Decision Pipeline</h3>
        <p className="text-xs text-slate-400 mt-1">
          Hierarchical integration of agronomic ML, mathematical optimization, and hybrid quantum simulation
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Layer 1: Data Ingestion */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Layer 1: Multimodal Hydrological & Agronomic Data Sources</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
              <div className="font-semibold text-cyan-300">4 Reservoirs</div>
              <div className="text-[11px] text-slate-400">Live storage & Min reserves</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
              <div className="font-semibold text-cyan-300">8 Canal Reaches</div>
              <div className="text-[11px] text-slate-400">Flow capacities & Seepage %</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
              <div className="font-semibold text-cyan-300">10 Crop Zones</div>
              <div className="text-[11px] text-slate-400">Growth stage & Kc coeff</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
              <div className="font-semibold text-cyan-300">36-Mo Timeseries</div>
              <div className="text-[11px] text-slate-400">Monsoon rainfall & Inflows</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-cyan-500">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Layer 2: AI / ML Inference */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 shadow-glow-cyan">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Layer 2: AI & Probabilistic Machine Learning</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="font-bold text-white flex justify-between">
                <span>Crop Water Demand Predictor</span>
                <span className="text-cyan-400 font-mono text-[11px]">R² = 0.941</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                GradientBoosting Regressor with FAO-56 Penman-Monteith ET0 proxy (Kc × ET0 - Peff)
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="font-bold text-white flex justify-between">
                <span>Catchment Inflow Forecaster</span>
                <span className="text-cyan-400 font-mono text-[11px]">P10 / P50 / P90</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                RandomForest hydrological model with seasonal decomposition and uncertainty intervals
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-quantum-500">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Layer 3: Optimization Solvers */}
        <div className="p-4 rounded-2xl bg-quantum-950/30 border border-quantum-500/30 shadow-glow-purple">
          <div className="flex items-center gap-2 text-xs font-bold text-quantum-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-quantum-400" />
            <span>Layer 3: Multi-Objective Mathematical & Quantum-Inspired Optimization</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="font-bold text-slate-300">1. Baseline Allocator</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Manual proportional allocation clipped to capacity constraints
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40">
              <div className="font-bold text-cyan-300">2. Classical LP / Simplex</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Exact continuous linear program solved with SciPy HiGHS simplex
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-quantum-500/40">
              <div className="font-bold text-quantum-300">3. Quantum-Inspired (QUBO)</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Hamiltonian encoding + Simulated Quantum Annealing (SQA)
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-emerald-500">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Layer 4: Operations & Explainability */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Layer 4: Real-time Operational Insights & Explainable AI (XAI)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
              <div className="font-semibold text-emerald-300">Jain&apos;s Fairness Index</div>
              <div className="text-[11px] text-slate-400">Equity across all agricultural districts</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
              <div className="font-semibold text-emerald-300">Explainable AI (XAI)</div>
              <div className="text-[11px] text-slate-400">Feature contribution reasoning bars</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
              <div className="font-semibold text-emerald-300">GIS Interactive Map</div>
              <div className="text-[11px] text-slate-400">Dynamic canal flow animations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
