import { create } from "zustand";
import {
  Reservoir, Canal, Region, Crop,
  OptimizationWeights, QuantumParameters,
  ScenarioDefinition, MultiOptimizationComparison,
  AlertItem, RecommendationItem, DemandPredictionResponse,
  InflowForecastResponse, PipelineRunResponse, PipelineStep
} from "../lib/types";
import { DEMO_RESERVOIRS, DEMO_CANALS, DEMO_REGIONS, DEMO_CROPS, DEMO_SCENARIOS } from "../data/demoData";
import { api } from "../lib/api";

interface WaterStoreState {
  // Active Entities
  reservoirs: Reservoir[];
  canals: Canal[];
  regions: Region[];
  crops: Crop[];
  scenarios: ScenarioDefinition[];
  selectedScenario: ScenarioDefinition;
  
  // Solvers Configuration
  weights: OptimizationWeights;
  quantumParams: QuantumParameters;

  // Pipeline Execution State
  isPipelineRunning: boolean;
  pipelineModalOpen: boolean;
  activeSteps: PipelineStep[];
  pipelineResult: PipelineRunResponse | null;
  comparison: MultiOptimizationComparison | null;

  // Alerts & Recommendations
  alerts: AlertItem[];
  recommendations: RecommendationItem[];
  demandPredictions: DemandPredictionResponse | null;
  inflowForecasts: InflowForecastResponse | null;

  // App Metadata & Mode
  isOfflineMode: boolean;
  activeTab: string;

  // Actions
  setScenario: (scenario: ScenarioDefinition) => void;
  setWeights: (weights: Partial<OptimizationWeights>) => void;
  setQuantumParams: (params: Partial<QuantumParameters>) => void;
  setOfflineMode: (offline: boolean) => void;
  setPipelineModalOpen: (open: boolean) => void;
  updateReservoir: (id: string, updates: Partial<Reservoir>) => void;
  updateCanal: (id: string, updates: Partial<Canal>) => void;
  updateCrop: (id: string, updates: Partial<Crop>) => void;
  acknowledgeAlert: (alertId: string) => void;
  addCustomScenario: (scenario: ScenarioDefinition) => void;
  
  // Pipeline Trigger
  runOptimizationPipeline: () => Promise<void>;
  initializeStore: () => Promise<void>;
}

export const useWaterStore = create<WaterStoreState>((set, get) => ({
  reservoirs: DEMO_RESERVOIRS,
  canals: DEMO_CANALS,
  regions: DEMO_REGIONS,
  crops: DEMO_CROPS,
  scenarios: DEMO_SCENARIOS,
  selectedScenario: DEMO_SCENARIOS[0],

  weights: {
    satisfaction_weight: 1.0,
    efficiency_weight: 0.6,
    fairness_weight: 0.8,
    safety_weight: 0.7,
    shortage_penalty: 1.5,
    loss_penalty: 0.5
  },

  quantumParams: {
    num_iterations: 300,
    initial_temperature: 10.0,
    cooling_rate: 0.985,
    num_restarts: 2,
    discretization_levels: 5,
    transverse_field_strength: 2.0
  },

  isPipelineRunning: false,
  pipelineModalOpen: false,
  activeSteps: [],
  pipelineResult: null,
  comparison: null,

  alerts: [],
  recommendations: [],
  demandPredictions: null,
  inflowForecasts: null,

  isOfflineMode: false,
  activeTab: "overview",

  setScenario: (scenario) => {
    set({ selectedScenario: scenario });
    get().runOptimizationPipeline();
  },

  setWeights: (newWeights) => {
    set((state) => ({ weights: { ...state.weights, ...newWeights } }));
  },

  setQuantumParams: (newParams) => {
    set((state) => ({ quantumParams: { ...state.quantumParams, ...newParams } }));
  },

  setOfflineMode: (isOffline) => set({ isOfflineMode: isOffline }),
  setPipelineModalOpen: (open) => set({ pipelineModalOpen: open }),

  updateReservoir: (id, updates) => {
    set((state) => ({
      reservoirs: state.reservoirs.map((r) => (r.id === id ? { ...r, ...updates } : r))
    }));
  },

  updateCanal: (id, updates) => {
    set((state) => ({
      canals: state.canals.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }));
  },

  updateCrop: (id, updates) => {
    set((state) => ({
      crops: state.crops.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }));
  },

  acknowledgeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    }));
  },

  addCustomScenario: (scenario) => {
    set((state) => ({
      scenarios: [...state.scenarios, scenario]
    }));
  },

  runOptimizationPipeline: async () => {
    const { selectedScenario, weights, quantumParams } = get();
    set({ isPipelineRunning: true, pipelineModalOpen: true });

    // Initial animated stepper state
    const initialSteps: PipelineStep[] = [
      { step_number: 1, name: "Load Current Scenario", status: "running", duration_ms: 0, summary: "Applying environmental factors..." },
      { step_number: 2, name: "Calculate Crop Demand (ML)", status: "pending", duration_ms: 0, summary: "GradientBoosting regressor..." },
      { step_number: 3, name: "Forecast Reservoir Inflow (ML)", status: "pending", duration_ms: 0, summary: "RandomForest P10/P50/P90 quantiles..." },
      { step_number: 4, name: "Run Classical Optimization (LP)", status: "pending", duration_ms: 0, summary: "PuLP Simplex LP formulation..." },
      { step_number: 5, name: "Run Quantum-Inspired Optimization (QUBO)", status: "pending", duration_ms: 0, summary: "Simulated Annealing on Hamiltonian..." },
      { step_number: 6, name: "Multi-Method Comparison & Scoring", status: "pending", duration_ms: 0, summary: "Evaluating Jain's fairness index..." },
      { step_number: 7, name: "Generate Explainable AI Insights", status: "pending", duration_ms: 0, summary: "Feature attributions..." },
      { step_number: 8, name: "Synchronize Dashboard State", status: "pending", duration_ms: 0, summary: "Refreshing live charts..." }
    ];
    set({ activeSteps: initialSteps });

    try {
      const response = await api.runPipeline(selectedScenario, weights, quantumParams);
      
      // Update store with full results
      set({
        pipelineResult: response,
        comparison: response.comparison,
        alerts: response.alerts,
        recommendations: response.recommendations,
        demandPredictions: response.demand_predictions,
        inflowForecasts: response.inflow_forecasts,
        activeSteps: response.steps,
        isPipelineRunning: false
      });
    } catch (err) {
      console.error("Pipeline run error:", err);
      set({ isPipelineRunning: false });
    }
  },

  initializeStore: async () => {
    // Hook up offline subscription
    api.subscribeOfflineStatus((offline) => {
      set({ isOfflineMode: offline });
    });

    // Run first baseline pipeline
    await get().runOptimizationPipeline();
  }
}));
