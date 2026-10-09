"use client";

import React from "react";
import { TopNav } from "../../components/aquaflow/TopNav";
import { AQUAFLOW_CONFIG, FEATURED_DAMS } from "../../data/aquaFlowConfig";
import { CloudSun, CloudRain, Wind, Droplets, Thermometer, ShieldCheck } from "lucide-react";

export default function WeatherPage() {
  const { weather } = AQUAFLOW_CONFIG;

  const catchmentForecast = [
    { area: "Upper Krishna Catchment (Almatti / Narayanpur)", rainMm: 38.5, status: "High Runoff", trend: "Increasing" },
    { area: "Middle Krishna (Srisailam Reservoir)", rainMm: 24.5, status: "Active Inflow", trend: "Steady" },
    { area: "Lower Krishna (Nagarjuna Sagar)", rainMm: 18.2, status: "Moderate Precipitation", trend: "Steady" },
    { area: "Krishna Delta (Prakasam Barrage)", rainMm: 31.0, status: "Coastal Showers", trend: "High Humidity" },
    { area: "Godavari Catchment (Polavaram Reservoir)", rainMm: 45.0, status: "Heavy Precipitation", trend: "Peak Inflow" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <TopNav />

      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C] tracking-tight">
            Meteorological & Monsoon Catchment Radar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Precipitation telemetry and basin atmospheric conditions impacting river inflows
          </p>
        </div>

        {/* Current Atmospheric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Temperature</p>
              <p className="text-2xl font-extrabold text-[#0B192C]">{weather.tempC}°C</p>
              <p className="text-[11px] text-slate-500">{weather.condition}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Daily Precipitation</p>
              <p className="text-2xl font-extrabold text-blue-600">{weather.rainfallTodayMm} mm</p>
              <p className="text-[11px] text-slate-500">Regional Average</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Relative Humidity</p>
              <p className="text-2xl font-extrabold text-sky-600">{weather.humidityPct}%</p>
              <p className="text-[11px] text-slate-500">Dew Point: 22°C</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Wind Speed</p>
              <p className="text-2xl font-extrabold text-teal-600">{weather.windSpeedKmh} km/h</p>
              <p className="text-[11px] text-slate-500">Direction: South-West</p>
            </div>
          </div>
        </div>

        {/* Catchment Runoff Advisory Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0B192C]">Catchment Basin Runoff Telemetry</h3>
            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold">Demo Sensor Feed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Catchment Basin</th>
                  <th className="py-2.5 px-3">Precipitation (24h)</th>
                  <th className="py-2.5 px-3">Hydrology Status</th>
                  <th className="py-2.5 px-3">Inflow Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {catchmentForecast.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-semibold text-slate-800">{c.area}</td>
                    <td className="py-3 px-3 font-bold text-blue-600">{c.rainMm} mm</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{c.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
