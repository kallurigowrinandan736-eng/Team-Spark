"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Droplets, LayoutDashboard, Map as MapIcon, Database,
  GitBranch, Sprout, BrainCircuit, Sliders,
  Sparkles, Compass, AlertTriangle, Lightbulb,
  BarChart3, LineChart, Presentation, BookOpen,
  ChevronLeft, ChevronRight, Activity
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isSpecial?: boolean;
}

const mainNav: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "GIS Network Map", href: "/map", icon: MapIcon },
  { name: "Reservoirs", href: "/reservoirs", icon: Database },
  { name: "Canals Network", href: "/canals", icon: GitBranch },
  { name: "Crop Command Areas", href: "/crops", icon: Sprout },
];

const optimizationNav: NavItem[] = [
  { name: "AI Predictions", href: "/predictions", icon: BrainCircuit },
  { name: "Water Optimization", href: "/optimization", icon: Sliders },
  { name: "Quantum-Inspired QUBO", href: "/quantum", icon: Sparkles, badge: "QUBO" },
  { name: "Scenario Simulator", href: "/scenarios", icon: Compass },
];

const insightsNav: NavItem[] = [
  { name: "Smart Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Explainable AI (XAI)", href: "/recommendations", icon: Lightbulb },
  { name: "Solver Benchmark", href: "/compare", icon: BarChart3 },
  { name: "Analytics & Trends", href: "/analytics", icon: LineChart },
];

const secondaryNav: NavItem[] = [
  { name: "Hackathon Demo Mode", href: "/demo", icon: Presentation, isSpecial: true },
  { name: "Data Management", href: "/data", icon: Activity },
  { name: "Docs & Architecture", href: "/docs", icon: BookOpen },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-5">
      {!collapsed && (
        <h3 className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? item.isSpecial
                    ? "bg-gradient-to-r from-quantum-600 to-cyan-600 text-white shadow-glow-purple"
                    : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm"
                  : item.isSpecial
                  ? "text-quantum-300 hover:bg-quantum-950/60 hover:text-white border border-quantum-500/20"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? item.isSpecial
                      ? "text-white"
                      : "text-cyan-400"
                    : item.isSpecial
                    ? "text-quantum-400"
                    : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-quantum-500/20 text-quantum-300 border border-quantum-500/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col bg-ocean-950/95 backdrop-blur-md border-r border-slate-800/80 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-water-500 to-quantum-500 flex items-center justify-center flex-shrink-0 shadow-glow-cyan">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-quantum-300 bg-clip-text text-transparent">
                AquaQ
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Quantum-AI Water
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Items List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        {renderNavGroup("Operations", mainNav)}
        {renderNavGroup("Optimization & AI", optimizationNav)}
        {renderNavGroup("Intelligence", insightsNav)}
        {renderNavGroup("Demo & Settings", secondaryNav)}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-ocean-900/50">
        {!collapsed ? (
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Solvers Active</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
              v1.0.0
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </div>
        )}
      </div>
    </aside>
  );
};
