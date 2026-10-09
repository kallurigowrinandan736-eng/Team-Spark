"use client";

import React, { useState } from "react";
import {
  ScenarioSimulationResult,
  CropAllocationResult,
  CanalAllocationResult
} from "../lib/scenarioEngine";
import { Droplets, Info, Waves, ShieldCheck, AlertTriangle } from "lucide-react";

interface WaterNetworkMapProps {
  data: ScenarioSimulationResult;
  isOptimized: boolean;
}

export function WaterNetworkMap({ data, isOptimized }: WaterNetworkMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const activeAlloc = isOptimized ? data.after : data.before;
  const { scenario } = data;
  const { canalAllocations, cropAllocations } = activeAlloc;

  // Find canal & crop items
  const canalA = canalAllocations.find(c => c.canal_id === "canal_a")!;
  const canalB = canalAllocations.find(c => c.canal_id === "canal_b")!;
  const canalC = canalAllocations.find(c => c.canal_id === "canal_c")!;

  const paddy = cropAllocations.find(c => c.crop_id === "paddy")!;
  const maize = cropAllocations.find(c => c.crop_id === "maize")!;
  const cotton = cropAllocations.find(c => c.crop_id === "cotton")!;
  const groundnut = cropAllocations.find(c => c.crop_id === "groundnut")!;

  // Node status helper
  const getNodeColor = (statusColor: "green" | "yellow" | "red") => {
    switch (statusColor) {
      case "green":
        return {
          fill: "rgba(16, 185, 129, 0.2)",
          stroke: "#10b981",
          glow: "rgba(16, 185, 129, 0.4)",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          text: "text-emerald-400"
        };
      case "yellow":
        return {
          fill: "rgba(245, 158, 11, 0.2)",
          stroke: "#f59e0b",
          glow: "rgba(245, 158, 11, 0.4)",
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          text: "text-amber-400"
        };
      case "red":
        return {
          fill: "rgba(239, 68, 68, 0.2)",
          stroke: "#ef4444",
          glow: "rgba(239, 68, 68, 0.4)",
          badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          text: "text-rose-400"
        };
    }
  };

  const paddyTheme = getNodeColor(paddy.statusColor);
  const maizeTheme = getNodeColor(maize.statusColor);
  const cottonTheme = getNodeColor(cotton.statusColor);
  const groundnutTheme = getNodeColor(groundnut.statusColor);

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-glass backdrop-blur-xl relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Legend */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Interactive Water Network & Conveyance Topology
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-medium">
              Live Network Flow
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Reservoir live head → Canal distribution gates → Command agricultural zones & village clusters
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/60 px-3.5 py-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="text-slate-300 font-medium">🟢 Sufficient Water</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
            <span className="text-slate-300 font-medium">🟡 Moderate Shortage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
            <span className="text-slate-300 font-medium">🔴 Severe Shortage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)]" />
            <span className="text-slate-300 font-medium">🔵 Reservoir / Canal</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Topology Diagram */}
      <div className="relative w-full aspect-[16/9] min-h-[420px] max-h-[520px] bg-gradient-to-b from-slate-950/90 via-[#0a151b]/95 to-slate-950/90 rounded-2xl border border-slate-800/80 p-2 flex items-center justify-center">
        <svg
          viewBox="0 0 960 520"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Linear Gradients */}
            <linearGradient id="reservoirGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="canalLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Filter for glowing nodes */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Animated flow pulse marker */}
            <marker
              id="flowArrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Grid Background Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
          <rect width="960" height="520" fill="url(#grid)" />

          {/* ================= FLOW PATHS (ANIMATED) ================= */}
          {/* Main Trunk Path from Reservoir (480, 85) to Main Gate (480, 140) */}
          <path
            d="M 480 85 L 480 140"
            stroke="#0284c7"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 480 85 L 480 140"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-[pulse_1.5s_infinite]"
          />

          {/* Gate to Canal A (Branch Left: 480,140 -> 210,140 -> 210,210) */}
          <path
            d="M 480 140 L 210 140 L 210 210"
            fill="none"
            stroke="#0284c7"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 480 140 L 210 140 L 210 210"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            strokeDashoffset="0"
            style={{ animation: "flowDash 2s linear infinite" }}
          />

          {/* Gate to Canal B (Branch Center: 480,140 -> 480,210) */}
          <path
            d="M 480 140 L 480 210"
            fill="none"
            stroke="#0284c7"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 480 140 L 480 210"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            style={{ animation: "flowDash 2s linear infinite" }}
          />

          {/* Gate to Canal C (Branch Right: 480,140 -> 750,140 -> 750,210) */}
          <path
            d="M 480 140 L 750 140 L 750 210"
            fill="none"
            stroke="#0284c7"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 480 140 L 750 140 L 750 210"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            style={{ animation: "flowDash 2s linear infinite" }}
          />

          {/* Canal A to Paddy Field (210, 280 -> 210, 370) */}
          <path
            d="M 210 280 L 210 370"
            fill="none"
            stroke={paddyTheme.stroke}
            strokeWidth="4"
            strokeLinecap="round"
            markerEnd="url(#flowArrow)"
          />
          <path
            d="M 210 280 L 210 370"
            fill="none"
            stroke="#a7f3d0"
            strokeWidth="2"
            strokeDasharray="6 4"
            style={{ animation: "flowDash 1.6s linear infinite" }}
          />

          {/* Canal B to Maize Field (480, 280 -> 480, 370) */}
          <path
            d="M 480 280 L 480 370"
            fill="none"
            stroke={maizeTheme.stroke}
            strokeWidth="4"
            strokeLinecap="round"
            markerEnd="url(#flowArrow)"
          />
          <path
            d="M 480 280 L 480 370"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="2"
            strokeDasharray="6 4"
            style={{ animation: "flowDash 1.8s linear infinite" }}
          />

          {/* Canal C splits to Cotton (670, 370) and Groundnut (830, 370) */}
          <path
            d="M 750 280 L 750 320 L 670 320 L 670 370"
            fill="none"
            stroke={cottonTheme.stroke}
            strokeWidth="3.5"
            strokeLinecap="round"
            markerEnd="url(#flowArrow)"
          />
          <path
            d="M 750 280 L 750 320 L 830 320 L 830 370"
            fill="none"
            stroke={groundnutTheme.stroke}
            strokeWidth="3.5"
            strokeLinecap="round"
            markerEnd="url(#flowArrow)"
          />

          {/* ================= NODE: RESERVOIR ================= */}
          <g
            className="cursor-pointer transition-transform duration-200"
            onMouseEnter={() => setHoveredNode("reservoir")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Reservoir Outer Shell */}
            <rect
              x="360"
              y="18"
              width="240"
              height="68"
              rx="18"
              fill="#082f49"
              stroke="#0284c7"
              strokeWidth="2.5"
              filter="url(#cyanGlow)"
            />
            {/* Water Fill Level inside Reservoir */}
            <rect
              x="364"
              y={18 + 68 * (1 - scenario.reservoir_level_pct / 100)}
              width="232"
              height={68 * (scenario.reservoir_level_pct / 100) - 4}
              rx="14"
              fill="url(#reservoirGrad)"
              opacity="0.85"
            />
            {/* Reservoir Label */}
            <text x="480" y="44" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="14">
              🏞️ Central River Reservoir
            </text>
            <text x="480" y="64" textAnchor="middle" fill="#bae6fd" fontSize="12" fontWeight="600">
              Storage: {scenario.available_water_ml.toLocaleString()} ML ({scenario.reservoir_level_pct}%) • Inflow: {scenario.expected_inflow_ml.toLocaleString()} ML
            </text>
          </g>

          {/* ================= NODES: CANALS ================= */}
          {/* Canal A */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode("canal_a")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect
              x="110"
              y="210"
              width="200"
              height="70"
              rx="14"
              fill="#0c1d2c"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <text x="210" y="234" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13">
              🔵 Canal A (Lined Aqueduct)
            </text>
            <text x="210" y="252" textAnchor="middle" fill="#93c5fd" fontSize="11">
              Cap: {canalA.capacity_ml} ML • Eff: {canalA.efficiency_pct}%
            </text>
            <text x="210" y="268" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">
              In: {canalA.water_received_ml} ML → Out: {canalA.water_delivered_ml} ML
            </text>
          </g>

          {/* Canal B */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode("canal_b")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect
              x="380"
              y="210"
              width="200"
              height="70"
              rx="14"
              fill="#0c1d2c"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <text x="480" y="234" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13">
              🔵 Canal B (Branch Feeder)
            </text>
            <text x="480" y="252" textAnchor="middle" fill="#93c5fd" fontSize="11">
              Cap: {canalB.capacity_ml} ML • Eff: {canalB.efficiency_pct}%
            </text>
            <text x="480" y="268" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">
              In: {canalB.water_received_ml} ML → Out: {canalB.water_delivered_ml} ML
            </text>
          </g>

          {/* Canal C */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode("canal_c")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect
              x="650"
              y="210"
              width="200"
              height="70"
              rx="14"
              fill="#0c1d2c"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <text x="750" y="234" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13">
              🔵 Canal C (Distributary)
            </text>
            <text x="750" y="252" textAnchor="middle" fill="#93c5fd" fontSize="11">
              Cap: {canalC.capacity_ml} ML • Eff: {canalC.efficiency_pct}%
            </text>
            <text x="750" y="268" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">
              In: {canalC.water_received_ml} ML → Out: {canalC.water_delivered_ml} ML
            </text>
          </g>

          {/* ================= NODES: CROPS & COMMAND REGIONS ================= */}
          {/* Paddy Node */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode("paddy")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect
              x="110"
              y="370"
              width="200"
              height="115"
              rx="16"
              fill={paddyTheme.fill}
              stroke={paddyTheme.stroke}
              strokeWidth="2.5"
            />
            <text x="210" y="396" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="14">
              🌾 Paddy (Rice)
            </text>
            <text x="210" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
              HIGH PRIORITY • Guntur Delta
            </text>
            <text x="210" y="434" textAnchor="middle" fill="#e2e8f0" fontSize="11">
              Demand: {paddy.demand_ml} ML
            </text>
            <text x="210" y="452" textAnchor="middle" fill={paddyTheme.stroke} fontSize="12" fontWeight="bold">
              Delivered: {paddy.delivered_ml} ML ({paddy.allocation_pct}%)
            </text>
            <text x="210" y="470" textAnchor="middle" fill="#f87171" fontSize="10">
              {paddy.shortage_ml > 0 ? `Shortage: -${paddy.shortage_ml} ML` : "✓ 100% Satisfied"}
            </text>
          </g>

          {/* Maize Node */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode("maize")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect
              x="380"
              y="370"
              width="200"
              height="115"
              rx="16"
              fill={maizeTheme.fill}
              stroke={maizeTheme.stroke}
              strokeWidth="2.5"
            />
            <text x="480" y="396" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="14">
              🌱 Maize
            </text>
            <text x="480" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
              HIGH PRIORITY • Vijayawada
            </text>
            <text x="480" y="434" textAnchor="middle" fill="#e2e8f0" fontSize="11">
              Demand: {maize.demand_ml} ML
            </text>
            <text x="480" y="452" textAnchor="middle" fill={maizeTheme.stroke} fontSize="12" fontWeight="bold">
              Delivered: {maize.delivered_ml} ML ({maize.allocation_pct}%)
            </text>
            <text x="480" y="470" textAnchor="middle" fill="#f87171" fontSize="10">
              {maize.shortage_ml > 0 ? `Shortage: -${maize.shortage_ml} ML` : "✓ 100% Satisfied"}
            </text>
          </g>

          {/* Cotton Node */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode("cotton")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect
              x="595"
              y="370"
              width="150"
              height="115"
              rx="16"
              fill={cottonTheme.fill}
              stroke={cottonTheme.stroke}
              strokeWidth="2.5"
            />
            <text x="670" y="396" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13">
              🌽 Cotton
            </text>
            <text x="670" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10">
              MED PRIORITY
            </text>
            <text x="670" y="434" textAnchor="middle" fill="#e2e8f0" fontSize="11">
              Dem: {cotton.demand_ml} ML
            </text>
            <text x="670" y="452" textAnchor="middle" fill={cottonTheme.stroke} fontSize="12" fontWeight="bold">
              Del: {cotton.delivered_ml} ML
            </text>
            <text x="670" y="470" textAnchor="middle" fill="#f87171" fontSize="10">
              {cotton.shortage_ml > 0 ? `-${cotton.shortage_ml} ML` : "✓ 100%"}
            </text>
          </g>

          {/* Groundnut Node */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode("groundnut")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect
              x="755"
              y="370"
              width="150"
              height="115"
              rx="16"
              fill={groundnutTheme.fill}
              stroke={groundnutTheme.stroke}
              strokeWidth="2.5"
            />
            <text x="830" y="396" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13">
              🥜 Groundnut
            </text>
            <text x="830" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10">
              MED PRIORITY
            </text>
            <text x="830" y="434" textAnchor="middle" fill="#e2e8f0" fontSize="11">
              Dem: {groundnut.demand_ml} ML
            </text>
            <text x="830" y="452" textAnchor="middle" fill={groundnutTheme.stroke} fontSize="12" fontWeight="bold">
              Del: {groundnut.delivered_ml} ML
            </text>
            <text x="830" y="470" textAnchor="middle" fill="#f87171" fontSize="10">
              {groundnut.shortage_ml > 0 ? `-${groundnut.shortage_ml} ML` : "✓ 100%"}
            </text>
          </g>
        </svg>

        {/* Dynamic Tooltip on Hover */}
        {hoveredNode && (
          <div className="absolute top-4 left-4 bg-slate-900/95 border border-cyan-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs max-w-xs animate-fade-in pointer-events-none">
            {hoveredNode === "reservoir" && (
              <div>
                <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                  <span>🏞️ Central River Reservoir</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Headworks</span>
                </div>
                <p className="text-slate-300">
                  Current Storage: <strong className="text-white">{scenario.available_water_ml} ML</strong> ({scenario.reservoir_level_pct}% storage capacity).
                </p>
                <p className="text-slate-300 mt-1">
                  Expected 30-day Catchment Runoff: <strong className="text-cyan-300">{scenario.expected_inflow_ml} ML</strong>.
                </p>
              </div>
            )}
            {hoveredNode === "canal_a" && (
              <div>
                <div className="font-bold text-white mb-1">Canal A (Concrete Lined)</div>
                <p className="text-slate-300">Conveyance Efficiency: <strong className="text-emerald-400">90%</strong></p>
                <p className="text-slate-300">Carrying: <strong>{canalA.water_received_ml} ML</strong> (Loss: {canalA.water_loss_ml} ML)</p>
                <p className="text-slate-400 text-[10px] mt-1">Dedicated feeder to high-priority Paddy command area.</p>
              </div>
            )}
            {hoveredNode === "canal_b" && (
              <div>
                <div className="font-bold text-white mb-1">Canal B (Branch Feeder)</div>
                <p className="text-slate-300">Conveyance Efficiency: <strong className="text-amber-400">80%</strong></p>
                <p className="text-slate-300">Carrying: <strong>{canalB.water_received_ml} ML</strong> (Loss: {canalB.water_loss_ml} ML)</p>
                <p className="text-slate-400 text-[10px] mt-1">Serves Maize command region.</p>
              </div>
            )}
            {hoveredNode === "canal_c" && (
              <div>
                <div className="font-bold text-white mb-1">Canal C (Distributary Earthen)</div>
                <p className="text-slate-300">Conveyance Efficiency: <strong className="text-rose-400">70%</strong></p>
                <p className="text-slate-300">Carrying: <strong>{canalC.water_received_ml} ML</strong> (Loss: {canalC.water_loss_ml} ML)</p>
                <p className="text-slate-400 text-[10px] mt-1">Distributes to Cotton & Groundnut fields.</p>
              </div>
            )}
            {hoveredNode === "paddy" && (
              <div>
                <div className="font-bold text-white mb-1">🌾 Paddy (High Priority)</div>
                <p className="text-slate-300">Demand: {paddy.demand_ml} ML • Delivered: {paddy.delivered_ml} ML</p>
                <p className="text-slate-300">Satisfaction: <strong className={paddyTheme.text}>{paddy.allocation_pct}%</strong></p>
                <p className="text-slate-400 text-[10px] mt-1">Critical food security staple; prioritized by QAOA engine.</p>
              </div>
            )}
            {hoveredNode === "maize" && (
              <div>
                <div className="font-bold text-white mb-1">🌱 Maize (High Priority)</div>
                <p className="text-slate-300">Demand: {maize.demand_ml} ML • Delivered: {maize.delivered_ml} ML</p>
                <p className="text-slate-300">Satisfaction: <strong className={maizeTheme.text}>{maize.allocation_pct}%</strong></p>
              </div>
            )}
            {hoveredNode === "cotton" && (
              <div>
                <div className="font-bold text-white mb-1">🌽 Cotton (Medium Priority)</div>
                <p className="text-slate-300">Demand: {cotton.demand_ml} ML • Delivered: {cotton.delivered_ml} ML</p>
                <p className="text-slate-300">Shortage: <strong className="text-rose-400">-{cotton.shortage_ml} ML</strong></p>
                <p className="text-slate-400 text-[10px] mt-1">Cash crop curtailed during drought to preserve staple food grains.</p>
              </div>
            )}
            {hoveredNode === "groundnut" && (
              <div>
                <div className="font-bold text-white mb-1">🥜 Groundnut (Medium Priority)</div>
                <p className="text-slate-300">Demand: {groundnut.demand_ml} ML • Delivered: {groundnut.delivered_ml} ML</p>
                <p className="text-slate-300">Shortage: <strong className="text-rose-400">-{groundnut.shortage_ml} ML</strong></p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Network Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Reservoir Condition</span>
          <span className="text-sm font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {scenario.reservoir_level_pct}% Capacity ({scenario.status})
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Network Delivered Water</span>
          <span className="text-sm font-bold text-emerald-400">
            {activeAlloc.metrics.total_delivered_ml.toLocaleString()} ML
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Canal Conveyance Loss</span>
          <span className="text-sm font-bold text-rose-400">
            {activeAlloc.metrics.total_loss_ml.toLocaleString()} ML (Avg {(100 - activeAlloc.metrics.allocation_efficiency_pct)}%)
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Optimization Mode</span>
          <span className="text-sm font-bold text-quantum-300">
            {isOptimized ? "⚛️ QAOA Loss-Minimizing" : "⚖️ Baseline Proportional"}
          </span>
        </div>
      </div>
    </div>
  );
}
