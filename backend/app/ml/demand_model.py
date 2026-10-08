import logging
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from typing import Dict, List, Any, Optional
from app.ml.synthetic_data import generate_demand_training_data, CROP_COEFFICIENTS
from app.schemas import DemandPredictionItem, DemandPredictionResponse, ModelMetrics, FeatureImportance, Crop

logger = logging.getLogger(__name__)

class DemandPredictionModel:
    def __init__(self):
        self.model: Optional[GradientBoostingRegressor] = None
        self.feature_names: List[str] = []
        self.metrics = ModelMetrics(mae=0.0, rmse=0.0, r2_score=0.0)
        self.feature_importance: List[FeatureImportance] = []
        self.train_model()

    def train_model(self):
        df = generate_demand_training_data(n_samples=500, random_seed=42)
        
        # Categorical features encoding
        categorical_cols = ["crop", "growth_stage", "region_id"]
        df_encoded = pd.get_dummies(df, columns=categorical_cols, drop_first=False)
        
        X = df_encoded.drop(columns=["demand_mcm"])
        y = df_encoded["demand_mcm"]
        self.feature_names = list(X.columns)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model = GradientBoostingRegressor(
            n_estimators=35,
            learning_rate=0.1,
            max_depth=3,
            random_state=42
        )
        self.model.fit(X_train, y_train)
        
        y_pred = self.model.predict(X_test)
        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = float(r2_score(y_test, y_pred))
        self.metrics = ModelMetrics(mae=round(mae, 2), rmse=round(rmse, 2), r2_score=round(r2, 3))
        
        importances = self.model.feature_importances_
        sorted_indices = np.argsort(importances)[::-1]
        
        # Simplify feature names for display
        friendly_names = {
            "area_ha": "Cultivated Area (ha)",
            "et0_mm_day": "Evapotranspiration (ET0)",
            "temperature_c": "Temperature (°C)",
            "rainfall_mm": "Rainfall (mm)",
            "soil_moisture_pct": "Soil Moisture (%)",
            "humidity_pct": "Relative Humidity (%)"
        }
        
        feats = []
        for idx in sorted_indices[:8]:
            raw_name = self.feature_names[idx]
            display_name = friendly_names.get(raw_name, raw_name.replace("crop_", "Crop: ").replace("growth_stage_", "Stage: ").replace("region_id_", "Region: "))
            feats.append(FeatureImportance(
                feature=display_name,
                importance=round(float(importances[idx]), 4)
            ))
        self.feature_importance = feats
        logger.info(f"Demand ML Model trained successfully. R2={r2:.3f}, MAE={mae:.2f}")

    def predict_crops(
        self,
        crops: List[Crop],
        horizon_days: int = 30,
        temp_delta: float = 0.0,
        rainfall_factor: float = 1.0,
        demand_factor: float = 1.0
    ) -> DemandPredictionResponse:
        if self.model is None:
            self.train_model()

        predictions: List[DemandPredictionItem] = []
        horizon_scale = horizon_days / 30.0

        for crop in crops:
            # Baseline feature vector construction
            base_area = crop.area_ha
            base_temp = 32.0 + temp_delta
            base_humidity = 60.0
            base_rainfall = 50.0 * rainfall_factor
            base_soil_moist = max(15.0, min(85.0, 50.0 * rainfall_factor))
            et0 = max(2.5, (base_temp * 0.22 - base_humidity * 0.04 + 0.25))

            row_dict = {
                "area_ha": base_area,
                "temperature_c": base_temp,
                "humidity_pct": base_humidity,
                "rainfall_mm": base_rainfall,
                "soil_moisture_pct": base_soil_moist,
                "et0_mm_day": et0
            }
            
            # Populate one-hot fields
            for col in self.feature_names:
                if col.startswith("crop_"):
                    row_dict[col] = 1 if col == f"crop_{crop.crop}" else 0
                elif col.startswith("growth_stage_"):
                    row_dict[col] = 1 if col == f"growth_stage_{crop.growth_stage}" else 0
                elif col.startswith("region_id_"):
                    row_dict[col] = 1 if col == f"region_id_{crop.region_id}" else 0
                elif col not in row_dict:
                    row_dict[col] = 0

            X_input = pd.DataFrame([row_dict])[self.feature_names]
            base_pred = float(self.model.predict(X_input)[0]) * demand_factor * horizon_scale
            base_pred = max(5.0, base_pred)
            
            # Uncertainty estimation (±8% to ±14% based on horizon)
            uncertainty_pct = 0.07 + (horizon_days / 300.0) * 0.08
            lower_bound = max(2.0, base_pred * (1.0 - uncertainty_pct))
            upper_bound = base_pred * (1.0 + uncertainty_pct)
            
            # Key drivers explanation
            drivers = []
            if crop.growth_stage in ["Flowering", "Vegetative"]:
                drivers.append(f"Peak critical water demand during {crop.growth_stage} phase")
            if base_temp > 34.0:
                drivers.append("Elevated evapotranspiration due to high ambient temperature")
            if rainfall_factor < 0.8:
                drivers.append("Rainfall deficit increasing net irrigation requirements")
            if crop.area_ha > 60000:
                drivers.append("High cultivated acreage command area")
            if not drivers:
                drivers.append("Standard crop water-use coefficient Kc trajectory")

            region_name_map = {
                "reg_1": "Guntur",
                "reg_2": "Vijayawada",
                "reg_3": "Krishna Delta",
                "reg_4": "Prakasam",
                "reg_5": "Palnadu"
            }

            predictions.append(DemandPredictionItem(
                crop_id=crop.id,
                crop_name=crop.crop,
                region_id=crop.region_id,
                region_name=region_name_map.get(crop.region_id, crop.region_id),
                horizon_days=horizon_days,
                current_demand_mcm=round(crop.total_demand_mcm * horizon_scale, 2),
                predicted_demand_mcm=round(base_pred, 2),
                confidence_lower_mcm=round(lower_bound, 2),
                confidence_upper_mcm=round(upper_bound, 2),
                key_drivers=drivers
            ))

        return DemandPredictionResponse(
            horizon_days=horizon_days,
            predictions=predictions,
            model_metrics=self.metrics,
            feature_importance=self.feature_importance,
            label="Simulated / Demo Model"
        )

demand_predictor = DemandPredictionModel()
