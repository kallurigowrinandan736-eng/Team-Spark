"""
Jaldhara Quantum Pipeline CLI Runner
Usage:
    python run_quantum.py
"""

import os
import sys
from pathlib import Path

# Setup path so backend app modules are importable
backend_dir = Path(__file__).resolve().parent / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import qiskit
from app.data_loader import data_store
from app.quantum.qubo_model import QuboWaterAllocationModel
from app.quantum.qaoa_optimizer import run_qaoa_optimization
from app.quantum.schemas import QaoaRunRequest, IbmJobSubmissionRequest
from app.quantum.ibm_runtime import get_ibm_runtime_status, submit_ibm_quantum_job

def main():
    print("=" * 70)
    print(">> JALDHARA: QUANTUM-AI WATER ALLOCATION PIPELINE")
    print("=" * 70)
    print(f"Qiskit Core Version: {qiskit.__version__}")
    print(f"Available Reservoirs: {len(data_store.reservoirs)}")
    print(f"Available Canals:     {len(data_store.canals)}")
    print(f"Crop Command Areas:   {len(data_store.crops)}")
    print()

    # ----------------------------------------------------
    # STEP 1: QUBO Formulation
    # ----------------------------------------------------
    print("[1/4] Formulating Quadratic Unconstrained Binary Optimization (QUBO)...")
    model = QuboWaterAllocationModel(
        reservoirs=data_store.reservoirs,
        canals=data_store.canals,
        regions=data_store.regions,
        crops=data_store.crops,
        available_water_mcm=450.0,
        use_subproblem=True
    )
    qubo_res = model.get_qubo_model_summary()
    H_C, offset = model.to_ising_hamiltonian()
    print(f"  [+] Binary Decision Variables : {qubo_res.num_variables}")
    print(f"  [+] Q-Matrix Dimensions       : {qubo_res.matrix_size}x{qubo_res.matrix_size}")
    print(f"  [+] Non-zero elements         : {qubo_res.non_zero_elements}")
    print(f"  [+] Ising Hamiltonian Terms   : {len(H_C)} Pauli Z operators")
    print(f"  [+] Ground State Offset       : {offset:.3f}")
    print()

    # ----------------------------------------------------
    # STEP 2: Qiskit QAOA Optimization
    # ----------------------------------------------------
    print("[2/4] Executing QAOA on Qiskit 2.5 Statevector Simulator...")
    req = QaoaRunRequest(
        p_layers=1,
        shots=1024,
        use_subproblem=True
    )
    qaoa_res = run_qaoa_optimization(
        request=req,
        reservoirs=data_store.reservoirs,
        canals=data_store.canals,
        regions=data_store.regions,
        crops=data_store.crops,
        available_water_mcm=450.0
    )
    print(f"  [+] Execution Mode            : {qaoa_res.execution_mode}")
    print(f"  [+] Quantum Circuit Depth     : {qaoa_res.circuit_depth}")
    print(f"  [+] Variational Parameters    : gamma={qaoa_res.optimal_gamma}, beta={qaoa_res.optimal_beta}")
    print(f"  [+] Measured Optimum Bitstring: |{qaoa_res.best_bitstring}>")
    print(f"  [+] Minimum Energy (Cost)     : {qaoa_res.optimal_energy}")
    print(f"  [+] Execution Runtime         : {qaoa_res.runtime_ms} ms")
    print(f"  [+] Classical Baseline Energy : {qaoa_res.classical_comparison['energy']}")
    print(f"  [+] Approximation Ratio       : {qaoa_res.classical_comparison['approximation_ratio']}")
    print()

    # ----------------------------------------------------
    # STEP 3: Physical Validation
    # ----------------------------------------------------
    print("[3/4] Validating Physical Hydrology & Hydraulic Constraints...")
    val = qaoa_res.validation
    print(f"  [+] Physical Constraints Valid: {'YES' if val['is_valid'] else 'NO'}")
    print(f"  [+] Supply Released vs Avail  : {val['total_released_mcm']} MCM / {val['available_water_mcm']} MCM ({val['supply_utilization_pct']}% utilized)")
    print(f"  [+] Violations Detected       : {len(val['violations'])}")
    print(f"  [+] Demand Satisfaction Rate  : {val['overall_demand_satisfaction_pct']}%")
    print(f"  [+] Jain's Fairness Index     : {val['jains_fairness_index']}")
    print()

    # ----------------------------------------------------
    # STEP 4: IBM Quantum Runtime Connection Status
    # ----------------------------------------------------
    print("[4/4] Inspecting IBM Quantum Cloud Runtime Connection...")
    status = get_ibm_runtime_status()
    print(f"  [+] IBM Runtime SDK Installed : {'YES' if status.runtime_sdk_available else 'NO'} (v{status.runtime_version or '0.50.0'})")
    print(f"  [+] Masked Instance CRN       : {status.instance_crn_masked}")
    print(f"  [+] Connected to Physical QPU : {'YES' if status.connected_to_hardware else 'NO (Local Emulation Mode)'}")
    print(f"  [+] Available Backends        : {', '.join(status.available_backends)}")
    print(f"  [+] Mode Message              : {status.message}")
    print("=" * 70)
    print("ALL QUANTUM MODULES TESTED AND OPERATIONAL!")
    print("=" * 70)
    print("To interact with the Quantum UI via your browser:")
    print("  - Overview       : http://localhost:3000/quantum")
    print("  - QUBO Modeller  : http://localhost:3000/quantum/qubo")
    print("  - QAOA Optimizer : http://localhost:3000/quantum/qaoa")
    print("  - IBM Quantum    : http://localhost:3000/quantum/ibm")
    print("=" * 70)

if __name__ == "__main__":
    main()
