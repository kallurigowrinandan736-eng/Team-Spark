"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sprout, Crosshair } from "lucide-react";

interface DetectionBoxProps {
  className?: string;
}

export function DetectionBox({ className = "" }: DetectionBoxProps) {
  const [confidence, setConfidence] = useState(0);

  // Smooth counter animation from 0 to 74%
  useEffect(() => {
    let start = 0;
    const end = 74;
    const duration = 1200; // ms
    const incrementTime = 25; // ms
    const step = end / (duration / incrementTime);

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setConfidence(end);
        clearInterval(timer);
      } else {
        setConfidence(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      aria-label="AI Precision Detection Overlay identifying weed species"
    >
      {/* ============================================================== */}
      {/* 1. PRIMARY TARGET BOUNDING BOX (over seedling stem / weed)     */}
      {/* ============================================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-44 sm:w-52 h-44 sm:h-52 border border-dashed border-white/80 rounded-sm"
      >
        {/* Pulsing Glow Border Animation */}
        <motion.div
          animate={{
            opacity: [0.2, 0.6, 0.2],
            boxShadow: [
              "0 0 10px rgba(200, 230, 74, 0.15)",
              "0 0 25px rgba(200, 230, 74, 0.4)",
              "0 0 10px rgba(200, 230, 74, 0.15)"
            ]
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-sm pointer-events-none"
        />

        {/* 4 Corner Square Handles */}
        <span
          aria-hidden="true"
          className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-[1px] shadow-sm"
        />
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-[1px] shadow-sm"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-[1px] shadow-sm"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-[1px] shadow-sm"
        />

        {/* Inside: Faint Centered Detection Circle */}
        <div className="absolute inset-0 m-auto w-24 h-24 rounded-full border border-white/20 flex items-center justify-center">
          {/* Subtle Inner Crosshair & Sprout Icon */}
          <Crosshair className="w-8 h-8 text-white/25 stroke-[1]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-[#C8E64A]/10 border border-[#C8E64A]/30 flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5 text-[#C8E64A]" />
            </div>
          </div>
        </div>

        {/* Faint Scanning Laser Beam traveling top to bottom */}
        <motion.div
          animate={{ top: ["5%", "95%", "5%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-[#C8E64A]/60 to-transparent shadow-[0_0_8px_#C8E64A]"
        />

        {/* Top-Right Tag: Translucent Glassmorphism "-4.3%" */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="absolute -top-3.5 -right-3.5 z-10"
        >
          <div className="px-2 py-0.5 rounded backdrop-blur-md bg-white/15 border border-white/30 text-white/95 text-[11px] font-mono font-medium tracking-tight shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            -4.3%
          </div>
        </motion.div>

        {/* Bottom Label Chip: "Pigweed 74%" (74% highlighted in lime #C8E64A) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="absolute -bottom-9 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap"
        >
          <div className="px-3 py-1 rounded-full backdrop-blur-md bg-black/60 border border-white/25 shadow-lg flex items-center gap-1.5 text-xs text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8E64A] animate-ping" />
            <span className="font-medium tracking-tight text-white/90">Pigweed</span>
            <span className="font-bold font-mono text-[#C8E64A]">
              {confidence}%
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* ============================================================== */}
      {/* 2. SECOND SMALLER DASHED BOX (sitting on leaf tips)            */}
      {/* ============================================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-8 -right-12 sm:-right-16 w-20 sm:w-24 h-16 sm:h-20 border border-dashed border-white/60 rounded-[2px]"
      >
        {/* 4 Corner Dot Handles */}
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-[#C8E64A] rounded-full"
        />
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#C8E64A] rounded-full"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-[#C8E64A] rounded-full"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[#C8E64A] rounded-full"
        />

        {/* Small Node Identifier */}
        <div className="absolute -bottom-4 right-0 px-1.5 py-0.2 rounded backdrop-blur-md bg-white/10 border border-white/20 text-[9px] font-mono text-white/80">
          leaf:tip
        </div>
      </motion.div>
    </div>
  );
}
