from fastapi import APIRouter
from typing import List
from app.data_loader import data_store
from app.schemas import AlertItem
from app.services.alerts import generate_alerts

router = APIRouter(prefix="/alerts", tags=["Smart Alerts"])

# In-memory acknowledged store
acknowledged_alerts: set[str] = set()

@router.get("", response_model=List[AlertItem])
def get_system_alerts():
    raw_alerts = generate_alerts(data_store.reservoirs, data_store.canals, data_store.crops, data_store.rainfall)
    for a in raw_alerts:
        if a.id in acknowledged_alerts:
            a.acknowledged = True
    return raw_alerts

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    acknowledged_alerts.add(alert_id)
    return {"message": f"Alert {alert_id} acknowledged successfully.", "alert_id": alert_id}
