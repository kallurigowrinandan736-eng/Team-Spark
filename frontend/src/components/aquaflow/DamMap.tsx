"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

interface DamMapProps {
  coordinates: [number, number];
  damName: string;
  river: string;
  district: string;
  state: string;
  status: string;
  levelFt: number;
  frlFt: number;
}

const DamMapInner = dynamic(
  () => import("./DamMapInner").then((mod) => mod.DamMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[360px] bg-slate-900 flex flex-col items-center justify-center text-slate-400 text-xs rounded-2xl animate-pulse">
        <MapPin className="w-8 h-8 text-blue-400 mb-2 animate-bounce" />
        <span className="font-semibold text-slate-300">Loading High-Resolution GIS Satellite Map...</span>
        <span className="text-[11px] text-slate-500 mt-1">Centering on Krishna River Gorge coordinates</span>
      </div>
    )
  }
);

export function DamMap(props: DamMapProps) {
  return <DamMapInner {...props} />;
}
