from fastapi import APIRouter, Body, HTTPException
from typing import List, Dict, Any
from app.data_loader import data_store
from app.schemas import (
    ScenarioDefinition, WhatIfRequest,
    OptimizationWeights, QuantumParameters, PipelineRunResponse
)
from app.services.scenarios import PRESET_SCENARIOS, apply_scenario
from app.services.pipeline import execute_optimization_pipeline

router = APIRouter(prefix="/scenarios", tags=["Scenario Simulator"])

@router.get("/presets", response_model=List[ScenarioDefinition])
def get_preset_scenarios():
    return PRESET_SCENARIOS

@router.post("/run", response_model=PipelineRunResponse)
def run_scenario_optimization(
    scenario: ScenarioDefinition = Body(...),
    weights: OptimizationWeights = Body(default_factory=OptimizationWeights),
    quantum_params: QuantumParameters = Body(default_factory=QuantumParameters)
):
    return execute_optimization_pipeline(scenario, weights, quantum_params)

@router.post("/what-if")
def calculate_what_if_analysis(what_if: WhatIfRequest = Body(...)):
    # Fast lightweight heuristic simulation for instant slider feedback
    scenario = ScenarioDefinition(
        id="what_if_custom",
        name="What-If Dynamic Simulation",
        description="Live parameter adjustment",
        rainfall_factor=what_if.rainfall_factor,
        storage_factor=what_if.reservoir_storage_factor,
        inflow_factor=what_if.rainfall_factor * 1.1,
        demand_factor=what_if.demand_factor,
        canal_capacity_factor=what_if.canal_efficiency_factor,
        temperature_delta_c=what_if.temperature_delta_c
    )
    res_mod, can_mod, reg_mod, crp_mod = apply_scenario(
        scenario,
        data_store.reservoirs,
        data_store.canals,
        data_store.regions,
        data_store.crops
    )
    
    total_avail = sum(r.current_storage_mcm - r.min_reserve_mcm + r.expected_inflow_mcm for r in res_mod)
    total_dem = sum(c.total_demand_mcm for c in crp_mod)
    sat_est = min(100.0, (total_avail / max(1.0, total_dem)) * 92.0)
    
    return {
        "scenario": scenario,
        "total_available_mcm": round(total_avail, 1),
        "total_demand_mcm": round(total_dem, 1),
        "estimated_satisfaction_pct": round(sat_est, 1),
        "deficit_mcm": round(max(0.0, total_dem - total_avail * 0.88), 1),
        "reservoirs": [{"name": r.name, "storage_mcm": r.current_storage_mcm} for r in res_mod],
        "crops": [{"crop": c.crop, "region": c.region_id, "demand_mcm": c.total_demand_mcm} for c in crp_mod]
    }
