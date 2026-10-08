from fastapi import APIRouter, Body
from typing import Optional
from app.schemas import (
    ScenarioDefinition, OptimizationWeights, QuantumParameters, PipelineRunResponse
)
from app.services.pipeline import execute_optimization_pipeline

router = APIRouter(prefix="/pipeline", tags=["Pipeline Execution"])

@router.post("/run", response_model=PipelineRunResponse)
def run_full_pipeline(
    scenario: Optional[ScenarioDefinition] = Body(None),
    weights: Optional[OptimizationWeights] = Body(None),
    quantum_params: Optional[QuantumParameters] = Body(None)
):
    return execute_optimization_pipeline(scenario, weights, quantum_params)
