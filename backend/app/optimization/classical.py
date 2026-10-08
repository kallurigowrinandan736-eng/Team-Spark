import time
import logging
import numpy as np
from scipy.optimize import linprog
from typing import List, Dict, Tuple, Optional
from app.schemas import (
    Reservoir, Canal, Region, Crop,
    OptimizationRunResult, OptimizationWeights
)
from app.optimization.formulation import NetworkTopology
from app.optimization.metrics import calculate_metrics

logger = logging.getLogger(__name__)

def solve_classical_lp(
    reservoirs: List[Reservoir],
    canals: List[Canal],
    regions: List[Region],
    crops: List[Crop],
    weights: OptimizationWeights = OptimizationWeights()
) -> OptimizationRunResult:
    start_time = time.perf_counter()
    topo = NetworkTopology(reservoirs, canals, regions, crops)
    routes = topo.routes
    num_routes = len(routes)
    num_crops = len(crops)
    crop_id_to_idx = {c.id: idx for idx, c in enumerate(crops)}

    # Total variables = num_routes (x_{c,k}) + num_crops (s_k)
    num_vars = num_routes + num_crops

    # Cost vector c (scipy linprog minimizes c^T x)
    c_obj = np.zeros(num_vars)
    for i, (canal, crop) in enumerate(routes):
        eff = 1.0 - canal.loss_pct
        priority_wt = crop.priority * 0.3 + 0.7  # 1.0 to 2.2
        
        # Benefit terms (negative since we minimize)
        benefit = weights.satisfaction_weight * priority_wt * eff * 15.0
        eff_bonus = weights.efficiency_weight * (canal.efficiency * 5.0)
        loss_penalty = weights.loss_penalty * (canal.loss_pct * 8.0)
        
        c_obj[i] = -(benefit + eff_bonus - loss_penalty)

    for k, crop in enumerate(crops):
        priority_wt = crop.priority * 0.3 + 0.7
        # Shortage penalty (positive cost)
        c_obj[num_routes + k] = weights.shortage_penalty * priority_wt * 20.0

    # 1. Inequality constraints A_ub * x <= b_ub
    # Canal capacities & Reservoir capacities
    row_list = []
    b_ub_list = []

    # Canal capacity constraints
    for canal in canals:
        row = np.zeros(num_vars)
        for i, (cn, _) in enumerate(routes):
            if cn.id == canal.id:
                row[i] = 1.0
        row_list.append(row)
        b_ub_list.append(canal.capacity_mcm)

    # Reservoir available water constraints
    for res in reservoirs:
        row = np.zeros(num_vars)
        avail = topo.get_reservoir_available_water(res.id)
        for i, (cn, _) in enumerate(routes):
            if cn.source_reservoir_id == res.id:
                row[i] = 1.0
        row_list.append(row)
        b_ub_list.append(avail)

    A_ub = np.array(row_list) if row_list else None
    b_ub = np.array(b_ub_list) if b_ub_list else None

    # 2. Equality constraints A_eq * x == b_eq
    # Delivered + Shortage = Demand per crop
    eq_row_list = []
    b_eq_list = []
    for k, crop in enumerate(crops):
        row = np.zeros(num_vars)
        for i, (cn, cr) in enumerate(routes):
            if cr.id == crop.id:
                row[i] = (1.0 - cn.loss_pct)  # delivered fraction
        row[num_routes + k] = 1.0  # shortage variable
        eq_row_list.append(row)
        b_eq_list.append(crop.total_demand_mcm)

    A_eq = np.array(eq_row_list)
    b_eq = np.array(b_eq_list)

    # Variable bounds (0 <= x_i <= max_route_cap, 0 <= s_k <= demand_k)
    bounds = []
    for canal, crop in routes:
        max_gross = crop.total_demand_mcm / max(0.01, 1.0 - canal.loss_pct)
        bounds.append((0.0, min(canal.capacity_mcm, max_gross)))
    for crop in crops:
        bounds.append((0.0, crop.total_demand_mcm))

    # Solve with HiGHS simplex / interior-point
    res = linprog(
        c=c_obj,
        A_ub=A_ub,
        b_ub=b_ub,
        A_eq=A_eq,
        b_eq=b_eq,
        bounds=bounds,
        method="highs"
    )

    allocations_dict: Dict[Tuple[str, str], float] = {}
    if res.success:
        for i, (canal, crop) in enumerate(routes):
            allocations_dict[(canal.id, crop.id)] = max(0.0, float(res.x[i]))
    else:
        logger.warning(f"HiGHS LP status: {res.message}, relaxing with interior point heuristic")
        # Fallback allocation
        for canal, crop in routes:
            avail = topo.get_reservoir_available_water(canal.source_reservoir_id)
            allocations_dict[(canal.id, crop.id)] = min(crop.total_demand_mcm, canal.capacity_mcm, avail * 0.4)

    (
        allocation_items,
        reservoir_releases,
        reservoir_end_storage,
        canal_utilization,
        crop_satisfaction
    ) = topo.calculate_results_summary(allocations_dict)

    runtime_ms = (time.perf_counter() - start_time) * 1000.0
    obj_val = float(-res.fun) if res.success else 0.0

    metrics = calculate_metrics(
        allocations=allocation_items,
        crops=crops,
        reservoirs=reservoirs,
        canals=canals,
        reservoir_releases=reservoir_releases,
        runtime_ms=runtime_ms,
        objective_val=obj_val,
        is_feasible=res.success
    )

    return OptimizationRunResult(
        method_name="Classical Optimization (LP / HiGHS)",
        allocations=allocation_items,
        metrics=metrics,
        reservoir_releases=reservoir_releases,
        reservoir_end_storage=reservoir_end_storage,
        canal_utilization=canal_utilization,
        crop_satisfaction=crop_satisfaction
    )
