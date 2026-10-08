from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.data_loader import data_store
from app.schemas import Reservoir, Canal, Region, Crop, WeatherData, RainfallData, InflowData, DemandData

router = APIRouter(prefix="/data", tags=["Data Management"])

@router.get("/reservoirs", response_model=List[Reservoir])
def get_reservoirs():
    return data_store.reservoirs

@router.put("/reservoirs", response_model=List[Reservoir])
def update_reservoirs(updated: List[Reservoir]):
    data_store.reservoirs = updated
    return data_store.reservoirs

@router.get("/canals", response_model=List[Canal])
def get_canals():
    return data_store.canals

@router.put("/canals", response_model=List[Canal])
def update_canals(updated: List[Canal]):
    data_store.canals = updated
    return data_store.canals

@router.get("/regions", response_model=List[Region])
def get_regions():
    return data_store.regions

@router.get("/crops", response_model=List[Crop])
def get_crops():
    return data_store.crops

@router.put("/crops", response_model=List[Crop])
def update_crops(updated: List[Crop]):
    data_store.crops = updated
    return data_store.crops

@router.get("/weather", response_model=List[WeatherData])
def get_weather():
    return data_store.weather

@router.get("/rainfall", response_model=List[RainfallData])
def get_rainfall():
    return data_store.rainfall

@router.get("/inflow-history", response_model=List[InflowData])
def get_inflow_history():
    return data_store.inflow_history

@router.get("/demand-history", response_model=List[DemandData])
def get_demand_history():
    return data_store.demand_history

@router.post("/reset-demo")
def reset_demo_data():
    data_store.reset_to_demo()
    return {"message": "All datasets have been reset to default demo records.", "status": "success"}
