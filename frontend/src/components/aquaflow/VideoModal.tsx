"use client";

import React from "react";
import { X, Play, ShieldAlert, ExternalLink } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <h3 className="text-base font-semibold text-white">Jaldhar System Demonstration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player or Interactive Simulation Preview */}
        <div className="relative aspect-video bg-black flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mb-4 text-blue-400">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">Automated Dam Telemetry & Allocation Overview</h4>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Watch how Jaldhar ingests acoustic Doppler stream gauges, satellite monsoon precipitation radar, and AI predictive models to optimize Krishna-Godavari basin releases.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#dashboard"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              Explore Live Dashboard
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950/60 text-slate-400 text-[11px] flex items-center justify-between">
          <span>Demo Data mode • AP Water Resources Engineering</span>
          <span className="text-slate-500">Duration: 1m 45s</span>
        </div>
      </div>
    </div>
  );
}
