"use client";

import React, { useState } from "react";
import { useWaterStore } from "../store/useWaterStore";
import { ThemeToggle } from "./ThemeToggle";
import {
  Sparkles, RefreshCw, ChevronDown,
  Wifi, WifiOff, Layers, CheckCircle2
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    scenarios, selectedScenario, setScenario,
    runOptimizationPipeline, isPipelineRunning,
    isOfflineMode
  } = useWaterStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 w-full dark:bg-[#08120a]/90 bg-white/95 backdrop-blur-xl dark:border-b dark:border-white/10 border-b border-emerald-200/60 px-6 flex items-center justify-between shadow-sm transition-colors duration-300">
      {/* Left: Clean Scenario Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl dark:bg-ocean-900 bg-emerald-50/70 border dark:border-slate-700 border-emerald-200 text-sm font-medium dark:text-slate-200 text-slate-800 hover:border-emerald-500/50 hover:bg-emerald-100/50 transition-all shadow-sm"
          >
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-emerald-950 dark:text-white">Scenario:</span>
            <span className="max-w-[200px] truncate">{selectedScenario.name.split(":")[0]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 rounded-2xl dark:bg-ocean-900/95 bg-white/95 border dark:border-slate-700/80 border-emerald-200 shadow-xl backdrop-blur-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-xs font-semibold dark:text-slate-400 text-emerald-800 uppercase tracking-wider">
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
                        ? "dark:bg-emerald-500/15 bg-emerald-100/70 dark:text-emerald-300 text-emerald-900 border border-emerald-500/30 font-semibold"
                        : "dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800/60 hover:bg-emerald-50"
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${selectedScenario.id === sc.id ? "text-emerald-500 opacity-100" : "opacity-0"}`} />
                    <div>
                      <div className="font-semibold">{sc.name}</div>
                      <div className="text-[11px] dark:text-slate-400 text-slate-500 line-clamp-1">{sc.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Theme Toggle, Connection Status, & Main Action Button */}
      <div className="flex items-center gap-3">
        {/* Night / Light Mode Toggle */}
        <ThemeToggle showLabel={false} />

        {/* Backend status indicator */}
        {isOfflineMode ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium dark:bg-amber-950/60 bg-amber-50 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <WifiOff className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Offline Mode</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium dark:bg-emerald-950/60 bg-emerald-50 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Backend Online</span>
          </div>
        )}

        {/* Main Run Optimization Action Button */}
        <button
          onClick={() => runOptimizationPipeline()}
          disabled={isPipelineRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-md duration-200 ${
            isPipelineRunning
              ? "bg-slate-600 cursor-not-allowed opacity-80"
              : "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-emerald-700/25 active:scale-95"
          }`}
        >
          {isPipelineRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-100" />
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span>Run Optimization</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
