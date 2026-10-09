"use client";

import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from "react-leaflet";
import L from "leaflet";
import { MAP_INFRASTRUCTURE } from "../../data/aquaFlowConfig";

// Custom Leaflet Icons using DivIcon
const createHtmlIcon = (color: string, label: string) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 6px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8]
  });
};

const damIcon = createHtmlIcon("#0284c7", "Dam");
const canalIcon = createHtmlIcon("#f97316", "Canal");
const reservoirIcon = createHtmlIcon("#38bdf8", "Reservoir");
const checkDamIcon = createHtmlIcon("#eab308", "Check Dam");
const stationIcon = createHtmlIcon("#ef4444", "Station");

export function LeafletMapInner() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Center on Andhra Pradesh / Telangana Krishna Basin (approx lat 16.5, lng 80.0)
  const centerPosition: [number, number] = [16.5, 79.9];

  // River alignments for Krishna and Godavari visualization
  const krishnaRiverLine: [number, number][] = [
    [16.02, 78.50],
    [16.0867, 78.8967], // Srisailam
    [16.5775, 79.3136], // Nagarjuna Sagar
    [16.75, 80.05],
    [16.5058, 80.6067], // Prakasam Barrage
    [15.80, 80.90]      // Bay of Bengal mouth
  ];

  const godavariRiverLine: [number, number][] = [
    [17.50, 81.10],
    [17.2567, 81.6567], // Polavaram
    [17.00, 81.78],
    [16.70, 82.20]      // Bay of Bengal
  ];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={centerPosition}
        zoom={7}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        style={{ height: "100%", width: "100%" }}
      >
        {/* OpenStreetMap Satellite / ESRI World Imagery Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & ESRI'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={18}
        />

        {/* Rivers Polyline Layers */}
        <Polyline
          positions={krishnaRiverLine}
          pathOptions={{ color: "#06b6d4", weight: 3.5, opacity: 0.85, dashArray: "1, 2" }}
        />
        <Polyline
          positions={godavariRiverLine}
          pathOptions={{ color: "#0ea5e9", weight: 3.5, opacity: 0.85, dashArray: "1, 2" }}
        />

        {/* Infrastructure Markers */}
        {MAP_INFRASTRUCTURE.map((item) => {
          let icon = damIcon;
          if (item.type === "canal") icon = canalIcon;
          if (item.type === "reservoir") icon = reservoirIcon;
          if (item.type === "check-dam") icon = checkDamIcon;
          if (item.type === "water-station") icon = stationIcon;

          return (
            <Marker key={item.id} position={[item.lat, item.lng]} icon={icon}>
              <Popup className="custom-popup">
                <div className="p-1 text-xs">
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-[11px] text-slate-500 capitalize">{item.type} • {item.details}</p>
                  {item.isApprox && (
                    <span className="inline-block mt-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Approximate / illustrative
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Legend Box in Top-Right Corner matching Visual Reference */}
      <div className="absolute top-2.5 right-2.5 z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-slate-200 text-[11px] space-y-1.5 select-none pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
          <span className="text-slate-700 font-medium">Dam</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
          <span className="text-slate-700 font-medium">Canal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
          <span className="text-slate-700 font-medium">Reservoir</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-0.5 bg-cyan-500 shrink-0" />
          <span className="text-slate-700 font-medium">River</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" />
          <span className="text-slate-700 font-medium">Check Dam</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
          <span className="text-slate-700 font-medium">Water Station</span>
        </div>
      </div>
    </div>
  );
}
