"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin, ShieldCheck, Waves, BarChart3, ChevronDown, Compass,
  Clock, ArrowUpRight, CheckCircle2, AlertTriangle, Droplets
} from "lucide-react";
import { DamDetailedRecord, DAM_DETAILS_DATA } from "../../../data/damDetailsData";

interface DamHeroSectionProps {
  dam: DamDetailedRecord;
}

export function DamHeroSection({ dam }: DamHeroSectionProps) {
  const router = useRouter();

  const handleDamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    router.push(`/dams/${selectedId}`);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg bg-slate-900 text-white">
      {/* High-Resolution Authentic Dam Photograph */}
      <div className="relative h-[440px] sm:h-[480px] lg:h-[520px] w-full overflow-hidden">
        <picture>
          <source srcSet={dam.heroImage} type="image/webp" />
          <img
            src={dam.heroImage}
            alt={`${dam.name} - ${dam.river}`}
            className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
          />
        </picture>

        {/* Professional environmental subtle gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/95 via-[#0B192C]/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B192C]/80 via-transparent to-black/20" />

        {/* Top Floating Controls Bar */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-center justify-between gap-3 z-10">
          {/* Breadcrumb & Station ID */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-200/90 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
            <Link href="/" className="hover:text-blue-300 transition-colors">Jaldhar</Link>
            <span className="text-slate-400">/</span>
            <Link href="/dams" className="hover:text-blue-300 transition-colors">Dams</Link>
            <span className="text-slate-400">/</span>
            <span className="text-white font-semibold">{dam.name}</span>
          </div>

          {/* Dam Switcher Selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={dam.id}
                onChange={handleDamChange}
                aria-label="Switch Dam"
                className="appearance-none bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/25 rounded-xl pl-3.5 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all"
              >
                {Object.values(DAM_DETAILS_DATA).map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-white font-medium">
                    {d.name} ({d.river})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/80 pointer-events-none" />
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-3 py-1.5 rounded-xl text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Telemetry</span>
            </div>
          </div>
        </div>

        {/* Hero Overlay Content */}
        <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            {/* Operational Status Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${
                  dam.statusType === "Operational"
                    ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
                    : "bg-amber-500/20 text-amber-200 border-amber-400/40"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                {dam.statusBadge}
              </span>

              <span className="text-xs text-slate-300 font-medium bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                {dam.river} Basin
              </span>

              <span className="hidden sm:inline-block text-xs text-slate-300 font-medium bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                CWC Hydrology Station #AP-KRS-04
              </span>
            </div>

            {/* Dam Name & Location */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {dam.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-200/90 font-medium flex items-center gap-2 mt-1.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{dam.river} • {dam.location}</span>
              </p>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl font-light">
                {dam.formalName} — Primary interstate multi-purpose hydroelectric and irrigation reservoir in the Eastern Ghats.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection("reservoir-overview")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center gap-2 transition-all active:scale-95"
              >
                <BarChart3 className="w-4 h-4" />
                <span>View Water Statistics</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("location-surroundings")}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <Compass className="w-4 h-4 text-sky-300" />
                <span>Explore Location</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("gate-operations")}
                className="px-4 py-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-slate-200 hover:text-white font-medium text-xs sm:text-sm rounded-xl border border-white/15 flex items-center gap-1.5 transition-all"
              >
                <Waves className="w-3.5 h-3.5 text-blue-400" />
                <span>Gate Operations ({dam.openGates}/{dam.totalGates} Open)</span>
              </button>
            </div>
          </div>

          {/* Key Quick Stats Pill */}
          <div className="bg-black/55 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs space-y-2 min-w-[240px] shrink-0 shadow-xl">
            <div className="flex justify-between items-center text-slate-300 pb-1.5 border-b border-white/10">
              <span>Full Reservoir Level</span>
              <span className="font-bold text-white">{dam.fullReservoirLevelFt} ft</span>
            </div>
            <div className="flex justify-between items-center text-slate-300 pb-1.5 border-b border-white/10">
              <span>Current Water Level</span>
              <span className="font-extrabold text-sky-400 text-sm">{dam.currentLevelFt} ft</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Current Live Storage</span>
              <span className="font-extrabold text-emerald-400 text-sm">{dam.currentStorageTmc} TMC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
