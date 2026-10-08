"use client";

import React from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend
} from "recharts";
import { ConvergencePoint } from "../lib/types";
import { Sparkles } from "lucide-react";

interface ConvergenceChartProps {
  data: ConvergencePoint[];
  numQubits?: number;
  restarts?: number;
}

export const ConvergenceChart: React.FC<ConvergenceChartProps> = ({
  data,
  numQubits = 50,
  restarts = 2
}) => {
  if (!data || !data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
        No annealing convergence data available.
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-ocean-900/80 border border-slate-800 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-quantum-400" />
            <span>Simulated Quantum Annealing (SQA) Energy Convergence</span>
          </h3>
          <p className="text-xs text-slate-400">
            Evolution of Hamiltonian Objective Energy ($H$) and Transverse Quantum Field ($\Gamma$) over {data[data.length - 1]?.iteration || 300} iterations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-quantum-300 bg-quantum-950/60 px-2 py-0.5 rounded border border-quantum-800/40">
            {numQubits} Qubits
          </span>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            {restarts} Restarts
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="iteration"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#e2e8f0"
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
            <Line
              type="monotone"
              dataKey="energy"
              name="Current State Energy (H)"
              stroke="#a855f7"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="stepAfter"
              dataKey="best_energy"
              name="Best Feasible Energy (H_min)"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="quantum_fluctuation"
              name="Transverse Field Γ(t)"
              stroke="#38bdf8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
