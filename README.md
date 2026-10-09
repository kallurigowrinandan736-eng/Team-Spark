# AquaQ - Quantum-AI Powered Smart Irrigation & Water Resource Allocation Platform

> **"Smart Water. Smarter Allocation."**  
> *AI and Quantum-Inspired Optimization for Sustainable Irrigation and Water Resource Management.*

---

## 🌊 Overview

**AquaQ** is a comprehensive, full-stack decision-support and optimization platform designed for water resource authorities, irrigation managers, and agricultural planners. It couples **machine learning (demand prediction & probabilistic inflow forecasting)** with **classical mathematical programming (LP/MILP)** and **quantum-inspired optimization (QUBO + Simulated Annealing / SQA simulation)** to solve complex multi-reservoir, multi-canal, and multi-crop water allocation problems under scarcity, normal, and flood conditions.

---

## ⚠️ Honesty & Simulation Disclaimers

1. **Quantum Layer & Qiskit Integration**: Powered by [IBM Qiskit](https://github.com/Qiskit/qiskit) (v2.5+). Formulates the water allocation QUBO problem into parameterized QAOA quantum circuits (problem unitary $R_Z$/$R_{ZZ}$ and transverse mixer $R_X$) with circuit depth analysis and statevector simulation. Classical simulation executes via Simulated Quantum Annealing (SQA) and statevector probability sampling without requiring access to a physical quantum processing unit (QPU).
2. **Demo Data**: All reservoir capacities, canal coordinates, historical rainfall, and crop records are simulated/synthetic datasets based on the Krishna River Basin in Andhra Pradesh, India.
3. **Simulated AI/ML Models**: Machine learning models (RandomForest / GradientBoosting) are trained on agronomic FAO-56 Penman-Monteith synthetic datasets with realistic monsoon seasonality.


---

## 🚀 Quick Start (One-Command Startup)

### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.10+ and **pip**

### 1. Install Dependencies

#### Frontend:
```bash
cd frontend
npm install
```

#### Backend:
```bash
cd backend
python -m pip install -r requirements.txt
```

### 2. Run Applications

#### Running Frontend & Backend Concurrently (from repository root):
```bash
npm install
npm run dev:all
```

#### Or Run Independently:
- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```
  *Accessible at [http://localhost:3000](http://localhost:3000)*

- **Backend**:
  ```bash
  cd backend
  uvicorn app.main:app --reload --port 8000
  ```
  *API documentation accessible at [http://localhost:8000/docs](http://localhost:8000/docs)*

> 💡 **Built-in Resilient Offline Fallback**: If the backend is not running, the frontend automatically switches to a high-fidelity TypeScript client-side simulation engine (offline mode), allowing full testing of all optimization, ML, and scenario features without interruption!

---

## 🏗️ System Architecture

```
                                  [ Data Layer ]
            (Reservoirs, Canals, Crops, Regions, Weather, Inflow)
                                        │
                                        ▼
                                [ AI / ML Layer ]
        ┌───────────────────────────────┴───────────────────────────────┐
        ▼                                                               ▼
[ Demand Predictor (GBR / RF) ]                     [ Probabilistic Inflow Forecaster ]
(FAO-56 Penman-Monteith Proxy)                      (Seasonal Decomposition + P10/P50/P90)
        │                                                               │
        └───────────────────────────────┬───────────────────────────────┘
                                        ▼
                        [ Optimization Formulation Engine ]
                        (Scalarized Weighted Objectives & Constraints)
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
[ Baseline Allocator ]        [ Classical LP / MILP ]       [ Quantum-Inspired QUBO ]
 (Proportional Demand)         (PuLP / Simplex Solver)       (Simulated Quantum Annealing)
        │                               │                               │
        └───────────────────────────────┼───────────────────────────────┘
                                        ▼
                        [ Metrics & Evaluation Engine ]
        (Jain's Fairness, Safety Margin, Canal Losses, Composite Score)
                                        │
        ┌───────────────────────────────┴───────────────────────────────┐
        ▼                                                               ▼
[ Explainable AI & Recommendations ]                        [ Real-time Operations Dashboard ]
 (Factor Attributions & Insights)                            (GIS Map, Flow Diagrams, Alerts)
```

---

## 🔬 Mathematical Formulation

### Decision Variables
- $x_{c,k} \ge 0$: Water allocated to crop $k$ through canal $c$ ($\text{MCM}$)
- $r_j \ge 0$: Derived release from reservoir $j$ ($\text{MCM}$)
- $s_k \ge 0$: Water shortage for crop $k$ ($\text{MCM}$)

### Objective Function (Scalarized Weighted Sum)
$$\max \quad w_{\text{sat}} \sum_{k} \omega_k \frac{\text{Delivered}_k}{\text{Demand}_k} + w_{\text{eff}} (1 - \text{LossPct}) + w_{\text{fair}} \mathcal{J}(\mathbf{x}) + w_{\text{safe}} \mathcal{S}(\mathbf{r}) - w_{\text{short}} \sum_k s_k$$

### Constraints
1. **Reservoir Storage Balance**: $r_j \le S_j - S_{j,\min} + I_{j,\text{forecast}}$
2. **Canal Flow Capacity**: $\sum_{k \in \text{Crops}(c)} x_{c,k} \le C_c$
3. **Conveyance Losses**: $\text{Delivered}_k = \sum_{c} x_{c,k} \cdot (1 - \lambda_c)$
4. **Demand Upper Bound**: $\text{Delivered}_k \le D_k$
5. **Environmental River Reserve**: $S_j - r_j \ge S_{j,\text{env}}$

---

## 📁 Repository Structure

```
aquaq/
├── README.md
├── package.json               # Root scripts (concurrently)
├── .env.example
├── data/                      # Demo CSV datasets
│   ├── reservoirs.csv
│   ├── canals.csv
│   ├── crops.csv
│   ├── regions.csv
│   ├── weather.csv
│   ├── rainfall.csv
│   ├── inflow_history.csv
│   └── water_demand_history.csv
├── backend/                   # FastAPI Python backend
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   ├── data_loader.py
│   │   ├── ml/
│   │   ├── optimization/
│   │   ├── services/
│   │   └── routers/
│   ├── tests/
│   └── requirements.txt
└── frontend/                  # Next.js App Router frontend
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   ├── store/
    │   └── data/
    └── package.json
```

---

## 🏆 Hackathon Evaluation Guide

1. Navigate to **Hackathon Demo** (`/demo`) for a guided 7-step interactive walkthrough.
2. Toggle between **Normal** and **Drought Scenarios** to inspect how the optimizer mitigates water scarcity.
3. Compare **Baseline vs Classical vs Quantum-Inspired** in the **Compare** (`/compare`) tab.
4. Inspect mathematical explanations and QUBO energy curves under **Quantum Optimization** (`/quantum`).
5. Explore the interactive **GIS Map** (`/map`) and **Canal Flow Diagram** (`/canals`).

---

## 📜 License
MIT License - Built for Hackathon Demonstration.
