from typing import List, Dict, Any, Tuple
from app.schemas import Reservoir, Canal, Region, Crop, AllocationItem

class NetworkTopology:
    def __init__(
        self,
        reservoirs: List[Reservoir],
        canals: List[Canal],
        regions: List[Region],
        crops: List[Crop]
    ):
        self.reservoirs = {r.id: r for r in reservoirs}
        self.canals = {c.id: c for c in canals}
        self.regions = {reg.id: reg for reg in regions}
        self.crops = {cr.id: cr for cr in crops}
        
        # Build valid routing pairs (canal, crop) where canal.destination_region_id == crop.region_id
        self.routes: List[Tuple[Canal, Crop]] = []
        for c in canals:
            for cr in crops:
                if c.destination_region_id == cr.region_id:
                    self.routes.append((c, cr))

    def get_reservoir_available_water(self, reservoir_id: str) -> float:
        r = self.reservoirs.get(reservoir_id)
        if not r:
            return 0.0
        # Available for release = current storage - min_reserve + expected inflow
        return max(0.0, r.current_storage_mcm - r.min_reserve_mcm + r.expected_inflow_mcm)

    def calculate_results_summary(
        self,
        allocations_dict: Dict[Tuple[str, str], float]
    ) -> Tuple[List[AllocationItem], Dict[str, float], Dict[str, float], Dict[str, float], Dict[str, float]]:
        """
        Takes {(canal_id, crop_id): allocated_mcm} and computes full AllocationItems,
        releases, end storages, canal utilizations, and crop satisfactions.
        """
        allocation_items: List[AllocationItem] = []
        reservoir_releases: Dict[str, float] = {r_id: 0.0 for r_id in self.reservoirs}
        canal_flows: Dict[str, float] = {c_id: 0.0 for c_id in self.canals}
        crop_delivered: Dict[str, float] = {cr_id: 0.0 for cr_id in self.crops}

        for (canal_id, crop_id), allocated in allocations_dict.items():
            if allocated <= 0.001:
                continue
            canal = self.canals[canal_id]
            crop = self.crops[crop_id]
            reservoir = self.reservoirs[canal.source_reservoir_id]
            region = self.regions[crop.region_id]
            
            loss = allocated * canal.loss_pct
            delivered = allocated - loss
            
            reservoir_releases[reservoir.id] += allocated
            canal_flows[canal.id] += allocated
            crop_delivered[crop.id] += delivered
            
            sat_pct = min(100.0, (delivered / max(0.1, crop.total_demand_mcm)) * 100.0)
            
            allocation_items.append(AllocationItem(
                canal_id=canal.id,
                canal_name=canal.name,
                reservoir_id=reservoir.id,
                reservoir_name=reservoir.name,
                region_id=region.id,
                region_name=region.name,
                crop_id=crop.id,
                crop_name=crop.crop,
                allocated_mcm=round(allocated, 2),
                loss_mcm=round(loss, 2),
                delivered_mcm=round(delivered, 2),
                demand_mcm=round(crop.total_demand_mcm, 2),
                satisfaction_pct=round(sat_pct, 1)
            ))

        # End storage calculation
        reservoir_end_storage: Dict[str, float] = {}
        for r_id, r in self.reservoirs.items():
            rel = reservoir_releases[r_id]
            end_s = r.current_storage_mcm + r.expected_inflow_mcm - rel
            reservoir_end_storage[r_id] = round(max(0.0, end_s), 2)

        # Canal utilization %
        canal_utilization: Dict[str, float] = {}
        for c_id, c in self.canals.items():
            flow = canal_flows[c_id]
            util = (flow / max(1.0, c.capacity_mcm)) * 100.0
            canal_utilization[c_id] = round(min(100.0, util), 1)

        # Crop satisfaction %
        crop_satisfaction: Dict[str, float] = {}
        for cr_id, cr in self.crops.items():
            deliv = crop_delivered[cr_id]
            sat = (deliv / max(0.1, cr.total_demand_mcm)) * 100.0
            crop_satisfaction[cr_id] = round(min(100.0, sat), 1)

        return (
            allocation_items,
            reservoir_releases,
            reservoir_end_storage,
            canal_utilization,
            crop_satisfaction
        )
