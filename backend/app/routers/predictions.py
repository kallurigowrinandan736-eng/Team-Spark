from fastapi import APIRouter, Query
from typing import Optional
from app.data_loader import data_store
from app.schemas import DemandPredictionResponse, InflowForecastResponse
from app.ml.demand_model import demand_predictor
from app.ml.inflow_model import inflow_forecaster

router = APIRouter(prefix="/predictions", tags=["AI Predictions"])

@router.get("/demand", response_model=DemandPredictionResponse)
def get_demand_predictions(
    horizon_days: int = Query(30, ge=7, le=90),
    temp_delta: float = Query(0.0, ge=-5.0, le=10.0),
    rainfall_factor: float = Query(1.0, ge=0.1, le=3.0),
    demand_factor: float = Query(1.0, ge=0.5, le=2.5)
):
    return demand_predictor.predict_crops(
        crops=data_store.crops,
        horizon_days=horizon_days,
        temp_delta=temp_delta,
        rainfall_factor=rainfall_factor,
        demand_factor=demand_factor
    )

@router.get("/inflow", response_model=InflowForecastResponse)
def get_inflow_forecast(
    horizon_days: int = Query(30, ge=7, le=90),
    rainfall_factor: float = Query(1.0, ge=0.1, le=3.0),
    inflow_factor: float = Query(1.0, ge=0.1, le=3.0),
    current_month: int = Query(8, ge=1, le=12)
):
    return inflow_forecaster.forecast_reservoirs(
        reservoirs=data_store.reservoirs,
        horizon_days=horizon_days,
        rainfall_factor=rainfall_factor,
        inflow_factor=inflow_factor,
        current_month=current_month
    )
