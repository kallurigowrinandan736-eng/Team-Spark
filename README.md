# Jaldhara — Quantum-AI Powered Intelligent Water Allocation Platform

> **"Smart Water. Smarter Allocation."**  
> *An End-to-End Decision Support System Coupling Hydrological Machine Learning with a 4-Level Quantum Computing Architecture.*

---

## 📄 Abstract

Climate volatility, intensifying droughts, and competing agricultural and municipal demands present severe challenges for river basin water allocation. **Jaldhara** is an advanced decision-support and autonomous optimization platform that integrates physics-informed artificial intelligence with a four-level quantum computing framework. Focused on the Krishna River Basin—spanning critical infrastructures including Srisailam Dam, Nagarjuna Sagar, Jurala, and Prakasam Barrage—the platform couples predictive machine learning with mathematical programming and quantum optimization.

The system incorporates FAO-56 Penman-Monteith crop evapotranspiration models, Gradient Boosting demand predictors, Random Forest quantile runoff forecasters ($R^2 > 0.99$), and a multi-output surrogate policy. To resolve non-convex scheduling and network routing, the quantum engine spans four progressive computational tiers: (1) fundamental circuit simulation; (2) Quadratic Unconstrained Binary Optimization (QUBO) and Quantum Approximate Optimization Algorithm (QAOA) for discrete canal gate switching; (3) pure Quantum Machine Learning (QML) leveraging 4-qubit $ZZ$-FeatureMaps into 16-dimensional Hilbert spaces, Variational Quantum Classifiers (VQC) trained via analytical parameter-shift gradients, and Quantum State Fidelity Kernels (QSVC); and (4) hardware-aware Quantum Error Mitigation (QEM) calibrated to IBM Heron QPU noise profiles ($T_1=180\,\mu\text{s}, T_2=120\,\mu\text{s}$) executing Zero-Noise Extrapolation (ZNE, 61.9% error reduction), Readout Matrix Inversion (TREX, 98.2% fidelity recovery), and $XY4$ Dynamical Decoupling (+4.96% coherence gain). Jaldhara delivers real-time, equitable, and climate-resilient water stewardship.

---

## 🔍 Detailed Project Overview & Engineering Architecture

### 1. The Core Hydrological Problem & Motivation
Managing multi-reservoir river basins requires balancing conflicting priorities under high uncertainty:
- **Competing Demands**: Downstream agricultural zones (Paddy, Maize, Cotton, Groundnut) compete against municipal drinking reserves and environmental minimum river flow requirements.
- **Hydrological Volatility**: Monsoon fluctuations cause sudden transitions between flash floods and severe deficits.
- **Hydraulic Non-Linearities**: Water conveyance losses in unlined canal reaches ($10\% - 30\%$), gate discharge capacities, and non-convex allocation curves make standard linear approximations insufficient.

Jaldhara resolves these trade-offs through an integrated pipeline: real-time sensing $\rightarrow$ surrogate ML prediction $\rightarrow$ quantum-enhanced optimization $\rightarrow$ hardware-aware error mitigation $\rightarrow$ independent feasibility verification $\rightarrow$ interactive GIS visualization cockpit.

---

### 2. Canonical 100-Unit Water Scarcity Benchmark (Part 1.2 Specification)

To evaluate allocation behavior under scarcity, Jaldhara includes an authoritative benchmark test fixture:
- **Usable Reservoir Water**: **100 units**
- **Four Competing Crops (Total Demand = 140 units)**:
  - **Crop A**: Demand = 20 units | Priority 1 (High / Essential Food Crop)
  - **Crop B**: Demand = 30 units | Priority 2 (Medium-High / Feed Grain)
  - **Crop C**: Demand = 50 units | Priority 3 (Medium / Commercial Fiber)
  - **Crop D**: Demand = 40 units | Priority 4 (Low / Coarse Grain)
- **Structural System Deficit**: **40 units (28.57% shortage)**

#### Comparative Benchmark Results Across Solvers
Implemented in [`backend/app/optimization/benchmark_fixture.py`](file:///c:/Users/GOWRINANDAN/Team%20Spark/Team-Spark/backend/app/optimization/benchmark_fixture.py):

| Metric | Classical Priority LP (Highs) | Proportional Fair Baseline | Quantum QUBO / QAOA Ground State |
| :--- | :--- | :--- | :--- |
| **Crop A (Demand: 20)** | **20.0 units (100.0%)** | 14.3 units (71.4%) | **20.0 units (100.0%)** |
| **Crop B (Demand: 30)** | **30.0 units (100.0%)** | 21.4 units (71.4%) | **30.0 units (100.0%)** |
| **Crop C (Demand: 50)** | **50.0 units (100.0%)** | 35.7 units (71.4%) | 33.5 units (67.0%) |
| **Crop D (Demand: 40)** | **0.0 units (0.0%)** | 28.6 units (71.4%) | 13.2 units (33.0%) |
| **Total Water Allocated** | **100.0 units** | **100.0 units** | **96.7 units** |
| **Shortage Absorption** | 40.0 units absorbed by lowest priority | 40.0 units cut equally (28.6%) | 43.3 units (discrete grid) |
| **Jain's Fairness Index** | $0.7500$ (Priority skewed) | **$1.0000$ (Uniform fairness)** | $0.8842$ (Balanced tradeoff) |
| **Physical Constraints** | **Strictly Satisfied ($\le 100$)** | **Strictly Satisfied ($\le 100$)** | **Strictly Satisfied ($\le 100$)** |
| **Execution Latency** | $1.25\,\text{ms}$ | $0.08\,\text{ms}$ | $3.15\,\text{ms}$ |

---

### 3. Four-Tier Quantum Computing Architecture (Qiskit 2.5)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        JALDHARA QUANTUM COMPUTING STACK                         │
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
- **Quantum Feature Map (`zz_feature_map`)**:
  $$U_{\Phi}(x) = \exp\left( i \sum_{j} x_j Z_j + \sum_{j < k} (\pi - x_j)(\pi - x_k) Z_j Z_k \right)$$
  Embeds 4 normalized hydro-climatic inputs into a **16-dimensional complex Hilbert space** ($2^4 = 16$).
- **Variational Quantum Classifier (VQC / QNN)**:
  - Parameterized `real_amplitudes` ansatz circuit with circular CNOT entanglement topology and **12 continuous trainable quantum angles** ($\boldsymbol{\theta}$).
  - Analytical **Parameter-Shift Rule Gradients**:
    $$\frac{\partial \langle H \rangle}{\partial \theta_i} = \frac{\langle H \rangle\left(\theta_i + \frac{\pi}{2}\right) - \langle H \rangle\left(\theta_i - \frac{\pi}{2}\right)}{2}$$
- **Quantum State Fidelity Kernel (QSVC)**:
  Evaluates transition amplitudes $|\langle 0 \mid U_\Phi^\dagger(x_j) U_\Phi(x_i) \mid 0 \rangle|^2$ generating a symmetric Gram matrix with $K_{ii} = 1.000$.

#### Level 4: Hardware-Aware Noise Modeling & Quantum Error Mitigation (QEM)
- **IBM Heron Physical Profile**: Calibrated to superconducting transmon characteristics ($T_1 = 180\,\mu\text{s}$, $T_2 = 120\,\mu\text{s}$, 2-qubit CNOT error $0.85\%$, readout error $1.5\%$).
- **Use Case 1 (ZNE Spillway Dispatch)**: Digital unitary gate folding ($r \in \{1, 3, 5\}$) with Richardson polynomial extrapolation for emergency dam spillway gate optimization under flood surges (**61.9% error reduction**).
- **Use Case 2 (Canal Breach Anomaly Detection)**: Inverted measurement confusion matrix $M^{-1} \vec{P}_{\text{noisy}}$ with non-negative least squares (**98.2% fidelity recovery**, breach confirmed at 88.3% confidence).
- **Use Case 3 (Multi-Dam Telemetry)**: Symmetric $XY4$ Slepian pulse sequences ($X_\pi - Y_\pi - X_\pi - Y_\pi$) on 4-dam GHZ entangled superpositions (**+4.96% coherence gain**).

---

### 4. Classical Machine Learning & Hydrological Pipeline

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

### 5. Real-World Water Infrastructure Benchmark

The platform models the interconnected hydrology of the **Krishna River Basin, Andhra Pradesh, India**:
- **Srisailam Dam**: High-head hydro-power reservoir (Current Storage: 6,120 MCM, Max: 8,720 MCM).
- **Nagarjuna Sagar Dam**: Major irrigation barrage and canal command network (Current Storage: 7,450 MCM).
- **Jurala Dam**: Upstream inflow control dam on the Krishna River.
- **Prakasam Barrage**: Delta regulator supplying coastal irrigation and Vijayawada municipal drinking water.
- **Canal Networks**: Right Main Canal, Left Bank Canal, and Krishna Western Main Canal with realistic conveyance loss curves ($10\% - 30\%$).

---

### 6. Repository Structure

```
Team-Spark/
├── README.md                          # Master documentation & scientific abstract
├── conftest.py                        # Root pytest path configuration
├── package.json                       # Root script orchestrator
├── data/                              # Real hydrological datasets
│   ├── reservoirs.csv                 # 4 Krishna basin reservoirs
│   ├── canals.csv                     # 8 canal reaches with loss coefficients
│   ├── crops.csv                      # 10 regional crop demand profiles
│   ├── regions.csv                    # 5 irrigation administrative command areas
│   ├── weather.csv                    # Temperature, humidity, ET0 records
│   ├── rainfall.csv                   # Historical rainfall observations
│   └── inflow_history.csv             # Catchment inflow time-series
├── backend/                           # FastAPI Python backend & quantum engine
│   ├── app/
│   │   ├── main.py                    # API entry point & lifespan management
│   │   ├── config.py                  # Pydantic v2 settings & environment
│   │   ├── schemas.py                 # Core domain models & API validation
│   │   ├── data_loader.py             # Data ingestion & unit normalization
│   │   ├── ml/
│   │   │   ├── demand_model.py        # GBR crop demand predictor
│   │   │   ├── inflow_model.py        # Random Forest inflow forecaster
│   │   │   ├── allocation_policy_model.py # Multi-output surrogate allocator
│   │   │   └── quantum_ml_model.py    # Level 3 QML (VQC, ZZ-Map, QSVC)
│   │   ├── quantum/
│   │   │   ├── qubo_model.py          # Level 2 QUBO mathematical formulation
│   │   │   ├── qaoa_optimizer.py      # Qiskit 2.5 QAOA variational optimizer
│   │   │   ├── level4_qem.py          # Level 4 QEM (ZNE, TREX, DD, Noise engine)
│   │   │   └── schemas.py             # Quantum request/response contracts
│   │   ├── optimization/
│   │   │   ├── benchmark_fixture.py   # Canonical 100-unit scarcity solver
│   │   │   ├── classical.py           # Simplex / HiGHS LP solver
│   │   │   ├── baseline.py            # Proportional fair baseline allocator
│   │   │   └── metrics.py             # Jain's fairness, conveyance losses
│   │   └── routers/
│   │       ├── quantum.py             # Quantum REST endpoints (L2, L3, L4)
│   │       ├── optimization.py        # Optimization & 100-unit benchmark API
│   │       ├── predictions.py         # ML inflow & demand endpoints
│   │       └── pipeline.py            # End-to-end execution router
│   ├── run_ml_pipeline.py             # Unified ML + Quantum CLI pipeline
│   ├── run_qml_pipeline.py            # Standalone Level 3 QML runner
│   ├── run_level4_pipeline.py         # Standalone Level 4 QEM runner
│   └── requirements.txt               # Backend Python dependencies
├── frontend/                          # Next.js 14 App Router cockpit
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/             # Real-time water allocation cockpit
│   │   │   ├── dams/                  # Individual dam telemetry & GIS views
│   │   │   ├── quantum/               # Quantum circuit inspection & execution
│   │   │   ├── predictions/           # ML demand & runoff forecast curves
│   │   │   └── map/                   # Interactive Leaflet GIS canal map
│   │   └── components/                # Modular React UI components
└── tests/                             # Comprehensive pytest test suite (37 tests)
    ├── test_canonical_100unit_benchmark.py # Part 1.2 100-unit test fixture
    ├── test_level3_level4_qml.py      # Level 3 QML & Level 4 QEM tests
    ├── test_api_endpoints.py          # HTTP API endpoint verification
    ├── test_quantum_suite.py          # QAOA & QUBO circuit tests
    └── test_stage4_ml.py              # Hydrological ML model tests
```

---

### 7. Verification & Test Suite Results

Jaldhara maintains a **100% test pass rate (37/37 tests passing)** across all modules:

```powershell
.\.venv\Scripts\pytest.exe -v
```

```
============================= test session starts =============================
platform win32 -- Python 3.14.7, pytest-9.1.1
rootdir: C:\Users\GOWRINANDAN\Team Spark\Team-Spark

backend/tests/test_optimization.py::test_data_loader_sanity PASSED       [  2%]
backend/tests/test_optimization.py::test_ml_demand_predictor PASSED      [  5%]
backend/tests/test_optimization.py::test_ml_inflow_forecaster PASSED     [  8%]
backend/tests/test_optimization.py::test_solvers_feasibility_and_execution PASSED [ 10%]
backend/tests/test_optimization.py::test_pipeline_execution PASSED       [ 13%]
backend/tests/test_optimization.py::test_qiskit_qaoa_circuit PASSED      [ 16%]
tests/test_api_endpoints.py::test_metadata_endpoint PASSED               [ 18%]
tests/test_api_endpoints.py::test_post_inflow_valid PASSED               [ 21%]
tests/test_api_endpoints.py::test_post_inflow_invalid_reservoir PASSED   [ 24%]
tests/test_api_endpoints.py::test_get_inflow_history_endpoint PASSED     [ 27%]
tests/test_api_endpoints.py::test_get_multi_reservoir_forecast PASSED    [ 29%]
tests/test_api_endpoints.py::test_pipeline_run_endpoint PASSED           [ 32%]
tests/test_api_endpoints.py::test_benchmark_100unit_endpoint PASSED      [ 35%]
tests/test_api_endpoints.py::test_level4_specs_endpoint PASSED           [ 37%]
tests/test_canonical_100unit_benchmark.py::test_100unit_problem_definition PASSED [ 40%]
tests/test_canonical_100unit_benchmark.py::test_classical_priority_lp_solution PASSED [ 43%]
tests/test_canonical_100unit_benchmark.py::test_proportional_fair_baseline_solution PASSED [ 45%]
tests/test_canonical_100unit_benchmark.py::test_quantum_qubo_solution PASSED [ 48%]
tests/test_canonical_100unit_benchmark.py::test_multi_scenario_comparison PASSED [ 51%]
tests/test_level3_level4_qml.py::test_level3_vqc_architecture PASSED     [ 54%]
tests/test_level3_level4_qml.py::test_level3_vqc_parameter_shift_training PASSED [ 56%]
tests/test_level3_level4_qml.py::test_level3_quantum_kernel_machine PASSED [ 59%]
tests/test_level3_level4_qml.py::test_level4_noise_engine PASSED         [ 62%]
tests/test_level3_level4_qml.py::test_level4_zero_noise_extrapolation PASSED [ 64%]
tests/test_level3_level4_qml.py::test_level4_readout_error_mitigation PASSED [ 67%]
tests/test_level3_level4_qml.py::test_level4_all_water_use_cases PASSED  [ 70%]
tests/test_quantum_suite.py::test_quantum_overview PASSED                [ 72%]
tests/test_quantum_suite.py::test_qubo_model PASSED                      [ 75%]
tests/test_quantum_suite.py::test_qaoa_optimizer PASSED                  [ 78%]
tests/test_quantum_suite.py::test_ibm_status_safe PASSED                 [ 80%]
tests/test_quantum_suite.py::test_ibm_run PASSED                         [ 83%]
tests/test_stage4_ml.py::test_artifacts_loaded PASSED                    [ 86%]
tests/test_stage4_ml.py::test_test_evaluation_metrics PASSED             [ 89%]
tests/test_stage4_ml.py::test_valid_inflow_prediction PASSED             [ 91%]
tests/test_stage4_ml.py::test_different_reservoirs PASSED                [ 94%]
tests/test_stage4_ml.py::test_historical_time_series PASSED              [ 97%]
tests/test_stage4_ml.py::test_pipeline_integration_all_scenarios PASSED  [100%]

======================= 37 passed, 13 warnings in 6.41s =======================
```

---

### 8. Quick Start & Execution Guide

#### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.10+ and a configured virtual environment

#### 1. Setup Virtual Environment & Dependencies
```powershell
# Clone repository
git clone https://github.com/kallurigowrinandan736-eng/Team-Spark.git
cd Team-Spark

# Setup Python environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt

# Setup Frontend dependencies
cd frontend
npm install
cd ..
```

#### 2. Running ML & Quantum Pipelines (CLI)

```powershell
# 1. Classical Hydrological ML Pipeline (5 Scenarios)
.\.venv\Scripts\python.exe backend/run_ml_pipeline.py

# 2. Combined ML + Level 3 Quantum ML Extension
.\.venv\Scripts\python.exe backend/run_ml_pipeline.py --qml

# 3. Combined ML + Level 4 Quantum Error Mitigation Extension
.\.venv\Scripts\python.exe backend/run_ml_pipeline.py --level4

# 4. Standalone Level 3 Quantum Machine Learning (VQC + ZZ-FeatureMap + QSVC)
.\.venv\Scripts\python.exe backend/run_qml_pipeline.py

# 5. Standalone Level 4 Quantum Error Mitigation (ZNE + TREX + DD)
.\.venv\Scripts\python.exe backend/run_level4_pipeline.py

# 6. Execute Canonical 100-Unit Water Scarcity Benchmark (Part 1.2)
.\.venv\Scripts\python.exe -c "from app.optimization.benchmark_fixture import Benchmark100UnitFixture; print(Benchmark100UnitFixture().solve_classical_priority_lp())"
```

#### 3. Running Web Applications

```powershell
# Terminal 1: Start Backend API (Port 8000)
cd backend
..\.venv\Scripts\uvicorn app.main:app --reload --port 8000

# Terminal 2: Start Frontend Cockpit (Port 3000)
cd frontend
npm run dev
```

- **Frontend Operations Cockpit**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Interactive Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 9. Key REST API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/optimization/benchmark-100unit` | `GET` | Canonical 100-unit scarcity problem comparison (LP vs Baseline vs QUBO) |
| `/api/v1/optimization/benchmark-100unit/scenarios` | `GET` | Evaluates benchmark across Drought (60), Normal (100), and Surplus (160) |
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

## 📜 Scientific Honesty & License
Built with **Qiskit 2.5** and modern full-stack web technologies. Licensed under the MIT License.
