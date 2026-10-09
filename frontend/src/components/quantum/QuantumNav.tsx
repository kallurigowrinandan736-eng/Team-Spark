"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, Binary, Cpu, Cloud, 
  CheckCircle2, Droplets, Layers, ShieldCheck, Activity
} from "lucide-react";

interface QuantumNavProps {
  scenarioName?: string;
  availableWaterMcm?: number;
  totalDemandMcm?: number;
  executionMode?: string;
  isValid?: boolean;
}

export const QuantumNav: React.FC<QuantumNavProps> = ({
  scenarioName = "Moderate Drought Scenario",
  availableWaterMcm = 280,
  totalDemandMcm = 330.5,
  executionMode = "Local Simulation (Qiskit 2.5)",
  isValid = true
}) => {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Quantum Overview",
      href: "/quantum",
      icon: Sparkles,
      description: "Architecture & Hydrology"
    },
    {
      name: "QUBO Modeller",
      href: "/quantum/qubo",
      icon: Binary,
      description: "Ising Hamiltonian & Penalties"
    },
    {
      name: "QAOA Optimizer",
      href: "/quantum/qaoa",
      icon: Cpu,
      description: "Circuit Simulation vs Baseline"
    },
    {
      name: "IBM Quantum Execution",
      href: "/quantum/ibm",
      icon: Cloud,
      description: "Hardware Runtime & Jobs"
    }
  ];

  const deficitRatio = totalDemandMcm > 0 ? ((totalDemandMcm - availableWaterMcm) / totalDemandMcm) * 100 : 0;

  return (
    <div className="space-y-4 mb-6">
      {/* Top Telemetry & Scenario Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 text-white shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              Jaldhara Quantum Suite
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="text-slate-400">Scenario:</span>
            <span className="font-semibold text-emerald-200">{scenarioName}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Available:</span>
            <span className="font-mono font-bold text-cyan-300">{availableWaterMcm.toFixed(1)} MCM</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">Demand:</span>
            <span className="font-mono font-bold text-amber-300">{totalDemandMcm.toFixed(1)} MCM</span>
            {deficitRatio > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {deficitRatio.toFixed(0)}% Deficit
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Execution Mode Honest Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-purple-950/70 text-purple-200 border border-purple-500/40">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>{executionMode}</span>
          </div>

          {/* Constraint Validation Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium ${
            isValid 
              ? "bg-emerald-950/70 text-emerald-200 border border-emerald-500/40"
              : "bg-rose-950/70 text-rose-200 border border-rose-500/40"
          }`}>
            <ShieldCheck className={`w-3.5 h-3.5 ${isValid ? "text-emerald-400" : "text-rose-400"}`} />
            <span>{isValid ? "Constraints Validated" : "Violations Detected"}</span>
          </div>
        </div>
      </div>

      {/* 4-Tab Navigation Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-emerald-50/80 dark:bg-slate-900/90 border border-emerald-200/80 dark:border-emerald-900/40 backdrop-blur-md">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-emerald-100/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isActive 
                  ? "bg-white/20 text-white" 
                  : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate leading-tight">
                  {tab.name}
                </span>
                <span className={`text-[10px] truncate ${isActive ? "text-emerald-100" : "text-slate-500 dark:text-slate-400"}`}>
                  {tab.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
