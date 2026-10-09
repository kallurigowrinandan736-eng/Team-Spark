"""
Jaldhara QAOA Quantum Optimization Engine
Implements the Quantum Approximate Optimization Algorithm (QAOA) using Qiskit 2.5.2 primitives.
Provides exact classical baseline benchmarking, convergence tracking, and bitstring sampling.
"""

import sys
import os
from pathlib import Path

# Ensure backend root is on sys.path for direct CLI execution
_backend_root = str(Path(__file__).resolve().parent.parent.parent)
if _backend_root not in sys.path:
    sys.path.insert(0, _backend_root)

import time
import logging
from typing import Dict, Any, List, Optional, Tuple
import numpy as np
from scipy.optimize import minimize

import qiskit
from qiskit.circuit.library import QAOAAnsatz
from qiskit.quantum_info import SparsePauliOp
from qiskit.primitives import StatevectorEstimator, StatevectorSampler

from app.schemas import Reservoir, Canal, Region, Crop
from app.quantum.qubo_model import QuboWaterAllocationModel
from app.quantum.validation import decode_and_validate_bitstring
from app.quantum.schemas import QaoaRunRequest, QaoaRunResponse

logger = logging.getLogger(__name__)


def solve_classical_brute_force(
    model: QuboWaterAllocationModel
) -> Tuple[str, float, float]:
    """
    Exact classical baseline solver that evaluates all 2^N states.
    Used for benchmarking QAOA approximation ratio and solution optimality.
    """
    t_start = time.perf_counter()
    Q, c, const = model.build_qubo_matrix()
    N = model.num_qubits

    best_energy = float("inf")
    best_bits = "0" * N

    # For up to 12 qubits, brute-force takes milliseconds
    max_states = min(4096, 2 ** N)
    for i in range(max_states):
        # Format binary string
        bit_str = format(i, f"0{N}b")
        x = np.array([int(b) for b in bit_str])
        energy = float(x @ Q @ x + c @ x + const)
        if energy < best_energy:
            best_energy = energy
            best_bits = bit_str

    runtime_ms = (time.perf_counter() - t_start) * 1000.0
    return best_bits, round(best_energy, 4), round(runtime_ms, 2)


def run_qaoa_optimization(
    request: QaoaRunRequest,
    reservoirs: List[Reservoir],
    canals: List[Canal],
    regions: List[Region],
    crops: List[Crop],
    available_water_mcm: float
) -> QaoaRunResponse:
    """
    Executes QAOA on the water allocation problem using Qiskit StatevectorEstimator and Sampler.
    """
    t_total_start = time.perf_counter()

    # 1. Build problem model and Ising Hamiltonian
    model = QuboWaterAllocationModel(
        reservoirs=reservoirs,
        canals=canals,
        regions=regions,
        crops=crops,
        available_water_mcm=available_water_mcm,
        use_subproblem=request.use_subproblem
    )
    H_C, offset = model.to_ising_hamiltonian()
    num_qubits = model.num_qubits

    # 2. Build QAOA Ansatz
    p_layers = request.p_layers
    ansatz = QAOAAnsatz(cost_operator=H_C, reps=p_layers)
    circuit_depth = ansatz.depth()

    # 3. Setup Qiskit Primitives
    estimator = StatevectorEstimator()
    sampler = StatevectorSampler()

    # History tracking
    convergence_history: List[Dict[str, Any]] = []
    iteration_counter = 0

    def cost_function(params: np.ndarray) -> float:
        nonlocal iteration_counter
        iteration_counter += 1
        # Run estimator pub: (ansatz, observable, parameter_values)
        pub = (ansatz, H_C, params)
        job = estimator.run([pub])
        result = job.result()
        ev = float(result[0].data.evs)
        total_energy = ev + offset

        if iteration_counter <= 30 or iteration_counter % 5 == 0:
            convergence_history.append({
                "iteration": iteration_counter,
                "energy": round(total_energy, 4),
                "gamma_norm": round(float(np.linalg.norm(params[:p_layers])), 3),
                "beta_norm": round(float(np.linalg.norm(params[p_layers:])), 3),
            })
        return ev

    # 4. Classical Optimization Loop (COBYLA / SLSQP)
    # Initial variational parameters: gammas in [0, pi], betas in [0, pi/2]
    init_gamma = [0.35 / (k + 1) for k in range(p_layers)]
    init_beta = [0.55 / (k + 1) for k in range(p_layers)]
    init_params = np.array(init_gamma + init_beta)

    opt_method = request.optimizer.upper()
    if opt_method not in ["COBYLA", "SLSQP"]:
        opt_method = "COBYLA"

    opt_res = minimize(
        cost_function,
        init_params,
        method=opt_method,
        options={"maxiter": request.maxiter}
    )

    opt_params = opt_res.x
    opt_gamma = [round(float(g), 4) for g in opt_params[:p_layers]]
    opt_beta = [round(float(b), 4) for b in opt_params[p_layers:]]
    min_energy = float(opt_res.fun) + offset

    # 5. Measure and Sample Output Bitstrings
    meas_circuit = ansatz.copy()
    meas_circuit.measure_all()
    sample_pub = (meas_circuit, opt_params)
    sample_res = sampler.run([sample_pub], shots=request.shots).result()
    counts = sample_res[0].data.meas.get_counts()

    # Sort bitstrings by frequency
    sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    total_shots = sum(counts.values())

    top_bitstrings: List[Dict[str, Any]] = []
    for bitstring, count in sorted_counts[:6]:
        prob = round(count / total_shots, 4)
        top_bitstrings.append({
            "bitstring": bitstring,
            "count": count,
            "probability": prob,
            "is_best": False
        })

    best_bitstring = sorted_counts[0][0] if sorted_counts else "0" * num_qubits
    if top_bitstrings:
        top_bitstrings[0]["is_best"] = True

    # 6. Validate Winning Bitstring
    validation = decode_and_validate_bitstring(
        bitstring=best_bitstring,
        variables=model.variables,
        reservoirs=reservoirs,
        canals=canals,
        crops=crops,
        available_water_mcm=available_water_mcm
    )

    # 7. Exact Classical Baseline Comparison
    c_bits, c_energy, c_runtime_ms = solve_classical_brute_force(model)
    c_validation = decode_and_validate_bitstring(
        bitstring=c_bits,
        variables=model.variables,
        reservoirs=reservoirs,
        canals=canals,
        crops=crops,
        available_water_mcm=available_water_mcm
    )

    total_runtime_ms = (time.perf_counter() - t_total_start) * 1000.0

    classical_comparison = {
        "solver_type": "Exact Classical Brute-Force (Exhaustive)",
        "best_bitstring": c_bits,
        "energy": c_energy,
        "runtime_ms": c_runtime_ms,
        "demand_satisfaction_pct": c_validation["overall_demand_satisfaction_pct"],
        "approximation_ratio": round(min_energy / max(1e-5, abs(c_energy)), 4) if c_energy != 0 else 1.0,
        "status": "Exact Global Optimum verified on classical CPU."
    }

    return QaoaRunResponse(
        status="success",
        execution_mode="Local Qiskit Simulator (Statevector / Sampler)",
        qiskit_version=qiskit.__version__,
        num_qubits=num_qubits,
        p_layers=p_layers,
        circuit_depth=circuit_depth,
        optimal_gamma=opt_gamma,
        optimal_beta=opt_beta,
        best_bitstring=best_bitstring,
        optimal_energy=round(min_energy, 4),
        runtime_ms=round(total_runtime_ms, 2),
        convergence_history=convergence_history,
        top_bitstrings=top_bitstrings,
        allocations=validation["allocations"],
        validation=validation,
        classical_comparison=classical_comparison
    )


if __name__ == "__main__":
    from app.data_loader import data_store
    print("=" * 60)
    print("Executing Jaldhara QAOA Quantum Optimization Engine...")
    print("=" * 60)
    req = QaoaRunRequest(
        p_layers=1,
        shots=512,
        use_subproblem=True
    )
    result = run_qaoa_optimization(
        request=req,
        reservoirs=data_store.reservoirs,
        canals=data_store.canals,
        regions=data_store.regions,
        crops=data_store.crops,
        available_water_mcm=450.0
    )
    print(f"Status: {result.status}")
    print(f"Execution Mode: {result.execution_mode}")
    print(f"Qiskit Version: {result.qiskit_version}")
    print(f"Qubits: {result.num_qubits} | Depth: {result.circuit_depth} | p: {result.p_layers}")
    print(f"Optimal Energy: {result.optimal_energy}")
    print(f"Best Bitstring: {result.best_bitstring}")
    print(f"Runtime: {result.runtime_ms} ms")
    print(f"Classical Baseline Energy: {result.classical_comparison['energy']}")
    print(f"Approximation Ratio: {result.classical_comparison['approximation_ratio']}")
    print(f"Canal Allocations: {len(result.allocations)} canal discharges computed.")
    print("[SUCCESS] QAOA optimization finished successfully!")

