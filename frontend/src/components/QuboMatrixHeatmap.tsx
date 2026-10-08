"use client";

import React, { useState } from "react";
import { Grid, Sparkles, Layers } from "lucide-react";

interface QuboMatrixHeatmapProps {
  matrix?: number[][];
  labels?: string[];
}

export const QuboMatrixHeatmap: React.FC<QuboMatrixHeatmapProps> = ({
  matrix,
  labels
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ i: number; j: number; val: number } | null>(null);

  const defaultMatrix = [
    [-3.8, 1.2, 0.5, -0.2, 2.1, 0.8, -1.1, 0.4],
    [1.2, -4.2, 1.8, 0.3, -0.9, 1.4, 0.2, -0.6],
    [0.5, 1.8, -3.5, 2.2, 0.4, -0.7, 1.5, 0.9],
    [-0.2, 0.3, 2.2, -5.1, 1.1, 0.6, -0.4, 1.3],
    [2.1, -0.9, 0.4, 1.1, -4.0, 1.9, 0.7, -0.5],
    [0.8, 1.4, -0.7, 0.6, 1.9, -3.9, 1.2, 0.3],
    [-1.1, 0.2, 1.5, -0.4, 0.7, 1.2, -4.7, 1.6],
    [0.4, -0.6, 0.9, 1.3, -0.5, 0.3, 1.6, -3.6]
  ];

  const defaultLabels = [
    "q0:Can1_Ric_0%",
    "q1:Can1_Ric_25%",
    "q2:Can1_Ric_50%",
    "q3:Can1_Ric_75%",
    "q4:Can1_Ric_100%",
    "q5:Can2_Mai_50%",
    "q6:Can3_Cot_75%",
    "q7:Can4_Sug_100%"
  ];

  const data = matrix || defaultMatrix;
  const varLabels = labels || defaultLabels;

  const getColor = (val: number) => {
    if (val < -3.0) return "bg-cyan-500 text-white";
    if (val < 0) return "bg-cyan-700/80 text-cyan-200";
    if (val === 0) return "bg-slate-800 text-slate-400";
    if (val < 1.5) return "bg-quantum-900 text-quantum-300";
    return "bg-quantum-600 text-white font-bold";
  };

  return (
    <div className="w-full rounded-2xl bg-ocean-900/80 border border-slate-800 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>QUBO Hamiltonian Coupling Matrix Q[i,j]</span>
          </h3>
          <p className="text-xs text-slate-400">
            Diagonal Q[i,i]: Linear Benefit Terms | Off-Diagonal Q[i,j]: Quadratic Constraint Penalties
          </p>
        </div>
        {hoveredCell ? (
          <div className="text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
            Q[{hoveredCell.i},{hoveredCell.j}] = {hoveredCell.val.toFixed(2)}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Hover cells to inspect coupling strength</span>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-9 gap-1.5 text-center text-[10px]">
            {/* Header row */}
            <div className="font-semibold text-slate-500 py-1">Qubit</div>
            {varLabels.slice(0, 8).map((lbl, idx) => (
              <div key={idx} className="font-mono text-slate-400 py-1 truncate" title={lbl}>
                q{idx}
              </div>
            ))}

            {/* Matrix rows */}
            {data.slice(0, 8).map((row, i) => (
              <React.Fragment key={i}>
                <div className="font-mono text-slate-400 flex items-center justify-center">
                  q{i}
                </div>
                {row.slice(0, 8).map((val, j) => (
                  <div
                    key={j}
                    onMouseEnter={() => setHoveredCell({ i, j, val })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-8 flex items-center justify-center rounded-lg font-mono text-[11px] cursor-pointer transition-all hover:scale-110 hover:z-10 shadow-sm ${getColor(val)}`}
                    title={`Q[q${i}, q${j}] = ${val}`}
                  >
                    {val.toFixed(1)}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cyan-500"></span> Negative (Favorable Benefit)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-quantum-600"></span> Positive (Penalty / Mutual Exclusion)
          </span>
        </div>
        <span className="font-mono">Formula: Min E(q) = q^T Q q</span>
      </div>
    </div>
  );
};
