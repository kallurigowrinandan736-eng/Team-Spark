"""
Jaldhara Quantum API Router
Exposes endpoints for Quantum Overview, QUBO Modelling, QAOA Optimization, and IBM Quantum Execution.
"""

from fastapi import APIRouter, Query, Body, HTTPException, status
from typing import Optional, List, Dict, Any

from app.data_loader import data_store
from app.services.scenarios import PRESET_SCENARIOS
from app.ml.inflow_service import inflow_service
from app.quantum.schemas import (
    QuantumOverviewResponse,
    QuboModelResponse,
    QaoaRunRequest,
    QaoaRunResponse,
    IbmRuntimeStatusResponse,
    IbmJobSubmissionRequest,
    IbmJobSubmissionResponse,
    QmlModelInfoResponse,
    QmlPredictRequest,
    QmlPredictResponse
)
from app.quantum.qubo_model import QuboWaterAllocationModel
from app.quantum.qaoa_optimizer import run_qaoa_optimization
from app.quantum.ibm_runtime import get_ibm_runtime_status, submit_ibm_quantum_job
from app.ml.quantum_ml_model import (
    VariationalQuantumClassifier,
    QuantumKernelMachine,
    generate_qml_benchmark_data
)
import numpy as np
import time

router = APIRouter(prefix="/quantum", tags=["Quantum Computing"])



def get_current_water_availability() -> float:
    """Computes real water availability using current storage + ML predicted inflow - min reserve."""
    total_avail = 0.0
    for r in data_store.reservoirs:
        inflow_mcm = r.expected_inflow_mcm
        if inflow_service.is_loaded:
            try:
                pred = inflow_service.predict(reservoir_id=r.id, prediction_period="2026-07")
                inflow_mcm = pred["predicted_inflow_mcm"]
            except Exception:
                pass
        avail = max(0.0, r.current_storage_mcm - r.min_reserve_mcm + inflow_mcm)
        total_avail += avail
    return round(total_avail, 2)


@router.get("/overview", response_model=QuantumOverviewResponse)
def get_quantum_overview():
    """Returns overview of the quantum computing layer and connection to the water network."""
    avail_mcm = get_current_water_availability()
    avail_ml = round(avail_mcm * 1000.0, 1)

    total_demand_mcm = round(sum(c.total_demand_mcm for c in data_store.crops), 2)
    total_demand_ml = round(total_demand_mcm * 1000.0, 1)

    import qiskit
    ibm_status = get_ibm_runtime_status()

    workflow = [
        {"step": "1. Hydrological Data", "desc": "Historical rainfall, runoff, and storage from reservoirs.csv and rainfall.csv"},
        {"step": "2. ML Inflow Prediction", "desc": "Random Forest Regressor forecasts future inflow quantiles to estimate available water"},
        {"step": "3. QUBO Formulation", "desc": "Maps canal routes and crop allocations into discrete binary gate states with supply & capacity penalty terms"},
        {"step": "4. QAOA Variational Circuit", "desc": "Constructs parameterized ansatz circuits using Qiskit 2.x for quantum state optimization"},
        {"step": "5. IBM Quantum Execution", "desc": "Runs on IBM Quantum backends via Qiskit Runtime Service or verified local simulation fallback"},
        {"step": "6. Physical Validation", "desc": "Decodes bitstrings back into Megaliters and enforces physical canal capacity and supply limits"}
    ]

    return QuantumOverviewResponse(
        title="Jaldhara Quantum-AI Smart Water Allocation",
        description="Exploring quantum optimization for non-convex irrigation networks, discrete canal gate scheduling, and fair crop water distribution.",
        current_scenario=PRESET_SCENARIOS[0].name,
        available_water_mcm=avail_mcm,
        available_water_ml=avail_ml,
        total_crop_demand_mcm=total_demand_mcm,
        total_crop_demand_ml=total_demand_ml,
        inflow_prediction_source="Stage 4 Random Forest Hydrological Model (Trained)",
        execution_mode="Local Qiskit 2.5 Simulator & IBM Quantum Runtime Ready",
        qiskit_version=qiskit.__version__,
        ibm_runtime_ready=ibm_status.runtime_sdk_available,
        workflow_steps=workflow
    )


@router.get("/qubo", response_model=QuboModelResponse)
def get_qubo_model(
    discretization_levels: int = Query(3, ge=2, le=5),
    use_subproblem: bool = Query(False)
):
    """
    Returns the real mathematical QUBO model, decision variable encodings,
    penalty weights, and interactive solvable Krishna Delta subproblem.
    """
    avail_mcm = get_current_water_availability()
    levels_map = {
        2: [0.0, 1.0],
        3: [0.0, 0.5, 1.0],
        4: [0.0, 0.33, 0.67, 1.0],
        5: [0.0, 0.25, 0.5, 0.75, 1.0]
    }
    levels = levels_map.get(discretization_levels, [0.0, 0.5, 1.0])

    model = QuboWaterAllocationModel(
        reservoirs=data_store.reservoirs,
        canals=data_store.canals,
        regions=data_store.regions,
        crops=data_store.crops,
        available_water_mcm=avail_mcm,
        discretization_levels=levels,
        use_subproblem=use_subproblem
    )
    return model.get_qubo_model_summary()


@router.post("/qaoa/run", response_model=QaoaRunResponse)
def run_qaoa(request: QaoaRunRequest):
    """
    Executes QAOA on the water allocation problem using real Qiskit 2.x StatevectorEstimator,
    optimizes variational parameters, and benchmarks against an exact classical baseline.
    """
    avail_mcm = get_current_water_availability()
    try:
        result = run_qaoa_optimization(
            request=request,
            reservoirs=data_store.reservoirs,
            canals=data_store.canals,
            regions=data_store.regions,
            crops=data_store.crops,
            available_water_mcm=avail_mcm
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"QAOA optimization failed: {str(e)}"
        )


@router.get("/ibm/status", response_model=IbmRuntimeStatusResponse)
def get_ibm_status():
    """
    Returns IBM Quantum Runtime configuration and connection status safely,
    without exposing secrets.
    """
    return get_ibm_runtime_status()


@router.post("/ibm/run", response_model=IbmJobSubmissionResponse)
def submit_ibm_job(request: IbmJobSubmissionRequest):
    """
    Submits a water allocation job to IBM Quantum on explicit user request.
    If physical hardware is connected, submits to QPU; otherwise executes verified emulation.
    """
    avail_mcm = get_current_water_availability()
    try:
        result = submit_ibm_quantum_job(
            request=request,
            reservoirs=data_store.reservoirs,
            canals=data_store.canals,
            regions=data_store.regions,
            crops=data_store.crops,
            available_water_mcm=avail_mcm
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"IBM Quantum job submission failed: {str(e)}"
        )


# =====================================================================
# Level 3: Pure Quantum Machine Learning (QML) Endpoints
# =====================================================================

_qml_vqc = None


def get_vqc_instance() -> VariationalQuantumClassifier:
    global _qml_vqc
    if _qml_vqc is None:
        _qml_vqc = VariationalQuantumClassifier(num_qubits=4, ansatz_reps=2, num_classes=4)
        X, y, _ = generate_qml_benchmark_data(num_samples=32)
        _qml_vqc.fit(X, y, epochs=5, lr=0.25)
    return _qml_vqc


@router.get("/qml/info", response_model=QmlModelInfoResponse)
def get_qml_info():
    """
    Returns specifications for Level 3 Quantum Machine Learning (VQC / QNN).
    Describes the 4-qubit Hilbert space embedding, variational ansatz, and parameter-shift gradients.
    """
    vqc = get_vqc_instance()
    decomposed = vqc.qnn_circuit.decompose()
    ops = {k: int(v) for k, v in decomposed.count_ops().items()}

    return QmlModelInfoResponse(
        level="Level 3: Pure Quantum Machine Learning (QML)",
        paradigm="Variational Quantum Classifier (VQC) & Quantum State Fidelity Kernel (QSVC)",
        num_qubits=vqc.num_qubits,
        hilbert_dimension=2 ** vqc.num_qubits,
        feature_map="ZZ-FeatureMap (Second-Order Non-Linear Pauli-Z Entangling Expansion)",
        ansatz="RealAmplitudes (Parameterized Rotation-Y & Circular CNOT Entanglement)",
        gradient_method="Analytical Parameter-Shift Rule (shift = pi / 2)",
        classes=["Low Stress", "Moderate Stress", "Severe Stress", "Critical Stress"],
        circuit_depth=decomposed.depth(),
        trainable_parameters=vqc.num_parameters,
        gate_counts=ops
    )


@router.post("/qml/predict", response_model=QmlPredictResponse)
def predict_water_stress_quantum(request: QmlPredictRequest):
    """
    Executes a quantum forward pass through the VQC using Qiskit 2.5 Statevector simulation.
    Embeds real-time agricultural telemetry into a 16-D Hilbert space, measures Pauli-Z expectations,
    and returns predicted agricultural water stress level.
    """
    t0 = time.time()
    vqc = get_vqc_instance()

    # Map inputs into angles in [0, pi]
    features = np.array([[
        request.soil_moisture_deficit * np.pi,
        request.evapotranspiration_rate * np.pi,
        (1.0 - request.reservoir_storage_ratio) * np.pi,
        request.temperature_stress * np.pi
    ]], dtype=np.float64)

    # Compute Pauli-Z expectations and softmax probabilities
    exp_vals = vqc.compute_expectation_values(features[0])
    probs = vqc.predict_proba(features)[0]
    pred_idx = int(np.argmax(probs))

    stress_labels = ["Low Stress", "Moderate Stress", "Severe Stress", "Critical Stress"]
    prob_dict = {stress_labels[i]: round(float(probs[i]), 4) for i in range(len(stress_labels))}
    latency_ms = round((time.time() - t0) * 1000.0, 2)

    return QmlPredictResponse(
        predicted_class=stress_labels[pred_idx],
        class_index=pred_idx,
        class_probabilities=prob_dict,
        quantum_expectation_values=[round(float(v), 4) for v in exp_vals],
        hilbert_state_dimension=16,
        execution_time_ms=latency_ms
    )


@router.get("/qml/kernel")
def get_qml_kernel_matrix():
    """
    Computes a sample 4x4 Quantum State Fidelity Kernel Matrix using statevector transition amplitudes.
    Demonstrates Quantum Support Vector Classifier (QSVC) state overlap evaluation.
    """
    qkm = QuantumKernelMachine(num_qubits=4, reps=1)
    X, _, _ = generate_qml_benchmark_data(num_samples=4)
    K = qkm.compute_kernel_matrix(X, X)

    return {
        "paradigm": "Quantum Support Vector Classifier (QSVC)",
        "kernel_type": "Fidelity Kernel: |<0| U_dagger(x_j) U(x_i) |0>|^2",
        "sample_size": 4,
        "matrix": [[round(float(val), 4) for val in row] for row in K],
        "properties": {
            "is_symmetric": True,
            "unit_diagonal": True,
            "hilbert_space_dim": 16
        }
    }


# =====================================================================
# Level 4: Hardware-Aware Quantum Computing & Error Mitigation (QEM)
# =====================================================================

_level4_engine = None


def get_level4_engine():
    global _level4_engine
    if _level4_engine is None:
        from app.quantum.level4_qem import Level4WaterUseCases
        _level4_engine = Level4WaterUseCases()
    return _level4_engine


@router.get("/level4/specs")
def get_level4_hardware_specs():
    """
    Returns hardware calibration profile and error mitigation capabilities.
    Calibrated to IBM Heron (Tunable Coupler Transmon QPU).
    """
    import qiskit
    engine = get_level4_engine()
    p = engine.noise_engine.profile
    return {
        "level": "Level 4: Hardware-Aware Quantum Computing & Error Mitigation (QEM)",
        "framework": f"Qiskit {qiskit.__version__} (DensityMatrix & Kraus Noise Evolution)",
        "target_hardware": p.name,
        "coherence_times": {
            "t1_relaxation_us": p.t1_us,
            "t2_dephasing_us": p.t2_us
        },
        "gate_durations_ns": {
            "single_qubit": p.gate_time_1q_ns,
            "two_qubit_cx": p.gate_time_2q_ns
        },
        "error_rates": {
            "depolarizing_1q_pct": round(p.error_1q * 100, 3),
            "depolarizing_2q_cx_pct": round(p.error_2q * 100, 3),
            "readout_p01_pct": round(p.readout_p01 * 100, 2),
            "readout_p10_pct": round(p.readout_p10 * 100, 2)
        },
        "mitigation_techniques": [
            "Zero-Noise Extrapolation (ZNE) via Unitary Digital Gate Folding (r=1, 3, 5)",
            "Twirled Readout Error Mitigation (TREX) via Inverted Confusion Matrix & NNLS",
            "Dynamical Decoupling (DD) via Symmetric XY4 Pulse Sequences"
        ],
        "use_cases": [
            "Use Case 1: Error-Mitigated Dam Spillway Gate Optimization under Flood Surge",
            "Use Case 2: Noise-Resilient Quantum Kernel Canal Anomaly & Seepage Detection",
            "Use Case 3: Coherence-Preserved Hydrological Telemetry State Vector Storage"
        ]
    }


@router.post("/level4/spillway-zne")
def run_spillway_zne():
    """
    Executes Use Case 1: Zero-Noise Extrapolated Dam Spillway Gate Optimization.
    """
    engine = get_level4_engine()
    return engine.run_spillway_zne_optimization()


@router.post("/level4/canal-anomaly")
def run_canal_anomaly_detection():
    """
    Executes Use Case 2: Noise-Resilient Quantum Kernel Canal Anomaly & Seepage Detection.
    """
    engine = get_level4_engine()
    return engine.run_canal_anomaly_detection_mitigated()


@router.post("/level4/telemetry-dd")
def run_telemetry_dynamical_decoupling():
    """
    Executes Use Case 3: Dynamical Decoupling Coherence Preservation for Telemetry Superposition.
    """
    engine = get_level4_engine()
    return engine.run_telemetry_dynamical_decoupling()


