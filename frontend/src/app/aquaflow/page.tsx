"use client";

import React, { useState } from "react";
import { TopNav } from "../../components/aquaflow/TopNav";
import { HeroSection } from "../../components/aquaflow/HeroSection";
import { DashboardSidebar } from "../../components/aquaflow/DashboardSidebar";
import { MetricCardsRow } from "../../components/aquaflow/MetricCardsRow";
import { WaterLevelTrendChart } from "../../components/aquaflow/WaterLevelTrendChart";
import { LiveMap } from "../../components/aquaflow/LiveMap";
import { CanalNetworkCard } from "../../components/aquaflow/CanalNetworkCard";
import { FeaturedDams } from "../../components/aquaflow/FeaturedDams";
import { FEATURED_DAMS, DamInfo } from "../../data/aquaFlowConfig";
import { Building2, Calendar, ChevronDown } from "lucide-react";

export default function AquaFlowPage() {
  const [selectedDamId, setSelectedDamId] = useState<string>("srisailam");
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-15");
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const currentDam: DamInfo =
    FEATURED_DAMS.find((d) => d.id === selectedDamId) || FEATURED_DAMS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. TOP NAVIGATION HEADER */}
      <TopNav />

      {/* 2. HERO SECTION */}
      <HeroSection />

      {/* 3. DAM MONITORING DASHBOARD SECTION */}
      <section
        id="dashboard"
        className="w-full max-w-[1520px] mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8"
      >
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left Dark Navy Sidebar */}
          <div className="hidden lg:block">
            <DashboardSidebar
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
            />
          </div>

          {/* Main Dashboard Canvas */}
          <div className="flex-1 p-4 sm:p-6 lg:p-7 bg-[#F8FAFC] space-y-5 overflow-hidden">
            {/* Header: Title, Breadcrumbs, Dam Selector & Date Picker */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
                  Dam Monitoring
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                  <span>Home</span>
                  <span>/</span>
                  <span>Dashboard</span>
                  <span>/</span>
                  <span className="text-blue-600 font-semibold">Dam Monitoring</span>
                </div>
              </div>

              {/* Right Selectors */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Dam Selector Dropdown */}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 rounded-xl px-3 py-1.5 shadow-sm transition-all">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <select
                      value={selectedDamId}
                      onChange={(e) => setSelectedDamId(e.target.value)}
                      className="appearance-none bg-transparent pr-6 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {FEATURED_DAMS.map((dam) => (
                        <option key={dam.id} value={dam.id}>
                          {dam.displayName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date Picker */}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 rounded-xl px-3 py-1.5 shadow-sm transition-all">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 1: Five Metric Cards in One Single Row */}
            <MetricCardsRow dam={currentDam} />

            {/* Row 2: Water Level Trend + Live Map + Canal Network */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Water Level Trend (4 cols on desktop) */}
              <div className="lg:col-span-4 flex flex-col">
                <WaterLevelTrendChart dam={currentDam} />
              </div>

              {/* Live Map – Dams & Canals (5 cols on desktop) */}
              <div className="lg:col-span-5 flex flex-col">
                <LiveMap />
              </div>

              {/* Canal Network Card (3 cols on desktop) */}
              <div className="lg:col-span-3 flex flex-col">
                <CanalNetworkCard />
              </div>
            </div>

            {/* Row 3: Featured Dams (4 Horizontal Cards) */}
            <FeaturedDams
              onSelectDam={(damId) => setSelectedDamId(damId)}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Jaldhar Smart Water Management System. Demo Data Engine.</p>
          <div className="flex items-center gap-4">
            <a href="/dams" className="hover:text-blue-600 transition-colors">Dams Directory</a>
            <a href="/canals" className="hover:text-blue-600 transition-colors">Canals Network</a>
            <a href="/weather" className="hover:text-blue-600 transition-colors">Monsoon Radar</a>
            <a href="/about" className="hover:text-blue-600 transition-colors">About Jaldhar</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
