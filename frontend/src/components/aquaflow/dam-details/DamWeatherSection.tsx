"use client";

import React from "react";
import {
  Cloud, CloudRain, Droplets, Wind, Compass, Thermometer,
  Eye, Gauge, Sun, Info, Calendar
} from "lucide-react";
import { DamDetailedRecord } from "../../../data/damDetailsData";

interface DamWeatherSectionProps {
  dam: DamDetailedRecord;
}

export function DamWeatherSection({ dam }: DamWeatherSectionProps) {
  const w = dam.weather;

  return (
    <section className="space-y-4 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
              Catchment Hydro-Meteorological Conditions
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Atmospheric parameters and precipitation forecast over {dam.name} reservoir basin
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200 text-[11px] font-semibold self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Demo Meteorological Telemetry</span>
        </div>
      </div>

      {/* Main Weather Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Temperature & Cloud Condition (4 cols) */}
          <div className="md:col-span-4 flex items-center gap-4 pr-0 md:pr-4 md:border-r border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <CloudRain className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-[#0B192C]">
                  {w.tempC}°
                </span>
                <span className="text-lg font-bold text-slate-500">C</span>
              </div>
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                {w.condition}
              </p>
              <p className="text-xs text-slate-400">
                {dam.district}, {dam.state}
              </p>
            </div>
          </div>

          {/* 4 Compact Weather Metrics (5 cols) */}
          <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                <span>24h Rain</span>
              </div>
              <p className="text-base font-extrabold text-[#0B192C] mt-1">
                {w.rainfall24hMm} mm
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Droplets className="w-3.5 h-3.5 text-teal-500" />
                <span>Humidity</span>
              </div>
              <p className="text-base font-extrabold text-[#0B192C] mt-1">
                {w.humidityPct}%
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Wind className="w-3.5 h-3.5 text-indigo-500" />
                <span>Wind</span>
              </div>
              <p className="text-base font-extrabold text-[#0B192C] mt-1">
                {w.windSpeedKmh} <span className="text-[10px] text-slate-500">{w.windDirection}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Gauge className="w-3.5 h-3.5 text-sky-500" />
                <span>Pressure</span>
              </div>
              <p className="text-base font-extrabold text-[#0B192C] mt-1">
                {w.pressureHpa} hPa
              </p>
            </div>
          </div>

          {/* 3-Day Outlook (3 cols) */}
          <div className="md:col-span-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              3-Day Catchment Forecast
            </span>
            <div className="space-y-1.5 divide-y divide-slate-100 text-xs">
              {w.forecast.map((f, idx) => (
                <div key={idx} className="flex justify-between items-center pt-1 first:pt-0">
                  <span className="text-slate-600 font-medium">{f.day}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-semibold">{f.rain}</span>
                    <span className="font-extrabold text-[#0B192C]">{f.temp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
