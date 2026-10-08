"use client";

import React from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { HonestyBadge } from "../../components/HonestyBadge";
import { WhyExplanationCard } from "../../components/WhyExplanationModal";
import { Lightbulb, Sparkles, BrainCircuit, ShieldCheck } from "lucide-react";

export default function RecommendationsPage() {
  const { recommendations, comparison } = useWaterStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-cyan-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Decision Support System</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Explainable AI (XAI) Actionable Recommendations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven engineering and agronomic guidance with feature-attribution reasoning and confidence metrics
          </p>
        </div>
        <HonestyBadge type="simulated-ml" />
      </div>

      {/* Overview Metric Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-center justify-between shadow-glow-cyan">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span>
            Recommendations are generated from live mathematical optimization constraints and agronomic ML feature importance weights (never static random text).
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-cyan-300 font-bold">
          <span>{recommendations.length} Active Prescriptions</span>
        </div>
      </div>

      {/* Recommendations Cards List with Factor Attributions */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <WhyExplanationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </div>
  );
}
