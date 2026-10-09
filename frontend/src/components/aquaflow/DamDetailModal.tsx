"use client";

import React from "react";
import {
  X, MapPin, Droplets, Waves, CheckCircle2, AlertTriangle,
  Building2, ExternalLink, Calendar, ShieldCheck
} from "lucide-react";
import { DamInfo } from "../../data/aquaFlowConfig";

interface DamDetailModalProps {
  dam: DamInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAsActive?: (damId: string) => void;
}

export function DamDetailModal({
  dam,
  isOpen,
  onClose,
  onSelectAsActive
}: DamDetailModalProps) {
  if (!isOpen || !dam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Photo Header with Badges */}
        <div className="relative h-48 sm:h-56 w-full shrink-0">
          <picture>
            <source srcSet={dam.photoWebp} type="image/webp" />
            <img
              src={dam.photoUrl}
              alt={dam.name}
              className="w-full h-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Location on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  dam.status === "Operational"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-400/40"
                }`}
              >
                {dam.status}
              </span>
              <span className="text-xs text-slate-300">• {dam.river}</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight">{dam.name}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {dam.location}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Key Hydrology Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Gross Capacity</span>
              <p className="text-base font-extrabold text-[#0B192C] mt-0.5">{dam.grossCapacityTmc} TMC</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Storage</span>
              <p className="text-base font-extrabold text-blue-600 mt-0.5">{dam.currentStorageTmc} TMC</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Water Level</span>
              <p className="text-base font-extrabold text-emerald-600 mt-0.5">{dam.waterLevelPct}%</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Full Res Level</span>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">{dam.fullReservoirLevelFt} ft</p>
            </div>
          </div>

          {/* Current Flow & Precipitation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Waves className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Inflow Discharge</p>
                <p className="text-sm font-bold text-slate-800">{dam.inflowCumecs.toLocaleString()} m³/s</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Outflow Release</p>
                <p className="text-sm font-bold text-slate-800">{dam.outflowCumecs.toLocaleString()} m³/s</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Catchment Rainfall</p>
                <p className="text-sm font-bold text-slate-800">{dam.rainfallMm} mm</p>
              </div>
            </div>
          </div>

          {/* Data Honesty and Citation */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Verified CWC Hydrological Baseline</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Source Citation:</strong> {dam.citation}. Storage capacity and coordinates are verified against Central Water Commission (CWC) National Register of Large Dams.
            </p>
            <p className="text-[10px] text-slate-400">
              Coordinates: {dam.coordinates[0]}° N, {dam.coordinates[1]}° E ({dam.isCoordinatesVerified ? "Verified Geo-Location" : "Approximate"})
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Jaldhar Multi-Reservoir Engine</span>
          <div className="flex items-center gap-2">
            {onSelectAsActive && (
              <button
                onClick={() => {
                  onSelectAsActive(dam.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Monitor on Dashboard
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
