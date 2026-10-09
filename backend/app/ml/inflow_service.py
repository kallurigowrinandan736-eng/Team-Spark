"""
Reservoir Inflow Machine Learning Inference Service
Stage 4 Production Pipeline for Jaldhara (Team Spark)

Loads trained model artifacts once at startup and provides validated inference,
historical series retrieval, and evaluation metrics.
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional, List
import numpy as np
import pandas as pd
import joblib

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"
ARTIFACTS_DIR = Path(__file__).resolve().parent / "artifacts"
MODEL_PATH = ARTIFACTS_DIR / "inflow_model.joblib"
METADATA_PATH = ARTIFACTS_DIR / "metadata.json"
TEST_RESULTS_PATH = ARTIFACTS_DIR / "test_evaluation_results.csv"

MCM_TO_ML = 1000.0  # 1 Million Cubic Meters = 1,000 Megaliters


class InflowMLService:
    def __init__(self):
        self.bundle: Optional[Dict[str, Any]] = None
        self.metadata: Optional[Dict[str, Any]] = None
        self.historical_df: Optional[pd.DataFrame] = None
        self.test_eval_df: Optional[pd.DataFrame] = None
        self.is_loaded = False
        self.load_artifacts()

    def load_artifacts(self):
        """Loads serialized model artifacts and metadata once into memory."""
        try:
            if MODEL_PATH.exists():
                self.bundle = joblib.load(MODEL_PATH)
            if METADATA_PATH.exists():
                with open(METADATA_PATH, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)
            if TEST_RESULTS_PATH.exists():
                self.test_eval_df = pd.read_csv(TEST_RESULTS_PATH)

            inflow_csv = DATA_DIR / "inflow_history.csv"
            if inflow_csv.exists():
                self.historical_df = pd.read_csv(inflow_csv)

            if self.bundle and self.metadata:
                self.is_loaded = True
                print(f"[InflowMLService] Successfully loaded trained model: {self.metadata.get('model_id')}")
            else:
                print("[InflowMLService] Model artifact not found. Please run training pipeline.")
        except Exception as e:
            print(f"[InflowMLService] Error loading artifacts: {e}")
            self.is_loaded = False

    def get_metadata(self) -> Dict[str, Any]:
        """Returns model evaluation metadata and performance metrics."""
        if not self.is_loaded or not self.metadata:
            return {
                "status": "not_loaded",
                "message": "Model artifacts not loaded. Run `python scripts/train_ml_model.py`."
            }
        return self.metadata

    def predict(
        self,
        reservoir_id: str,
        prediction_period: str = "2026-07",
        rainfall_anomaly_pct: float = 0.0,
        rainfall_factor: float = 1.0,
        inflow_factor: float = 1.0,
    ) -> Dict[str, Any]:
        """
        Executes model inference for a specific reservoir and period.
        
        Args:
            reservoir_id: Valid ID from reservoirs.csv (res_1, res_2, res_3, res_4)
            prediction_period: YYYY-MM string (e.g. '2026-07')
            rainfall_anomaly_pct: Optional climate perturbation anomaly %
            rainfall_factor: Scenario multiplier on rainfall
            inflow_factor: Scenario multiplier on baseline inflow
        """
        if not self.is_loaded or not self.bundle:
            # Fallback if artifact is missing
            return {
                "reservoir_id": reservoir_id,
                "prediction_period": prediction_period,
                "predicted_inflow_ml": 125000.0 * inflow_factor,
                "predicted_inflow_mcm": 125.0 * inflow_factor,
                "model_id": "fallback_rule_based",
                "status": "fallback_demo_mode",
                "limitation": "Trained model artifact not loaded; using baseline estimate.",
                "evaluation_metrics": None
            }

        # 1. Parse prediction period
        try:
            target_date = pd.to_datetime(prediction_period)
        except Exception:
            target_date = pd.to_datetime("2026-07-01")
            prediction_period = "2026-07"

        month_num = int(target_date.month)
        quarter = int((month_num - 1) // 3 + 1)
        is_monsoon = 1 if month_num in [6, 7, 8, 9, 10] else 0

        # 2. Extract reservoir parameters
        res_capacity_map = self.bundle.get("res_capacity_map", {})
        capacity_mcm = res_capacity_map.get(reservoir_id, 1000.0)

        # 3. Retrieve historical lags for this reservoir
        lag_1 = 150.0
        lag_2 = 120.0
        lag_12 = 250.0
        rolling_3 = 140.0

        if self.historical_df is not None:
            res_history = self.historical_df[self.historical_df["reservoir_id"] == reservoir_id]
            if len(res_history) > 0:
                recent = res_history.sort_values("month")
                inflows = recent["inflow_mcm"].values
                lag_1 = float(inflows[-1])
                lag_2 = float(inflows[-2]) if len(inflows) > 1 else lag_1
                rolling_3 = float(np.mean(inflows[-3:]))
                
                # Check for same month in history
                same_month_hist = recent[recent["month"].str.endswith(f"-{month_num:02d}")]
                if len(same_month_hist) > 0:
                    lag_12 = float(same_month_hist["inflow_mcm"].values[-1])
                else:
                    lag_12 = float(np.median(inflows))

        # Adjust lags with scenario inflow_factor
        lag_1 *= inflow_factor
        lag_2 *= inflow_factor
        lag_12 *= inflow_factor
        rolling_3 *= inflow_factor

        # 4. Seasonal weather defaults for Krishna Basin
        # Typical rainfall: high in monsoon (120-250mm), low in winter (10-30mm)
        base_rainfall = 180.0 if is_monsoon else 25.0
        rainfall_mm = max(0.0, base_rainfall * rainfall_factor * (1.0 + rainfall_anomaly_pct / 100.0))
        
        avg_temp = 31.0 if month_num in [3, 4, 5] else (26.0 if is_monsoon else 24.0)
        humidity = 78.0 if is_monsoon else 55.0
        evap = 5.5 if month_num in [3, 4, 5] else 3.5
        soil_moist = 32.0 if is_monsoon else 18.0

        # 5. Build feature vectors
        feature_dict = {
            "month_num": month_num,
            "quarter": quarter,
            "is_monsoon": is_monsoon,
            "capacity_mcm": capacity_mcm,
            "rainfall_mm": rainfall_mm,
            "rainfall_anomaly_pct": rainfall_anomaly_pct,
            "avg_temperature_c": avg_temp,
            "avg_humidity_pct": humidity,
            "evapotranspiration_mm_day": evap,
            "avg_soil_moisture_pct": soil_moist,
            "lag_1_inflow": lag_1,
            "lag_2_inflow": lag_2,
            "lag_12_inflow": lag_12,
            "rolling_mean_3_inflow": rolling_3,
        }

        feature_numeric = self.bundle["feature_numeric"]
        num_vals = np.array([[feature_dict[col] for col in feature_numeric]])

        encoder = self.bundle["encoder"]
        # Reshape for categorical encoder
        cat_df = pd.DataFrame([{"reservoir_id": reservoir_id}])
        cat_vals = encoder.transform(cat_df[["reservoir_id"]])

        X_input = np.hstack([num_vals, cat_vals])

        # 6. Predict using trained model
        model = self.bundle["model"]
        predicted_mcm = float(model.predict(X_input)[0])
        # Inflow cannot be negative in physical hydrology
        predicted_mcm = max(0.0, round(predicted_mcm, 2))
        predicted_ml = round(predicted_mcm * MCM_TO_ML, 1)

        # 7. Confidence bounds (approximated from evaluation RMSE)
        eval_metrics = self.metadata.get("evaluation_metrics", {})
        rmse_mcm = eval_metrics.get("mcm", {}).get("rmse", 44.25)
        p10_mcm = max(0.0, round(predicted_mcm - 1.28 * rmse_mcm, 2))
        p90_mcm = round(predicted_mcm + 1.28 * rmse_mcm, 2)

        return {
            "reservoir_id": reservoir_id,
            "prediction_period": prediction_period,
            "predicted_inflow_mcm": predicted_mcm,
            "predicted_inflow_ml": predicted_ml,
            "confidence_bounds": {
                "p10_inflow_mcm": p10_mcm,
                "p90_inflow_mcm": p90_mcm,
                "p10_inflow_ml": round(p10_mcm * MCM_TO_ML, 1),
                "p90_inflow_ml": round(p90_mcm * MCM_TO_ML, 1),
            },
            "model_id": self.metadata.get("model_id", "jaldhara-inflow-v4"),
            "algorithm": self.metadata.get("algorithm", "Random Forest Regressor"),
            "status": "valid_prediction",
            "evaluation_metrics": eval_metrics,
            "inputs_used": {
                "rainfall_mm": round(rainfall_mm, 1),
                "month": month_num,
                "is_monsoon": bool(is_monsoon),
                "lag_1_inflow_mcm": round(lag_1, 1),
            },
            "limitations": "Model trained on 2023-2024 historical Krishna Basin datasets; test-set evaluated on unseen 2025 data. Extreme unrecorded hydrological events may fall outside training support."
        }

    def get_time_series_data(self, reservoir_id: str) -> Dict[str, Any]:
        """
        Returns full chronological series:
        - Historical observations (2023-2024)
        - Test set actuals vs model predictions (2025)
        - Next period forecast (2026-07)
        """
        if self.historical_df is None:
            return {"history": [], "test_eval": []}

        hist_records = []
        res_data = self.historical_df[self.historical_df["reservoir_id"] == reservoir_id].sort_values("month")
        for _, row in res_data.iterrows():
            mcm = float(row["inflow_mcm"])
            hist_records.append({
                "period": row["month"],
                "actual_mcm": mcm,
                "actual_ml": round(mcm * MCM_TO_ML, 1),
                "is_test_period": row["month"] >= "2025-01",
            })

        # Load rainfall mapping for linked region
        rainfall_map = {}
        rainfall_csv = DATA_DIR / "rainfall.csv"
        target_region = self.bundle.get("reservoir_to_region", {}).get(reservoir_id, "reg_1") if self.bundle else "reg_1"
        if rainfall_csv.exists():
            df_rain = pd.read_csv(rainfall_csv)
            region_rain = df_rain[df_rain["region_id"] == target_region]
            for _, rrow in region_rain.iterrows():
                rainfall_map[str(rrow["month"])] = float(rrow["rainfall_mm"])

        test_pred_map = {}
        test_records = []
        if self.test_eval_df is not None:
            res_test = self.test_eval_df[self.test_eval_df["reservoir_id"] == reservoir_id].sort_values("month")
            for _, row in res_test.iterrows():
                m_str = str(row["month"])
                act_mcm = float(row["inflow_mcm"])
                pred_mcm = float(row["predicted_inflow_mcm"])
                test_pred_map[m_str] = pred_mcm
                test_records.append({
                    "period": m_str,
                    "actual_mcm": act_mcm,
                    "actual_ml": round(act_mcm * MCM_TO_ML, 1),
                    "predicted_mcm": pred_mcm,
                    "predicted_ml": round(pred_mcm * MCM_TO_ML, 1),
                    "error_mcm": round(pred_mcm - act_mcm, 2),
                    "rainfall_mm": rainfall_map.get(m_str, 0.0),
                })

        for r in hist_records:
            m_str = r["period"]
            r["rainfall_mm"] = rainfall_map.get(m_str, 0.0)
            if m_str in test_pred_map:
                r["predicted_mcm"] = test_pred_map[m_str]
                r["predicted_ml"] = round(test_pred_map[m_str] * MCM_TO_ML, 1)

        return {
            "reservoir_id": reservoir_id,
            "region_id": target_region,
            "history": hist_records,
            "test_eval": test_records,
            "metadata": self.metadata,
        }


# Global singleton instance
inflow_service = InflowMLService()
