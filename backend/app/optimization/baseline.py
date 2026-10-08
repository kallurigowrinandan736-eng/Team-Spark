import time
from typing import List, Dict, Tuple
from app.schemas import (
    Reservoir, Canal, Region, Crop,
    OptimizationRunResult, OptimizationWeights
)
from app.optimization.formulation import NetworkTopology
from app.optimization.metrics import calculate_metrics

def solve_baseline_allocation(
    reservoirs: List[Reservoir],
    canals: List[Canal],
    regions: List[Region],
    crops: List[Crop],
    weights: OptimizationWeights = OptimizationWeights()
) -> OptimizationRunResult:
    start_time = time.perf_counter()
    topo = NetworkTopology(reservoirs, canals, regions, crops)
    
    # 1. Calculate reservoir available water
    reservoir_available = {r.id: topo.get_reservoir_available_water(r.id) for r in reservoirs}
    canal_remaining_cap = {c.id: c.capacity_mcm for c in canals}
    
    allocations_dict: Dict[Tuple[str, str], float] = {}
    
    # Simple proportional allocation
    total_system_demand = sum(cr.total_demand_mcm for cr in crops)
    total_system_avail = sum(reservoir_available.values())
    global_scale = min(1.0, total_system_avail / max(1.0, total_system_demand)) * 0.88  # Heuristic conservative manual factor
    
    for canal, crop in topo.routes:
        # Gross water required to deliver crop demand via canal
        loss_multiplier = 1.0 / max(0.01, (1.0 - canal.loss_pct))
        desired_gross = crop.total_demand_mcm * global_scale * loss_multiplier * (crop.current_allocation_mcm / max(1.0, crop.total_demand_mcm))
        
        # Clip by canal remaining capacity and reservoir available
        res_id = canal.source_reservoir_id
        alloc = min(desired_gross, canal_remaining_cap[canal.id], reservoir_available[res_id])
        alloc = max(0.0, alloc)
        
        allocations_dict[(canal.id, crop.id)] = alloc
        canal_remaining_cap[canal.id] -= alloc
        reservoir_available[res_id] -= alloc

    (
        allocation_items,
        reservoir_releases,
        reservoir_end_storage,
        canal_utilization,
        crop_satisfaction
    ) = topo.calculate_results_summary(allocations_dict)

    runtime_ms = (time.perf_counter() - start_time) * 1000.0

    metrics = calculate_metrics(
        allocations=allocation_items,
        crops=crops,
        reservoirs=reservoirs,
        canals=canals,
        reservoir_releases=reservoir_releases,
        runtime_ms=runtime_ms,
        objective_val=sum(a.delivered_mcm for a in allocation_items),
        is_feasible=True
    )

    return OptimizationRunResult(
        method_name="Baseline (Manual / Proportional)",
        allocations=allocation_items,
        metrics=metrics,
        reservoir_releases=reservoir_releases,
        reservoir_end_storage=reservoir_end_storage,
        canal_utilization=canal_utilization,
        crop_satisfaction=crop_satisfaction
    )
