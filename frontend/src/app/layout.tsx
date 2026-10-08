"use client";

import React, { useEffect } from "react";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { PipelineModal } from "../components/PipelineModal";
import { useWaterStore } from "../store/useWaterStore";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeStore } = useWaterStore();
  const pathname = usePathname();
  const isLandingPage = pathname === "/" || pathname === "/demo";

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <html lang="en" className="dark">
      <head>
        <title>AquaQ — Quantum-AI Smart Irrigation & Water Allocation</title>
        <meta
          name="description"
          content="AI and Quantum-Inspired Optimization for Sustainable Irrigation and Water Resource Management."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-ocean-950 text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-ocean-950">
        {isLandingPage ? (
          <main className="min-h-screen">{children}</main>
        ) : (
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col pl-20 lg:pl-64 transition-all duration-300">
              <Header />
              <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
                {children}
              </main>
            </div>
          </div>
        )}
        <PipelineModal />
      </body>
    </html>
  );
}
