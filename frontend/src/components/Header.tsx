"use client";

import React, { useState } from "react";
import { useWaterStore } from "../store/useWaterStore";
import { HonestyBadge } from "./HonestyBadge";
import {
  Play, Sparkles, RefreshCw, ChevronDown,
  Wifi, WifiOff, Layers, CheckCircle2
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    scenarios, selectedScenario, setScenario,
    runOptimizationPipeline, isPipelineRunning,
    isOfflineMode, comparison
  } = useWaterStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-ocean-950/85 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
      {/* Left: Scenario Selector */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-ocean-900 border border-slate-700 text-sm font-medium text-slate-200 hover:border-cyan-500/50 hover:bg-ocean-850 transition-all shadow-sm"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="max-w-[240px] truncate">{selectedScenario.name.split(":")[0]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-ocean-900/95 border border-slate-700/80 shadow-glass backdrop-blur-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Operational Scenario
              </div>
              <div className="space-y-1 mt-1">
                {scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setScenario(sc);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-start gap-2 ${
                      selectedScenario.id === sc.id
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${selectedScenario.id === sc.id ? "text-cyan-400 opacity-100" : "opacity-0"}`} />
                    <div>
                      <div className="font-semibold">{sc.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{sc.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Honesty Badges */}
        <div className="hidden lg:flex items-center gap-2">
          <HonestyBadge type="demo" />
          <HonestyBadge type="quantum" />
        </div>
      </div>

      {/* Right: Offline Indicator & Main Action Button */}
      <div className="flex items-center gap-3.5">
        {/* Offline fallback indicator */}
        {isOfflineMode ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-500/30">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Offline TS Simulation</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Backend Connected</span>
          </div>
        )}

        {/* Latest Score Chip */}
        {comparison && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700/80 text-xs">
            <span className="text-slate-400">Opt Score:</span>
            <span className="font-bold text-cyan-400">
              {comparison.classical.metrics.optimization_score}/100
            </span>
          </div>
        )}

        {/* Prominent Run Optimization Button */}
        <button
          onClick={() => runOptimizationPipeline()}
          disabled={isPipelineRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-glow-cyan duration-200 ${
            isPipelineRunning
              ? "bg-slate-700 cursor-not-allowed opacity-80"
              : "bg-gradient-to-r from-cyan-500 via-water-500 to-quantum-600 hover:from-cyan-400 hover:to-quantum-500 active:scale-95"
          }`}
        >
          {isPipelineRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>Run Optimization</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
