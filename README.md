# AquaQ (Jaldhar) — Quantum-AI Powered Smart Irrigation & Water Resource Allocation

> **"Smart Water. Smarter Allocation."**  
> *An End-to-End Decision Support System Coupling Hydrological Machine Learning with a 4-Level Quantum Computing Architecture.*

---

## 📄 Abstract

Climate volatility, intensifying droughts, and competing agricultural and civic demands present severe challenges for river basin water management. **AquaQ (Jaldhar)** is an advanced decision-support and autonomous allocation platform that integrates physics-informed artificial intelligence with a four-level quantum computing framework. Focused on the Krishna River Basin—spanning critical infrastructures including Srisailam Dam, Nagarjuna Sagar, Jurala, and Prakasam Barrage—the platform couples predictive machine learning with mathematical programming and quantum optimization.

The system incorporates FAO-56 Penman-Monteith crop evapotranspiration models, Gradient Boosting demand predictors, Random Forest quantile runoff forecasters ($R^2 > 0.99$), and a multi-output surrogate policy. To resolve non-convex scheduling and network routing, the quantum engine spans four progressive computational tiers: (1) fundamental circuit simulation; (2) Quadratic Unconstrained Binary Optimization (QUBO) and Quantum Approximate Optimization Algorithm (QAOA) for discrete canal gate switching; (3) pure Quantum Machine Learning (QML) leveraging 4-qubit $ZZ$-FeatureMaps into 16-dimensional Hilbert spaces, Variational Quantum Classifiers (VQC) trained via analytical parameter-shift gradients, and Quantum State Fidelity Kernels (QSVC); and (4) hardware-aware Quantum Error Mitigation (QEM) calibrated to IBM Heron QPU noise profiles ($T_1=180\,\mu\text{s}, T_2=120\,\mu\text{s}$) executing Zero-Noise Extrapolation (ZNE, 61.9% error reduction), Readout Matrix Inversion (TREX, 98.2% fidelity recovery), and $XY4$ Dynamical Decoupling (+4.96% coherence gain). AquaQ delivers real-time, equitable, and climate-resilient water stewardship.

---

## 🔍 Detailed Project Overview

### 1. Problem Statement & Motivation
Managing multi-reservoir river basins requires balancing conflicting priorities under high uncertainty:
- **Competing Demands**: Downstream agricultural zones (Paddy, Maize, Cotton, Groundnut) compete against civic municipal drinking reserves and environmental river flow constraints.
- **Hydrological Volatility**: Monsoon variability causes sudden oscillations between flash floods and severe droughts.
- **Physical Hydraulic Constraints**: Water conveyance losses in unlined canal reaches, gate capacity thresholds, and non-convex discharge curves make classical linear optimization insufficient.

AquaQ resolves these trade-offs by providing an end-to-end pipeline: from real-time meteorological sensing to surrogate ML prediction, quantum-enhanced optimization, error-mitigated execution, and an interactive GIS visualization cockpit.

---

### 2. Four-Tier Quantum Computing Architecture (Qiskit 2.5)

AquaQ implements a comprehensive, 4-tier quantum software stack:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          AQUAQ QUANTUM COMPUTING STACK                          │
├─────────┬───────────────────────────────┬───────────────────────────────────────┤
│ Tier    │ Quantum Paradigm              │ Real-World Water Domain Application   │
├─────────┼───────────────────────────────┼───────────────────────────────────────┤
│ Level 1 │ Circuit Fundamentals          │ Superposition, Bell states & register │
│         │ & Statevector Simulation      │ statevector evaluation.               │
├─────────┼───────────────────────────────┼───────────────────────────────────────┤
│ Level 2 │ Combinatorial Optimization    │ Discrete canal gate scheduling with   │
│         │ (QUBO + Variational QAOA)     │ supply & capacity penalty terms.      │
├─────────┼───────────────────────────────┼───────────────────────────────────────┤
│ Level 3 │ Pure Quantum Machine Learning │ 16-D Hilbert space feature embedding, │
│         │ (ZZ-FeatureMap, VQC & QSVC)   │ Parameter-Shift Rule, stress class.   │
├─────────┼───────────────────────────────┼───────────────────────────────────────┤
│ Level 4 │ Hardware-Aware Error          │ Digital gate folding ZNE, TREX readout│
│         │ Mitigation (QEM & Noise)      │ inversion, and XY4 dynamical decoupl. │
└─────────┴───────────────────────────────┴───────────────────────────────────────┘
```

#### Level 1: Circuit Foundations
- Native Qiskit 2.5 quantum registers, Pauli operations ($X, Y, Z$), parameterized single-qubit rotations ($R_Y, R_Z$), and two-qubit entangling gates ($CX$).
- Exact statevector probability and expectation value extraction.

#### Level 2: Hybrid Combinatorial Optimization (QUBO & QAOA)
- **Problem Formulation**: Discretizes canal gate allocation levels ($0\%, 50\%, 100\%$) into binary decision variables $x_{c,k} \in \{0, 1\}$.
- **Ising Hamiltonian ($H_C$)**: Encodes objective terms (crop demand satisfaction, conveyance efficiency, Jain's fairness index) and quadratic penalty multipliers for reservoir supply limits and canal capacities.
- **QAOA Circuit**: Alternates cost unitary $e^{-i \gamma H_C}$ and transverse mixer unitary $e^{-i \beta H_M}$ optimized via classical COBYLA/SLSQP routines.

#### Level 3: Pure Quantum Machine Learning (QML)
- **Quantum Feature Map (`zz_feature_map`)**: Embeds 4 normalized hydro-climatic inputs into a **16-dimensional complex Hilbert space** ($2^4 = 16$) using second-order non-linear Pauli-$Z$ phase interactions.
- **Variational Quantum Classifier (VQC / QNN)**: Employs a `real_amplitudes` ansatz circuit with circular CNOT entanglement topology and 12 trainable quantum angle parameters ($\boldsymbol{\theta}$).
- **Analytical Parameter-Shift Gradients**:
  $$\frac{\partial \langle H \rangle}{\partial \theta_i} = \frac{\langle H \rangle\left(\theta_i + \frac{\pi}{2}\right) - \langle H \rangle\left(\theta_i - \frac{\pi}{2}\right)}{2}$$
- **Quantum State Fidelity Kernel (QSVC)**: Evaluates transition amplitudes $|\langle 0 \mid U_\Phi^\dagger(x_j) U_\Phi(x_i) \mid 0 \rangle|^2$ for agricultural water stress classification.

#### Level 4: Hardware-Aware Noise Modeling & Quantum Error Mitigation (QEM)
- **Calibrated QPU Noise Model**: Density matrix Kraus evolution calibrated to **IBM Heron** transmon specs ($T_1 = 180\,\mu\text{s}$, $T_2 = 120\,\mu\text{s}$, 2-qubit CNOT error $0.85\%$, readout error $1.5\%$).
- **Use Case 1: Zero-Noise Extrapolation (ZNE)**: Unitary digital gate folding ($r \in \{1, 3, 5\}$) and Richardson polynomial extrapolation for emergency dam spillway gate optimization under flood surges (**61.9% error reduction**).
- **Use Case 2: Readout Error Mitigation (TREX)**: Inverted measurement confusion matrix for noise-resilient canal breach and seepage anomaly detection (**98.2% fidelity recovery**).
- **Use Case 3: Dynamical Decoupling (DD)**: Symmetric $XY4$ Slepian pulse sequences ($X_\pi - Y_\pi - X_\pi - Y_\pi$) preserving multi-dam entangled telemetry superpositions (**+4.96% coherence gain**).

---

### 3. Classical Machine Learning & Hydrological Pipeline

```
                                  [ Raw Telemetry & Data Layer ]
                    (Reservoirs, Canals, Crops, Soil Sensors, Satellite Inflow)
                                                │
                                                ▼
                                    [ Hydrological AI Engine ]
            ┌───────────────────────────────────┴───────────────────────────────────┐
            ▼                                                                       ▼
    [ Crop Water Demand ]                                               [ Inflow Quantile Forecaster ]
 (Gradient Boosting Regressor)                                          (Random Forest Regressor)
  FAO-56 Penman-Monteith Proxy                                           Catchment Runoff & Monsoon P10/P50/P90
            │                                                                       │
            └───────────────────────────────────┬───────────────────────────────────┘
                                                ▼
                                [ Multi-Output ML Policy Surrogate ]
                                (MultiOutputRegressor / Random Forest)
                                Real-Time Inference: ~1.4 ms | R² = 0.9975
                                                │
                                                ▼
                                [ Multi-Objective Allocation Policy ]
                                (Demand Satisfaction, Loss Routing, Equity)
```

1. **Crop Demand Regressor**: Gradient Boosting Regressor trained on soil moisture deficit, temperature, crop growth stages, and reference evapotranspiration ($ET_0$).
2. **Inflow Forecaster**: Multi-quantile Random Forest forecasting 30-day reservoir catchment runoff.
3. **Allocation Policy Surrogate**: Multi-output surrogate model delivering sub-2ms water distribution decisions across 5 operational hydrological regimes: *Normal Monsoon*, *Severe Drought*, *Heavy Rainfall*, *Low Reservoir Storage*, and *Unexpected Inflow*.

---

### 4. Real-World Water Infrastructure Benchmark

The platform models the interconnected hydrology of the **Krishna River Basin, Andhra Pradesh, India**:
- **Srisailam Dam**: High-head hydro-power reservoir (Current Storage: 6,120 MCM, Max: 8,720 MCM).
- **Nagarjuna Sagar Dam**: Major irrigation barrage and canal command network (Current Storage: 7,450 MCM).
- **Jurala Dam**: Upstream inflow control dam on the Krishna River.
- **Prakasam Barrage**: Delta regulator supplying coastal irrigation and Vijayawada municipal drinking water.
- **Canal Networks**: Right Main Canal, Left Bank Canal, and Krishna Western Main Canal with realistic conveyance loss curves ($10\% - 30\%$).

---

### 5. Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Leaflet / OpenStreetMap.
- **Backend API**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn, NumPy, Pandas, Scikit-Learn.
- **Quantum Computing**: Qiskit 2.5, Qiskit Quantum Info (`DensityMatrix`, `Kraus`, `SparsePauliOp`), Qiskit IBM Runtime SDK.

---

### 6. Quick Start & Execution Guide

#### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.10+ and a configured virtual environment

#### 1. Setup Virtual Environment & Dependencies
```powershell
# Clone and enter directory
cd "Team-Spark"

# Setup Python virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt

# Install Frontend dependencies
cd frontend
npm install
cd ..
```

#### 2. Running ML & Quantum Pipelines (CLI)

```powershell
# 1. Classical ML Hydrological Pipeline (5 Scenarios)
.\.venv\Scripts\python.exe backend/run_ml_pipeline.py

# 2. Combined ML + Level 3 Quantum ML Extension
.\.venv\Scripts\python.exe backend/run_ml_pipeline.py --qml

# 3. Standalone Level 3 Quantum Machine Learning (VQC + ZZ-FeatureMap + QSVC)
.\.venv\Scripts\python.exe backend/run_qml_pipeline.py

# 4. Standalone Level 4 Quantum Error Mitigation (ZNE + TREX + DD)
.\.venv\Scripts\python.exe backend/run_level4_pipeline.py
```

#### 3. Running Web Applications

```powershell
# Start Backend API (Port 8000)
cd backend
..\.venv\Scripts\uvicorn app.main:app --reload --port 8000

# Start Frontend Cockpit (Port 3000)
cd frontend
npm run dev
```

- **Frontend Web Dashboard**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 7. Key REST API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/quantum/overview` | `GET` | Quantum optimization layer overview & storage availability |
| `/api/v1/quantum/qubo` | `GET` | Full mathematical QUBO matrix & subproblem formulation |
| `/api/v1/quantum/qaoa/run` | `POST` | Executes QAOA statevector variational optimization |
| `/api/v1/quantum/qml/info` | `GET` | Level 3 QML specs (4 qubits, 16-D Hilbert space, gate counts) |
| `/api/v1/quantum/qml/predict` | `POST` | Real-time quantum forward pass for water stress classification |
| `/api/v1/quantum/qml/kernel` | `GET` | 4×4 Quantum State Fidelity Kernel Gram matrix |
| `/api/v1/quantum/level4/specs` | `GET` | IBM Heron hardware noise profile & QEM parameters |
| `/api/v1/quantum/level4/spillway-zne` | `POST` | Use Case 1: Zero-Noise Extrapolated dam spillway dispatch |
| `/api/v1/quantum/level4/canal-anomaly`| `POST` | Use Case 2: Readout-mitigated canal seepage anomaly detection |
| `/api/v1/quantum/level4/telemetry-dd` | `POST` | Use Case 3: Dynamical Decoupling state coherence preservation |

---

## 📜 License & Acknowledgments
Built with **Qiskit 2.5** and modern web technologies. Licensed under the MIT License.
