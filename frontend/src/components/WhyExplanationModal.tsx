"use client";

import React, { useState } from "react";
import { RecommendationItem } from "../lib/types";
import { Lightbulb, ChevronDown, ChevronUp, ShieldCheck, Sparkles } from "lucide-react";

interface WhyExplanationCardProps {
  recommendation: RecommendationItem;
}

export const WhyExplanationCard: React.FC<WhyExplanationCardProps> = ({ recommendation }) => {
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    High: "bg-rose-950/60 text-rose-300 border-rose-500/30",
    Medium: "bg-amber-950/60 text-amber-300 border-amber-500/30",
    Low: "bg-cyan-950/60 text-cyan-300 border-cyan-500/30"
  };

  return (
    <div className="rounded-2xl bg-ocean-900/80 border border-slate-800 p-5 backdrop-blur-md transition-all hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2.5">
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider ${priorityColors[recommendation.priority as keyof typeof priorityColors] || priorityColors.Medium}`}>
              {recommendation.priority} Priority
            </span>
            <span className="text-xs font-semibold text-slate-400">{recommendation.category}</span>
          </div>
          <h4 className="text-sm font-bold text-white leading-snug">{recommendation.title}</h4>
          <p className="text-xs text-cyan-300/90 font-medium">{recommendation.action_text}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{(recommendation.confidence_score * 100).toFixed(0)}% Conf</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <span>{expanded ? "Hide Details" : "Why this action?"}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span className="text-slate-300 font-medium">Impact: {recommendation.impact_summary}</span>
      </div>

      {/* Expandable "Why?" Factor Attributions Panel */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-700/80 space-y-3 animate-in fade-in duration-200">
          <div className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 leading-relaxed">
            <span className="font-bold text-cyan-400">AI Reasoning: </span>
            {recommendation.why_explanation}
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Factor Contribution Breakdown (Feature Attribution)
            </span>
            <div className="space-y-1.5">
              {recommendation.factors.map((factor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{factor.name} ({factor.value})</span>
                    <span className={`font-mono font-semibold ${factor.direction === "positive" ? "text-emerald-400" : "text-amber-400"}`}>
                      {factor.contribution_pct.toFixed(0)}% weight
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${factor.direction === "positive" ? "bg-emerald-500" : "bg-amber-500"}`}
                      style={{ width: `${factor.contribution_pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
