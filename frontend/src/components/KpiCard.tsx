import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "cyan" | "purple" | "emerald" | "amber" | "rose" | "blue";
  delta?: {
    value: string;
    isPositive: boolean;
    text?: string;
  };
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  variant = "cyan",
  delta
}) => {
  const variantStyles = {
    cyan: "from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-400 shadow-glow-cyan",
    purple: "from-quantum-500/10 to-transparent border-quantum-500/20 text-quantum-400 shadow-glow-purple",
    emerald: "from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400",
    amber: "from-amber-500/10 to-transparent border-amber-500/20 text-amber-400",
    rose: "from-rose-500/10 to-transparent border-rose-500/20 text-rose-400",
    blue: "from-water-500/10 to-transparent border-water-500/20 text-water-400 shadow-glow-water"
  };

  const iconBgStyles = {
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    purple: "bg-quantum-500/15 text-quantum-400 border-quantum-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    blue: "bg-water-500/15 text-water-400 border-water-500/30"
  };

  return (
    <div className={`relative p-5 rounded-2xl bg-gradient-to-br dark:bg-ocean-900/80 bg-white/95 border dark:border-slate-800/80 border-emerald-200/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-md ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold dark:text-slate-400 text-emerald-800 uppercase tracking-wider">{title}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black dark:text-white text-emerald-950 tracking-tight">{value}</span>
            {unit && <span className="text-xs font-semibold dark:text-slate-400 text-emerald-700">{unit}</span>}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl border ${iconBgStyles[variant]} flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || delta) && (
        <div className="mt-3 pt-2.5 border-t dark:border-slate-800/80 border-emerald-100 flex items-center justify-between text-xs">
          {subtitle && <span className="dark:text-slate-400 text-emerald-700 line-clamp-1">{subtitle}</span>}
          {delta && (
            <div className={`flex items-center gap-1 font-semibold ml-auto ${delta.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
              {delta.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{delta.value}</span>
              {delta.text && <span className="text-[10px] dark:text-slate-500 text-emerald-600 font-normal">({delta.text})</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
