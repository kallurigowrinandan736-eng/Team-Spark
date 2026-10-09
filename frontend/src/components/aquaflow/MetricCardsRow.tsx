"use client";

import React from "react";
import {
  Waves, TrendingUp, TrendingDown, CloudRain, Droplets,
  ArrowUpRight, ArrowDownRight, Info
} from "lucide-react";
import { DamInfo } from "../../data/aquaFlowConfig";

interface MetricCardsRowProps {
  dam: DamInfo;
}

export function MetricCardsRow({ dam }: MetricCardsRowProps) {
  // Sparkline data points for Inflow and Outflow
  const inflowPoints = [2200, 2400, 2900, 3100, 3250, 3350, dam.inflowCumecs];
  const outflowPoints = [2700, 2800, 2950, 2800, 2920, 2850, dam.outflowCumecs];
  const rainfallBars = [12, 18, 14, 28, 22, 19, dam.rainfallMm];

  // Helper for SVG Sparkline paths
  const renderSparkline = (data: number[], color: string, fillColor: string) => {
    const min = Math.min(...data) * 0.9;
    const max = Math.max(...data) * 1.05;
    const width = 120;
    const height = 36;
    const step = width / (data.length - 1);

    const points = data.map((d, i) => {
      const x = i * step;
      const y = height - ((d - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    });

    const pathD = `M ${points.join(" L ")}`;
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`grad-${fillColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${fillColor})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  // Circular Donut Calculation for Reservoir Capacity
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dam.waterLevelPct / 100) * circumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {/* 1. Water Level Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                <Waves className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Water Level</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-medium">Demo Data</span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight">
              {dam.waterLevelPct}%
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{dam.waterLevelDeltaPct}%
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-700"
              style={{ width: `${dam.waterLevelPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {dam.currentStorageTmc} TMC / {dam.grossCapacityTmc} TMC
          </p>
        </div>
      </div>

      {/* 2. Inflow Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Inflow</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-medium">Demo Data</span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight">
              {dam.inflowCumecs.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">m³/s</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center ml-auto">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{dam.inflowDeltaPct}%
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          {renderSparkline(inflowPoints, "#0284c7", "blue")}
        </div>
      </div>

      {/* 3. Outflow Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
                <TrendingDown className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Outflow</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-medium">Demo Data</span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight">
              {dam.outflowCumecs.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">m³/s</span>
            <span className="text-xs font-bold text-rose-500 flex items-center ml-auto">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {dam.outflowDeltaPct}%
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          {renderSparkline(outflowPoints, "#0284c7", "sky")}
        </div>
      </div>

      {/* 4. Rainfall Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                <CloudRain className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Rainfall</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-medium">Demo Data</span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight">
              {dam.rainfallMm}
            </span>
            <span className="text-xs font-medium text-slate-500">mm</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center ml-auto">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{dam.rainfallDeltaPct}%
            </span>
          </div>
        </div>

        {/* Mini Bars */}
        <div className="mt-3 flex items-end gap-1.5 h-9 justify-end">
          {rainfallBars.map((val, i) => (
            <div
              key={i}
              className="w-2.5 bg-blue-500 hover:bg-blue-600 rounded-t-sm transition-all"
              style={{ height: `${Math.min(100, (val / 35) * 100)}%` }}
              title={`Day ${i + 1}: ${val} mm`}
            />
          ))}
        </div>
      </div>

      {/* 5. Reservoir Capacity Donut Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Reservoir Capacity</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-medium">Demo Data</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          {/* Circular Donut SVG */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-slate-100"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-blue-600 transition-all duration-700"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-800">
              {dam.waterLevelPct}%
            </span>
          </div>

          {/* Legend */}
          <div className="text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <span className="truncate">Current ({dam.currentStorageTmc} TMC)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-sky-300 shrink-0" />
              <span className="truncate">Remaining ({dam.remainingStorageTmc} TMC)</span>
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">
              Total: {dam.grossCapacityTmc} TMC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
