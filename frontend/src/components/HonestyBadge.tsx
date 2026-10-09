import React from "react";
import { Sparkles, Database, Cpu, Info } from "lucide-react";

interface HonestyBadgeProps {
  type: "quantum" | "demo" | "simulated-ml" | "disclaimer" | "trained-ml";
  className?: string;
}

export const HonestyBadge: React.FC<HonestyBadgeProps> = ({ type, className = "" }) => {
  if (type === "quantum") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-quantum-900/60 text-quantum-300 border border-quantum-500/30 backdrop-blur-sm shadow-sm ${className}`}>
        <Sparkles className="w-3.5 h-3.5 text-quantum-400 animate-pulse" />
        <span>Quantum-Inspired Simulation — runs on classical hardware</span>
      </div>
    );
  }

  if (type === "demo") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-500/30 backdrop-blur-sm ${className}`}>
        <Database className="w-3.5 h-3.5 text-amber-400" />
        <span>Demo Data — Synthetic AP Krishna Basin</span>
      </div>
    );
  }

  if (type === "trained-ml") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm shadow-sm ${className}`}>
        <Cpu className="w-3.5 h-3.5 text-emerald-400" />
        <span>Trained Stage 4 ML Model — Evaluated on 2025 Test Split</span>
      </div>
    );
  }

  if (type === "simulated-ml") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm ${className}`}>
        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        <span>Simulated / Demo ML Model</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 ${className}`}>
      <Info className="w-3.5 h-3.5 text-slate-400" />
      <span>Fictional Scenario Simulation</span>
    </div>
  );
};
