from typing import List, Dict, Tuple
from app.schemas import (
    ScenarioDefinition, Reservoir, Canal, Region, Crop, RainfallData
)

PRESET_SCENARIOS = [
    ScenarioDefinition(
        id="scenario_a",
        name="Scenario A: Normal Monsoon & Standard Allocation",
        description="Baseline seasonal conditions with typical rainfall, nominal reservoir storage, and steady crop water demand.",
        rainfall_factor=1.0,
        storage_factor=1.0,
        inflow_factor=1.0,
        demand_factor=1.0,
        canal_capacity_factor=1.0,
        temperature_delta_c=0.0
    ),
    ScenarioDefinition(
        id="scenario_b",
        name="Scenario B: Severe Drought & High Evapotranspiration",
        description="Critical 60% rainfall deficit, depleted reservoir live storage, high ambient temperatures (+3.5°C), and elevated crop stress.",
        rainfall_factor=0.40,
        storage_factor=0.55,
        inflow_factor=0.35,
        demand_factor=1.35,
        canal_capacity_factor=1.0,
        temperature_delta_c=3.5
    ),
    ScenarioDefinition(
        id="scenario_c",
        name="Scenario C: Heavy Monsoon & Catchment Inflow Surge",
        description="Surplus precipitation (+70%), near-capacity reservoir levels, abundant river discharge, and reduced irrigation demand.",
        rainfall_factor=1.70,
        storage_factor=1.15,
        inflow_factor=2.20,
        demand_factor=0.65,
        canal_capacity_factor=1.0,
        temperature_delta_c=-1.5
    ),
    ScenarioDefinition(
        id="scenario_d",
        name="Scenario D: Intensified Kharif Crop Demand",
        description="Expanded agricultural command area and simultaneous vegetative/flowering stages resulting in +45% crop water demand.",
        rainfall_factor=0.90,
        storage_factor=0.90,
        inflow_factor=0.85,
        demand_factor=1.45,
        canal_capacity_factor=1.0,
        temperature_delta_c=1.0
    ),
    ScenarioDefinition(
        id="scenario_e",
        name="Scenario E: Upstream Reservoir Depletion",
        description="Upstream catchment shortfall causing 55% reduction in Nagarjuna Sagar and Srisailam live storages.",
        rainfall_factor=0.75,
        storage_factor=0.45,
        inflow_factor=0.50,
        demand_factor=1.10,
        canal_capacity_factor=1.0,
        temperature_delta_c=1.2
    ),
    ScenarioDefinition(
        id="scenario_f",
        name="Scenario F: Canal Infrastructure Bottleneck",
        description="Maintenance closures and siltation reducing main and branch canal conveying capacities by 45%.",
        rainfall_factor=1.0,
        storage_factor=1.0,
        inflow_factor=1.0,
        demand_factor=1.0,
        canal_capacity_factor=0.55,
        temperature_delta_c=0.0
    )
]

def apply_scenario(
    scenario: ScenarioDefinition,
    reservoirs: List[Reservoir],
    canals: List[Canal],
    regions: List[Region],
    crops: List[Crop]
) -> Tuple[List[Reservoir], List[Canal], List[Region], List[Crop]]:
    # Deep copy with scenario factors applied
    res_mod = []
    for r in reservoirs:
        adj_storage = min(r.max_capacity_mcm, r.current_storage_mcm * scenario.storage_factor)
        adj_inflow = r.expected_inflow_mcm * scenario.inflow_factor
        adj_level = r.min_reserve_mcm + (adj_storage / max(1.0, r.max_capacity_mcm)) * (r.max_level_m - 15.0)
        status = "Critical" if adj_storage < r.min_reserve_mcm * 1.2 else ("Optimal" if adj_storage > r.max_capacity_mcm * 0.7 else "Normal")
        
        res_mod.append(Reservoir(
            id=r.id,
            name=r.name,
            lat=r.lat,
            lng=r.lng,
            max_capacity_mcm=r.max_capacity_mcm,
            current_storage_mcm=round(adj_storage, 1),
            min_reserve_mcm=r.min_reserve_mcm,
            expected_inflow_mcm=round(adj_inflow, 1),
            expected_outflow_mcm=round(r.expected_outflow_mcm * scenario.storage_factor, 1),
            current_level_m=round(adj_level, 2),
            max_level_m=r.max_level_m,
            status=status
        ))

    can_mod = []
    for c in canals:
        adj_cap = c.capacity_mcm * scenario.canal_capacity_factor
        adj_flow = min(adj_cap, c.current_flow_mcm * scenario.canal_capacity_factor)
        can_mod.append(Canal(
            id=c.id,
            name=c.name,
            source_reservoir_id=c.source_reservoir_id,
            destination_region_id=c.destination_region_id,
            capacity_mcm=round(adj_cap, 1),
            current_flow_mcm=round(adj_flow, 1),
            loss_pct=c.loss_pct,
            efficiency=c.efficiency,
            status="Warning" if scenario.canal_capacity_factor < 0.8 else c.status,
            path=c.path
        ))

    crp_mod = []
    for cr in crops:
        adj_demand = cr.total_demand_mcm * scenario.demand_factor * (1.0 - (scenario.rainfall_factor - 1.0) * 0.25)
        adj_demand = max(5.0, adj_demand)
        adj_deficit = max(0.0, adj_demand - cr.current_allocation_mcm)
        crp_mod.append(Crop(
            id=cr.id,
            crop=cr.crop,
            region_id=cr.region_id,
            area_ha=cr.area_ha,
            growth_stage=cr.growth_stage,
            base_water_requirement_mm=cr.base_water_requirement_mm,
            total_demand_mcm=round(adj_demand, 1),
            priority=cr.priority,
            current_allocation_mcm=cr.current_allocation_mcm,
            deficit_mcm=round(adj_deficit, 1),
            season=cr.season
        ))

    return res_mod, can_mod, regions, crp_mod
