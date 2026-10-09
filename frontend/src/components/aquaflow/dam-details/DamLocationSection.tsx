"use client";

import React from "react";
import {
  MapPin, Mountain, Waves, Compass, ShieldCheck,
  CheckCircle2, ExternalLink, Navigation, Eye, Layers
} from "lucide-react";
import { DamDetailedRecord } from "../../../data/damDetailsData";
import { DamMap } from "../DamMap";

interface DamLocationSectionProps {
  dam: DamDetailedRecord;
}

export function DamLocationSection({ dam }: DamLocationSectionProps) {
  return (
    <section id="location-surroundings" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
              Dam Location &amp; Geographic Surroundings
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Geographic coordinates, natural reservoir gorge topography, and catchment geography
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>{dam.coordinates[0].toFixed(4)}° N, {dam.coordinates[1].toFixed(4)}° E</span>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Surroundings Photograph & Technical Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-[#0B192C]">
                Interactive Geographic GIS Map
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified Coordinates
            </span>
          </div>

          {/* Interactive Leaflet Map Wrapper */}
          <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
            <DamMap
              coordinates={dam.coordinates}
              damName={dam.name}
              river={dam.river}
              district={dam.district}
              state={dam.state}
              status={dam.statusBadge}
              levelFt={dam.currentLevelFt}
              frlFt={dam.fullReservoirLevelFt}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 gap-2">
            <p>
              Centering on {dam.river} gorge cutting through the Eastern Ghats.
            </p>
            <span className="font-mono text-[11px] text-slate-400">
              Datum: WGS 84 / EPSG:4326
            </span>
          </div>
        </div>

        {/* Natural Surroundings Photo & Location Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Natural Surroundings Photo Card */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col">
            <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
              <picture>
                <source srcSet={dam.surroundingsImage} type="image/webp" />
                <img
                  src={dam.surroundingsImage}
                  alt={`Natural surroundings of ${dam.name} - ${dam.river}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-semibold flex items-center gap-1.5 border border-white/20">
                <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nallamala Forest Range</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs text-slate-200 line-clamp-2">
                  {dam.caption}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50/70 text-xs text-slate-600 flex items-center justify-between border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-blue-500" />
                <span>Deep Reservoir Water Spread: 616 km²</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Catchment: 206,030 km²
              </span>
            </div>
          </div>

          {/* Location Details & Address Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#0B192C] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Verified Location &amp; Structural Specs</span>
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Administrative Boundary</span>
                <span className="font-semibold text-slate-800 text-right">{dam.location}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">River Basin</span>
                <span className="font-semibold text-slate-800 text-right">{dam.basin}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Dam Structure Type</span>
                <span className="font-semibold text-slate-800 text-right">{dam.specs.damType}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Max Height / Length</span>
                <span className="font-semibold text-slate-800 text-right">
                  {dam.specs.heightMeters} m ({dam.specs.heightFeet} ft) / {dam.specs.lengthMeters} m
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Hydroelectric Capacity</span>
                <span className="font-semibold text-slate-800 text-right">{dam.specs.hydroCapacityMw}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Nearest Landmark</span>
                <span className="font-semibold text-slate-800 text-right">{dam.specs.nearestTown}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Seismic Hazard Zone</span>
                <span className="font-semibold text-slate-800 text-right">{dam.specs.seismicZone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
