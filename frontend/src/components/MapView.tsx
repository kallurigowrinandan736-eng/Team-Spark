"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Reservoir, Canal, Region, Crop } from "../lib/types";
import { HonestyBadge } from "./HonestyBadge";
import { Layers, Droplets, GitBranch, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Dynamic import for React-Leaflet components to avoid SSR window errors
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

interface MapViewProps {
  reservoirs: Reservoir[];
  canals: Canal[];
  regions: Region[];
  crops: Crop[];
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  reservoirs,
  canals,
  regions,
  crops,
  height = "560px"
}) => {
  const [mounted, setMounted] = useState(false);
  const [showReservoirs, setShowReservoirs] = useState(true);
  const [showCanals, setShowCanals] = useState(true);
  const [showRegions, setShowRegions] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-2xl bg-ocean-950 border border-slate-800 flex items-center justify-center text-slate-500 text-xs"
      >
        Loading GIS Water Network Map...
      </div>
    );
  }

  // Calculate district shortages
  const regionShortageMap: Record<string, { totalDemand: number; deficit: number }> = {};
  crops.forEach((cr) => {
    if (!regionShortageMap[cr.region_id]) {
      regionShortageMap[cr.region_id] = { totalDemand: 0, deficit: 0 };
    }
    regionShortageMap[cr.region_id].totalDemand += cr.total_demand_mcm;
    regionShortageMap[cr.region_id].deficit += cr.deficit_mcm;
  });

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-ocean-950 shadow-glass">
      {/* Top Map Layer Control Overlay */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2 bg-ocean-950/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 shadow-md text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-cyan-400" /> Layers:
        </span>
        <button
          onClick={() => setShowReservoirs(!showReservoirs)}
          className={`px-2 py-1 rounded-lg transition-colors ${
            showReservoirs ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "text-slate-500"
          }`}
        >
          Reservoirs
        </button>
        <button
          onClick={() => setShowCanals(!showCanals)}
          className={`px-2 py-1 rounded-lg transition-colors ${
            showCanals ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-500"
          }`}
        >
          Canals
        </button>
        <button
          onClick={() => setShowRegions(!showRegions)}
          className={`px-2 py-1 rounded-lg transition-colors ${
            showRegions ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-500"
          }`}
        >
          Districts
        </button>
      </div>

      <div className="absolute bottom-3 left-3 z-[1000]">
        <HonestyBadge type="demo" />
      </div>

      <div style={{ height }}>
        <MapContainer
          center={[16.30, 80.10]}
          zoom={8}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", backgroundColor: "#060b13" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles-dark"
          />

          {/* 1. Regions Shortage Polygons/Circles */}
          {showRegions &&
            regions.map((reg) => {
              const shortageData = regionShortageMap[reg.id] || { totalDemand: 100, deficit: 10 };
              const shortagePct = (shortageData.deficit / Math.max(1, shortageData.totalDemand)) * 100;
              const circleColor = shortagePct > 25 ? "#f43f5e" : shortagePct > 15 ? "#f59e0b" : "#38bdf8";

              return (
                <Circle
                  key={reg.id}
                  center={[reg.lat, reg.lng]}
                  radius={24000}
                  pathOptions={{
                    color: circleColor,
                    fillColor: circleColor,
                    fillOpacity: 0.18,
                    weight: 1.5,
                    dashArray: "4 4"
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-slate-800 text-xs font-sans">
                      <div className="font-bold text-sm text-slate-900">{reg.name} District</div>
                      <div className="mt-1 space-y-0.5 text-[11px]">
                        <div>Priority: Tier {reg.priority}/5</div>
                        <div>Irrigated Area: {(reg.total_irrigated_area_ha / 1000).toFixed(0)}k ha</div>
                        <div>Total Demand: {shortageData.totalDemand.toFixed(1)} MCM</div>
                        <div className="font-bold" style={{ color: circleColor }}>
                          Deficit: {shortageData.deficit.toFixed(1)} MCM ({shortagePct.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              );
            })}

          {/* 2. Canal Flow Lines */}
          {showCanals &&
            canals.map((can) => {
              if (!can.path || can.path.length < 2) return null;
              const util = (can.current_flow_mcm / Math.max(1, can.capacity_mcm)) * 100;
              const lineColor = util > 85 ? "#f59e0b" : "#06b6d4";

              return (
                <Polyline
                  key={can.id}
                  positions={can.path}
                  pathOptions={{
                    color: lineColor,
                    weight: Math.max(3, Math.min(7, (can.capacity_mcm / 100) * 1.5)),
                    opacity: 0.85,
                    dashArray: "8, 8"
                  }}
                >
                  <Popup>
                    <div className="p-2 text-slate-800 text-xs font-sans">
                      <div className="font-bold text-sm text-slate-900">{can.name}</div>
                      <div className="mt-1 space-y-0.5 text-[11px]">
                        <div>Capacity: {can.capacity_mcm} MCM</div>
                        <div>Current Flow: {can.current_flow_mcm} MCM</div>
                        <div>Hydraulic Load: {util.toFixed(1)}%</div>
                        <div>Seepage Loss: {(can.loss_pct * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              );
            })}

          {/* 3. Reservoir Markers */}
          {showReservoirs &&
            reservoirs.map((res) => {
              const storagePct = (res.current_storage_mcm / Math.max(1, res.max_capacity_mcm)) * 100;
              const radius = Math.max(10, Math.min(22, (res.max_capacity_mcm / 6500) * 20));
              const resColor = res.status === "Critical" ? "#f43f5e" : res.status === "Optimal" ? "#06b6d4" : "#38bdf8";

              return (
                <CircleMarker
                  key={res.id}
                  center={[res.lat, res.lng]}
                  radius={radius}
                  pathOptions={{
                    color: "#ffffff",
                    fillColor: resColor,
                    fillOpacity: 0.9,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-2 text-slate-800 text-xs font-sans">
                      <div className="font-bold text-sm text-slate-900">{res.name}</div>
                      <div className="mt-1 space-y-0.5 text-[11px]">
                        <div>Storage: {res.current_storage_mcm} / {res.max_capacity_mcm} MCM ({storagePct.toFixed(1)}%)</div>
                        <div>Current Water Level: {res.current_level_m} m (Max: {res.max_level_m} m)</div>
                        <div>Forecasted Inflow: {res.expected_inflow_mcm} MCM</div>
                        <div>Min Environmental Reserve: {res.min_reserve_mcm} MCM</div>
                        <div className="font-bold text-cyan-700">Status: {res.status}</div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
};
