"use client";

import React from "react";
import { TopNav } from "../../components/aquaflow/TopNav";
import { FEATURED_DAMS } from "../../data/aquaFlowConfig";
import { FileText, Download, Calendar, Filter, CheckCircle2 } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { id: "REP-2026-09", title: "Daily Reservoir Storage & Inflow Bulletin", date: "Sep 15, 2026", size: "1.4 MB", type: "PDF" },
    { id: "REP-2026-08", title: "Monthly Krishna Basin Discharge Audit", date: "Aug 31, 2026", size: "3.8 MB", type: "PDF" },
    { id: "REP-2026-07", title: "Canal Conveyance Loss & Seepage Analysis", date: "Jul 31, 2026", size: "2.1 MB", type: "XLSX" },
    { id: "REP-2026-06", title: "Monsoon Catchment Infiltration Audit", date: "Jun 30, 2026", size: "4.5 MB", type: "PDF" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <TopNav />

      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C] tracking-tight">
              Hydrological Reports & Discharge Logs
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Download validated daily, weekly, and monthly reservoir discharge telemetry audits
            </p>
          </div>

          <button
            onClick={() => alert("Generating automated daily report...")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate New Audit</span>
          </button>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Report Identifier</th>
                <th className="py-3 px-4">Title / Scope</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{r.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{r.title}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{r.date}</td>
                  <td className="py-3.5 px-4 text-slate-400">{r.size} • {r.type}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Downloading ${r.title}...`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
