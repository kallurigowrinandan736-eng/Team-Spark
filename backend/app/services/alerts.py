from datetime import datetime
from typing import List
from app.config import settings
from app.schemas import AlertItem, Reservoir, Canal, Crop, RainfallData

def generate_alerts(
    reservoirs: List[Reservoir],
    canals: List[Canal],
    crops: List[Crop],
    rainfall_data: List[RainfallData] = None
) -> List[AlertItem]:
    alerts: List[AlertItem] = []
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    alert_idx = 1

    # 1. Reservoir Alerts
    for r in reservoirs:
        storage_pct = (r.current_storage_mcm / max(1.0, r.max_capacity_mcm)) * 100.0
        if storage_pct <= settings.RESERVOIR_CRITICAL_LEVEL_PCT:
            alerts.append(AlertItem(
                id=f"alt_{alert_idx}",
                timestamp=now_str,
                severity="Critical",
                category="Reservoir",
                entity_id=r.id,
                entity_name=r.name,
                metric="Storage Capacity",
                current_value=round(storage_pct, 1),
                threshold_value=settings.RESERVOIR_CRITICAL_LEVEL_PCT,
                unit="%",
                message=f"Critical water level at {r.name} ({storage_pct:.1f}% capacity). Minimum reserve at severe risk."
            ))
            alert_idx += 1
        elif storage_pct <= settings.RESERVOIR_WARNING_LEVEL_PCT:
            alerts.append(AlertItem(
                id=f"alt_{alert_idx}",
                timestamp=now_str,
                severity="Warning",
                category="Reservoir",
                entity_id=r.id,
                entity_name=r.name,
                metric="Storage Capacity",
                current_value=round(storage_pct, 1),
                threshold_value=settings.RESERVOIR_WARNING_LEVEL_PCT,
                unit="%",
                message=f"Low storage warning at {r.name} ({storage_pct:.1f}% capacity). Implement conservation schedules."
            ))
            alert_idx += 1

    # 2. Canal Overload and Loss Alerts
    for c in canals:
        utilization = (c.current_flow_mcm / max(1.0, c.capacity_mcm)) * 100.0
        if utilization >= settings.CANAL_OVERLOAD_UTILIZATION_PCT:
            alerts.append(AlertItem(
                id=f"alt_{alert_idx}",
                timestamp=now_str,
                severity="Warning",
                category="Canal",
                entity_id=c.id,
                entity_name=c.name,
                metric="Canal Hydraulic Load",
                current_value=round(utilization, 1),
                threshold_value=settings.CANAL_OVERLOAD_UTILIZATION_PCT,
                unit="%",
                message=f"{c.name} operating near maximum design capacity ({utilization:.1f}%). Flow throttling recommended."
            ))
            alert_idx += 1

        if (c.loss_pct * 100.0) >= settings.CANAL_EXCESSIVE_LOSS_PCT:
            alerts.append(AlertItem(
                id=f"alt_{alert_idx}",
                timestamp=now_str,
                severity="Warning",
                category="Canal",
                entity_id=c.id,
                entity_name=c.name,
                metric="Conveyance Seepage Loss",
                current_value=round(c.loss_pct * 100.0, 1),
                threshold_value=settings.CANAL_EXCESSIVE_LOSS_PCT,
                unit="%",
                message=f"High conveyance seepage detected on {c.name} ({c.loss_pct*100:.1f}% loss). Canal lining audit required."
            ))
            alert_idx += 1

    # 3. Crop Deficit Alerts
    for cr in crops:
        deficit_pct = (cr.deficit_mcm / max(0.1, cr.total_demand_mcm)) * 100.0
        if deficit_pct >= settings.CROP_DEFICIT_CRITICAL_PCT and cr.priority >= 4:
            alerts.append(AlertItem(
                id=f"alt_{alert_idx}",
                timestamp=now_str,
                severity="Critical",
                category="Crop",
                entity_id=cr.id,
                entity_name=f"{cr.crop} ({cr.region_id})",
                metric="Water Deficit",
                current_value=round(deficit_pct, 1),
                threshold_value=settings.CROP_DEFICIT_CRITICAL_PCT,
                unit="%",
                message=f"Severe moisture stress on high-priority {cr.crop} in {cr.region_id} ({deficit_pct:.1f}% deficit) during {cr.growth_stage} phase."
            ))
            alert_idx += 1

    # 4. Environmental & Weather Anomaly Alerts
    if rainfall_data:
        recent_rain = [r for r in rainfall_data if r.anomaly_pct <= settings.DROUGHT_RAINFALL_DEFICIT_PCT]
        for rf in recent_rain[:2]:
            alerts.append(AlertItem(
                id=f"alt_{alert_idx}",
                timestamp=now_str,
                severity="Warning",
                category="Weather",
                entity_id=rf.region_id,
                entity_name=f"Region {rf.region_id}",
                metric="Rainfall Anomaly",
                current_value=round(rf.anomaly_pct, 1),
                threshold_value=settings.DROUGHT_RAINFALL_DEFICIT_PCT,
                unit="%",
                message=f"Precipitation deficit of {rf.anomaly_pct:.1f}% recorded in {rf.region_id}. Intensifying supplemental canal releases."
            ))
            alert_idx += 1

    # Ensure at least a normal status alert if empty
    if not alerts:
        alerts.append(AlertItem(
            id=f"alt_{alert_idx}",
            timestamp=now_str,
            severity="Normal",
            category="Environmental",
            entity_id="sys_net",
            entity_name="Krishna River Basin",
            metric="System Status",
            current_value=100.0,
            threshold_value=100.0,
            unit="%",
            message="All reservoir storages, canal hydraulic heads, and crop allocations are within nominal operating boundaries."
        ))

    return alerts
