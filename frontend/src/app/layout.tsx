"use client";

import React, { useEffect } from "react";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { PipelineModal } from "../components/PipelineModal";
import { useWaterStore } from "../store/useWaterStore";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeStore } = useWaterStore();
  const pathname = usePathname();
  const isStandalonePage =
    pathname === "/" ||
    pathname === "/demo" ||
    pathname === "/aquaflow" ||
    pathname.startsWith("/dams") ||
    pathname.startsWith("/weather") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/maps");

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <title>Jaldhar — Quantum-AI Smart Irrigation &amp; Water Allocation</title>
        <meta
          name="description"
          content="Jaldhar: AI and Quantum-Inspired Optimization for Sustainable Irrigation and Water Resource Management — Team Spark."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('aquaq-theme');
                if (saved === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-[#f7faf8] text-emerald-950 dark:bg-[#071109] dark:text-slate-100 min-h-screen antialiased selection:bg-emerald-400 selection:text-black transition-colors duration-300">
        <ThemeProvider>
          {!isStandalonePage && (
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
              <picture>
                <source srcSet="/images/jaldhara-infographic-bg.webp" type="image/webp" />
                <img
                  src="/images/jaldhara-infographic-bg.jpg"
                  alt="Jaldhara System Infographic Background"
                  className="w-full h-full object-cover object-top filter dark:brightness-[0.78] dark:contrast-[1.08] dark:opacity-50 brightness-[0.98] contrast-[1.05] opacity-45 saturate-[1.2] transition-all duration-500"
                  aria-hidden="true"
                />
              </picture>
              <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-[#061008]/75 dark:via-[#08150d]/80 dark:to-[#040905]/88 bg-gradient-to-b from-[#f4faf6]/70 via-white/75 to-[#edf7f1]/80" />
              <div className="absolute -top-32 right-1/4 w-[550px] h-[550px] rounded-full bg-emerald-500/10 blur-[140px]" />
              <div className="absolute top-1/2 -left-32 w-[650px] h-[650px] rounded-full bg-teal-400/10 blur-[150px]" />
            </div>
          )}

          {isStandalonePage ? (
            <main className="min-h-screen bg-[#F8FAFC] relative z-10">{children}</main>
          ) : (
            <div className="relative z-10 flex min-h-screen">
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
        </ThemeProvider>
      </body>
    </html>
  );
}
