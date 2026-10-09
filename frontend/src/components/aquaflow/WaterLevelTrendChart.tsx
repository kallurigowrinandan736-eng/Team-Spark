"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, Line
} from "recharts";
import { ChevronDown, Info } from "lucide-react";
import { DamInfo } from "../../data/aquaFlowConfig";

interface WaterLevelTrendChartProps {
  dam: DamInfo;
}

export function WaterLevelTrendChart({ dam }: WaterLevelTrendChartProps) {
  const [timeRange, setTimeRange] = useState("Last 8 Months");
  const data = dam.monthlyTrend;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#0B192C]">
            Water Level Trend
          </h3>
          <p className="text-[11px] text-slate-400">Monthly reservoir filling trajectory</p>
        </div>

        {/* Time-Range Selector */}
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
          >
            <option value="Last 8 Months">Last 8 Months</option>
            <option value="Current Water Year">Current Water Year</option>
            <option value="Historical 5-Yr">Historical 5-Yr Avg</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-52 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="waterLevelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white rounded-xl p-2.5 text-xs shadow-xl border border-slate-800 space-y-1">
                      <p className="font-bold text-sky-400">{item.month} 2026</p>
                      <p className="font-semibold">Water Level: {item.levelPct}%</p>
                      <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800 space-y-0.5">
                        <p>Inflow: {item.inflow} m³/s</p>
                        <p>Outflow: {item.outflow} m³/s</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="levelPct"
              stroke="#0284c7"
              strokeWidth={2.5}
              fill="url(#waterLevelGrad)"
              dot={{ r: 3.5, fill: "#0284c7", strokeWidth: 1.5, stroke: "#ffffff" }}
              activeDot={{ r: 5, fill: "#0369a1", strokeWidth: 2, stroke: "#ffffff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400" />
          Full Reservoir Level (FRL): {dam.fullReservoirLevelFt} ft
        </span>
        <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          Current: {dam.waterLevelPct}%
        </span>
      </div>
    </div>
  );
}
