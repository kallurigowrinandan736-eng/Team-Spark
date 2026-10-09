"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Waves, Activity } from "lucide-react";
import { AQUAFLOW_CONFIG } from "../../data/aquaFlowConfig";

export function CanalNetworkCard() {
  const { canalOverview } = AQUAFLOW_CONFIG;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#0B192C]">
            Canal Network
          </h3>
          <p className="text-[11px] text-slate-400">Distribution command telemetry</p>
        </div>

        <Link
          href="/canals"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Real Canal Photo Container with Bottom Floating Overlays */}
      <div className="relative w-full h-56 sm:h-60 rounded-xl overflow-hidden shadow-inner group">
        <picture>
          <source srcSet="/images/canal.webp" type="image/webp" />
          <img
            src="/images/canal.jpg"
            alt="Concrete irrigation canal through green agricultural fields"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </picture>

        {/* Ambient Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

        {/* Bottom Floating Translucent Pill Overlays */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Overlay 1: Total Canals */}
          <div className="flex-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-2.5 text-white flex items-center gap-2 shadow-lg">
            <div className="w-8 h-8 rounded-lg bg-sky-500/25 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
              <Waves className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-300 font-medium leading-none">Total Canals</p>
              <p className="text-sm font-extrabold text-white tracking-tight mt-0.5">
                {canalOverview.totalLengthKm} km
              </p>
            </div>
          </div>

          {/* Overlay 2: Active Flow */}
          <div className="flex-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-2.5 text-white flex items-center gap-2 shadow-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/25 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-300 font-medium leading-none">Active Flow</p>
              <p className="text-sm font-extrabold text-white tracking-tight mt-0.5">
                {canalOverview.activeFlowPct}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
