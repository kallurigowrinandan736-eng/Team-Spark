from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# --- Base Entity Schemas ---

class Reservoir(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    max_capacity_mcm: float
    current_storage_mcm: float
    min_reserve_mcm: float
    expected_inflow_mcm: float
    expected_outflow_mcm: float
    current_level_m: float
    max_level_m: float
    status: str

class Canal(BaseModel):
    id: str
    name: str
    source_reservoir_id: str
    destination_region_id: str
    capacity_mcm: float
    current_flow_mcm: float
    loss_pct: float
    efficiency: float
    status: str
    path: Optional[List[List[float]]] = None

class Region(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    priority: int
    total_irrigated_area_ha: float
    active_farmers: int
    soil_type: str
    groundwater_depth_m: float

class Crop(BaseModel):
    id: str
    crop: str
    region_id: str
    area_ha: float
    growth_stage: str
    base_water_requirement_mm: float
    total_demand_mcm: float
    priority: int
    current_allocation_mcm: float
    deficit_mcm: float
    season: str

class WeatherData(BaseModel):
    month: str
    avg_temperature_c: float
    avg_humidity_pct: float
    evapotranspiration_mm_day: float
    avg_soil_moisture_pct: float

class RainfallData(BaseModel):
    month: str
    region_id: str
    rainfall_mm: float
    anomaly_pct: float

class InflowData(BaseModel):
    month: str
    reservoir_id: str
    inflow_mcm: float
    inflow_anomaly_pct: float

class DemandData(BaseModel):
    month: str
    crop_id: str
    region_id: str
    demand_mcm: float

# --- Optimization Schemas ---

class OptimizationWeights(BaseModel):
    satisfaction_weight: float = Field(1.0, ge=0.0, le=5.0)
    efficiency_weight: float = Field(0.6, ge=0.0, le=5.0)
    fairness_weight: float = Field(0.8, ge=0.0, le=5.0)
    safety_weight: float = Field(0.7, ge=0.0, le=5.0)
    shortage_penalty: float = Field(1.5, ge=0.0, le=5.0)
    loss_penalty: float = Field(0.5, ge=0.0, le=5.0)

class QuantumParameters(BaseModel):
    num_iterations: int = 300
    initial_temperature: float = 10.0
    cooling_rate: float = 0.985
    num_restarts: int = 2
    discretization_levels: int = 5
    transverse_field_strength: float = 2.0

class AllocationItem(BaseModel):
    canal_id: str
    canal_name: str
    reservoir_id: str
    reservoir_name: str
    region_id: str
    region_name: str
    crop_id: str
    crop_name: str
    allocated_mcm: float
    loss_mcm: float
    delivered_mcm: float
    demand_mcm: float
    satisfaction_pct: float

class SolverMetrics(BaseModel):
    demand_satisfaction_pct: float
    water_utilization_pct: float
    total_allocated_mcm: float
    total_delivered_mcm: float
    total_loss_mcm: float
    total_shortage_mcm: float
    jains_fairness_index: float
    min_satisfaction_ratio: float
    reservoir_safety_index: float
    constraint_violations_count: int
    objective_value: float
    runtime_ms: float
    optimization_score: float
    is_feasible: bool = True
    slack_relaxations: Optional[Dict[str, float]] = None

class ConvergencePoint(BaseModel):
    iteration: int
    energy: float
    best_energy: float
    temperature: float
    quantum_fluctuation: float

class QuantumResultDetails(BaseModel):
    num_qubits: int
    num_variables: int
    iterations: int
    restarts: int
    best_energy: float
    feasibility: bool
    fallback_used: bool = False
    convergence_curve: List[ConvergencePoint]
    qubo_matrix_sample: Optional[List[List[float]]] = None
    variable_labels: Optional[List[str]] = None
    qiskit_enabled: bool = True
    qiskit_version: Optional[str] = "2.5.2"
    qiskit_repo: Optional[str] = "https://github.com/Qiskit/qiskit.git"
    circuit_depth: Optional[int] = 27
    gate_counts: Optional[Dict[str, int]] = None
    circuit_diagram: Optional[str] = None
    qaoa_layers: Optional[int] = 1
    basis_state_probabilities: Optional[Dict[str, float]] = None


class OptimizationRunResult(BaseModel):
    method_name: str
    allocations: List[AllocationItem]
    metrics: SolverMetrics
    reservoir_releases: Dict[str, float]
    reservoir_end_storage: Dict[str, float]
    canal_utilization: Dict[str, float]
    crop_satisfaction: Dict[str, float]
    quantum_details: Optional[QuantumResultDetails] = None

class MultiOptimizationComparison(BaseModel):
    baseline: OptimizationRunResult
    classical: OptimizationRunResult
    quantum: OptimizationRunResult
    verdict: str
    timestamp: str

# --- ML Schemas ---

class FeatureImportance(BaseModel):
    feature: str
    importance: float

class ModelMetrics(BaseModel):
    mae: float
    rmse: float
    r2_score: float

class DemandPredictionItem(BaseModel):
    crop_id: str
    crop_name: str
    region_id: str
    region_name: str
    horizon_days: int
    current_demand_mcm: float
    predicted_demand_mcm: float
    confidence_lower_mcm: float
    confidence_upper_mcm: float
    key_drivers: List[str]

class DemandPredictionResponse(BaseModel):
    horizon_days: int
    predictions: List[DemandPredictionItem]
    model_metrics: ModelMetrics
    feature_importance: List[FeatureImportance]
    label: str = "Simulated / Demo Model"

class InflowForecastItem(BaseModel):
    reservoir_id: str
    reservoir_name: str
    date_or_month: str
    p10_inflow_mcm: float
    p50_inflow_mcm: float
    p90_inflow_mcm: float
    historical_avg_mcm: float

class InflowForecastResponse(BaseModel):
    horizon_days: int
    forecasts: List[InflowForecastItem]
    model_metrics: ModelMetrics
    label: str = "Simulated / Demo Model"

# --- Scenario & What-If Schemas ---

class ScenarioDefinition(BaseModel):
    id: str
    name: str
    description: str
    rainfall_factor: float = 1.0
    storage_factor: float = 1.0
    inflow_factor: float = 1.0
    demand_factor: float = 1.0
    canal_capacity_factor: float = 1.0
    temperature_delta_c: float = 0.0

class WhatIfRequest(BaseModel):
    rainfall_factor: float = 1.0
    temperature_delta_c: float = 0.0
    demand_factor: float = 1.0
    reservoir_storage_factor: float = 1.0
    canal_efficiency_factor: float = 1.0

# --- Alerts & Recommendations ---

class AlertItem(BaseModel):
    id: str
    timestamp: str
    severity: str  # "Critical", "Warning", "Normal"
    category: str  # "Reservoir", "Canal", "Crop", "Weather", "Environmental"
    entity_id: str
    entity_name: str
    metric: str
    current_value: float
    threshold_value: float
    unit: str
    message: str
    acknowledged: bool = False

class RecommendationFactor(BaseModel):
    name: str
    value: str
    contribution_pct: float
    direction: str  # "positive", "negative"

class RecommendationItem(BaseModel):
    id: str
    title: str
    category: str
    priority: str  # "High", "Medium", "Low"
    action_text: str
    impact_summary: str
    confidence_score: float
    factors: List[RecommendationFactor]
    why_explanation: str

# --- Pipeline Schemas ---

class PipelineStep(BaseModel):
    step_number: int
    name: str
    status: str  # "pending", "running", "completed", "error"
    duration_ms: float
    summary: str

class PipelineRunResponse(BaseModel):
    run_id: str
    status: str
    scenario_used: ScenarioDefinition
    steps: List[PipelineStep]
    comparison: MultiOptimizationComparison
    alerts: List[AlertItem]
    recommendations: List[RecommendationItem]
    demand_predictions: DemandPredictionResponse
    inflow_forecasts: InflowForecastResponse

# --- Stage 4 Machine Learning Prediction Schemas ---

class InflowPredictionRequest(BaseModel):
    reservoir_id: str = Field("res_1", description="Reservoir ID (res_1, res_2, res_3, res_4)")
    prediction_period: str = Field("2026-07", description="Target period YYYY-MM")
    rainfall_anomaly_pct: float = Field(0.0, ge=-100.0, le=300.0, description="Rainfall anomaly percentage")
    rainfall_factor: float = Field(1.0, ge=0.1, le=5.0, description="Rainfall scale factor")
    inflow_factor: float = Field(1.0, ge=0.1, le=5.0, description="Inflow scale factor")

class InflowPredictionResult(BaseModel):
    reservoir_id: str
    prediction_period: str
    predicted_inflow_ml: float
    predicted_inflow_mcm: float
    confidence_bounds: Optional[Dict[str, float]] = None
    model_id: str
    algorithm: str
    status: str
    evaluation_metrics: Optional[Dict[str, Any]] = None
    inputs_used: Optional[Dict[str, Any]] = None
    limitations: Optional[str] = None

