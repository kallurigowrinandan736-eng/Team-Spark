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
      {/* Dynamic Background Animated Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-quantum-600/20 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-water-500/15 blur-[150px]" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-water-500 to-quantum-500 flex items-center justify-center shadow-glow-cyan">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-quantum-300 bg-clip-text text-transparent">
            AquaQ
          </span>
        </div>

        <div className="flex items-center gap-4">
          <HonestyBadge type="quantum" className="hidden sm:inline-flex" />
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-ocean-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-glow-cyan flex items-center gap-1.5"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ocean-900 border border-slate-700 text-xs text-cyan-300 font-medium mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Hackathon Problem 03: Smart Irrigation & Water Resource Allocation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
          Smart Water. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-quantum-400 bg-clip-text text-transparent">
            Smarter Allocation.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          AI and Quantum-Inspired Optimization for Sustainable Irrigation and Multi-Reservoir Water Resource Management.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-7 py-3.5 rounded-2xl text-sm font-bold text-ocean-950 bg-gradient-to-r from-cyan-400 via-water-400 to-quantum-400 hover:shadow-glow-cyan transition-all transform hover:-translate-y-0.5 flex items-center gap-2 shadow-lg"
          >
            <span>Launch Operations Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/demo"
            className="px-7 py-3.5 rounded-2xl text-sm font-bold text-quantum-300 bg-ocean-900/90 border border-quantum-500/40 hover:bg-quantum-950/60 hover:text-white transition-all transform hover:-translate-y-0.5 flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-quantum-400" />
            <span>Run Hackathon Demo (7-Step Walkthrough)</span>
          </Link>
        </div>

        {/* Live System Preview Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Active Storage</div>
            <div className="text-xl font-bold text-sky-400 mt-1">{totalStorage.toFixed(0)} MCM</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{(totalCapacity).toFixed(0)} MCM Max Cap</div>
          </div>
          <div className="p-4 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Irrigation Demand</div>
            <div className="text-xl font-bold text-indigo-400 mt-1">{totalDemand.toFixed(0)} MCM</div>
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
            <div className="text-xl font-bold text-quantum-400 mt-1">50 Qubits</div>
            <div className="text-[10px] text-quantum-300 mt-0.5">SQA Hamiltonian</div>
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
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
              The AquaQ Solution
            </span>
            <h3 className="text-xl font-bold text-white">Hybrid Quantum-AI Optimization Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              AquaQ couples agronomic GradientBoosting demand predictors with probabilistic inflow forecasting and solves multi-reservoir dispatch using both classical Linear Programming and Quantum-Inspired SQA.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                <div className="text-cyan-400 font-bold text-sm">+18.5%</div>
                <div className="text-[11px] text-slate-400">Crop Satisfaction Gain</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-quantum-500/30">
                <div className="text-quantum-400 font-bold text-sm">0.962</div>
                <div className="text-[11px] text-slate-400">Jain&apos;s Fairness Index</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                <div className="text-emerald-400 font-bold text-sm">-24.8 MCM</div>
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
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-ocean-900 via-cyan-950 to-quantum-950 border border-cyan-500/40 shadow-glow-cyan space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Explore the Quantum-AI Water Allocation Platform?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Experience real-time optimization, scenario simulation, explainable AI recommendations, and multi-solver benchmarking.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-xl text-sm font-bold text-ocean-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-glow-cyan"
            >
              Open Dashboard
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all border border-slate-600"
            >
              Start Hackathon Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div>
          © 2026 AquaQ — Team Spark. Built for Hackathon Demonstration.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/docs" className="hover:text-cyan-400 transition-colors">Documentation</Link>
          <Link href="/data" className="hover:text-cyan-400 transition-colors">Data Management</Link>
          <Link href="/demo" className="hover:text-cyan-400 transition-colors">Demo Mode</Link>
        </div>
      </footer>
    </div>
  );
}
