import logging
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from typing import Dict, List, Any, Optional
from app.ml.synthetic_data import generate_inflow_training_data
from app.schemas import InflowForecastItem, InflowForecastResponse, ModelMetrics, Reservoir

logger = logging.getLogger(__name__)

class InflowForecastingModel:
    def __init__(self):
        self.model: Optional[RandomForestRegressor] = None
        self.metrics = ModelMetrics(mae=0.0, rmse=0.0, r2_score=0.0)
        self.train_model()

    def train_model(self):
        df = generate_inflow_training_data(n_samples=400, random_seed=42)
        df_encoded = pd.get_dummies(df, columns=["reservoir_id"], drop_first=False)
        
        X = df_encoded.drop(columns=["inflow_mcm"])
        y = df_encoded["inflow_mcm"]
        self.feature_names = list(X.columns)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model = RandomForestRegressor(
            n_estimators=30,
            max_depth=4,
            random_state=42
        )
        self.model.fit(X_train, y_train)
        
        y_pred = self.model.predict(X_test)
        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = float(r2_score(y_test, y_pred))
        self.metrics = ModelMetrics(mae=round(mae, 2), rmse=round(rmse, 2), r2_score=round(r2, 3))
        logger.info(f"Inflow ML Model trained successfully. R2={r2:.3f}, MAE={mae:.2f}")

    def forecast_reservoirs(
        self,
        reservoirs: List[Reservoir],
        horizon_days: int = 30,
        rainfall_factor: float = 1.0,
        inflow_factor: float = 1.0,
        current_month: int = 8
    ) -> InflowForecastResponse:
        if self.model is None:
            self.train_model()

        forecasts: List[InflowForecastItem] = []
        horizon_scale = horizon_days / 30.0

        for res in reservoirs:
            row_dict = {
                "month": current_month,
                "rainfall_catchment_mm": 90.0 * rainfall_factor,
                "temperature_c": 31.0,
                "prev_storage_mcm": res.current_storage_mcm
            }
            
            for col in self.feature_names:
                if col.startswith("reservoir_id_"):
                    row_dict[col] = 1 if col == f"reservoir_id_{res.id}" else 0
                elif col not in row_dict:
                    row_dict[col] = 0

            X_input = pd.DataFrame([row_dict])[self.feature_names]
            p50_raw = float(self.model.predict(X_input)[0]) * inflow_factor * horizon_scale
            p50 = max(15.0, p50_raw)
            
            # Hydrological quantile bounds
            p10 = max(5.0, p50 * 0.72)
            p90 = p50 * 1.35
            hist_avg = res.expected_inflow_mcm * horizon_scale

            forecasts.append(InflowForecastItem(
                reservoir_id=res.id,
                reservoir_name=res.name,
                date_or_month=f"Next {horizon_days} Days",
                p10_inflow_mcm=round(p10, 1),
                p50_inflow_mcm=round(p50, 1),
                p90_inflow_mcm=round(p90, 1),
                historical_avg_mcm=round(hist_avg, 1)
            ))

        return InflowForecastResponse(
            horizon_days=horizon_days,
            forecasts=forecasts,
            model_metrics=self.metrics,
            label="Simulated / Demo Model"
        )

inflow_forecaster = InflowForecastingModel()
