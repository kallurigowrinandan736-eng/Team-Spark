"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "", showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 select-none shadow-sm ${
        isDark
          ? "bg-[#0b1a0e] text-emerald-300 border border-emerald-500/30 hover:bg-[#122817] hover:border-emerald-400/50 shadow-emerald-950/40"
          : "bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 shadow-emerald-900/10"
      } ${className}`}
      title={isDark ? "Switch to Light Mode (Green & White)" : "Switch to Night Mode"}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-emerald-400 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Sun className="w-4 h-4 text-emerald-600 transition-transform duration-300 rotate-90 scale-100" />
        )}
      </div>

      {showLabel ? (
        <span className="font-medium tracking-tight">
          {isDark ? "Night Mode" : "Green & White"}
        </span>
      ) : (
        <span className="text-[11px] font-mono">
          {isDark ? "🌙 Night" : "☀️ Light"}
        </span>
      )}
    </button>
  );
};
