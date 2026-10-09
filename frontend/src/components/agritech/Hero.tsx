"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronsUpDown, Check, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CTAButton } from "./CTAButton";
import { DetectionBox } from "./DetectionBox";

interface HeroProps {
  onScrollClick?: () => void;
}

export function Hero({ onScrollClick }: HeroProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    farmSize: "500-2,000 Acres",
    primaryCrop: "Soybean & Corn"
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setIsDemoModalOpen(false);
    }, 2000);
  };

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 select-none overflow-hidden"
      style={{
        // Soft sage green-gray (#6F7F72) with a subtle radial vignette
        backgroundColor: "#6F7F72",
        backgroundImage: "radial-gradient(ellipse at 50% 50%, #7e9082 0%, #6F7F72 60%, #546257 100%)"
      }}
      aria-label="AgriTech AI Precision-Spraying Hero Section"
    >
      {/* Subtle background ambient grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* ============================================================== */}
      {/* CENTERED HERO CARD (~16px rounded, ~92% viewport width, 16:9)   */}
      {/* ============================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-[92vw] max-w-[1400px] rounded-[16px] overflow-hidden shadow-[0_30px_70px_-15px_rgba(0,0,0,0.55)] border border-white/10 aspect-auto min-h-[620px] sm:min-h-[660px] lg:min-h-0 lg:aspect-[16/9] flex flex-col justify-between"
      >
        {/* Full-bleed Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-seedling.jpg"
            alt="Human hand gently touching a young seedling in fertile soil"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            loading="eager"
            onError={(e) => {
              // High-resolution Unsplash fallback if local image is unavailable
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=2160&q=85";
            }}
          />

          {/* Grain overlay on photo for a premium organic feel */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Dark gradient overlay: transparent at top to near-black (#050805) at bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,8,5,0.15) 0%, rgba(5,8,5,0.40) 45%, rgba(5,8,5,0.85) 80%, #050805 100%)"
            }}
          />

          {/* Radial subtle vignette inside the photo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 40%, transparent 40%, rgba(5,8,5,0.6) 100%)"
            }}
          />
        </div>

        {/* ============================================================== */}
        {/* CARD TOP BAR: Subtle Brand & Live Status                       */}
        {/* ============================================================== */}
        <header className="relative z-20 flex items-center justify-between p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8E64A] shadow-[0_0_8px_#C8E64A]" />
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/90 font-mono">
              Jaldhar • Precision AgriTech
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-white/90 bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md transition flex items-center gap-1.5"
            >
              <span>Platform Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C8E64A]" />
            </Link>
          </div>
        </header>

        {/* ============================================================== */}
        {/* CARD CONTENT LAYER: Headline, CTA, Detection Overlay           */}
        {/* ============================================================== */}
        <div className="relative z-10 flex-1 px-6 sm:px-10 lg:px-14 flex flex-col justify-between py-2 sm:py-4">
          {/* Top Left Headline & CTA Button Container */}
          <div className="max-w-xl">
            {/* Animated Headline Line 1 & Line 2 */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white tracking-tight leading-[1.05]"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, -apple-system, sans-serif" }}
              >
                Grow more.
              </motion.h1>
            </div>

            <div className="overflow-hidden mb-6 sm:mb-8">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white tracking-tight leading-[1.05]"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, -apple-system, sans-serif" }}
              >
                Spray less.
              </motion.h1>
            </div>


            {/* CTA Button Under Headline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              <CTAButton
                label="Book a Demo ›"
                onClick={() => setIsDemoModalOpen(true)}
              />
            </motion.div>
          </div>

          {/* AI DETECTION OVERLAY (Signature Element) */}
          {/* Positioned accurately over the seedling touching area */}
          <div className="absolute right-[8%] sm:right-[18%] lg:right-[24%] top-[42%] sm:top-[38%] lg:top-[35%] transform -translate-y-1/2">
            <DetectionBox />
          </div>

          {/* Bottom Bar: Bottom-Left Paragraph & Bottom-Right Scroll Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-12 sm:pt-6 pb-4">
            {/* 3. Bottom-Left Paragraph (max-width 420px, white 85%) */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-white/85 text-xs sm:text-sm lg:text-[14px] leading-relaxed max-w-[420px] font-normal"
            >
              Detect weeds and pests plant by plant. Treat only where needed. Reduce chemical use without putting yield at risk.
            </motion.p>

            {/* 4. Bottom-Right: "Scroll to Explore" with gently bouncing chevron icon */}
            <motion.button
              type="button"
              onClick={onScrollClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="group flex items-center gap-2 text-white/80 hover:text-white text-xs font-medium tracking-wide transition select-none cursor-pointer self-end sm:self-auto"
              aria-label="Scroll to explore more details below"
            >
              <span className="hidden sm:inline tracking-wider uppercase text-[11px] font-mono">
                Scroll to Explore
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/40 transition"
              >
                <ChevronDown className="w-3.5 h-3.5 text-white/90" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ============================================================== */}
      {/* INTERACTIVE DEMO BOOKING MODAL                                 */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isDemoModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md p-6 rounded-2xl bg-gradient-to-b from-[#131b14] to-[#080d08] border border-white/20 shadow-2xl text-white"
            >
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-[#C8E64A] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Field-Ready Precision AI</span>
              </div>

              <h2 id="modal-title" className="text-xl font-bold tracking-tight text-white mb-1">
                Book a Precision-Spraying Demo
              </h2>
              <p className="text-xs text-white/70 mb-5">
                See plant-by-plant detection in action on your specific crop varieties and field acreage.
              </p>

              {demoSubmitted ? (
                <div className="p-6 rounded-xl bg-[#5A6B30]/30 border border-[#C8E64A]/40 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#C8E64A]/20 text-[#C8E64A] flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Demo Requested!</h3>
                  <p className="text-xs text-white/80">
                    An agronomist from our precision team will reach out to schedule your live walkthrough.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-white/80 font-medium mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#C8E64A] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-1">Business / Farm Email</label>
                    <input
                      type="email"
                      required
                      placeholder="farmer@agrifarm.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#C8E64A] transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/80 font-medium mb-1">Acreage</label>
                      <select
                        value={formData.farmSize}
                        onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-lg bg-black/50 border border-white/20 text-white focus:outline-none focus:border-[#C8E64A] transition"
                      >
                        <option value="Under 500 Acres">Under 500 Acres</option>
                        <option value="500-2,000 Acres">500-2,000 Acres</option>
                        <option value="2,000+ Acres">2,000+ Acres</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-1">Primary Crop</label>
                      <select
                        value={formData.primaryCrop}
                        onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-lg bg-black/50 border border-white/20 text-white focus:outline-none focus:border-[#C8E64A] transition"
                      >
                        <option value="Soybean & Corn">Soybean & Corn</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Paddy Rice">Paddy Rice</option>
                        <option value="Specialty Vegetables">Specialty</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDemoModalOpen(false)}
                      className="px-4 py-2 rounded-lg text-white/70 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-[#6B7B3A] to-[#5A6B30] hover:brightness-110 shadow-md transition"
                    >
                      Confirm Demo Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
