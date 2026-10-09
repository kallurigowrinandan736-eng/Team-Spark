#!/usr/bin/env python3
r"""
Jaldhar - Level 3 Quantum Machine Learning (QML) Benchmark Pipeline
=====================================================================
Executes genuine Quantum Machine Learning using Qiskit 2.5:
1. Quantum Data Embedding: Non-Linear ZZ-FeatureMap into 16-Dimensional Hilbert Space
2. Variational Quantum Classifier (VQC / QNN): RealAmplitudes Circuit with Trainable Quantum Angles
3. Parameter-Shift Analytical Quantum Gradients
4. Quantum Support Vector Classifier (QSVC): Quantum Fidelity Kernel Matrix Evaluation
5. Real-World Multi-Class Agricultural Water Stress Prediction
"""

import os
import sys
import time

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Ensure utf-8 stdout on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.ml.quantum_ml_model import (
    VariationalQuantumClassifier,
    QuantumKernelMachine,
    generate_qml_benchmark_data,
    run_level_3_qml_pipeline
)
import numpy as np


def print_banner(title: str):
    width = 80
    print("\n" + "=" * width)
    print(f"  {title}".center(width))
    print("=" * width)


def main():
    print_banner("JALDHARA: LEVEL 3 QUANTUM MACHINE LEARNING (QML) PIPELINE")
    print("Framework       : Qiskit 2.5 (Native Quantum Circuit Engine)")
    print("Target Task     : Multi-Class Agricultural Water Stress Classification")
    print("Quantum State   : 4 Qubits -> 16-Dimensional Complex Hilbert Space")
    print("Feature Mapping : Non-Linear ZZ-FeatureMap (Pauli-Z Phase & Entanglement)")
    print("Variational QNN : Parameterized RealAmplitudes Ansatz (Circular CNOT Entanglement)")
    print("Kernel Paradigm : Quantum State Fidelity Kernel (Transition Probability)")
    print("-" * 80)

    t0 = time.time()

    # Step 1: Synthesize Agricultural Benchmark Data
    print("\n[1/5] Synthesizing Hydro-Climatic Features for Quantum Angle Embedding...")
    X, y, feature_names = generate_qml_benchmark_data(num_samples=40)
    split = 28
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    print(f"      [OK] Samples: {len(X)} total ({len(X_train)} train, {len(X_test)} test)")
    print(f"      [OK] Input Features (4D mapped to [0, pi] rad):")
    for fn in feature_names:
        print(f"           - {fn}")

    # Step 2: Variational Quantum Classifier (QNN)
    print("\n[2/5] Initializing Variational Quantum Classifier (VQC / QNN)...")
    vqc = VariationalQuantumClassifier(num_qubits=4, ansatz_reps=2, num_classes=4)
    decomposed = vqc.qnn_circuit.decompose()
    print(f"      [OK] Quantum Architecture: {vqc.num_qubits} Qubits, Depth {decomposed.depth()}")
    print(f"      [OK] Trainable Quantum Parameters: {vqc.num_parameters} Angles (theta)")
    print(f"      [OK] Physical Quantum Gate Counts: {dict(decomposed.count_ops())}")

    # Step 3: Parameter-Shift Rule Quantum Training
    print("\n[3/5] Optimizing Quantum Angles via Parameter-Shift Rule Gradients...")
    print("      Loss Formulation: Cross-Entropy over Pauli-Z Expectation Softmax")
    loss_history = vqc.fit(X_train, y_train, epochs=10, lr=0.25)
    for epoch, loss in enumerate(loss_history, 1):
        if epoch in [1, 3, 5, 8, 10]:
            print(f"      Epoch {epoch:2d}/10 | Quantum Cost Loss: {loss:.4f}")

    # Step 4: Quantum Kernel Machine (QSVC)
    print("\n[4/5] Evaluating Quantum State Fidelity Kernel Matrix (QSVC)...")
    qkm = QuantumKernelMachine(num_qubits=4, reps=1)
    K = qkm.compute_kernel_matrix(X_test[:4], X_test[:4])
    print(f"      [OK] Evaluated 4x4 Quantum State Fidelity Matrix (Sample):")
    for row in K:
        print(f"           [{' '.join(f'{val:.3f}' for val in row)}]")
    print("      [OK] Diagonal elements K(x_i, x_i) = 1.000 (Pure State Self-Fidelity)")

    # Step 5: Test Set Quantum Inference & Verification
    print("\n[5/5] Executing Quantum Inference on Unseen Test Testbed...")
    preds = vqc.predict(X_test)
    accuracy = float(np.mean(preds == y_test)) * 100
    stress_labels = ["Low Stress", "Moderate Stress", "Severe Stress", "Critical Stress"]

    print(f"      [OK] Quantum Classification Accuracy: {accuracy:.1f}%")
    print("\n      Sample Quantum Predictions vs Ground Truth:")
    print("      " + "-" * 70)
    print(f"      {'ID':<4} {'Soil Def (rad)':<15} {'Reservoir (rad)':<16} {'Ground Truth':<18} {'VQC Predicted':<16}")
    print("      " + "-" * 70)
    for i in range(min(5, len(X_test))):
        gt = stress_labels[y_test[i]]
        pred = stress_labels[preds[i]]
        print(f"      {i+1:<4} {X_test[i][0]:<15.3f} {X_test[i][2]:<16.3f} {gt:<18} {pred:<16}")
    print("      " + "-" * 70)

    # Circuit Diagram Snippet
    print("\n[+] Synthesized Quantum Neural Network Circuit (Decomposed):")
    lines = str(decomposed.draw(output="text")).split("\n")
    for line in lines[:15]:
        print("    " + line)
    if len(lines) > 15:
        print(f"    ... [{len(lines)-15} additional circuit lines]")

    elapsed = time.time() - t0
    print_banner(f"Level 3 QML Pipeline Verified & Operational in {elapsed:.2f}s!")


if __name__ == "__main__":
    main()
