"use client";

import React from "react";
import {
  Sliders, ShieldAlert, Waves, CheckCircle2, Clock, AlertTriangle,
  Info, Eye, ChevronRight, Activity, Zap
} from "lucide-react";
import { DamDetailedRecord, GateStatus } from "../../../data/damDetailsData";

interface GateOperationsSectionProps {
  dam: DamDetailedRecord;
}

export function GateOperationsSection({ dam }: GateOperationsSectionProps) {
  return (
    <section id="gate-operations" className="space-y-6 pt-4">
      {/* Section Header with Safety Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
              Gate Operations &amp; Spillway Telemetry
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Supervisory monitoring of radial crest gates, hoist lift positions, and river release volumes
          </p>
        </div>

        {/* Safety Disclaimer Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200/80 text-xs font-semibold self-start sm:self-auto">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Monitoring Only — Physical Actuation Restricted</span>
        </div>
      </div>

      {/* Discharge Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400">Total Spillway Release</span>
            <p className="text-xl font-black text-[#0B192C]">{dam.spillwayDischargeCusecs.toLocaleString()} <span className="text-xs font-semibold text-slate-500">cusecs</span></p>
            <p className="text-[11px] text-blue-600 font-medium">{dam.openGates} of {dam.totalGates} crest gates discharging</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400">Hydro Powerhouse Flow</span>
            <p className="text-xl font-black text-[#0B192C]">{dam.powerhouseDischargeCusecs.toLocaleString()} <span className="text-xs font-semibold text-slate-500">cusecs</span></p>
            <p className="text-[11px] text-emerald-600 font-medium">Turbines spinning under active generation</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400">Total River Discharge</span>
            <p className="text-xl font-black text-indigo-600">{dam.outflowCusecs.toLocaleString()} <span className="text-xs font-semibold text-slate-500">cusecs</span></p>
            <p className="text-[11px] text-slate-500 font-medium">Equates to {dam.outflowCumecs.toLocaleString()} m³/s into riverbed</p>
          </div>
        </div>
      </div>

      {/* 12 Gates Visualizer Grid */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#0B192C] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Spillway Crest Gates Status Matrix ({dam.gates.length} Gates)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Each gate spans 15.24m × 16.76m with automated wire-rope electric hoist telemetry
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Open ({dam.openGates})</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>Closed ({dam.totalGates - dam.openGates})</span>
            </span>
          </div>
        </div>

        {/* Gates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
          {dam.gates.slice(0, 12).map((gate) => {
            const isOpen = gate.status === "Open";
            return (
              <div
                key={gate.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isOpen
                    ? "bg-emerald-50/50 border-emerald-200/90 shadow-sm"
                    : "bg-slate-50 border-slate-200/70 opacity-90"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#0B192C] text-sm">{gate.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOpen
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {gate.status}
                  </span>
                </div>

                <div className="my-2.5 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Gate Lift:</span>
                    <strong className={isOpen ? "text-emerald-700 font-extrabold" : "text-slate-600"}>
                      {gate.liftFt > 0 ? `${gate.liftFt} ft` : "Seated (0 ft)"}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Discharge:</span>
                    <strong className={isOpen ? "text-blue-700 font-bold" : "text-slate-400"}>
                      {gate.dischargeCusecs > 0 ? `${gate.dischargeCusecs.toLocaleString()} cfs` : "0 cfs"}
                    </strong>
                  </div>
                </div>

                {/* Gate visual graphic */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full ${isOpen ? "bg-emerald-500" : "bg-slate-300"}`}
                    style={{ width: isOpen ? `${Math.min(100, (gate.liftFt / 15) * 100)}%` : "0%" }}
                  />
                </div>

                <span className="text-[10px] text-slate-400 mt-2 block truncate font-mono">
                  {gate.lastUpdated}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Operations Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0B192C] flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Historical Operations &amp; Gate Adjustment Log</span>
            </h3>
            <p className="text-xs text-slate-400">
              Recent recorded operations, spillway regulation directives, and official sign-offs
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            Live SCADA Relay
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Log ID / Timestamp</th>
                <th className="py-2.5 px-3">Operation Event</th>
                <th className="py-2.5 px-3">Gates Affected</th>
                <th className="py-2.5 px-3">Discharge Impact</th>
                <th className="py-2.5 px-3">Authorized By</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dam.gateLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-medium whitespace-nowrap">
                    <span className="font-mono text-slate-900 font-bold block">{log.id}</span>
                    <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-3 px-3 font-mono text-blue-600 font-semibold">
                    {log.gatesAffected}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {log.dischargeChange}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {log.authorizedBy}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.status === "Active"
                          ? "bg-blue-100 text-blue-700"
                          : log.status === "Completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Safety & Protocol Box */}
        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/70 text-xs text-slate-700 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Dam Safety Protocol Note:</strong> Spillway gates at {dam.name} operate in accordance with the CWC Rule Curves and Krishna River Management Board (KRMB) flood regulation manual. Remote actuation controls are strictly disabled on public telemetric networks to ensure industrial SCADA air-gap integrity.
          </p>
        </div>
      </div>
    </section>
  );
}
