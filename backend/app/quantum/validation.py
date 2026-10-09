"""
Jaldhara Quantum Allocation Validation & Constraint Verification Module
Converts binary bitstrings into physical water allocations, validates against
hard physical limits (reservoir supply, canal capacity), and calculates agronomic metrics.
"""

from typing import List, Dict, Any, Tuple
import numpy as np

from app.schemas import Reservoir, Canal, Region, Crop
from app.quantum.schemas import QuboVariable


def decode_and_validate_bitstring(
    bitstring: str,
    variables: List[QuboVariable],
    reservoirs: List[Reservoir],
    canals: List[Canal],
    crops: List[Crop],
    available_water_mcm: float
) -> Dict[str, Any]:
    """
    Decodes a binary bitstring into physical water allocations,
    performs constraint checking against reservoir supply and canal limits,
    and returns verified allocations and metrics.
    """
    N = len(variables)
    # Parse bitstring (leftmost bit is variable 0)
    bits = [int(b) for b in bitstring.strip().replace(" ", "")]
    if len(bits) < N:
        bits = bits + [0] * (N - len(bits))
    bits = bits[:N]

    canal_map = {c.id: c for c in canals}
    crop_map = {cr.id: cr for cr in crops}

    # Group variables by routing pair (canal_id, crop_id)
    routes: Dict[Tuple[str, str], List[Tuple[QuboVariable, int]]] = {}
    for i, var in enumerate(variables):
        key = (var.canal_id, var.crop_id)
        if key not in routes:
            routes[key] = []
        routes[key].append((var, bits[i]))

    allocations: List[Dict[str, Any]] = []
    total_water_released_mcm = 0.0
    canal_flows: Dict[str, float] = {c.id: 0.0 for c in canals}
    crop_deliveries: Dict[str, float] = {cr.id: 0.0 for cr in crops}
    violations: List[str] = []

    for (canal_id, crop_id), var_list in routes.items():
        canal = canal_map.get(canal_id)
        crop = crop_map.get(crop_id)
        if not canal or not crop:
            continue

        # Check one-hot selection
        active_vars = [var for var, b in var_list if b == 1]
        if len(active_vars) == 1:
            chosen = active_vars[0]
            allocated = chosen.allocated_mcm
        elif len(active_vars) > 1:
            violations.append(f"Multiple levels active for {canal.name} -> {crop.crop}")
            # Soft fallback: pick highest selected level
            chosen = max(active_vars, key=lambda v: v.level_fraction)
            allocated = chosen.allocated_mcm
        else:
            # 0 levels selected: default 0 allocation
            allocated = 0.0

        # Loss calculation
        loss = allocated * canal.loss_pct
        delivered = allocated - loss

        total_water_released_mcm += allocated
        canal_flows[canal_id] += allocated
        crop_deliveries[crop_id] += delivered

        allocations.append({
            "canal_id": canal_id,
            "canal_name": canal.name,
            "crop_id": crop_id,
            "crop_name": crop.crop,
            "allocated_mcm": round(allocated, 2),
            "allocated_ml": round(allocated * 1000.0, 1),
            "loss_mcm": round(loss, 2),
            "delivered_mcm": round(delivered, 2),
            "satisfaction_pct": round(min(100.0, (delivered / max(0.1, crop.total_demand_mcm)) * 100.0), 1)
        })

    # Supply constraint check
    supply_exceeded = total_water_released_mcm > (available_water_mcm + 0.1)
    if supply_exceeded:
        excess = total_water_released_mcm - available_water_mcm
        violations.append(f"Total release ({total_water_released_mcm:.1f} MCM) exceeds available water ({available_water_mcm:.1f} MCM) by {excess:.1f} MCM")

    # Canal capacity check
    for c_id, flow in canal_flows.items():
        cn = canal_map.get(c_id)
        if cn and flow > (cn.capacity_mcm + 0.1):
            violations.append(f"Canal '{cn.name}' capacity exceeded: flow {flow:.1f} MCM > max {cn.capacity_mcm:.1f} MCM")

    # Crop satisfaction and fairness
    satisfactions = [
        min(1.0, crop_deliveries[cr.id] / max(0.1, cr.total_demand_mcm))
        for cr in crops
    ]
    mean_sat = float(np.mean(satisfactions)) if satisfactions else 0.0
    sum_sat = float(np.sum(satisfactions))
    sum_sq = float(np.sum([s ** 2 for s in satisfactions]))
    jains_fairness = (sum_sat ** 2) / (len(satisfactions) * sum_sq) if sum_sq > 0 else 0.0

    is_physically_valid = len(violations) == 0

    return {
        "is_valid": is_physically_valid,
        "violations": violations,
        "total_released_mcm": round(total_water_released_mcm, 2),
        "total_released_ml": round(total_water_released_mcm * 1000.0, 1),
        "available_water_mcm": round(available_water_mcm, 2),
        "supply_utilization_pct": round(min(100.0, (total_water_released_mcm / max(0.1, available_water_mcm)) * 100.0), 1),
        "overall_demand_satisfaction_pct": round(mean_sat * 100.0, 1),
        "jains_fairness_index": round(float(jains_fairness), 3),
        "allocations": allocations
    }
