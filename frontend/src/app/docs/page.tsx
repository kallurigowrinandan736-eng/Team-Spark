"use client";

import React from "react";
import { SystemArchitectureDiagram } from "../../components/SystemArchitectureDiagram";
import { HonestyBadge } from "../../components/HonestyBadge";
import { BookOpen, Sparkles, Cpu, Sliders, ShieldCheck, AlertTriangle, Layers } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-ocean-900 via-slate-900 to-indigo-950/70 border border-slate-800 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Technical Documentation</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Jaldhar System Architecture & Mathematical Models</h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive specification of agronomic ML, exact Linear Programming, and Quantum QUBO formulations
          </p>
        </div>
        <HonestyBadge type="quantum" />
      </div>

      {/* System Architecture Diagram */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>1. System Architecture</span>
        </h2>
        <SystemArchitectureDiagram />
      </section>

      {/* Mathematical Formulations */}
      <section className="space-y-4 p-6 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <span>2. Classical Linear Programming Formulation</span>
        </h2>
        
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-300 space-y-2 border border-slate-800">
            <div className="text-white font-bold">Decision Variables:</div>
            <div>• x[c,k] ≥ 0 : Continuous water allocated to crop k through canal c (MCM)</div>
            <div>• r[j] ≥ 0 : Gross water released from reservoir j (MCM)</div>
            <div>• s[k] ≥ 0 : Water shortage deficit for crop k (MCM)</div>
            
            <div className="text-white font-bold pt-2">Scalarized Objective:</div>
            <div>
              Max Z = w_sat · Σ (P[k] · (1 - λ[c]) · x[c,k]) + w_eff · Σ (eff[c] · x[c,k]) - w_loss · Σ (λ[c] · x[c,k]) - w_short · Σ (P[k] · s[k])
            </div>

            <div className="text-white font-bold pt-2">Network Constraints:</div>
            <div>1. Canal Hydraulic Limit : Σ_k x[c,k] ≤ C[c]  ∀ canal c</div>
            <div>2. Reservoir Availability : Σ_(c ∈ R_j) Σ_k x[c,k] ≤ S[j] - S_min[j] + I_forecast[j]  ∀ reservoir j</div>
            <div>3. Crop Demand Balance   : Σ_c (1 - λ[c]) · x[c,k] + s[k] = Demand[k]  ∀ crop k</div>
            <div>4. Non-Negativity         : x[c,k] ≥ 0, s[k] ≥ 0</div>
          </div>
          <p className="text-slate-400">
            Implemented in Python utilizing <code>scipy.optimize.linprog</code> with the exact HiGHS interior-point simplex solver for guaranteed global optimality in sub-5ms runtimes.
          </p>
        </div>
      </section>

      {/* Quantum-Inspired QUBO Formulation */}
      <section className="space-y-4 p-6 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-quantum-400" />
          <span>3. Quantum-Inspired QUBO & SQA Formulation</span>
        </h2>

        <div className="space-y-3 text-xs text-slate-300">
          <p>
            To evaluate quantum annealing advantages for combinatorial resource allocation, we discretize continuous allocations into binary variables:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-quantum-300 space-y-2 border border-slate-800">
            <div>• Binary Qubit Variable: q_c,k,l in (0, 1) indicates choosing discrete allocation level (0%, 25%, 50%, 75%, 100%)</div>
            <div>• Total Qubits: N = |Routes| x |Levels| = 10 x 5 = 50 Qubits</div>
            
            <div className="text-white font-bold pt-2">Hamiltonian Objective:</div>
            <div>H(q) = q^T Q q = - Sum(Benefit_c,k,l * q_c,k,l) + P_onehot * Sum (Sum q_i,l - 1)^2 + P_cap * Penalty_canal + P_res * Penalty_res</div>

            <div className="text-white font-bold pt-2">Simulated Quantum Annealing (SQA) Schedule:</div>
            <div>• Classical Thermal Decay: T(t) = T0 * alpha^t (where alpha = 0.985)</div>
            <div>• Transverse Tunneling Field: Gamma(t) = Gamma_0 * (1 - t / T_max)</div>
            <div>• Acceptance Criterion: P(accept) = exp(-max(0, Delta_E - Gamma(t)*xi) / T(t))</div>

            <div className="text-white font-bold pt-2">Qiskit SDK Circuit Formulation (QAOA):</div>
            <div>• Open-source SDK: Integrated with <a href="https://github.com/Qiskit/qiskit" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">IBM Qiskit</a> (v2.5+)</div>
            <div>• Problem Unitary: U(C, γ) = e^(-i γ H_C) using Rz single-qubit phases &amp; Rzz 2-qubit CNOT coupling</div>
            <div>• Mixer Unitary: U(B, β) = e^(-i β H_M) using Rx(2β) transverse tunneling rotations</div>
            <div>• Statevector Simulation: Exact probability distributions across allocation eigenstates P(|x⟩)</div>
          </div>
        </div>
      </section>


      {/* Honesty & Limitations */}
      <section className="space-y-4 p-6 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>4. Honesty & Current Limitations</span>
        </h2>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-400">• Synthetic Demo Data:</span>
            <span>All reservoir storages, canal coordinates, and historical rainfall are modeled from the Andhra Pradesh Krishna Basin for hackathon demonstration.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-quantum-400">• Classical Simulation:</span>
            <span>The quantum optimization module runs a Simulated Quantum Annealing algorithm on classical CPUs/browsers and does not connect to physical quantum hardware.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-cyan-400">• Simulated ML Models:</span>
            <span>Agronomic models are trained on synthetic FAO-56 Penman-Monteith datasets with realistic Indian monsoon seasonality.</span>
          </div>
        </div>
      </section>

      {/* Future Scope */}
      <section className="space-y-4 p-6 rounded-2xl bg-ocean-900/80 border border-slate-800 backdrop-blur-md">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>5. Future Roadmap & Scale</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-white">Physical Cloud QPU Integration</div>
            <p className="text-slate-400">Deploying QUBO matrices directly to D-Wave Advantage and IBM Quantum backends.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-white">Satellite NDVI & Soil IoT Telemetry</div>
            <p className="text-slate-400">Ingesting real-time Copernicus satellite vegetation indices and LoRaWAN soil moisture sensors.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-white">Multi-Year Reservoir Planning</div>
            <p className="text-slate-400">Expanding optimization horizons across multi-season Kharif and Rabi crop cycles.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-white">Autonomous Canal Gate Control</div>
            <p className="text-slate-400">Interfacing optimization output with SCADA programmable logic controllers for automated sluice gate actuation.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
