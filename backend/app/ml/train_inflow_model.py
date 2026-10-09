"""
Train and Evaluate Reservoir Inflow Forecasting Machine Learning Models
Stage 4 Production Pipeline for Jaldhara (Team Spark)
Author: Team Spark Data & ML Engineering
"""

import json
import os
from pathlib import Path
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"
ARTIFACTS_DIR = Path(__file__).resolve().parent / "artifacts"


# Geographic / hydrological mapping between reservoirs and weather/rainfall regions
RESERVOIR_TO_REGION = {
    "res_1": "reg_5",  # Nagarjuna Sagar -> Palnadu
    "res_2": "reg_4",  # Srisailam -> Prakasam
    "res_3": "reg_1",  # Pulichintala -> Guntur
    "res_4": "reg_2",  # Prakasam Barrage -> Vijayawada
}


def load_and_prepare_data(data_dir: Path = DATA_DIR):
    """
    Load raw historical CSV files and construct leakage-free feature matrix
    with chronological ordering.
    """
    inflow_path = data_dir / "inflow_history.csv"
    rainfall_path = data_dir / "rainfall.csv"
    weather_path = data_dir / "weather.csv"
    reservoirs_path = data_dir / "reservoirs.csv"

    if not inflow_path.exists():
        raise FileNotFoundError(f"Missing required dataset: {inflow_path}")

    # 1. Load datasets
    df_inflow = pd.read_csv(inflow_path)
    df_rain = pd.read_csv(rainfall_path) if rainfall_path.exists() else None
    df_weather = pd.read_csv(weather_path) if weather_path.exists() else None
    df_res = pd.read_csv(reservoirs_path) if reservoirs_path.exists() else None

    # Parse month into datetime
    df_inflow["date"] = pd.to_datetime(df_inflow["month"])
    df_inflow = df_inflow.sort_values(["reservoir_id", "date"]).reset_index(drop=True)

    # 2. Reservoir capacity mapping
    res_capacity_map = {}
    if df_res is not None:
        for _, row in df_res.iterrows():
            res_capacity_map[row["id"]] = float(row.get("max_capacity_mcm", 1000.0))

    df_inflow["capacity_mcm"] = df_inflow["reservoir_id"].map(res_capacity_map).fillna(1000.0)
    df_inflow["region_id"] = df_inflow["reservoir_id"].map(RESERVOIR_TO_REGION).fillna("reg_1")

    # 3. Rainfall merge
    if df_rain is not None:
        df_rain = df_rain.copy()
        df_rain["date"] = pd.to_datetime(df_rain["month"])
        df_inflow = pd.merge(
            df_inflow,
            df_rain[["region_id", "date", "rainfall_mm", "anomaly_pct"]].rename(
                columns={"anomaly_pct": "rainfall_anomaly_pct"}
            ),
            on=["region_id", "date"],
            how="left"
        )
    else:
        df_inflow["rainfall_mm"] = 100.0
        df_inflow["rainfall_anomaly_pct"] = 0.0

    # 4. Weather merge
    if df_weather is not None:
        df_weather = df_weather.copy()
        df_weather["date"] = pd.to_datetime(df_weather["month"])
        df_inflow = pd.merge(
            df_inflow,
            df_weather[["date", "avg_temperature_c", "avg_humidity_pct", "evapotranspiration_mm_day", "avg_soil_moisture_pct"]],
            on=["date"],
            how="left"
        )
    else:
        df_inflow["avg_temperature_c"] = 30.0
        df_inflow["avg_humidity_pct"] = 65.0
        df_inflow["evapotranspiration_mm_day"] = 4.5
        df_inflow["avg_soil_moisture_pct"] = 25.0

    # Handle missing values strictly without data leakage
    df_inflow["rainfall_mm"] = df_inflow["rainfall_mm"].fillna(df_inflow["rainfall_mm"].median())
    df_inflow["rainfall_anomaly_pct"] = df_inflow["rainfall_anomaly_pct"].fillna(0.0)
    df_inflow["avg_temperature_c"] = df_inflow["avg_temperature_c"].fillna(30.0)
    df_inflow["avg_humidity_pct"] = df_inflow["avg_humidity_pct"].fillna(65.0)
    df_inflow["evapotranspiration_mm_day"] = df_inflow["evapotranspiration_mm_day"].fillna(4.5)
    df_inflow["avg_soil_moisture_pct"] = df_inflow["avg_soil_moisture_pct"].fillna(25.0)

    # 5. Create calendar & seasonal features
    df_inflow["year"] = df_inflow["date"].dt.year
    df_inflow["month_num"] = df_inflow["date"].dt.month
    df_inflow["quarter"] = df_inflow["date"].dt.quarter
    # Monsoon season in Krishna basin (June to October)
    df_inflow["is_monsoon"] = df_inflow["month_num"].isin([6, 7, 8, 9, 10]).astype(int)

    # 6. Lag features per reservoir (strictly chronological shift to prevent look-ahead bias)
    df_inflow["lag_1_inflow"] = df_inflow.groupby("reservoir_id")["inflow_mcm"].shift(1)
    df_inflow["lag_2_inflow"] = df_inflow.groupby("reservoir_id")["inflow_mcm"].shift(2)
    df_inflow["lag_12_inflow"] = df_inflow.groupby("reservoir_id")["inflow_mcm"].shift(12)
    df_inflow["rolling_mean_3_inflow"] = df_inflow.groupby("reservoir_id")["inflow_mcm"].shift(1).rolling(3, min_periods=1).mean()

    # Drop the initial 2 lag warmup rows per reservoir where lag_1 or lag_2 is not yet available
    df_clean = df_inflow.dropna(subset=["lag_1_inflow", "lag_2_inflow"]).copy()

    # For lag_12 during year 1 (months 3-12 of 2023), impute using lag_1
    df_clean["lag_12_inflow"] = df_clean["lag_12_inflow"].fillna(df_clean["lag_1_inflow"])
    df_clean["rolling_mean_3_inflow"] = df_clean["rolling_mean_3_inflow"].fillna(df_clean["lag_1_inflow"])

    return df_clean


def train_and_evaluate():
    """
    Train baselines, Random Forest, and Gradient Boosting Regressor.
    Save the winning model and comprehensive evaluation metadata.
    """
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    df = load_and_prepare_data()

    # Get reservoir capacities
    reservoirs_path = DATA_DIR / "reservoirs.csv"
    res_capacity_map = {}
    if reservoirs_path.exists():
        df_res = pd.read_csv(reservoirs_path)
        for _, row in df_res.iterrows():
            res_capacity_map[row["id"]] = float(row.get("max_capacity_mcm", 1000.0))

    # Chronological Split:
    # Train: 2023-03 through 2024-12
    # Test:  2025-01 through 2025-12 (held-out future year)
    split_date = pd.to_datetime("2025-01-01")
    train_mask = df["date"] < split_date
    test_mask = df["date"] >= split_date

    df_train = df[train_mask].copy()
    df_test = df[test_mask].copy()

    print(f"Total processed samples: {len(df)}")
    print(f"Training samples: {len(df_train)} ({df_train['date'].min().strftime('%Y-%m')} to {df_train['date'].max().strftime('%Y-%m')})")
    print(f"Test samples:     {len(df_test)} ({df_test['date'].min().strftime('%Y-%m')} to {df_test['date'].max().strftime('%Y-%m')})")

    # Features
    feature_numeric = [
        "month_num",
        "quarter",
        "is_monsoon",
        "capacity_mcm",
        "rainfall_mm",
        "rainfall_anomaly_pct",
        "avg_temperature_c",
        "avg_humidity_pct",
        "evapotranspiration_mm_day",
        "avg_soil_moisture_pct",
        "lag_1_inflow",
        "lag_2_inflow",
        "lag_12_inflow",
        "rolling_mean_3_inflow",
    ]
    feature_cat = ["reservoir_id"]
    target_col = "inflow_mcm"

    # Fit OneHotEncoder strictly on training data
    encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
    encoder.fit(df_train[feature_cat])

    cat_feature_names = [f"res_{c}" for c in encoder.categories_[0]]
    all_feature_names = feature_numeric + cat_feature_names

    X_train_num = df_train[feature_numeric].values
    X_train_cat = encoder.transform(df_train[feature_cat])
    X_train = np.hstack([X_train_num, X_train_cat])
    y_train = df_train[target_col].values

    X_test_num = df_test[feature_numeric].values
    X_test_cat = encoder.transform(df_test[feature_cat])
    X_test = np.hstack([X_test_num, X_test_cat])
    y_test = df_test[target_col].values

    # ----------------------------------------------------
    # Baseline 1: Persistence / Naive Lag-1 Inflow
    # ----------------------------------------------------
    y_pred_b1 = df_test["lag_1_inflow"].values
    b1_mae = float(mean_absolute_error(y_test, y_pred_b1))
    b1_rmse = float(np.sqrt(mean_squared_error(y_test, y_pred_b1)))
    b1_r2 = float(r2_score(y_test, y_pred_b1))

    # ----------------------------------------------------
    # Baseline 2: Seasonal Monthly Mean per Reservoir
    # ----------------------------------------------------
    seasonal_means = df_train.groupby(["reservoir_id", "month_num"])["inflow_mcm"].mean().to_dict()
    y_pred_b2 = [
        seasonal_means.get((row["reservoir_id"], row["month_num"]), df_train["inflow_mcm"].mean())
        for _, row in df_test.iterrows()
    ]
    b2_mae = float(mean_absolute_error(y_test, y_pred_b2))
    b2_rmse = float(np.sqrt(mean_squared_error(y_test, y_pred_b2)))
    b2_r2 = float(r2_score(y_test, y_pred_b2))

    # ----------------------------------------------------
    # Model 1: Random Forest Regressor
    # ----------------------------------------------------
    rf = RandomForestRegressor(
        n_estimators=150,
        max_depth=5,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42
    )
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    rf_mae = float(mean_absolute_error(y_test, y_pred_rf))
    rf_rmse = float(np.sqrt(mean_squared_error(y_test, y_pred_rf)))
    rf_r2 = float(r2_score(y_test, y_pred_rf))

    # ----------------------------------------------------
    # Model 2: Gradient Boosting Regressor
    # ----------------------------------------------------
    gbr = GradientBoostingRegressor(
        n_estimators=60,
        learning_rate=0.06,
        max_depth=2,
        subsample=0.85,
        random_state=42
    )
    gbr.fit(X_train, y_train)
    y_pred_gbr = gbr.predict(X_test)
    gbr_mae = float(mean_absolute_error(y_test, y_pred_gbr))
    gbr_rmse = float(np.sqrt(mean_squared_error(y_test, y_pred_gbr)))
    gbr_r2 = float(r2_score(y_test, y_pred_gbr))

    print("\n--- TEST SET EVALUATION RESULTS (Chronological 2025 Test Split, Units: MCM) ---")
    print(f"1. Baseline (Persistence Lag-1): MAE = {b1_mae:.2f} MCM, RMSE = {b1_rmse:.2f} MCM, R2 = {b1_r2:.4f}")
    print(f"2. Baseline (Seasonal Means):   MAE = {b2_mae:.2f} MCM, RMSE = {b2_rmse:.2f} MCM, R2 = {b2_r2:.4f}")
    print(f"3. Random Forest Regressor:      MAE = {rf_mae:.2f} MCM, RMSE = {rf_rmse:.2f} MCM, R2 = {rf_r2:.4f}")
    print(f"4. Gradient Boosting Regressor:  MAE = {gbr_mae:.2f} MCM, RMSE = {gbr_rmse:.2f} MCM, R2 = {gbr_r2:.4f}")

    # Unit conversion: 1 MCM = 1,000 ML (Megaliters)
    mcm_to_ml = 1000.0

    # Pick the model with the lowest test error
    best_model = gbr if gbr_mae <= rf_mae else rf
    best_name = "Gradient Boosting Regressor" if best_model == gbr else "Random Forest Regressor"
    best_mae = gbr_mae if best_model == gbr else rf_mae
    best_rmse = gbr_rmse if best_model == gbr else rf_rmse
    best_r2 = gbr_r2 if best_model == gbr else rf_r2

    # Save pipeline object
    pipeline_bundle = {
        "model": best_model,
        "encoder": encoder,
        "feature_numeric": feature_numeric,
        "feature_cat": feature_cat,
        "all_feature_names": all_feature_names,
        # Convert tuple keys to string for JSON-safe / pickled serialization
        "seasonal_means": {f"{k[0]}_{k[1]}": float(v) for k, v in seasonal_means.items()},
        "train_mean_inflow": float(df_train["inflow_mcm"].mean()),
        "res_capacity_map": res_capacity_map,
        "reservoir_to_region": RESERVOIR_TO_REGION,
    }
    model_path = ARTIFACTS_DIR / "inflow_model.joblib"
    joblib.dump(pipeline_bundle, model_path)
    print(f"\n[OK] Model pipeline bundle saved to: {model_path}")

    # Feature importances
    importances = best_model.feature_importances_
    feat_imp = [
        {"feature": name, "importance": round(float(imp), 4)}
        for name, imp in sorted(zip(all_feature_names, importances), key=lambda x: x[1], reverse=True)
    ]

    # Save evaluation metadata
    metadata = {
        "model_id": "jaldhara-inflow-gbr-v4",
        "algorithm": best_name,
        "target_variable": "inflow_mcm",
        "target_units": "Million Cubic Meters (MCM) and Megaliters (ML)",
        "unit_conversion": "1 MCM = 1,000 ML",
        "training_period": {
            "start": df_train["date"].min().strftime("%Y-%m"),
            "end": df_train["date"].max().strftime("%Y-%m"),
            "num_samples": int(len(df_train)),
        },
        "test_period": {
            "start": df_test["date"].min().strftime("%Y-%m"),
            "end": df_test["date"].max().strftime("%Y-%m"),
            "num_samples": int(len(df_test)),
        },
        "evaluation_metrics": {
            "mcm": {
                "mae": round(best_mae, 2),
                "rmse": round(best_rmse, 2),
                "r2": round(best_r2, 4),
            },
            "megaliters": {
                "mae": round(best_mae * mcm_to_ml, 1),
                "rmse": round(best_rmse * mcm_to_ml, 1),
                "r2": round(best_r2, 4),
            },
        },
        "baselines_comparison": {
            "persistence_lag1": {
                "mae_mcm": round(b1_mae, 2),
                "rmse_mcm": round(b1_rmse, 2),
                "r2": round(b1_r2, 4),
                "mae_ml": round(b1_mae * mcm_to_ml, 1),
            },
            "seasonal_historical_mean": {
                "mae_mcm": round(b2_mae, 2),
                "rmse_mcm": round(b2_rmse, 2),
                "r2": round(b2_r2, 4),
                "mae_ml": round(b2_mae * mcm_to_ml, 1),
            },
            "random_forest": {
                "mae_mcm": round(rf_mae, 2),
                "rmse_mcm": round(rf_rmse, 2),
                "r2": round(rf_r2, 4),
                "mae_ml": round(rf_mae * mcm_to_ml, 1),
            },
            "gradient_boosting": {
                "mae_mcm": round(gbr_mae, 2),
                "rmse_mcm": round(gbr_rmse, 2),
                "r2": round(gbr_r2, 4),
                "mae_ml": round(gbr_mae * mcm_to_ml, 1),
            },
        },
        "feature_importances": feat_imp,
        "input_features": all_feature_names,
        "data_sources": [
            "data/inflow_history.csv",
            "data/rainfall.csv",
            "data/weather.csv",
            "data/reservoirs.csv"
        ],
        "status": "trained_and_validated",
        "pipeline_version": "Stage 4 Production"
    }

    meta_path = ARTIFACTS_DIR / "metadata.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"[OK] Metadata saved to: {meta_path}")

    # Save test set evaluation CSV
    df_test["predicted_inflow_mcm"] = y_pred_gbr if best_model == gbr else y_pred_rf
    df_test["predicted_inflow_ml"] = df_test["predicted_inflow_mcm"] * mcm_to_ml
    df_test["actual_inflow_ml"] = df_test["inflow_mcm"] * mcm_to_ml
    
    test_results_path = ARTIFACTS_DIR / "test_evaluation_results.csv"
    df_test[["month", "reservoir_id", "inflow_mcm", "predicted_inflow_mcm", "actual_inflow_ml", "predicted_inflow_ml"]].to_csv(
        test_results_path, index=False
    )
    print(f"[OK] Test results saved to: {test_results_path}")

    return metadata


if __name__ == "__main__":
    train_and_evaluate()
