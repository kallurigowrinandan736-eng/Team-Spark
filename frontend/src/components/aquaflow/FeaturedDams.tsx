"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { FEATURED_DAMS, DamInfo } from "../../data/aquaFlowConfig";
import { DamDetailModal } from "./DamDetailModal";

interface FeaturedDamsProps {
  onSelectDam?: (damId: string) => void;
}

export function FeaturedDams({ onSelectDam }: FeaturedDamsProps) {
  const [selectedDam, setSelectedDam] = useState<DamInfo | null>(null);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#0B192C]">
            Featured Dams
          </h3>
          <p className="text-[11px] text-slate-400">Key storage infrastructure across Andhra Pradesh & Telangana</p>
        </div>

        <Link
          href="/dams"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Horizontal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {FEATURED_DAMS.map((dam) => {
          const isOperational = dam.status === "Operational";

          return (
            <div
              key={dam.id}
              onClick={() => setSelectedDam(dam)}
              className="group bg-white rounded-xl border border-slate-200/90 hover:border-blue-400/60 p-2.5 sm:p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Photo */}
              <div className="relative w-full h-32 sm:h-36 rounded-lg overflow-hidden bg-slate-100 mb-3">
                <picture>
                  <source srcSet={dam.photoWebp} type="image/webp" />
                  <img
                    src={dam.photoUrl}
                    alt={dam.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </picture>
              </div>

              {/* Title & Status Badge */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-start justify-between gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0B192C] group-hover:text-blue-600 transition-colors leading-tight">
                    {dam.name}
                  </h4>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      isOperational
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {dam.status}
                  </span>
                </div>

                {/* Location */}
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{dam.location}</span>
                </p>

                {/* Capacity */}
                <p className="text-[11px] font-semibold text-slate-700 pt-1">
                  Capacity: <span className="text-[#0B192C] font-bold">{dam.grossCapacityTmc} TMC</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <DamDetailModal
        dam={selectedDam}
        isOpen={!!selectedDam}
        onClose={() => setSelectedDam(null)}
        onSelectAsActive={(damId) => {
          if (onSelectDam) onSelectDam(damId);
        }}
      />
    </div>
  );
}
