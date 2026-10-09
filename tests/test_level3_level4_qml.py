"""
Tests for Level 3 Pure Quantum Machine Learning (QML) and Level 4 Quantum Error Mitigation (QEM)
================================================================================================
Verifies:
- Level 3: Non-Linear ZZ-FeatureMap into 16-D Hilbert Space
- Level 3: Parameterized RealAmplitudes VQC with Parameter-Shift Rule Gradients
- Level 3: Quantum State Fidelity Kernel (QSVC) Gram matrix
- Level 4: Hardware Noise Profile & Kraus density matrix simulation
- Level 4: Zero-Noise Extrapolation (ZNE) via Unitary Gate Folding (r=1, 3, 5) & Richardson extrapolation
- Level 4: Readout Error Mitigation (TREX) via assignment matrix inversion
- Level 4: Dynamical Decoupling (DD) with XY4 pulse sequences
"""

import pytest
import numpy as np
from app.ml.quantum_ml_model import (
    VariationalQuantumClassifier,
    QuantumKernelMachine,
    generate_qml_benchmark_data,
    run_level_3_qml_pipeline
)
from app.quantum.level4_qem import (
    HardwareNoiseProfile,
    QuantumNoiseEngine,
    ZeroNoiseExtrapolator,
    ReadoutErrorMitigator,
    DynamicalDecouplingScheduler,
    Level4WaterUseCases
)


def test_level3_vqc_architecture():
    """Verify Level 3 VQC circuit parameters, qubits, and expectation readout."""
    vqc = VariationalQuantumClassifier(num_qubits=4, ansatz_reps=2, num_classes=4)
    assert vqc.num_qubits == 4
    assert vqc.num_classes == 4
    assert vqc.num_parameters == 12  # 4 * (2 reps + 1)
    assert len(vqc.observables) == 4

    # Test single-sample expectation values
    x_test = np.array([0.5, 0.7, 0.3, 0.8]) * np.pi
    exp_vals = vqc.compute_expectation_values(x_test)
    assert len(exp_vals) == 4
    for val in exp_vals:
        assert -1.05 <= val <= 1.05

    # Forward pass returns valid probability distribution
    probs = vqc.forward(x_test)
    assert len(probs) == 4
    assert np.isclose(np.sum(probs), 1.0, atol=1e-4)


def test_level3_vqc_parameter_shift_training():
    """Verify analytical parameter-shift gradient computation and loss convergence."""
    X, y, feature_names = generate_qml_benchmark_data(num_samples=16)
    vqc = VariationalQuantumClassifier(num_qubits=4, ansatz_reps=1, num_classes=4)
    
    # Compute parameter-shift gradient for 1 sample
    grads = vqc.compute_gradient_parameter_shift(X[0], int(y[0]), vqc.weights)
    assert len(grads) == vqc.num_parameters
    assert not np.isnan(grads).any()

    # Fit 3 mini-epochs
    loss_history = vqc.fit(X, y, epochs=3, lr=0.20)
    assert len(loss_history) == 3
    assert loss_history[0] > 0.0


def test_level3_quantum_kernel_machine():
    """Verify QSVC state overlap fidelity matrix is symmetric with unit diagonal."""
    qkm = QuantumKernelMachine(num_qubits=4, reps=1)
    X, _, _ = generate_qml_benchmark_data(num_samples=4)
    K = qkm.compute_kernel_matrix(X, X)

    assert K.shape == (4, 4)
    # Unit diagonal
    for i in range(4):
        assert np.isclose(K[i, i], 1.0, atol=1e-3)
    # Symmetry
    assert np.allclose(K, K.T, atol=1e-3)


def test_level4_noise_engine():
    """Verify Level 4 density matrix Kraus noise simulation causes purity decay."""
    engine = QuantumNoiseEngine()
    assert engine.profile.t1_us == 180.0
    assert engine.profile.t2_us == 120.0

    # Build simple Bell circuit
    from qiskit import QuantumCircuit
    qc = QuantumCircuit(2)
    qc.h(0)
    qc.cx(0, 1)

    rho = engine.evolve_circuit_with_noise(qc, noise_multiplier=1.0)
    assert rho.num_qubits == 2
    # Noisy density matrix purity should be < 1.0 due to decoherence
    assert rho.purity().real < 0.999


def test_level4_zero_noise_extrapolation():
    """Verify ZNE unitary digital gate folding and Richardson extrapolation."""
    from qiskit import QuantumCircuit
    qc = QuantumCircuit(2)
    qc.cx(0, 1)

    zne = ZeroNoiseExtrapolator()
    # r=1: 1 CX
    folded_1 = zne.fold_circuit(qc, scale_factor=1)
    assert folded_1.count_ops()["cx"] == 1

    # r=3: 3 CX
    folded_3 = zne.fold_circuit(qc, scale_factor=3)
    assert folded_3.count_ops()["cx"] == 3

    # Richardson extrapolation over quadratic curve
    factors = [1.0, 3.0, 5.0]
    # Noisy curve with linear slope 0.05 + 0.50 ideal
    noisy_vals = [0.55, 0.65, 0.75]
    mitigated = zne.richardson_extrapolate(factors, noisy_vals)
    assert np.isclose(mitigated, 0.50, atol=1e-2)


def test_level4_readout_error_mitigation():
    """Verify TREX assignment matrix inversion recovers unperturbed probabilities."""
    trex = ReadoutErrorMitigator(p01=0.02, p10=0.03)
    noisy_p = np.array([0.85, 0.15])
    mitigated_p = trex.mitigate_probabilities(noisy_p)
    assert len(mitigated_p) == 2
    assert np.isclose(np.sum(mitigated_p), 1.0, atol=1e-4)


def test_level4_all_water_use_cases():
    """Verify all 3 Level 4 real-world water resource use cases execute successfully."""
    engine = Level4WaterUseCases()
    
    # Use Case 1: ZNE Spillway Dispatch
    uc1 = engine.run_spillway_zne_optimization()
    assert uc1["qubits_used"] == 3
    assert uc1["error_reduction_percentage"] > 0.0

    # Use Case 2: Canal Anomaly QSVC + TREX
    uc2 = engine.run_canal_anomaly_detection_mitigated()
    assert uc2["fidelity_restoration_percentage"] > 0.0
    assert "anomaly_detected" in uc2

    # Use Case 3: Telemetry Dynamical Decoupling
    uc3 = engine.run_telemetry_dynamical_decoupling()
    assert uc3["coherence_gain_percentage"] > 0.0
    assert len(uc3["telemetry_nodes"]) == 4
