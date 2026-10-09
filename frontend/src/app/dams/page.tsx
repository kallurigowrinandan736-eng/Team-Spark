"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "../../components/aquaflow/TopNav";
import { FEATURED_DAMS, DamInfo } from "../../data/aquaFlowConfig";
import { DamDetailModal } from "../../components/aquaflow/DamDetailModal";
import { Building2, MapPin, Droplets, Waves, Search, ShieldCheck, ArrowRight } from "lucide-react";

export default function DamsDirectoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeModalDam, setActiveModalDam] = useState<DamInfo | null>(null);

  const filtered = FEATURED_DAMS.filter((dam) => {
    const matchSearch =
      dam.name.toLowerCase().includes(search.toLowerCase()) ||
      dam.district.toLowerCase().includes(search.toLowerCase()) ||
      dam.river.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || dam.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <TopNav />

      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C] tracking-tight">
              Major Dams & Reservoirs Directory
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Verified storage capacity, current fill levels, and river discharge gates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search dams or rivers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Operational">Operational</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>
        </div>

        {/* Dams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((dam) => (
            <div
              key={dam.id}
              onClick={() => router.push(`/dams/${dam.id}`)}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <picture>
                  <source srcSet={dam.photoWebp} type="image/webp" />
                  <img
                    src={dam.photoUrl}
                    alt={dam.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </picture>
                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${
                    dam.status === "Operational"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-amber-50 text-amber-700 border-amber-300"
                  }`}
                >
                  {dam.status}
                </span>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0B192C] group-hover:text-blue-600 transition-colors">{dam.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {dam.location} • {dam.river}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Water Fill Level</span>
                    <span className="text-blue-600">{dam.waterLevelPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${dam.waterLevelPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Current: {dam.currentStorageTmc} TMC</span>
                    <span>Gross: {dam.grossCapacityTmc} TMC</span>
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dams/${dam.id}`);
                    }}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Dam Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalDam(dam);
                    }}
                    className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                    title="Quick Specs Modal"
                  >
                    Quick
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <DamDetailModal
        dam={activeModalDam}
        isOpen={!!activeModalDam}
        onClose={() => setActiveModalDam(null)}
      />
    </div>
  );
}
