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
