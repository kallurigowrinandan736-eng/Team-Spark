from fastapi import APIRouter, Query, HTTPException, status
from typing import Optional, Dict, Any
from app.data_loader import data_store
from app.schemas import (
    DemandPredictionResponse,
    InflowForecastResponse,
    InflowForecastItem,
    ModelMetrics,
    InflowPredictionRequest,
    InflowPredictionResult,
)
from app.ml.demand_model import demand_predictor
from app.ml.inflow_model import inflow_forecaster
from app.ml.inflow_service import inflow_service

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


@router.post("/inflow", response_model=InflowPredictionResult)
def predict_reservoir_inflow(request: InflowPredictionRequest):
    """
    Stage 4 Production Machine Learning Prediction Endpoint.
    Uses trained Random Forest Regressor to forecast reservoir inflow (in ML and MCM)
    given reservoir, target period, and climate conditions.
    """
    # Validate reservoir exists
    valid_reservoirs = [r.id for r in data_store.reservoirs] or ["res_1", "res_2", "res_3", "res_4"]
    if request.reservoir_id not in valid_reservoirs:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid reservoir_id '{request.reservoir_id}'. Valid choices: {valid_reservoirs}"
        )

    try:
        result = inflow_service.predict(
            reservoir_id=request.reservoir_id,
            prediction_period=request.prediction_period,
            rainfall_anomaly_pct=request.rainfall_anomaly_pct,
            rainfall_factor=request.rainfall_factor,
            inflow_factor=request.inflow_factor,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model inference failed: {str(e)}"
        )


@router.get("/inflow/metadata")
def get_inflow_model_metadata():
    """
    Returns Stage 4 Model evaluation metrics, training period, baseline comparison,
    and feature importances.
    """
    meta = inflow_service.get_metadata()
    return meta


@router.get("/inflow/history")
def get_inflow_time_series(reservoir_id: str = Query("res_1")):
    """
    Returns historical observations (2023-2024), unseen test-set actuals vs model predictions (2025),
    and model evaluation metrics for charting.
    """
    valid_reservoirs = [r.id for r in data_store.reservoirs] or ["res_1", "res_2", "res_3", "res_4"]
    if reservoir_id not in valid_reservoirs:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid reservoir_id '{reservoir_id}'. Valid choices: {valid_reservoirs}"
        )
    return inflow_service.get_time_series_data(reservoir_id=reservoir_id)


@router.get("/inflow", response_model=InflowForecastResponse)
def get_inflow_forecast(
    horizon_days: int = Query(30, ge=7, le=90),
    rainfall_factor: float = Query(1.0, ge=0.1, le=3.0),
    inflow_factor: float = Query(1.0, ge=0.1, le=3.0),
    current_month: int = Query(8, ge=1, le=12)
):
    """
    Multi-reservoir inflow forecast powered by the trained ML pipeline when available,
    with graceful fallback.
    """
    # If the Stage 4 ML model is loaded, use it to produce realistic predictions for each reservoir
    if inflow_service.is_loaded:
        forecast_items = []
        period_str = f"2026-{current_month:02d}"
        for res in data_store.reservoirs:
            pred = inflow_service.predict(
                reservoir_id=res.id,
                prediction_period=period_str,
                rainfall_factor=rainfall_factor,
                inflow_factor=inflow_factor,
            )
            pred_mcm = pred["predicted_inflow_mcm"]
            bounds = pred.get("confidence_bounds", {})
            forecast_items.append(
                InflowForecastItem(
                    reservoir_id=res.id,
                    reservoir_name=res.name,
                    date_or_month=period_str,
                    p10_inflow_mcm=bounds.get("p10_inflow_mcm", round(pred_mcm * 0.8, 2)),
                    p50_inflow_mcm=pred_mcm,
                    p90_inflow_mcm=bounds.get("p90_inflow_mcm", round(pred_mcm * 1.2, 2)),
                    historical_avg_mcm=res.expected_inflow_mcm,
                )
            )
        eval_meta = inflow_service.get_metadata().get("evaluation_metrics", {}).get("mcm", {})
        return InflowForecastResponse(
            horizon_days=horizon_days,
            forecasts=forecast_items,
            model_metrics=ModelMetrics(
                mae=eval_meta.get("mae", 36.14),
                rmse=eval_meta.get("rmse", 44.25),
                r2_score=eval_meta.get("r2", 0.956)
            ),
            label="Trained Random Forest Regressor (Stage 4)"
        )

    # Fallback to in-memory forecaster
    return inflow_forecaster.forecast_reservoirs(
        reservoirs=data_store.reservoirs,
        horizon_days=horizon_days,
        rainfall_factor=rainfall_factor,
        inflow_factor=inflow_factor,
        current_month=current_month
    )


@router.post("/ml-allocate")
def predict_ml_water_allocation(
    available_water_ml: float = Query(8000.0, ge=1000.0, le=25000.0),
    reservoir_level_pct: float = Query(80.0, ge=5.0, le=100.0),
    inflow_ml: float = Query(2500.0, ge=100.0, le=15000.0),
    demand_ml: float = Query(7000.0, ge=2000.0, le=15000.0),
    temp_c: float = Query(32.0, ge=15.0, le=50.0),
    rainfall_mm: float = Query(75.0, ge=0.0, le=500.0)
):
    from app.ml.allocation_policy_model import ml_allocator
    return ml_allocator.predict_allocation(
        available_water_ml=available_water_ml,
        reservoir_level_pct=reservoir_level_pct,
        inflow_ml=inflow_ml,
        demand_ml=demand_ml,
        temp_c=temp_c,
        rainfall_mm=rainfall_mm
    )


@router.get("/ml-telemetry")
def get_ml_telemetry():
    from app.ml.allocation_policy_model import ml_allocator
    stage4_meta = inflow_service.get_metadata()
    return {
        "status": "ready",
        "stage4_inflow_model": {
            "model_id": stage4_meta.get("model_id"),
            "algorithm": stage4_meta.get("algorithm"),
            "evaluation_metrics": stage4_meta.get("evaluation_metrics"),
            "status": stage4_meta.get("status")
        },
        "allocation_policy_model": {
            "model": "Multi-Output RandomForest Regressor + Crop Priority Policy",
            "metrics": ml_allocator.metrics
        }
    }
