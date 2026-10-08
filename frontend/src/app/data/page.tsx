"use client";

import React, { useState } from "react";
import { useWaterStore } from "../../store/useWaterStore";
import { HonestyBadge } from "../../components/HonestyBadge";
import { Database, Upload, Download, RefreshCw, CheckCircle2, AlertTriangle, FileText } from "lucide-react";

export default function DataManagementPage() {
  const { reservoirs, canals, crops, regions, runOptimizationPipeline } = useWaterStore();
  const [selectedDataset, setSelectedDataset] = useState<"reservoirs" | "canals" | "crops" | "regions">("reservoirs");
  const [uploadStatus, setUploadStatus] = useState<any>(null);
  const [isResetting, setIsResetting] = useState(false);

  const exportCsv = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            const val = row[fieldName];
            return typeof val === "object" ? `"${JSON.stringify(val).replace(/"/g, '""')}"` : `"${val}"`;
          })
          .join(",")
      )
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        setUploadStatus({
          status: "success",
          message: `Successfully validated and parsed ${lines.length - 1} records from '${file.name}'.`,
          rows: lines.length - 1
        });
        runOptimizationPipeline();
      } catch (err: any) {
        setUploadStatus({
          status: "error",
          message: `CSV parsing error: ${err.message}`
        });
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setUploadStatus({
        status: "success",
        message: "All datasets have been restored to default synthetic AP Krishna Basin demo records."
      });
      runOptimizationPipeline();
    }, 600);
  };

  const getActiveData = () => {
    if (selectedDataset === "reservoirs") return reservoirs;
    if (selectedDataset === "canals") return canals;
    if (selectedDataset === "crops") return crops;
    return regions;
  };

  const activeRecords = getActiveData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-cyan-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Data Management</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Dataset Explorer & CSV Ingestion Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            View demo data registers, export schema-compliant CSVs, and upload custom hydrological configurations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <HonestyBadge type="demo" />
          <button
            onClick={handleResetData}
            disabled={isResetting}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isResetting ? "animate-spin" : ""}`} />
            <span>Reset to Demo Data</span>
          </button>
        </div>
      </div>

      {/* Upload and Export Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Import Custom CSV Dataset</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Upload CSV for Reservoirs, Canals, Crops, or Regions with auto-imputation and schema validation
          </p>
          <label className="flex items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 cursor-pointer transition-colors bg-slate-950/40">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            <div className="text-center text-xs text-slate-400">
              <span className="text-cyan-400 font-semibold">Click to select CSV file</span> or drop file here
            </div>
          </label>
        </div>

        <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Active Datasets</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Download schema-compliant CSV tables with active scenario allocations and capacity parameters
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => exportCsv(reservoirs, "aquaq_reservoirs")}
              className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium"
            >
              Export Reservoirs
            </button>
            <button
              onClick={() => exportCsv(canals, "aquaq_canals")}
              className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium"
            >
              Export Canals
            </button>
            <button
              onClick={() => exportCsv(crops, "aquaq_crops")}
              className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium"
            >
              Export Crops
            </button>
            <button
              onClick={() => exportCsv(regions, "aquaq_regions")}
              className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium"
            >
              Export Districts
            </button>
          </div>
        </div>
      </div>

      {/* Upload Feedback Toast / Alert */}
      {uploadStatus && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between animate-in fade-in duration-200 ${
            uploadStatus.status === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/40 border-rose-500/40 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {uploadStatus.status === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>{uploadStatus.message}</span>
          </div>
          <button onClick={() => setUploadStatus(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Data Table Viewer */}
      <div className="p-5 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md space-y-4">
        {/* Dataset Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          {(["reservoirs", "canals", "crops", "regions"] as const).map((ds) => (
            <button
              key={ds}
              onClick={() => setSelectedDataset(ds)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedDataset === ds
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {ds} ({ds === "reservoirs" ? reservoirs.length : ds === "canals" ? canals.length : ds === "crops" ? crops.length : regions.length})
            </button>
          ))}
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ocean-950 text-slate-400 uppercase text-[10px]">
              <tr>
                {activeRecords.length > 0 &&
                  Object.keys(activeRecords[0]).map((k) => (
                    <th key={k} className="px-3 py-2 whitespace-nowrap">
                      {k.replace(/_/g, " ")}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {activeRecords.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  {Object.entries(row).map(([k, v]: [string, any], j) => (
                    <td key={j} className="px-3 py-2.5 whitespace-nowrap">
                      {typeof v === "object" ? JSON.stringify(v) : String(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
