// AquaQ Global TypeScript Definitions

export interface Reservoir {
  id: string;
  name: string;
  lat: number;
  lng: number;
  max_capacity_mcm: number;
  current_storage_mcm: number;
  min_reserve_mcm: number;
  expected_inflow_mcm: number;
  expected_outflow_mcm: number;
  current_level_m: number;
  max_level_m: number;
  status: "Optimal" | "Normal" | "Warning" | "Critical" | string;
}

export interface Canal {
  id: string;
  name: string;
  source_reservoir_id: string;
  destination_region_id: string;
  capacity_mcm: number;
  current_flow_mcm: number;
  loss_pct: number;
  efficiency: number;
  status: "Normal" | "Warning" | "Overload" | string;
  path?: [number, number][];
}

export interface Region {
  id: string;
  name: string;
  lat: number;
  lng: number;
  priority: number;
  total_irrigated_area_ha: number;
  active_farmers: number;
  soil_type: string;
  groundwater_depth_m: number;
}

export interface Crop {
  id: string;
  crop: string;
  region_id: string;
  area_ha: number;
  growth_stage: "Sowing" | "Vegetative" | "Flowering" | "Maturity" | string;
  base_water_requirement_mm: number;
  total_demand_mcm: number;
  priority: number;
  current_allocation_mcm: number;
  deficit_mcm: number;
  season: "Kharif" | "Rabi" | "Zaid" | "Perennial" | string;
}

export interface OptimizationWeights {
  satisfaction_weight: number;
  efficiency_weight: number;
  fairness_weight: number;
  safety_weight: number;
  shortage_penalty: number;
  loss_penalty: number;
}

export interface QuantumParameters {
  num_iterations: number;
  initial_temperature: number;
  cooling_rate: number;
  num_restarts: number;
  discretization_levels: number;
  transverse_field_strength: number;
}

export interface AllocationItem {
  canal_id: string;
  canal_name: string;
  reservoir_id: string;
  reservoir_name: string;
  region_id: string;
  region_name: string;
  crop_id: string;
  crop_name: string;
  allocated_mcm: number;
  loss_mcm: number;
  delivered_mcm: number;
  demand_mcm: number;
  satisfaction_pct: number;
}

export interface SolverMetrics {
  demand_satisfaction_pct: number;
  water_utilization_pct: number;
  total_allocated_mcm: number;
  total_delivered_mcm: number;
  total_loss_mcm: number;
  total_shortage_mcm: number;
  jains_fairness_index: number;
  min_satisfaction_ratio: number;
  reservoir_safety_index: number;
  constraint_violations_count: number;
  objective_value: number;
  runtime_ms: number;
  optimization_score: number;
  is_feasible: boolean;
  slack_relaxations?: Record<string, number>;
}

export interface ConvergencePoint {
  iteration: number;
  energy: number;
  best_energy: number;
  temperature: number;
  quantum_fluctuation: number;
}

export interface QuantumResultDetails {
  num_qubits: number;
  num_variables: number;
  iterations: number;
  restarts: number;
  best_energy: number;
  feasibility: boolean;
  fallback_used: boolean;
  convergence_curve: ConvergencePoint[];
  qubo_matrix_sample?: number[][];
  variable_labels?: string[];
  qiskit_enabled?: boolean;
  qiskit_version?: string;
  qiskit_repo?: string;
  circuit_depth?: number;
  gate_counts?: Record<string, number>;
  circuit_diagram?: string;
  qaoa_layers?: number;
  basis_state_probabilities?: Record<string, number>;
}


export interface OptimizationRunResult {
  method_name: string;
  allocations: AllocationItem[];
  metrics: SolverMetrics;
  reservoir_releases: Record<string, number>;
  reservoir_end_storage: Record<string, number>;
  canal_utilization: Record<string, number>;
  crop_satisfaction: Record<string, number>;
  quantum_details?: QuantumResultDetails;
}

export interface MultiOptimizationComparison {
  baseline: OptimizationRunResult;
  classical: OptimizationRunResult;
  quantum: OptimizationRunResult;
  verdict: string;
  timestamp: string;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  rainfall_factor: number;
  storage_factor: number;
  inflow_factor: number;
  demand_factor: number;
  canal_capacity_factor: number;
  temperature_delta_c: number;
}

export interface WhatIfRequest {
  available_water_mcm?: number;
  rainfall_factor: number;
  temperature_delta_c: number;
  demand_factor: number;
  reservoir_storage_factor: number;
  canal_efficiency_factor: number;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  severity: "Critical" | "Warning" | "Normal";
  category: "Reservoir" | "Canal" | "Crop" | "Weather" | "Environmental";
  entity_id: string;
  entity_name: string;
  metric: string;
  current_value: number;
  threshold_value: number;
  unit: string;
  message: string;
  acknowledged?: boolean;
}

export interface RecommendationFactor {
  name: string;
  value: string;
  contribution_pct: number;
  direction: "positive" | "negative";
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  action_text: string;
  impact_summary: string;
  confidence_score: number;
  factors: RecommendationFactor[];
  why_explanation: string;
}

export interface PipelineStep {
  step_number: number;
  name: string;
  status: "pending" | "running" | "completed" | "error";
  duration_ms: number;
  summary: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ModelMetrics {
  mae: number;
  rmse: number;
  r2_score: number;
}

export interface DemandPredictionItem {
  crop_id: string;
  crop_name: string;
  region_id: string;
  region_name: string;
  horizon_days: number;
  current_demand_mcm: number;
  predicted_demand_mcm: number;
  confidence_lower_mcm: number;
  confidence_upper_mcm: number;
  key_drivers: string[];
}

export interface DemandPredictionResponse {
  horizon_days: number;
  predictions: DemandPredictionItem[];
  model_metrics: ModelMetrics;
  feature_importance: FeatureImportance[];
  label: string;
}

export interface InflowForecastItem {
  reservoir_id: string;
  reservoir_name: string;
  date_or_month: string;
  p10_inflow_mcm: number;
  p50_inflow_mcm: number;
  p90_inflow_mcm: number;
  historical_avg_mcm: number;
}

export interface InflowForecastResponse {
  horizon_days: number;
  forecasts: InflowForecastItem[];
  model_metrics: ModelMetrics;
  label: string;
}

export interface PipelineRunResponse {
  run_id: string;
  status: string;
  scenario_used: ScenarioDefinition;
  steps: PipelineStep[];
  comparison: MultiOptimizationComparison;
  alerts: AlertItem[];
  recommendations: RecommendationItem[];
  demand_predictions: DemandPredictionResponse;
  inflow_forecasts: InflowForecastResponse;
}

// Stage 4 Machine Learning Types
export interface InflowPredictionRequest {
  reservoir_id: string;
  prediction_period?: string;
  rainfall_anomaly_pct?: number;
  rainfall_factor?: number;
  inflow_factor?: number;
}

export interface InflowPredictionResult {
  reservoir_id: string;
  prediction_period: string;
  predicted_inflow_ml: number;
  predicted_inflow_mcm: number;
  confidence_bounds?: {
    p10_inflow_mcm: number;
    p90_inflow_mcm: number;
    p10_inflow_ml: number;
    p90_inflow_ml: number;
  };
  model_id: string;
  algorithm: string;
  status: string;
  evaluation_metrics?: {
    mcm: { mae: number; rmse: number; r2: number };
    megaliters: { mae: number; rmse: number; r2: number };
  };
  inputs_used?: Record<string, any>;
  limitations?: string;
}

export interface InflowHistoryPoint {
  period: string;
  actual_mcm: number;
  actual_ml: number;
  is_test_period: boolean;
  rainfall_mm?: number;
  predicted_mcm?: number;
  predicted_ml?: number;
}

export interface InflowTestEvalPoint {
  period: string;
  actual_mcm: number;
  actual_ml: number;
  predicted_mcm: number;
  predicted_ml: number;
  error_mcm: number;
}

export interface InflowTimeSeriesResponse {
  reservoir_id: string;
  history: InflowHistoryPoint[];
  test_eval: InflowTestEvalPoint[];
  metadata?: any;
}

// --- Quantum Computing Types (Stage 4) ---

export interface QuantumOverviewData {
  title: string;
  description: string;
  current_scenario: string;
  available_water_mcm: number;
  available_water_ml: number;
  total_crop_demand_mcm: number;
  total_crop_demand_ml: number;
  inflow_prediction_source: string;
  execution_mode: string;
  qiskit_version: string;
  ibm_runtime_ready: boolean;
  ibm_runtime_version?: string;
  workflow_steps: { step: string; desc: string }[];
  selected_scenario?: {
    id?: string;
    name?: string;
    description?: string;
    available_water_mcm?: number;
    total_crop_demand_mcm?: number;
  };
  reservoir_telemetry?: {
    id?: string;
    name?: string;
    current_storage_mcm?: number;
    full_reservoir_level_mcm?: number;
    storage_ratio?: number;
  };
  last_execution?: {
    mode?: string;
    timestamp?: string;
    measured_runtime_ms?: number;
    optimal_value?: number;
    valid?: boolean;
    total_allocated_mcm?: number;
  };
}

export interface QuboVariableItem {
  index: number;
  label: string;
  canal_id: string;
  canal_name: string;
  crop_id: string;
  crop_name: string;
  level_fraction: number;
  allocated_mcm: number;
}

export interface QuboPenaltyWeightItem {
  name: string;
  weight: number;
  unit: string;
  description: string;
}

export interface QuboModelData {
  num_variables: number;
  num_qubits: number;
  discretization_levels: number[];
  variables: QuboVariableItem[];
  objective_terms: Record<string, string>;
  penalties: QuboPenaltyWeightItem[];
  matrix_size: number;
  non_zero_elements: number;
  sparsity_pct: number;
  sample_subproblem: Record<string, any>;
  formula_latex: string;
  explanation: string;
  q_matrix?: number[][];
}

export interface QaoaExecutionRequest {
  p_layers?: number;
  reps?: number;
  optimizer?: string;
  optimizer_name?: string;
  maxiter?: number;
  shots?: number;
  use_subproblem?: boolean;
  scenario_name?: string;
  scenario_id?: string;
}

export interface QaoaExecutionResponse {
  status: string;
  execution_mode: string;
  qiskit_version: string;
  num_qubits: number;
  p_layers: number;
  circuit_depth: number;
  optimal_gamma: number[];
  optimal_beta: number[];
  best_bitstring: string;
  optimal_energy: number;
  runtime_ms: number;
  convergence_history: { iteration: number; energy: number; gamma_norm: number; beta_norm: number }[];
  top_bitstrings: { bitstring: string; count: number; probability: number; is_best: boolean }[];
  allocations: any[];
  validation: {
    is_valid: boolean;
    violations: string[];
    total_released_mcm: number;
    total_released_ml: number;
    available_water_mcm: number;
    supply_utilization_pct: number;
    overall_demand_satisfaction_pct: number;
    jains_fairness_index: number;
    allocations: any[];
  };
  classical_comparison: {
    solver_type: string;
    best_bitstring: string;
    energy: number;
    runtime_ms: number;
    demand_satisfaction_pct: number;
    approximation_ratio: number;
    status: string;
  };
  optimal_cost?: number;
  optimal_bitstring?: string;
  measured_runtime_ms?: number;
  num_evaluations?: number;
  allocation_result?: any;
  classical_baseline?: any;
}

export interface IbmRuntimeStatusData {
  runtime_sdk_available: boolean;
  runtime_version?: string;
  channel: string;
  instance_crn_masked: string;
  has_api_key: boolean;
  connected_to_hardware: boolean;
  available_backends: string[];
  mode_label: string;
  message: string;
  setup_instructions: string[];
}

export interface IbmJobResultData {
  status: string;
  job_id: string;
  backend_name: string;
  execution_mode: string;
  measured_runtime_ms: number;
  circuit_depth: number;
  num_qubits: number;
  best_bitstring: string;
  allocations: any[];
  validation: any;
  message: string;
  shots?: number;
  top_measurement_counts?: Record<string, number>;
  optimal_cost?: number;
  optimal_bitstring?: string;
  reps?: number;
  created_at?: string;
}


