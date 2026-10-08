"use client";

import React from "react";
import { useWaterStore } from "../store/useWaterStore";
import {
  CheckCircle2, Loader2, Sparkles, X,
  Clock, ArrowRight, Layers, Award
} from "lucide-react";

export const PipelineModal: React.FC = () => {
  const {
    pipelineModalOpen, setPipelineModalOpen,
    isPipelineRunning, activeSteps, comparison
  } = useWaterStore();

  if (!pipelineModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-ocean-900 border border-slate-700 shadow-glass overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-ocean-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-quantum-600 shadow-glow-cyan text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Quantum-AI Optimization Pipeline</h2>
              <p className="text-xs text-slate-400">8-Step End-to-End Orchestrated Water Dispatch</p>
            </div>
          </div>
          <button
            onClick={() => setPipelineModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Body */}
        <div className="p-6 overflow-y-auto space-y-3 custom-scrollbar flex-1">
          {activeSteps.map((step) => {
            const isDone = step.status === "completed";
            const isRunning = step.status === "running";

            return (
              <div
                key={step.step_number}
                className={`flex items-start gap-4 p-3.5 rounded-2xl border transition-all duration-200 ${
                  isRunning
                    ? "bg-cyan-950/40 border-cyan-500/50 shadow-glow-cyan"
                    : isDone
                    ? "bg-slate-900/60 border-slate-800"
                    : "bg-slate-900/20 border-slate-800/40 opacity-50"
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isRunning ? (
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      {step.step_number}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">
                      Step {step.step_number}: {step.name}
                    </span>
                    {step.duration_ms > 0 && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/40">
                        <Clock className="w-3 h-3" />
                        {step.duration_ms.toFixed(1)}ms
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{step.summary}</p>
                </div>
              </div>
            );
          })}

          {/* Final Impact Verdict Card */}
          {comparison && !isPipelineRunning && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-quantum-950/80 via-ocean-900 to-cyan-950/80 border border-quantum-500/40 shadow-glow-purple">
              <div className="flex items-center gap-2 text-quantum-300 font-bold text-sm mb-1.5">
                <Award className="w-4 h-4 text-quantum-400" />
                <span>Multi-Solver Optimization Verdict</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {comparison.verdict}
              </p>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-center">
                <div>
                  <div className="text-[11px] text-slate-400">Classical Score</div>
                  <div className="text-sm font-bold text-cyan-400">{comparison.classical.metrics.optimization_score}/100</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Quantum Score</div>
                  <div className="text-sm font-bold text-quantum-400">{comparison.quantum.metrics.optimization_score}/100</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Fairness Index</div>
                  <div className="text-sm font-bold text-emerald-400">{comparison.classical.metrics.jains_fairness_index}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-ocean-950/70">
          <span className="text-xs text-slate-400">
            {isPipelineRunning ? "Running real-time mathematical calculations..." : "Pipeline execution finished."}
          </span>
          <button
            onClick={() => setPipelineModalOpen(false)}
            disabled={isPipelineRunning}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isPipelineRunning
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-400 text-ocean-950 shadow-glow-cyan"
            }`}
          >
            {isPipelineRunning ? "Please Wait..." : "View Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
};
