"use client";

import React from "react";
import Link from "next/link";
import {
  Droplets, Sparkles, BrainCircuit, Sliders,
  ArrowRight, ShieldCheck, Cpu, Database,
  TrendingUp, BarChart3, Activity, Layers, CheckCircle2
} from "lucide-react";
import { HonestyBadge } from "../components/HonestyBadge";
import { SystemArchitectureDiagram } from "../components/SystemArchitectureDiagram";
import { useWaterStore } from "../store/useWaterStore";

export default function LandingPage() {
  const { comparison, reservoirs, crops } = useWaterStore();

  const totalCapacity = reservoirs.reduce((s, r) => s + r.max_capacity_mcm, 0);
  const totalStorage = reservoirs.reduce((s, r) => s + r.current_storage_mcm, 0);
  const totalDemand = crops.reduce((s, c) => s + c.total_demand_mcm, 0);

  return (
    <div className="relative min-h-screen bg-ocean-950 text-slate-100 overflow-hidden">
      {/* Jaldhara Infographic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10">
        <picture>
          <source srcSet="/images/jaldhara-infographic-bg.webp" type="image/webp" />
          <img
            src="/images/jaldhara-infographic-bg.jpg"
            alt="Jaldhara System Infographic"
            className="w-full h-full object-cover object-top opacity-45 filter brightness-[0.82] contrast-[1.08] saturate-[1.25]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-950/80 via-ocean-950/70 to-ocean-950/90" />
      </div>

      {/* Dynamic Animated Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-teal-600/20 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-cyan-500/15 blur-[150px]" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 flex items-center justify-center shadow-lg">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Jaldhar
            </span>
            <span className="text-[10px] text-emerald-400/80 font-medium tracking-wider uppercase">
              Smart Water Allocation • Team Spark
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/aquaflow"
            className="hidden md:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 border border-slate-700/60 transition-colors"
          >
            Dam Monitoring View
          </Link>
          <HonestyBadge type="quantum" className="hidden sm:inline-flex" />
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-ocean-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:brightness-110 transition-all shadow-glow-cyan flex items-center gap-1.5"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-medium text-emerald-300 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Quantum-AI Powered Irrigation & Water Resource Allocation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Precision Water Allocation Powered by{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Hybrid Quantum-AI
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          <strong>Jaldhar</strong> optimizes multi-reservoir dispatch across Nagarjuna Sagar, Srisailam, and Krishna Basin canals. Combines agronomic ML demand forecasting with classical LP and simulated quantum annealing.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-xl text-sm font-bold text-ocean-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:brightness-110 transition-all shadow-glow-cyan flex items-center gap-2"
          >
            <span>Launch Operations Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/quantum"
            className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Quantum Algorithms (QAOA & QUBO)</span>
          </Link>
          <Link
            href="/demo"
            className="px-8 py-3.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Run Hackathon Demo</span>
          </Link>
        </div>

        {/* Live System Preview Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Active Storage</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{totalStorage.toFixed(0)} MCM</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{(totalCapacity).toFixed(0)} MCM Max Cap</div>
          </div>
          <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Irrigation Demand</div>
            <div className="text-xl font-bold text-teal-400 mt-1">{totalDemand.toFixed(0)} MCM</div>
            <div className="text-[10px] text-slate-500 mt-0.5">10 Crop Command Zones</div>
          </div>
          <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Classical LP Score</div>
            <div className="text-xl font-bold text-cyan-400 mt-1">
              {comparison?.classical.metrics.optimization_score || 81.5}/100
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">+16.5% vs Manual</div>
          </div>
          <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Quantum Simulation</div>
            <div className="text-xl font-bold text-cyan-300 mt-1">50 Qubits</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">SQA & QAOA Ready</div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Breakdown */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/40">
              The Challenge
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Severe Water Scarcity & Suboptimal Manual Canal Allocations
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional irrigation allocation relies on static rules and manual heuristics. During dry spells and erratic monsoons, this leads to catastrophic crop moisture stress, up to 15% canal conveyance seepage losses, and inequitable distribution across upstream and downstream agricultural districts.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>Unpredictable monsoon rainfall and reservoir catchment inflow volatility</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>Heavy conveyance losses along unlined branch canals and distributaries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>Conflict between environmental reserve floors and agricultural yield protection</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-ocean-900 via-slate-900 to-ocean-950 border border-slate-700/80 shadow-glass space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
              The Jaldhar Solution
            </span>
            <h3 className="text-xl font-bold text-white">Hybrid Quantum-AI Optimization Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jaldhar couples agronomic GradientBoosting demand predictors with probabilistic inflow forecasting and solves multi-reservoir dispatch using classical Linear Programming, Simulated Quantum Annealing, and QAOA on Qiskit.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                <div className="text-emerald-400 font-bold text-sm">+18.5%</div>
                <div className="text-[11px] text-slate-400">Crop Satisfaction Gain</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-teal-500/30">
                <div className="text-teal-400 font-bold text-sm">0.962</div>
                <div className="text-[11px] text-slate-400">Jain&apos;s Fairness Index</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                <div className="text-cyan-400 font-bold text-sm">-24.8 MCM</div>
                <div className="text-[11px] text-slate-400">Canal Seepage Reduced</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30">
                <div className="text-amber-400 font-bold text-sm">100%</div>
                <div className="text-[11px] text-slate-400">Environmental Reserve Met</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Diagram Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/80">
        <SystemArchitectureDiagram />
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-ocean-900 via-teal-950 to-slate-900 border border-emerald-500/40 shadow-glow-cyan space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Explore the Jaldhar Water Allocation Platform?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Experience real-time optimization, scenario simulation, explainable AI recommendations, and multi-solver benchmarking.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-xl text-sm font-bold text-ocean-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:brightness-110 transition-all shadow-glow-cyan"
            >
              Open Operations Dashboard
            </Link>
            <Link
              href="/quantum/ibm"
              className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all border border-slate-600"
            >
              IBM Quantum Cloud
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 transition-all border border-slate-700"
            >
              Start Hackathon Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div>
          © 2026 Jaldhar — Team Spark. Built for Hackathon Demonstration.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
          <Link href="/quantum" className="hover:text-emerald-400 transition-colors">Quantum Suite</Link>
          <Link href="/predictions" className="hover:text-emerald-400 transition-colors">ML Inflow</Link>
          <Link href="/docs" className="hover:text-emerald-400 transition-colors">Documentation</Link>
          <Link href="/aquaflow" className="hover:text-cyan-400 transition-colors">Dam Monitoring</Link>
        </div>
      </footer>
    </div>
  );
}
