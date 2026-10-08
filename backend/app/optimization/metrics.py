import numpy as np
from typing import List, Dict, Any, Tuple
from app.schemas import AllocationItem, SolverMetrics, Crop, Reservoir, Canal

def calculate_metrics(
    allocations: List[AllocationItem],
    crops: List[Crop],
    reservoirs: List[Reservoir],
    canals: List[Canal],
    reservoir_releases: Dict[str, float],
    runtime_ms: float,
    objective_val: float = 0.0,
    is_feasible: bool = True,
    slack_relaxations: Dict[str, float] = None
) -> SolverMetrics:
    total_allocated = sum(a.allocated_mcm for a in allocations)
    total_delivered = sum(a.delivered_mcm for a in allocations)
    total_loss = sum(a.loss_mcm for a in allocations)
    
    total_demand = sum(c.total_demand_mcm for c in crops)
    total_shortage = max(0.0, total_demand - total_delivered)
    
    # Demand satisfaction per crop
    crop_delivered: Dict[str, float] = {}
    for a in allocations:
        crop_delivered[a.crop_id] = crop_delivered.get(a.crop_id, 0.0) + a.delivered_mcm

    satisfaction_ratios = []
    for c in crops:
        deliv = crop_delivered.get(c.id, 0.0)
        ratio = min(1.0, deliv / max(0.1, c.total_demand_mcm))
        satisfaction_ratios.append(ratio)

    avg_satisfaction_pct = (sum(satisfaction_ratios) / len(satisfaction_ratios)) * 100 if satisfaction_ratios else 0.0
    min_satisfaction_ratio = min(satisfaction_ratios) if satisfaction_ratios else 0.0

    # Jain's Fairness Index = (sum(x_i))^2 / (n * sum(x_i^2))
    n = len(satisfaction_ratios)
    sum_r = sum(satisfaction_ratios)
    sum_r_sq = sum(r ** 2 for r in satisfaction_ratios)
    jains_fairness = (sum_r ** 2) / (n * sum_r_sq) if sum_r_sq > 0 else 1.0
    jains_fairness = max(0.0, min(1.0, jains_fairness))

    # Water utilization % = delivered / total_available
    total_available = sum(max(0.0, r.current_storage_mcm - r.min_reserve_mcm + r.expected_inflow_mcm) for r in reservoirs)
    water_utilization_pct = min(100.0, (total_delivered / max(1.0, total_available)) * 100)

    # Reservoir safety index: average margin above minimum reserve across all reservoirs
    safety_margins = []
    for r in reservoirs:
        release = reservoir_releases.get(r.id, 0.0)
        end_storage = r.current_storage_mcm + r.expected_inflow_mcm - release
        margin = (end_storage - r.min_reserve_mcm) / max(1.0, r.max_capacity_mcm)
        safety_margins.append(max(0.0, margin))
    reservoir_safety_index = (sum(safety_margins) / len(safety_margins)) if safety_margins else 0.5
    reservoir_safety_index = min(1.0, max(0.0, reservoir_safety_index))

    # Constraint violations check
    violations = 0
    # 1. Canal capacity
    canal_flows: Dict[str, float] = {}
    for a in allocations:
        canal_flows[a.canal_id] = canal_flows.get(a.canal_id, 0.0) + a.allocated_mcm
    for cn in canals:
        if canal_flows.get(cn.id, 0.0) > cn.capacity_mcm + 0.1:
            violations += 1

    # 2. Reservoir availability
    for r in reservoirs:
        avail = r.current_storage_mcm - r.min_reserve_mcm + r.expected_inflow_mcm
        if reservoir_releases.get(r.id, 0.0) > avail + 0.1:
            violations += 1

    # 3. Crop over-allocation
    for c in crops:
        if crop_delivered.get(c.id, 0.0) > c.total_demand_mcm + 0.1:
            violations += 1

    # Composite Optimization Score (0 - 100)
    # 40% satisfaction + 25% fairness + 20% safety + 15% loss-efficiency - penalty for violations
    loss_efficiency = 1.0 - (total_loss / max(1.0, total_allocated)) if total_allocated > 0 else 1.0
    score = (
        (avg_satisfaction_pct * 0.40) +
        (jains_fairness * 100 * 0.25) +
        (reservoir_safety_index * 100 * 0.20) +
        (loss_efficiency * 100 * 0.15) -
        (violations * 10.0)
    )
    score = max(5.0, min(100.0, score))

    return SolverMetrics(
        demand_satisfaction_pct=round(avg_satisfaction_pct, 2),
        water_utilization_pct=round(water_utilization_pct, 2),
        total_allocated_mcm=round(total_allocated, 2),
        total_delivered_mcm=round(total_delivered, 2),
        total_loss_mcm=round(total_loss, 2),
        total_shortage_mcm=round(total_shortage, 2),
        jains_fairness_index=round(jains_fairness, 3),
        min_satisfaction_ratio=round(min_satisfaction_ratio, 3),
        reservoir_safety_index=round(reservoir_safety_index, 3),
        constraint_violations_count=violations,
        objective_value=round(objective_val, 2),
        runtime_ms=round(runtime_ms, 2),
        optimization_score=round(score, 1),
        is_feasible=is_feasible and (violations == 0),
        slack_relaxations=slack_relaxations or {}
    )
