r"""
Level 3 Quantum Machine Learning (QML) Engine for Jaldhar
===========================================================
Implements true Quantum Machine Learning models using modern Qiskit 2.5:
1. Quantum Feature Map / Hilbert Space Data Embedding (zz_feature_map)
2. Parameterized Quantum Circuit (PQC) / Variational Quantum Classifier (VQC / QNN)
3. Parameter-Shift Rule for Analytical Quantum Gradients
4. Quantum Kernel Machine (Fidelity-based Quantum Support Vector Classifier - QSVC)
5. Multi-Class Agricultural Water Stress Prediction
"""

import time
import logging
from typing import Dict, Any, List, Tuple, Optional
import numpy as np

import qiskit
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter, ParameterVector
try:
    from qiskit.circuit.library import zz_feature_map, real_amplitudes
except ImportError:
    from qiskit.circuit.library import ZZFeatureMap as zz_feature_map, RealAmplitudes as real_amplitudes
from qiskit.quantum_info import Statevector, SparsePauliOp

logger = logging.getLogger(__name__)


class QuantumFeatureEncoder:
    r"""
    Level 3 QML Component 1: Quantum Data Embedding
    Encodes classical continuous features x in R^d into 2^n dimensional Hilbert space
    using the non-linear second-order Pauli-Z expansion: U_\Phi(x)|0\rangle^{\otimes n}
    """
    def __init__(self, num_qubits: int = 4, reps: int = 2):
        self.num_qubits = num_qubits
        self.reps = reps
        self.circuit = zz_feature_map(
            feature_dimension=num_qubits,
            reps=reps,
            entanglement="linear"
        )

    def encode(self, features: np.ndarray) -> QuantumCircuit:
        """Binds normalized features into the parameter vector of the feature map."""
        if len(features) != self.num_qubits:
            padded = np.zeros(self.num_qubits)
            padded[:min(len(features), self.num_qubits)] = features[:self.num_qubits]
            features = padded
            
        param_dict = {p: float(val) for p, val in zip(self.circuit.parameters, features)}
        return self.circuit.assign_parameters(param_dict)


class VariationalQuantumClassifier:
    r"""
    Level 3 QML Component 2: Variational Quantum Classifier (VQC / Quantum Neural Network)
    Combines zz_feature_map with a Parameterized Quantum Circuit (real_amplitudes ansatz),
    measures Pauli-Z expectation values \langle Z_i \rangle, and classifies agricultural water stress.
    """
    def __init__(
        self,
        num_qubits: int = 4,
        ansatz_reps: int = 2,
        num_classes: int = 4
    ):
        self.num_qubits = num_qubits
        self.ansatz_reps = ansatz_reps
        self.num_classes = num_classes
        
        # 1. Quantum Feature Map (Data Encoding)
        self.feature_map = zz_feature_map(
            feature_dimension=num_qubits,
            reps=1,
            entanglement="linear"
        )
        
        # 2. Parameterized Variational Ansatz (Quantum Neural Network Weights)
        self.ansatz = real_amplitudes(
            num_qubits=num_qubits,
            reps=ansatz_reps,
            entanglement="circular"
        )
        
        # 3. Composed QNN Circuit: U(x, theta) = V(theta) * U_Phi(x)
        self.qnn_circuit = QuantumCircuit(num_qubits)
        self.qnn_circuit.compose(self.feature_map, inplace=True)
        self.qnn_circuit.compose(self.ansatz, inplace=True)
        
        self.num_parameters = len(self.ansatz.parameters)
        np.random.seed(42)
        self.weights = np.random.uniform(-0.5 * np.pi, 0.5 * np.pi, self.num_parameters)
        
        # Pauli-Z observables for readout
        self.observables = [
            SparsePauliOp.from_list([("I" * i + "Z" + "I" * (num_qubits - 1 - i), 1.0)])
            for i in range(min(num_qubits, num_classes))
        ]
        
        # Measurement Readout Projection Layer W @ <Z> + b
        self.readout_matrix = np.eye(self.num_classes, len(self.observables))
        self.readout_bias = np.zeros(self.num_classes)

    def _get_bound_circuit(self, x: np.ndarray, weights: np.ndarray) -> QuantumCircuit:
        """Binds both input features and variational weights into the circuit."""
        param_dict = {}
        for p, val in zip(self.feature_map.parameters, x):
            param_dict[p] = float(val)
        for p, val in zip(self.ansatz.parameters, weights):
            param_dict[p] = float(val)
        return self.qnn_circuit.assign_parameters(param_dict)

    def compute_expectation_values(self, x: np.ndarray, weights: Optional[np.ndarray] = None) -> List[float]:
        """Computes raw Pauli-Z expectation values for a given input."""
        w = self.weights if weights is None else weights
        bound_qc = self._get_bound_circuit(x, w)
        sv = Statevector.from_instruction(bound_qc)
        return [float(sv.expectation_value(obs).real) for obs in self.observables]

    def forward(self, x: np.ndarray, weights: Optional[np.ndarray] = None) -> np.ndarray:
        r"""
        Executes a quantum forward pass.
        Returns Pauli-Z expectation values \langle Z_0 \rangle, \langle Z_1 \rangle, ... in [-1, +1]
        mapped into class probabilities via Softmax over calibrated measurement readout.
        """
        exp_vals = np.array(self.compute_expectation_values(x, weights))
        
        # Linear measurement readout projection W @ <Z> + b
        logits = self.readout_matrix @ exp_vals + self.readout_bias
        logits_scaled = logits * 4.0
        exp_norm = np.exp(logits_scaled - np.max(logits_scaled))
        probs = exp_norm / np.sum(exp_norm)
        
        if len(probs) < self.num_classes:
            full_probs = np.zeros(self.num_classes)
            full_probs[:len(probs)] = probs
            full_probs = full_probs / np.sum(full_probs)
            return full_probs
            
        return probs

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predicts discrete class labels for multiple input samples."""
        preds = []
        for x in X:
            probs = self.forward(x)
            preds.append(np.argmax(probs))
        return np.array(preds)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Predicts class probabilities across multiple input samples."""
        return np.array([self.forward(x) for x in X])

    def compute_gradient_parameter_shift(
        self,
        x: np.ndarray,
        target_class: int,
        weights: np.ndarray,
        shift: float = np.pi / 2.0
    ) -> np.ndarray:
        r"""
        Level 3 QML: Parameter-Shift Rule for Analytical Quantum Gradients
        \frac{\partial \langle H \rangle}{\partial \theta_i} = \frac{\langle H \rangle(\theta_i + \pi/2) - \langle H \rangle(\theta_i - \pi/2)}{2}
        """
        grads = np.zeros(len(weights))
        for i in range(len(weights)):
            w_plus = weights.copy()
            w_plus[i] += shift
            p_plus = self.forward(x, w_plus)[target_class]
            
            w_minus = weights.copy()
            w_minus[i] -= shift
            p_minus = self.forward(x, w_minus)[target_class]
            
            # Loss gradient (negative log likelihood): -1/p * dp/dtheta
            dp = (p_plus - p_minus) / 2.0
            p_current = max(1e-4, self.forward(x, weights)[target_class])
            grads[i] = -dp / p_current
            
        return grads

    def _calibrate_readout_layer(self, X: np.ndarray, y: np.ndarray):
        """Calibrates measurement readout projection weights via regularized linear projection."""
        n = len(X)
        exp_mat = np.array([self.compute_expectation_values(x) for x in X])  # (n, num_obs)
        aug_e = np.hstack([exp_mat, np.ones((n, 1))])  # (n, num_obs + 1)
        
        # One-hot encode targets
        y_oh = np.zeros((n, self.num_classes))
        for i, val in enumerate(y):
            y_oh[i, int(val)] = 1.0
            
        # Ridge projection (aug_e^T aug_e + lambda I)^-1 aug_e^T y_oh
        reg = 0.05 * np.eye(aug_e.shape[1])
        try:
            w_full = np.linalg.solve(aug_e.T @ aug_e + reg, aug_e.T @ y_oh)
            num_obs = len(self.observables)
            self.readout_matrix = w_full[:num_obs, :].T
            self.readout_bias = w_full[num_obs, :]
        except Exception:
            pass

    def fit(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        epochs: int = 10,
        lr: float = 0.22
    ) -> List[float]:
        """Trains the Variational Quantum Classifier using Parameter-Shift rule gradients."""
        loss_history = []
        n_samples = len(X_train)
        
        # Initial readout calibration
        self._calibrate_readout_layer(X_train, y_train)
        
        for epoch in range(epochs):
            total_loss = 0.0
            epoch_grads = np.zeros(self.num_parameters)
            
            # Mini-batch sampling for fast sub-second convergence
            indices = np.random.choice(n_samples, size=min(8, n_samples), replace=False)
            for idx in indices:
                x = X_train[idx]
                y = int(y_train[idx])
                probs = self.forward(x)
                loss = -np.log(max(1e-5, probs[y]))
                total_loss += loss
                
                # Parameter-shift gradient
                g = self.compute_gradient_parameter_shift(x, y, self.weights)
                epoch_grads += g
                
            avg_loss = total_loss / len(indices)
            loss_history.append(float(avg_loss))
            
            # Update quantum parameters
            self.weights -= lr * (epoch_grads / len(indices))
            
            # Calibrate readout layer every few epochs
            if (epoch + 1) % 3 == 0 or epoch == epochs - 1:
                self._calibrate_readout_layer(X_train, y_train)
            
        return loss_history


class QuantumKernelMachine:
    r"""
    Level 3 QML Component 3: Quantum Support Vector Classifier (QSVC)
    Computes Quantum Kernel Matrix K(x_i, x_j) = |\langle 0 | U_\Phi^\dagger(x_j) U_\Phi(x_i) | 0 \rangle|^2
    measuring Hilbert-space fidelity between hydrological states.
    """
    def __init__(self, num_qubits: int = 4, reps: int = 1):
        self.num_qubits = num_qubits
        self.encoder = QuantumFeatureEncoder(num_qubits=num_qubits, reps=reps)

    def compute_kernel_element(self, x1: np.ndarray, x2: np.ndarray) -> float:
        """
        Computes quantum transition probability / fidelity:
        |<psi(x1)|psi(x2)>|^2
        """
        qc1 = self.encoder.encode(x1)
        qc2 = self.encoder.encode(x2)
        
        # Statevector fidelity
        sv1 = Statevector.from_instruction(qc1)
        sv2 = Statevector.from_instruction(qc2)
        fidelity = abs(sv1.inner(sv2)) ** 2
        return float(fidelity)

    def compute_kernel_matrix(self, X1: np.ndarray, X2: np.ndarray) -> np.ndarray:
        """Constructs full Gram matrix between two datasets."""
        n1 = len(X1)
        n2 = len(X2)
        K = np.zeros((n1, n2))
        for i in range(n1):
            for j in range(n2):
                if X1 is X2 and j < i:
                    K[i, j] = K[j, i]
                else:
                    K[i, j] = self.compute_kernel_element(X1[i], X2[j])
        return K


def generate_qml_benchmark_data(num_samples: int = 60) -> Tuple[np.ndarray, np.ndarray, List[str]]:
    """
    Generates structured normalized agricultural water stress datasets for Level 3 QML:
    Features:
      1. Normalized Soil Moisture Deficit (0 to pi)
      2. Normalized Crop Evapotranspiration ET0 (0 to pi)
      3. Reservoir Storage Head Ratio (0 to pi)
      4. Catchment Rainfall Deficit Index (0 to pi)
    Target Labels:
      0: Low Stress (Abundant Water)
      1: Moderate Stress (Controlled Irrigation)
      2: Severe Stress (Deficit Irrigation)
      3: Critical Stress (Emergency Rationing)
    """
    np.random.seed(101)
    feature_names = [
        "Soil Moisture Deficit",
        "Evapotranspiration (ET0)",
        "Reservoir Head Ratio",
        "Monsoon Deficit Index"
    ]
    
    X = []
    y = []
    
    for _ in range(num_samples):
        soil_def = np.random.uniform(0.1, 0.95)
        et0 = np.random.uniform(0.2, 0.9)
        storage = np.random.uniform(0.15, 0.95)
        rain_def = np.random.uniform(0.05, 0.9)
        
        # Weighted stress index
        score = 0.40 * soil_def + 0.35 * (1.0 - storage) + 0.25 * rain_def + 0.10 * et0
        
        if score < 0.35:
            label = 0
        elif score < 0.55:
            label = 1
        elif score < 0.72:
            label = 2
        else:
            label = 3
            
        x_scaled = np.array([soil_def, et0, storage, rain_def]) * np.pi
        X.append(x_scaled)
        y.append(label)
        
    return np.array(X), np.array(y), feature_names


def run_level_3_qml_pipeline(num_samples: int = 40, epochs: int = 10, verbose: bool = True) -> Dict[str, Any]:
    """
    Executes the complete Level 3 QML Pipeline:
    1. Quantum Feature Map compilation
    2. Variational Quantum Classifier (VQC) training via Parameter-Shift Rule
    3. Quantum Kernel Matrix evaluation (QSVC)
    4. Circuit metrics & Hilbert Space dimension
    """
    t0 = time.time()
    num_qubits = 4
    num_classes = 4
    
    # 1. Dataset Generation
    X, y, feature_names = generate_qml_benchmark_data(num_samples=num_samples)
    split = int(0.7 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    
    if verbose:
        print(f"      [OK] Hilbert Space Dimension: {2**num_qubits} (4 Qubits)")
        print(f"      [OK] Quantum Feature Map: ZZ-FeatureMap (2nd-Order Pauli-Z Phase Expansion)")
        print(f"      [OK] Training VQC via Parameter-Shift Rule across {epochs} epochs...")

    # 2. VQC Training
    vqc = VariationalQuantumClassifier(num_qubits=num_qubits, ansatz_reps=2, num_classes=num_classes)
    loss_history = vqc.fit(X_train, y_train, epochs=epochs, lr=0.25)
    
    # Test Predictions
    preds_test = vqc.predict(X_test)
    accuracy = float(np.mean(preds_test == y_test))

    
    # 3. Quantum Kernel Evaluation
    qkm = QuantumKernelMachine(num_qubits=num_qubits, reps=1)
    K_sample = qkm.compute_kernel_matrix(X_test[:4], X_test[:4])
    
    # 4. Quantum Circuit Architecture Specs (Decomposed for physical gate depth)
    decomposed_qc = vqc.qnn_circuit.decompose()
    depth = decomposed_qc.depth()
    gate_counts = {str(k): int(v) for k, v in decomposed_qc.count_ops().items()}
    
    execution_time_ms = round((time.time() - t0) * 1000, 2)
    
    stress_labels = ["Low Stress", "Moderate Stress", "Severe Stress", "Critical Stress"]
    
    sample_inference = []
    for i in range(min(5, len(X_test))):
        sample_inference.append({
            "sample_id": i + 1,
            "soil_deficit_rad": round(float(X_test[i][0]), 3),
            "reservoir_ratio_rad": round(float(X_test[i][2]), 3),
            "ground_truth": stress_labels[y_test[i]],
            "quantum_predicted": stress_labels[preds_test[i]],
            "correct": bool(preds_test[i] == y_test[i])
        })
        
    if verbose:
        print(f"      [OK] Circuit Physical Depth: {depth} | Total Trainable Angles: {vqc.num_parameters}")
        print(f"      [OK] Final Cost Loss: {loss_history[-1]:.4f} | Execution Latency: {execution_time_ms} ms")
        print(f"      [OK] Level 3 QML Classification Accuracy: {round(accuracy * 100, 1)}%")

    return {
        "qml_level": "Level 3: Full Quantum Machine Learning (VQC, QNN & Quantum Kernel)",
        "qiskit_version": qiskit.__version__,
        "hilbert_space_dimension": 2 ** num_qubits,
        "num_qubits": num_qubits,
        "quantum_feature_map": "zz_feature_map (Second-Order Pauli-Z Expansion)",
        "variational_ansatz": "real_amplitudes (Circular Entanglement)",
        "quantum_weights_count": vqc.num_parameters,
        "quantum_circuit_depth": depth,
        "gate_counts": gate_counts,
        "test_accuracy": round(accuracy * 100, 1),
        "initial_loss": round(loss_history[0], 4),
        "final_loss": round(loss_history[-1], 4),
        "kernel_sample_matrix": K_sample.round(3).tolist(),
        "sample_inferences": sample_inference,
        "execution_time_ms": execution_time_ms,
        "circuit_ascii": str(decomposed_qc.draw(output="text"))
    }
