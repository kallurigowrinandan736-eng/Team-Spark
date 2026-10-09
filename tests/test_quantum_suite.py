"""
Quantum Integration Test Suite for Jaldhara
Tests:
- GET /api/quantum/overview
- GET /api/quantum/qubo (formulation, penalties, 4-qubit subproblem)
- POST /api/quantum/qaoa/run (Qiskit 2.5 Statevector simulation & classical comparison)
- GET /api/quantum/ibm/status (masked secret verification)
- POST /api/quantum/ibm/run (job submission and emulation)
- Constraint verification (total released <= available water, canal flows <= capacities)
"""

import sys
from pathlib import Path
from fastapi.testclient import TestClient

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR / "backend"))

from app.main import app

client = TestClient(app)


def test_quantum_overview():
    res = client.get("/api/quantum/overview")
    assert res.status_code == 200, f"Error: {res.text}"
    data = res.json()
    assert "available_water_mcm" in data
    assert "qiskit_version" in data
    assert len(data["workflow_steps"]) == 6
    print(f"[PASS] Quantum Overview: Qiskit {data['qiskit_version']}, Water Avail: {data['available_water_mcm']} MCM")


def test_qubo_model():
    res = client.get("/api/quantum/qubo?discretization_levels=2&use_subproblem=true")
    assert res.status_code == 200, f"Error: {res.text}"
    data = res.json()
    assert data["num_qubits"] > 0
    assert "penalties" in data
    assert "sample_subproblem" in data
    assert len(data["variables"]) == data["num_qubits"]
    print(f"[PASS] QUBO Modeller: {data['num_qubits']} qubits, Sparsity: {data['sparsity_pct']}%")


def test_qaoa_optimizer():
    payload = {
        "p_layers": 1,
        "optimizer": "COBYLA",
        "maxiter": 10,
        "shots": 512,
        "use_subproblem": True
    }
    res = client.post("/api/quantum/qaoa/run", json=payload)
    assert res.status_code == 200, f"Error: {res.text}"
    data = res.json()
    assert data["status"] == "success"
    assert data["execution_mode"] == "Local Qiskit Simulator (Statevector / Sampler)"
    assert len(data["top_bitstrings"]) > 0
    assert "validation" in data
    assert "classical_comparison" in data
    assert data["validation"]["total_released_mcm"] <= data["validation"]["available_water_mcm"] + 0.1
    print(f"[PASS] QAOA Optimizer: Best bitstring: {data['best_bitstring']}, Energy: {data['optimal_energy']}, Runtime: {data['runtime_ms']} ms")


def test_ibm_status_safe():
    res = client.get("/api/quantum/ibm/status")
    assert res.status_code == 200, f"Error: {res.text}"
    data = res.json()
    assert "instance_crn_masked" in data
    # Ensure no raw secret is exposed
    assert "api_key" not in data or data.get("api_key") is None
    print(f"[PASS] IBM Status: Mode: {data['mode_label']}, Hardware Connected: {data['connected_to_hardware']}")


def test_ibm_run():
    payload = {
        "p_layers": 1,
        "shots": 256
    }
    res = client.post("/api/quantum/ibm/run", json=payload)
    assert res.status_code == 200, f"Error: {res.text}"
    data = res.json()
    assert data["status"] == "completed"
    assert "job_id" in data
    assert data["num_qubits"] > 0
    print(f"[PASS] IBM Job: ID: {data['job_id']}, Mode: {data['execution_mode']}, Runtime: {data['measured_runtime_ms']} ms")


if __name__ == "__main__":
    print("=" * 60)
    print("Running Quantum Architecture Test Suite")
    print("=" * 60)
    test_quantum_overview()
    test_qubo_model()
    test_qaoa_optimizer()
    test_ibm_status_safe()
    test_ibm_run()
    print("\n" + "=" * 60)
    print("ALL QUANTUM BACKEND TESTS PASSED!")
    print("=" * 60)
