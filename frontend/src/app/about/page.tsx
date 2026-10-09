"use client";

import React from "react";
import { TopNav } from "../../components/aquaflow/TopNav";
import { Waves, ShieldCheck, Cpu, Leaf, Users, Award, ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <TopNav />

      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-tr from-[#0B192C] to-[#1e3a60] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-semibold border border-blue-400/30">
              <Waves className="w-3.5 h-3.5" />
              <span>Hackathon Demonstration Edition</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              AquaFlow: Intelligent Water Management
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Pioneering automated telemetry, real-time dam monitoring, and predictive irrigation scheduling across the Krishna-Godavari river basins.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0B192C]">Dam Safety & Flood Resilience</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time monitoring of reservoir spillway discharges, automated gate synchronization, and upstream acoustic inflow estimation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0B192C]">Equitable Irrigation Allocation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Distributing water proportionally through 980 km of canal networks to serve 2.1M+ farmers while eliminating tail-end canal water distress.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0B192C]">Quantum & AI Optimization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Combinatorial scheduling using QUBO formulations and Qiskit QAOA primitives to minimize conveyance losses and optimize reservoir head.
            </p>
          </div>
        </div>

        {/* Data Honesty Notice */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6 text-slate-700 space-y-2">
          <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Data Honesty & Attribution Note
          </h4>
          <p className="text-xs leading-relaxed text-slate-600">
            Storage capacities and geographical coordinates are grounded in published Central Water Commission (CWC) and Andhra Pradesh Water Resources Department (AP WRD) registers. Current sensor readings, water levels, and inflows are presented for demonstration and simulation purposes.
          </p>
        </div>
      </main>
    </div>
  );
}
