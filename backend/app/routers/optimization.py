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

@router.get("/qiskit/circuit")
def get_qiskit_circuit(
    p_layers: int = 1,
    gamma: float = 0.45,
    beta: float = 0.65
):
    from app.optimization.qiskit_engine import generate_qiskit_qaoa_analysis
    return generate_qiskit_qaoa_analysis(
        num_routes=4,
        discretization_levels=2,
        p_layers=p_layers,
        gamma=gamma,
        beta=beta
    )

@router.get("/ibm-runtime/status")
def ibm_runtime_status(api_key: Optional[str] = None, instance_crn: Optional[str] = None):
    from app.optimization.ibm_runtime_service import get_ibm_runtime_status
    return get_ibm_runtime_status(api_key=api_key, instance_crn=instance_crn)

@router.post("/ibm-runtime/execute")
def ibm_runtime_execute(
    scenario_name: str = "Normal",
    available_water_ml: float = 8000.0,
    demand_ml: float = 7000.0,
    api_key: Optional[str] = None,
    instance_crn: Optional[str] = None,
    p_layers: int = 2
):
    from app.optimization.ibm_runtime_service import run_quantum_ml_optimization
    return run_quantum_ml_optimization(
        scenario_name=scenario_name,
        available_water_ml=available_water_ml,
        demand_ml=demand_ml,
        api_key=api_key,
        instance_crn=instance_crn,
        p_layers=p_layers
    )

