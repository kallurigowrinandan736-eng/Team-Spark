"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TopNav } from "../../../components/aquaflow/TopNav";
import { DAM_DETAILS_DATA, DamDetailedRecord } from "../../../data/damDetailsData";
import { DamHeroSection } from "../../../components/aquaflow/dam-details/DamHeroSection";
import { DamMetricsGrid } from "../../../components/aquaflow/dam-details/DamMetricsGrid";
import { ReservoirOverviewSection } from "../../../components/aquaflow/dam-details/ReservoirOverviewSection";
import { DamLocationSection } from "../../../components/aquaflow/dam-details/DamLocationSection";
import { GateOperationsSection } from "../../../components/aquaflow/dam-details/GateOperationsSection";
import { DamWeatherSection } from "../../../components/aquaflow/dam-details/DamWeatherSection";
import { Waves, ArrowLeft, ShieldCheck, Database, FileText } from "lucide-react";

export default function IndividualDamDetailsPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "srisailam";
  const damId = rawId.toLowerCase();

  const dam: DamDetailedRecord = DAM_DETAILS_DATA[damId] || DAM_DETAILS_DATA.srisailam;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 2. Header: AquaFlow Brand & Navigation */}
      <TopNav />

      {/* Main Environmental Dam Dashboard Container */}
      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* Back Link & Quick Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/dams"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Dams Directory</span>
          </Link>

          <span className="text-[11px] font-mono text-slate-400">
            Station Ref: AP-KRS-SRIS-01
          </span>
        </div>

        {/* 3. Dam Hero Section */}
        <DamHeroSection dam={dam} />

        {/* 4. Dam Information Cards */}
        <DamMetricsGrid dam={dam} />

        {/* 5. Reservoir Monitoring ("Reservoir Overview") */}
        <ReservoirOverviewSection dam={dam} />

        {/* 6. Dam Location and Surroundings */}
        <DamLocationSection dam={dam} />

        {/* 7. Dam Gate and Operations Section */}
        <GateOperationsSection dam={dam} />

        {/* 8. Weather Section */}
        <DamWeatherSection dam={dam} />

        {/* Footer Disclaimer & Regulatory Information */}
        <footer className="pt-8 pb-12 border-t border-slate-200 text-xs text-slate-500 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-[#0B192C]">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Waves className="w-3.5 h-3.5" />
              </div>
              <span>Jaldhar Smart Water Management System</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                CWC Hydrology Guidelines Compliant
              </span>
              <span>Central Water Commission (CWC)</span>
              <span>Krishna River Management Board (KRMB)</span>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-400">
            All telemetry metrics, gate levels, and hydrological inflows displayed for {dam.name} are calibrated demonstration and verified baseline data. Infrastructure actuation and physical gate control are strictly isolated to authenticated on-site SCADA systems.
          </p>
        </footer>
      </main>
    </div>
  );
}
