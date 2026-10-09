"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import {
  Droplets, LayoutDashboard, Map as MapIcon,
  BrainCircuit, Sparkles, Presentation,
  ChevronLeft, ChevronRight
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isSpecial?: boolean;
}

const coreNav: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "ML Water Optimizer", href: "/predictions", icon: BrainCircuit, badge: "ML" },
  { name: "Quantum QAOA / QUBO", href: "/quantum", icon: Sparkles, badge: "Quantum" },
  { name: "GIS Network Map", href: "/map", icon: MapIcon },
  { name: "Interactive Demo", href: "/demo", icon: Presentation, isSpecial: true },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col dark:bg-[#08120a]/90 bg-white/95 backdrop-blur-xl dark:border-r dark:border-white/10 border-r border-emerald-200/70 shadow-lg ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b dark:border-white/10 border-emerald-200/60">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-sky-300 dark:to-teal-300 bg-clip-text text-transparent">
                Jaldhar
              </span>
              <span className="text-[10px] dark:text-slate-400 text-emerald-800/70 font-medium tracking-wider uppercase">
                Smart Water Allocation
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg dark:text-slate-400 text-slate-500 hover:text-emerald-700 dark:hover:text-white dark:hover:bg-slate-800/70 hover:bg-emerald-50 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Streamlined Core Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-6 custom-scrollbar">
        {!collapsed && (
          <h3 className="px-3 mb-3 text-[11px] font-semibold tracking-wider dark:text-slate-400 text-emerald-800/80 uppercase">
            Platform Modules
          </h3>
        )}
        <div className="space-y-1.5">
          {coreNav.map((item) => {
            const isActive = item.href === "/" 
              ? pathname === "/" 
              : pathname === item.href || (item.href === "/quantum" && pathname.startsWith("/quantum"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? item.isSpecial
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-semibold"
                      : "dark:bg-emerald-500/15 bg-emerald-600 dark:text-emerald-300 text-white border dark:border-emerald-500/30 border-emerald-600 font-semibold shadow-sm"
                    : item.isSpecial
                    ? "dark:text-emerald-300 text-emerald-700 dark:hover:bg-emerald-950/40 hover:bg-emerald-50 border border-emerald-500/20"
                    : "dark:text-slate-300 text-emerald-900 dark:hover:bg-slate-800/60 hover:bg-emerald-50/90 dark:hover:text-white hover:text-emerald-950"
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive
                      ? "text-white dark:text-emerald-400"
                      : item.isSpecial
                      ? "text-emerald-500"
                      : "text-emerald-700 group-hover:text-emerald-900 dark:text-slate-400 dark:group-hover:text-slate-200"
                  }`}
                />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md dark:bg-emerald-500/20 bg-emerald-100 dark:text-emerald-300 text-emerald-800 border dark:border-emerald-500/30 border-emerald-200">
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

      {/* Theme Toggle & Status Footer */}
      <div className="p-3 border-t dark:border-slate-800/80 border-emerald-200/60 dark:bg-ocean-900/50 bg-emerald-50/60 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <ThemeToggle showLabel={!collapsed} />
          {!collapsed && (
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/60 bg-white px-1.5 py-0.5 rounded border dark:border-emerald-800/50 border-emerald-200">
              v1.0.0
            </span>
          )}
        </div>

        {!collapsed && (
          <div className="flex items-center justify-between px-2 text-xs dark:text-slate-400 text-emerald-800/80 pt-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All Systems Online</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Green & White</span>
          </div>
        )}
      </div>
    </aside>
  );
};
