"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Play, CloudSun, CloudRain, ShieldCheck,
  Layers, Waves, Users, Building2
} from "lucide-react";
import { AQUAFLOW_CONFIG } from "../../data/aquaFlowConfig";
import { VideoModal } from "./VideoModal";

export function HeroSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { weather, heroStats } = AQUAFLOW_CONFIG;

  const statIcons: Record<string, React.ReactNode> = {
    dam: <Building2 className="w-6 h-6 text-sky-300" />,
    waves: <Waves className="w-6 h-6 text-sky-300" />,
    database: <Layers className="w-6 h-6 text-sky-300" />,
    users: <Users className="w-6 h-6 text-sky-300" />
  };

  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex flex-col justify-between overflow-hidden">
      {/* Full-Width Dam Photo Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <picture>
          <source srcSet="/images/hero-dam.webp" type="image/webp" />
          <img
            src="/images/hero-dam.jpg"
            alt="Hydroelectric Dam reservoir with green mountains and cloud sky"
            className="w-full h-full object-cover object-center scale-[1.02]"
            fetchPriority="high"
          />
        </picture>

        {/* Ambient Darkened Gradient for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-8 w-full flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Text Column */}
          <div className="lg:col-span-8 max-w-2xl text-white space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] drop-shadow-md">
              Smart Water.
              <br />
              <span className="text-white">Sustainable Future.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200/90 font-normal max-w-xl leading-relaxed drop-shadow-sm">
              Monitor dams, manage water resources, and support a greener tomorrow.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-black/40 hover:bg-black/60 text-white font-semibold text-sm backdrop-blur-md border border-white/25 shadow-md hover:border-white/40 active:scale-[0.98] transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>
          </div>

          {/* Right Floating Weather Card */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="w-full sm:w-72 bg-black/45 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-xl hover:border-white/30 transition-all">
              {/* Temperature & Condition */}
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight">{weather.tempC}°C</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">{weather.condition}</p>
                  <p className="text-[11px] text-slate-400">{weather.location}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-300">
                  <CloudSun className="w-7 h-7" />
                </div>
              </div>

              {/* Rainfall Today */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight">{weather.rainfallTodayMm} mm</p>
                    <p className="text-[10px] text-slate-400">Rainfall Today</p>
                  </div>
                </div>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-400/30">
                  Active Radar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Translucent Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-12 pb-4">
          {heroStats.map((stat) => (
            <div
              key={stat.id}
              className="bg-black/40 hover:bg-black/55 backdrop-blur-md border border-white/15 hover:border-white/30 rounded-2xl p-4 flex items-center gap-3.5 text-white shadow-lg transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0">
                {statIcons[stat.icon] || <Layers className="w-5 h-5 text-sky-300" />}
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-black tracking-tight leading-none text-white">
                  {stat.value}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-300 font-medium truncate mt-1">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </section>
  );
}
