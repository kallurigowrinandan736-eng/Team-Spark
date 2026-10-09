"use client";

import React from "react";
import { motion } from "framer-motion";

interface CTAButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function CTAButton({
  label = "Book a Demo ›",
  onClick,
  className = ""
}: CTAButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group inline-flex items-center justify-center font-medium text-[14px] text-white tracking-wide transition-all duration-200 select-none ${className}`}
      aria-label={label.replace("›", "").trim()}
      style={{
        // Chamfered / notched bottom-right corner per design specifications
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)"
      }}
    >
      {/* Outer gradient background */}
      <div className="px-6 py-3 bg-gradient-to-r from-[#6B7B3A] via-[#657636] to-[#5A6B30] hover:brightness-110 border border-white/20 shadow-md group-hover:shadow-[0_8px_25px_rgba(90,107,48,0.45)] transition-all duration-200 flex items-center gap-1.5">
        <span className="font-semibold text-white tracking-tight drop-shadow-sm">
          {label}
        </span>
      </div>

      {/* Subtle Chamfer Edge Highlight Accent */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[10px] h-[1px] bg-white/40 rotate-45 origin-bottom-right"
      />
    </motion.button>
  );
}
