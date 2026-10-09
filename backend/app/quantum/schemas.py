"""
Jaldhara Quantum Computing Schemas
Stage 4 Production Pipeline: QUBO, QAOA, Validation, and IBM Quantum
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class QuboVariable(BaseModel):
    index: int
    label: str
    canal_id: str
    canal_name: str
    crop_id: str
    crop_name: str
    level_fraction: float
    allocated_mcm: float


class QuboPenaltyWeight(BaseModel):
    name: str
    weight: float
    unit: str
    description: str


class QuboModelResponse(BaseModel):
    num_variables: int
    num_qubits: int
    discretization_levels: List[float]
    variables: List[QuboVariable]
    objective_terms: Dict[str, str]
    penalties: List[QuboPenaltyWeight]
    matrix_size: int
    non_zero_elements: int
    sparsity_pct: float
    sample_subproblem: Dict[str, Any]
    formula_latex: str
    explanation: str
    q_matrix: Optional[List[List[float]]] = None


class QaoaRunRequest(BaseModel):
    p_layers: int = Field(1, ge=1, le=4, description="QAOA depth / repetitions")
    optimizer: str = Field("COBYLA", description="Classical optimizer: COBYLA or SLSQP")
    maxiter: int = Field(30, ge=5, le=100, description="Max classical optimization iterations")
    shots: int = Field(1024, ge=128, le=8192, description="Measurement shots")
    use_subproblem: bool = Field(True, description="True for fast interactive 4-to-6 qubit subsystem")
    scenario_name: Optional[str] = "Normal"


class QaoaRunResponse(BaseModel):
    status: str
    execution_mode: str  # "Local Qiskit Simulator (Statevector / Sampler)"
    qiskit_version: str
    num_qubits: int
    p_layers: int
    circuit_depth: int
    optimal_gamma: List[float]
    optimal_beta: List[float]
    best_bitstring: str
    optimal_energy: float
    runtime_ms: float
    convergence_history: List[Dict[str, Any]]
    top_bitstrings: List[Dict[str, Any]]
    allocations: List[Dict[str, Any]]
    validation: Dict[str, Any]
    classical_comparison: Dict[str, Any]


class IbmRuntimeStatusResponse(BaseModel):
    runtime_sdk_available: bool
    runtime_version: Optional[str]
    channel: str
    instance_crn_masked: str
    has_api_key: bool
    connected_to_hardware: bool
    available_backends: List[str]
    mode_label: str
    message: str
    setup_instructions: List[str]


class IbmJobSubmissionRequest(BaseModel):
    backend_name: Optional[str] = None
    p_layers: int = 1
    shots: int = 1024


class IbmJobSubmissionResponse(BaseModel):
    status: str
    job_id: str
    backend_name: str
    execution_mode: str
    measured_runtime_ms: float
    circuit_depth: int
    num_qubits: int
    best_bitstring: str
    allocations: List[Dict[str, Any]]
    validation: Dict[str, Any]
    message: str


class QuantumOverviewResponse(BaseModel):
    title: str
    description: str
    current_scenario: str
    available_water_mcm: float
    available_water_ml: float
    total_crop_demand_mcm: float
    total_crop_demand_ml: float
    inflow_prediction_source: str
    execution_mode: str
    qiskit_version: str
    ibm_runtime_ready: bool
    workflow_steps: List[Dict[str, str]]


class QmlModelInfoResponse(BaseModel):
    level: str
    paradigm: str
    num_qubits: int
    hilbert_dimension: int
    feature_map: str
    ansatz: str
    gradient_method: str
    classes: List[str]
    circuit_depth: int
    trainable_parameters: int
    gate_counts: Dict[str, int]


class QmlPredictRequest(BaseModel):
    soil_moisture_deficit: float = Field(0.65, ge=0.0, le=1.0, description="Normalized soil moisture deficit [0-1]")
    evapotranspiration_rate: float = Field(0.70, ge=0.0, le=1.0, description="Normalized crop ET rate [0-1]")
    reservoir_storage_ratio: float = Field(0.35, ge=0.0, le=1.0, description="Normalized remaining reservoir ratio [0-1]")
    temperature_stress: float = Field(0.80, ge=0.0, le=1.0, description="Normalized temperature heat stress [0-1]")


class QmlPredictResponse(BaseModel):
    predicted_class: str
    class_index: int
    class_probabilities: Dict[str, float]
    quantum_expectation_values: List[float]
    hilbert_state_dimension: int
    execution_time_ms: float

