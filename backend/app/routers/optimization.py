from fastapi import APIRouter, Body
from typing import Optional
from app.data_loader import data_store
from app.schemas import (
    OptimizationWeights, QuantumParameters,
    OptimizationRunResult, MultiOptimizationComparison
)
from app.optimization.baseline import solve_baseline_allocation
from app.optimization.classical import solve_classical_lp
from app.optimization.quantum_inspired import solve_quantum_inspired_optimization
from app.services.pipeline import execute_optimization_pipeline

router = APIRouter(prefix="/optimization", tags=["Optimization Engine"])

@router.post("/baseline", response_model=OptimizationRunResult)
def run_baseline_optimization(weights: OptimizationWeights = Body(default_factory=OptimizationWeights)):
    return solve_baseline_allocation(
        data_store.reservoirs,
        data_store.canals,
        data_store.regions,
        data_store.crops,
        weights
    )

@router.post("/classical", response_model=OptimizationRunResult)
def run_classical_optimization(weights: OptimizationWeights = Body(default_factory=OptimizationWeights)):
    return solve_classical_lp(
        data_store.reservoirs,
        data_store.canals,
        data_store.regions,
        data_store.crops,
        weights
    )

@router.post("/quantum", response_model=OptimizationRunResult)
def run_quantum_optimization(
    weights: OptimizationWeights = Body(default_factory=OptimizationWeights),
    quantum_params: QuantumParameters = Body(default_factory=QuantumParameters)
):
    return solve_quantum_inspired_optimization(
        data_store.reservoirs,
        data_store.canals,
        data_store.regions,
        data_store.crops,
        weights,
        quantum_params
    )

@router.post("/compare", response_model=MultiOptimizationComparison)
def compare_solvers(
    weights: OptimizationWeights = Body(default_factory=OptimizationWeights),
    quantum_params: QuantumParameters = Body(default_factory=QuantumParameters)
):
    pipeline_res = execute_optimization_pipeline(None, weights, quantum_params)
    return pipeline_res.comparison
