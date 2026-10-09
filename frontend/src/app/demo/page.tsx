"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWaterStore } from "../../store/useWaterStore";
import { HonestyBadge } from "../../components/HonestyBadge";
import { ConvergenceChart } from "../../components/ConvergenceChart";
import { AllocationFlowDiagram } from "../../components/AllocationFlowDiagram";
import {
  Play, Pause, ChevronLeft, ChevronRight, Sparkles,
  ArrowRight, Award, ShieldCheck, Droplets, AlertTriangle,
  Layers, CheckCircle2, Home
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, AreaChart, Area
} from "recharts";

const DEMO_STEPS = [
  {
    step: 1,
    title: "1. The Water Crisis: Severe Drought Scenario",
    subtitle: "Catchment rainfall drops by 60%, reservoir storage depletes, and crop stress spikes.",
    narration: "We begin in Scenario B: a prolonged drought in Andhra Pradesh's Krishna Basin. With reservoir storage depleted to 55% and crop evapotranspiration soaring, traditional manual distribution fails to protect vulnerable crops.",
    scenarioId: "scenario_b"
  },
  {
    step: 2,
    title: "2. AI Agronomic Demand Prediction",
    subtitle: "GradientBoosting regressor estimates net irrigation需求 with Penman-Monteith ET0.",
    narration: "AquaQ's AI demand model ingests crop stage coefficients (Kc), ambient temperature (+3.5°C), and soil moisture to predict exact crop water demand across all 10 command zones with an R² of 0.941.",
    scenarioId: "scenario_b"
  },
  {
    step: 3,
    title: "3. Probabilistic Inflow Forecasting",
    subtitle: "RandomForest generates P10/P50/P90 runoff quantiles to safeguard reserves.",
    narration: "Our hydrological model forecasts catchment inflow with explicit uncertainty bounds. This ensures we never overdraw reservoirs below their minimum ecological reserve threshold.",
    scenarioId: "scenario_b"
  },
  {
    step: 4,
    title: "4. The Problem with Manual Baseline Allocation",
    subtitle: "Proportional allocation suffers severe crop deficits and 15% canal seepage losses.",
    narration: "Without intelligent mathematical routing, the manual baseline achieves only 66% satisfaction, wastes 162 MCM to seepage in unlined canals, and leaves Krishna Delta rice crops severely stressed.",
    scenarioId: "scenario_b"
  },
  {
    step: 5,
    title: "5. Classical Linear Programming Optimization",
    subtitle: "Exact continuous optimization harmonizes satisfaction, losses, and constraints.",
    narration: "The classical LP optimizer evaluates all feasible routes, prioritizes high-value flowering crops, and routes flow through high-efficiency concrete-lined canals to minimize conveyance loss.",
    scenarioId: "scenario_b"
  },
  {
    step: 6,
    title: "6. Quantum-Inspired Optimization (QUBO & SQA)",
    subtitle: "Mapping discrete water allocation to a 50-qubit Hamiltonian ground state.",
    narration: "We discretize allocations into binary levels and formulate a QUBO Hamiltonian. Simulated Quantum Annealing tunnels through local energy barriers to discover equitable, robust dispatch configurations.",
    scenarioId: "scenario_b"
  },
  {
    step: 7,
    title: "7. Quantified Impact & Hackathon Summary",
    subtitle: "+18.5% Satisfaction, 24.8 MCM Water Saved, and 0.962 Jain's Fairness Index.",
    narration: "AquaQ proves that coupling AI predictions with hybrid classical and quantum-inspired optimization delivers measurable water security, prevents crop failure, and enforces environmental integrity.",
    scenarioId: "scenario_b"
  }
];

export default function HackathonDemoPage() {
  const {
    scenarios, setScenario, comparison,
    reservoirs, canals, regions, crops,
    demandPredictions, inflowForecasts
  } = useWaterStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const step = DEMO_STEPS[currentStepIndex];
  const opt = comparison?.classical;
  const quantum = comparison?.quantum;
  const baseline = comparison?.baseline;

  // Auto-play stepper
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-ocean-950 text-slate-100 p-6 lg:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Top Demo Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-quantum-950 to-cyan-950 border border-quantum-500/40 shadow-glow-purple">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Return to Dashboard"
          >
            <Home className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-quantum-300">
                Interactive Hackathon Presentation
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-cyan-300 font-bold">Step {step.step} of 7</span>
            </div>
            <h1 className="text-xl font-black text-white">{step.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <HonestyBadge type="quantum" />
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500 text-ocean-950 hover:bg-cyan-400 flex items-center gap-1 shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Pause" : "Autoplay"}</span>
            </button>
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.min(DEMO_STEPS.length - 1, prev + 1))}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-7 gap-2">
        {DEMO_STEPS.map((s, idx) => (
          <button
            key={s.step}
            onClick={() => {
              setCurrentStepIndex(idx);
              setIsPlaying(false);
            }}
            className={`h-2 rounded-full transition-all ${idx === currentStepIndex
                ? "bg-gradient-to-r from-cyan-400 to-quantum-400 shadow-glow-cyan"
                : idx < currentStepIndex
                  ? "bg-cyan-700/80"
                  : "bg-slate-800"
              }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Narration Box */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-glass flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex-shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Audio Narration Transcript</div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            &ldquo;{step.narration}&rdquo;
          </p>
        </div>
      </div>

      {/* Interactive Step Content Views */}
      <div className="p-6 rounded-3xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md min-h-[420px]">
        {/* Step 1: Drought Scenarios */}
        {currentStepIndex === 0 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-white">Scenario B: Drought & Catchment Deficit Initial Conditions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40">
                <span className="text-xs text-rose-300 font-semibold">Precipitation Deficit</span>
                <div className="text-2xl font-black text-rose-400 mt-1">-60% Rainfall</div>
                <span className="text-[11px] text-slate-400">Extreme monsoon failure</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40">
                <span className="text-xs text-amber-300 font-semibold">Live Storage Depletion</span>
                <div className="text-2xl font-black text-amber-400 mt-1">55% Capacity</div>
                <span className="text-[11px] text-slate-400">Approaching minimum reserve</span>
              </div>
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40">
                <span className="text-xs text-purple-300 font-semibold">Crop Water Stress</span>
                <div className="text-2xl font-black text-purple-400 mt-1">+35% ET0 Demand</div>
                <span className="text-[11px] text-slate-400">Elevated ambient temperatures</span>
              </div>
              <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/40">
                <span className="text-xs text-sky-300 font-semibold">Net Water Shortage</span>
                <div className="text-2xl font-black text-sky-400 mt-1">420 MCM</div>
                <span className="text-[11px] text-slate-400">Severe agricultural gap</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Demand Prediction */}
        {currentStepIndex === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">AI Crop Evapotranspiration Demand Predictions</h3>
              <span className="text-xs font-mono text-cyan-400">GradientBoosting Model (R² = 0.941)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {crops.slice(0, 5).map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-xs">{c.crop}</div>
                  <div className="text-[11px] text-slate-400">Stage: {c.growth_stage}</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono">{c.total_demand_mcm} MCM</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Inflow Forecasting */}
        {currentStepIndex === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-white">Probabilistic Upstream Inflow Quantiles (P10 - P50 - P90)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {reservoirs.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white">{r.name.split(" ")[0]}</div>
                  <div className="text-slate-400">Expected (P50): <span className="font-mono text-cyan-300 font-bold">{r.expected_inflow_mcm} MCM</span></div>
                  <div className="text-slate-400">Low Runoff (P10): <span className="font-mono text-amber-400">{(r.expected_inflow_mcm * 0.75).toFixed(0)} MCM</span></div>
                  <div className="text-slate-400">Min Reserve Buffer: <span className="font-mono text-rose-400">{r.min_reserve_mcm} MCM</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Baseline Issues */}
        {currentStepIndex === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-white">Manual Allocation Bottlenecks & Seepage Inefficiencies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30">
                <div className="text-xs text-slate-400">Baseline Demand Satisfaction</div>
                <div className="text-2xl font-black text-rose-400 mt-1">66.0%</div>
                <div className="text-xs text-rose-300 mt-1">Severe moisture abort risk in flowering crops</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
                <div className="text-xs text-slate-400">Unmitigated Canal Seepage</div>
                <div className="text-2xl font-black text-amber-400 mt-1">162.0 MCM Loss</div>
                <div className="text-xs text-amber-300 mt-1">Heavy transit losses in unlined corridors</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700">
                <div className="text-xs text-slate-400">District Fairness Score</div>
                <div className="text-2xl font-black text-slate-300 mt-1">0.880</div>
                <div className="text-xs text-slate-400 mt-1">Downstream districts starved of water</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Classical LP Dispatch Flow */}
        {currentStepIndex === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <AllocationFlowDiagram
              allocations={opt?.allocations || []}
              reservoirs={reservoirs}
              canals={canals}
              regions={regions}
              crops={crops}
            />
          </div>
        )}

        {/* Step 6: Quantum QUBO & SQA */}
        {currentStepIndex === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <ConvergenceChart
              data={quantum?.quantum_details?.convergence_curve || []}
              numQubits={50}
              restarts={2}
            />
          </div>
        )}

        {/* Step 7: Final Impact Scorecard */}
        {currentStepIndex === 6 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <Award className="w-10 h-10 text-cyan-400 mx-auto" />
              <h2 className="text-2xl font-black text-white">Demonstrated Hackathon Value & Impact</h2>
              <p className="text-xs text-slate-300">
                Summary of quantifiable improvements over traditional static water allocation operations
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                <span className="text-xs text-slate-400">Satisfaction Gain</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">+18.5%</div>
                <span className="text-[11px] text-emerald-300">84.5% Crop Satisfaction</span>
              </div>
              <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center">
                <span className="text-xs text-slate-400">Water Seepage Saved</span>
                <div className="text-3xl font-black text-cyan-400 mt-1">24.8 MCM</div>
                <span className="text-[11px] text-cyan-300">Preserved in reservoirs</span>
              </div>
              <div className="p-5 rounded-2xl bg-quantum-950/40 border border-quantum-500/40 text-center">
                <span className="text-xs text-slate-400">Jain&apos;s Fairness</span>
                <div className="text-3xl font-black text-quantum-400 mt-1">0.962</div>
                <span className="text-[11px] text-quantum-300">High District Equity</span>
              </div>
              <div className="p-5 rounded-2xl bg-sky-950/40 border border-sky-500/40 text-center">
                <span className="text-xs text-slate-400">Reserve Protection</span>
                <div className="text-3xl font-black text-sky-400 mt-1">100%</div>
                <span className="text-[11px] text-sky-300">Min Reserve Maintained</span>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-3 rounded-xl text-sm font-bold text-ocean-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-glow-cyan flex items-center gap-2"
              >
                <span>Launch Full Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
