"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Waves, LayoutDashboard, Building2, GitFork, CloudSun,
  LineChart, Map, Bell, FileText, Settings, ShieldCheck
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DashboardSidebar({ activeTab = "dashboard", onTabChange }: DashboardSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/#dashboard" },
    { id: "dams", label: "Dams", icon: Building2, href: "/dams" },
    { id: "canals", label: "Canals", icon: GitFork, href: "/canals" },
    { id: "weather", label: "Weather", icon: CloudSun, href: "/weather" },
    { id: "analytics", label: "Analytics", icon: LineChart, href: "/analytics" },
    { id: "maps", label: "Maps", icon: Map, href: "/maps" },
    { id: "alerts", label: "Alerts", icon: Bell, href: "/alerts", badge: "3" },
    { id: "reports", label: "Reports", icon: FileText, href: "/reports" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" }
  ];

  return (
    <aside className="w-56 lg:w-60 bg-[#0B192C] text-slate-300 flex flex-col shrink-0 rounded-2xl lg:rounded-none overflow-hidden select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-800/80">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Waves className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Jaldhar</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected =
            activeTab === item.id ||
            (item.id === "dashboard" && pathname === "/") ||
            (item.id !== "dashboard" && pathname.startsWith(item.href));

          const handleClick = (e: React.MouseEvent) => {
            if (onTabChange) {
              onTabChange(item.id);
            }
          };

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={handleClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isSelected
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-500 text-white shadow-sm">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status Tag */}
      <div className="p-4 border-t border-slate-800/60 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-300">SCADA Network Online</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Telemetry Sync: Real-time</p>
      </div>
    </aside>
  );
}
