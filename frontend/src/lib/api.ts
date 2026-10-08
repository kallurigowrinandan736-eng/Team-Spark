import {
  Reservoir, Canal, Region, Crop,
  OptimizationWeights, QuantumParameters,
  ScenarioDefinition, WhatIfRequest,
  MultiOptimizationComparison, PipelineRunResponse,
  DemandPredictionResponse, InflowForecastResponse, AlertItem, RecommendationItem
} from "./types";
import {
  runOfflinePipeline, runOfflineClassical,
  runOfflineQuantum, runOfflineBaseline
} from "./offlineSolver";
import { DEMO_RESERVOIRS, DEMO_CANALS, DEMO_REGIONS, DEMO_CROPS, DEMO_SCENARIOS } from "../data/demoData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiClient {
  public isOffline: boolean = false;
  private offlineListeners: ((offline: boolean) => void)[] = [];

  public subscribeOfflineStatus(listener: (offline: boolean) => void) {
    this.offlineListeners.push(listener);
    listener(this.isOffline);
  }

  private setOffline(status: boolean) {
    if (this.isOffline !== status) {
      this.isOffline = status;
      this.offlineListeners.forEach(fn => fn(status));
    }
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 2500): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  // --- Pipeline Run ---
  public async runPipeline(
    scenario?: ScenarioDefinition,
    weights?: OptimizationWeights,
    quantumParams?: QuantumParameters
  ): Promise<PipelineRunResponse> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/pipeline/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          weights,
          quantum_params: quantumParams
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setOffline(false);
      return data;
    } catch (err) {
      console.warn("Backend unavailable, executing client-side simulation engine (offline mode)", err);
      this.setOffline(true);
      return runOfflinePipeline(scenario, weights, quantumParams);
    }
  }

  // --- Data Fetching ---
  public async getReservoirs(): Promise<Reservoir[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/data/reservoirs`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setOffline(false);
      return data;
    } catch {
      this.setOffline(true);
      return DEMO_RESERVOIRS;
    }
  }

  public async getCanals(): Promise<Canal[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/data/canals`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setOffline(false);
      return data;
    } catch {
      this.setOffline(true);
      return DEMO_CANALS;
    }
  }

  public async getCrops(): Promise<Crop[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/data/crops`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setOffline(false);
      return data;
    } catch {
      this.setOffline(true);
      return DEMO_CROPS;
    }
  }

  public async getScenarios(): Promise<ScenarioDefinition[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/scenarios/presets`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setOffline(false);
      return data;
    } catch {
      this.setOffline(true);
      return DEMO_SCENARIOS;
    }
  }

  public async getAlerts(): Promise<AlertItem[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/alerts`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setOffline(false);
      return data;
    } catch {
      this.setOffline(true);
      return runOfflinePipeline().alerts;
    }
  }

  public async getRecommendations(): Promise<RecommendationItem[]> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/recommendations`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setOffline(false);
      return data;
    } catch {
      this.setOffline(true);
      return runOfflinePipeline().recommendations;
    }
  }

  public async getDemandPredictions(horizonDays: number = 30): Promise<DemandPredictionResponse> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/predictions/demand?horizon_days=${horizonDays}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setOffline(false);
      return data;
    } catch {
      this.setOffline(true);
      return runOfflinePipeline().demand_predictions;
    }
  }

  public async getInflowForecast(horizonDays: number = 30): Promise<InflowForecastResponse> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/predictions/inflow?horizon_days=${horizonDays}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setOffline(false);
      return data;
    } catch {
      this.setOffline(true);
      return runOfflinePipeline().inflow_forecasts;
    }
  }

  public async runWhatIf(whatIf: WhatIfRequest): Promise<any> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/scenarios/what-if`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(whatIf)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setOffline(false);
      return data;
    } catch {
      this.setOffline(true);
      // Fast client-side what-if heuristic
      const totalAvail = 9762.0 * whatIf.reservoir_storage_factor;
      const totalDem = 1395.0 * whatIf.demand_factor * (1.0 - (whatIf.rainfall_factor - 1.0) * 0.2);
      const sat = Math.min(100.0, (totalAvail / Math.max(1, totalDem)) * 92.0);
      return {
        total_available_mcm: Number(totalAvail.toFixed(1)),
        total_demand_mcm: Number(totalDem.toFixed(1)),
        estimated_satisfaction_pct: Number(sat.toFixed(1)),
        deficit_mcm: Number(Math.max(0, totalDem - totalAvail * 0.88).toFixed(1))
      };
    }
  }
}

export const api = new ApiClient();
