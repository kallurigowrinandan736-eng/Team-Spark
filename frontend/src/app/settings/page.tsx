"use client";

import React, { useState } from "react";
import { TopNav } from "../../components/aquaflow/TopNav";
import { Settings, Bell, Sliders, Database, ShieldCheck, Check } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState("85");
  const [inflowWarning, setInflowWarning] = useState("4000");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <TopNav />

      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C] tracking-tight">
            System Configuration & Alert Thresholds
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure automated SCADA telemetry limits, alert triggers, and measurement units
          </p>
        </div>

        <div className="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B192C] flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Hydraulic Alert Thresholds
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Reservoir Water Level Alert (% of FRL)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="flex-1 accent-blue-600"
                />
                <span className="text-sm font-bold text-blue-600 w-12">{alertThreshold}%</span>
              </div>
              <p className="text-[11px] text-slate-400">Trigger yellow alert when reservoir exceeds this level.</p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-700">
                Peak Inflow Warning Limit (m³/s)
              </label>
              <input
                type="number"
                value={inflowWarning}
                onChange={(e) => setInflowWarning(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {saved ? (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences saved!
              </span>
            ) : <span />}

            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
