import pytest
from app.data_loader import data_store
from app.schemas import OptimizationWeights, QuantumParameters, ScenarioDefinition
from app.optimization.baseline import solve_baseline_allocation
from app.optimization.classical import solve_classical_lp
from app.optimization.quantum_inspired import solve_quantum_inspired_optimization
from app.ml.demand_model import demand_predictor
from app.ml.inflow_model import inflow_forecaster
from app.services.pipeline import execute_optimization_pipeline

def test_data_loader_sanity():
    assert len(data_store.reservoirs) == 4
    assert len(data_store.canals) >= 6
    assert len(data_store.crops) >= 7
    assert len(data_store.regions) == 5

def test_ml_demand_predictor():
    preds = demand_predictor.predict_crops(data_store.crops, horizon_days=30)
    assert len(preds.predictions) == len(data_store.crops)
    assert preds.model_metrics.r2_score is not None
    assert len(preds.feature_importance) > 0

def test_ml_inflow_forecaster():
    forecasts = inflow_forecaster.forecast_reservoirs(data_store.reservoirs, horizon_days=30)
    assert len(forecasts.forecasts) == len(data_store.reservoirs)
    for f in forecasts.forecasts:
        assert f.p10_inflow_mcm <= f.p50_inflow_mcm <= f.p90_inflow_mcm

def test_solvers_feasibility_and_execution():
    weights = OptimizationWeights()
    
    baseline = solve_baseline_allocation(data_store.reservoirs, data_store.canals, data_store.regions, data_store.crops, weights)
    assert baseline.metrics.total_allocated_mcm > 0
    assert baseline.metrics.demand_satisfaction_pct > 0
    
    classical = solve_classical_lp(data_store.reservoirs, data_store.canals, data_store.regions, data_store.crops, weights)
    assert classical.metrics.is_feasible
    assert classical.metrics.total_allocated_mcm > 0
    assert classical.metrics.demand_satisfaction_pct >= baseline.metrics.demand_satisfaction_pct - 1.0
    
    quantum = solve_quantum_inspired_optimization(
        data_store.reservoirs, data_store.canals, data_store.regions, data_store.crops,
        weights, QuantumParameters(num_iterations=100, num_restarts=2)
    )
    assert quantum.quantum_details is not None
    assert quantum.quantum_details.num_qubits > 0
    assert len(quantum.quantum_details.convergence_curve) > 0

def test_pipeline_execution():
    pipe_res = execute_optimization_pipeline()
    assert pipe_res.status == "success"
    assert len(pipe_res.steps) == 8
    assert len(pipe_res.alerts) > 0
    assert len(pipe_res.recommendations) > 0
    assert pipe_res.comparison.verdict is not None
