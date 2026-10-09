"use client";

import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { Layers, Maximize2, Navigation } from "lucide-react";

interface DamMapInnerProps {
  coordinates: [number, number];
  damName: string;
  river: string;
  district: string;
  state: string;
  status: string;
  levelFt: number;
  frlFt: number;
}

// Leaflet DivIcon for dam crest
const createDamIcon = () => {
  return L.divIcon({
    className: "dam-crest-marker",
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.28);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: relative;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #2563EB;
          border: 3px solid #FFFFFF;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF;"></div>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -16]
  });
};

function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 12, { duration: 1.5 });
  }, [coords, map]);
  return null;
}

export function DamMapInner({
  coordinates,
  damName,
  river,
  district,
  state,
  status,
  levelFt,
  frlFt
}: DamMapInnerProps) {
  const [mapType, setMapType] = useState<"satellite" | "topo">("satellite");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Krishna gorge path around Srisailam (approx upstream & downstream gorge points)
  const isSrisailam = damName.toLowerCase().includes("srisailam");
  const riverAlignment: [number, number][] = isSrisailam
    ? [
        [16.035, 78.785],
        [16.052, 78.825],
        [16.071, 78.868],
        [16.0867, 78.8967], // Srisailam Dam Crest
        [16.102, 78.925],
        [16.135, 78.960],
        [16.175, 79.015]
      ]
    : [
        [coordinates[0] - 0.05, coordinates[1] - 0.05],
        coordinates,
        [coordinates[0] + 0.05, coordinates[1] + 0.05]
      ];

  return (
    <div className="relative w-full h-full min-h-[360px]">
      <MapContainer
        center={coordinates}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        style={{ height: "100%", width: "100%", minHeight: "360px" }}
      >
        <ChangeMapView coords={coordinates} />

        {mapType === "satellite" ? (
          <TileLayer
            attribution='&copy; ESRI World Imagery &amp; CWC'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />
        )}

        {/* River Alignment Flow Line */}
        <Polyline
          positions={riverAlignment}
          pathOptions={{
            color: "#38BDF8",
            weight: 4.5,
            opacity: 0.9,
            dashArray: "1, 2"
          }}
        />

        {/* Upstream Reservoir Spread Indicator */}
        <Circle
          center={[coordinates[0] - 0.015, coordinates[1] - 0.02]}
          radius={2200}
          pathOptions={{
            color: "#0284C7",
            fillColor: "#0284C7",
            fillOpacity: 0.22,
            weight: 1.5
          }}
        />

        {/* Dam Wall Marker */}
        <Marker position={coordinates} icon={createDamIcon()}>
          <Popup className="custom-popup" autoPan={false}>
            <div className="p-2 space-y-1 text-slate-800 text-xs font-sans min-w-[200px]">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1">
                <span className="font-extrabold text-[#0B192C] text-sm">{damName}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {status}
                </span>
              </div>
              <p className="text-slate-600 font-medium">
                {river} • {district}, {state}
              </p>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1 flex justify-between text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Water Level</span>
                  <span className="font-bold text-blue-600">{levelFt} ft</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Full Res Level</span>
                  <span className="font-bold text-slate-700">{frlFt} ft</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">GPS Coordinates</span>
                  <span className="font-bold text-slate-700">{coordinates[0].toFixed(4)}°N</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Layer Toggle Switch */}
      <div className="absolute top-3 right-3 z-20 flex bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setMapType("satellite")}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            mapType === "satellite"
              ? "bg-[#0B192C] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Satellite Imagery
        </button>
        <button
          onClick={() => setMapType("topo")}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            mapType === "topo"
              ? "bg-[#0B192C] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Terrain / Street
        </button>
      </div>

      {/* Coordinate & GIS Badge */}
      <div className="absolute bottom-3 left-3 z-20 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[11px] font-mono border border-white/10 flex items-center gap-2 shadow-lg">
        <Navigation className="w-3.5 h-3.5 text-sky-400" />
        <span>
          {coordinates[0].toFixed(4)}° N, {coordinates[1].toFixed(4)}° E
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-emerald-400 font-sans font-semibold">Gorge Elevation: 885 ft MSL</span>
      </div>
    </div>
  );
}
