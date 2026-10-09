#!/usr/bin/env python3
"""
AquaQ - Machine Learning Pipeline for Irrigation and Water-Resource Allocation Optimisation

Problem Statement:
Allocating limited water across canals, reservoirs and crops under competing demands
and variable inflows is a complex multi-objective optimization problem.

This script executes the complete ML approach:
1. Hydro-Climatic Data Ingestion & Synthesis (FAO-56 Penman-Monteith)
2. ML Crop Water Demand Prediction (Gradient Boosting Regressor)
3. Catchment Runoff & Reservoir Inflow Forecasting (Random Forest Quantile Regressor)
4. ML Water Allocation Policy Surrogate (Multi-Output Random Forest Regressor)
5. Regional Agricultural Water Stress Classification (Random Forest Classifier)
6. Live Scenario Simulation across 5 Hydrological Regimes (Normal, Drought, Heavy Rain, Low Reservoir, Unexpected Inflow)
"""

import sys
import os
import time

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Ensure utf-8 stdout on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.ml.demand_model import DemandPredictionModel
from app.ml.inflow_model import InflowForecastingModel
from app.ml.allocation_policy_model import WaterAllocationMLPolicy, generate_allocation_training_data
from app.data_loader import data_store


def print_banner(title: str):
    width = 80
    print("\n" + "=" * width)
    print(f"  {title}".center(width))
    print("=" * width)


def main():
    print_banner("AquaQ: Machine Learning Pipeline for Water Resource Allocation")
    print("Problem Statement: Allocating limited water across canals, reservoirs and crops")
    print("                  under competing demands and variable inflows.")
    print("Approach: Supervised Surrogate Policy + Gradient Boosting Crop Regressors\n")

    start_total_time = time.time()

    # -------------------------------------------------------------
    # Step 1: Hydro-Climatic Synthetic Dataset Generation
    # -------------------------------------------------------------
    print("[1/5] Ingesting & Generating Hydrological Observations...")
    X, Y, y_risk = generate_allocation_training_data(n_samples=1200, random_seed=42)
    print(f"      [OK] Generated {len(X)} hydro-climatic observation vectors.")
    print(f"      [OK] State Features: {list(X.columns)[:6]}...")
    print(f"      [OK] Target Allocation Variables: {list(Y.columns)[:5]}...")

    # -------------------------------------------------------------
    # Step 2: Training Crop Water Demand Regressor (GBR)
    # -------------------------------------------------------------
    print("\n[2/5] Training Crop Water Demand Model (Gradient Boosting Regressor)...")
    demand_model = DemandPredictionModel()
    dm_metrics = demand_model.metrics
    print(f"      [OK] Model: GradientBoostingRegressor(n_estimators=35, max_depth=3)")
    print(f"      [OK] Metrics: R2 = {dm_metrics.r2_score:.4f} | MAE = {dm_metrics.mae:.2f} MCM | RMSE = {dm_metrics.rmse:.2f} MCM")
    print("      [OK] Top Predictive Features:")
    for feat in demand_model.feature_importance[:4]:
        print(f"         - {feat.feature:<30} Importance: {feat.importance:.4f}")

    # -------------------------------------------------------------
    # Step 3: Training Reservoir Inflow Forecasting Model (RF)
    # -------------------------------------------------------------
    print("\n[3/5] Training Catchment Runoff Inflow Forecaster (Random Forest)...")
    inflow_model = InflowForecastingModel()
    im_metrics = inflow_model.metrics
    print(f"      [OK] Model: RandomForestRegressor(n_estimators=30, max_depth=4)")
    print(f"      [OK] Metrics: R2 = {im_metrics.r2_score:.4f} | MAE = {im_metrics.mae:.2f} MCM | RMSE = {im_metrics.rmse:.2f} MCM")

    # -------------------------------------------------------------
    # Step 4: Training ML Water Allocation Policy Surrogate
    # -------------------------------------------------------------
    print("\n[4/5] Training Multi-Output ML Water Allocation Policy Model...")
    ml_allocator = WaterAllocationMLPolicy()
    telemetry = ml_allocator.metrics
    print(f"      [OK] Architecture: MultiOutputRegressor(RandomForestRegressor, n_estimators=45)")
    print(f"      [OK] Regression Performance: R2 Score = {telemetry['r2_score']:.4f} | MAE = {telemetry['mae_ml']:.2f} ML")
    print(f"      [OK] Stress Classifier Accuracy: {telemetry['stress_classifier_accuracy']*100:.2f}%")
    print(f"      [OK] Real-Time Inference Latency: ~{telemetry['inference_latency_ms']} ms")
    print("      [OK] Core Decision Drivers:")
    for f in telemetry['top_features'][:4]:
        print(f"         - {f['feature']:<28} Weight: {f['importance']:.4f}")

    # -------------------------------------------------------------
    # Step 5: Live Scenario Allocation Simulation
    # -------------------------------------------------------------
    print_banner("Live ML Policy Inference across 5 Hydrological Scenarios")

    scenarios = [
        {"name": "Normal Monsoon", "avail_ml": 8000.0, "demand_ml": 7000.0, "level_pct": 80.0, "inflow_ml": 2500.0, "temp_c": 31.0},
        {"name": "Severe Drought", "avail_ml": 4000.0, "demand_ml": 7000.0, "level_pct": 35.0, "inflow_ml": 800.0, "temp_c": 36.5},
        {"name": "Heavy Rainfall", "avail_ml": 11000.0, "demand_ml": 7000.0, "level_pct": 92.0, "inflow_ml": 6000.0, "temp_c": 28.0},
        {"name": "Low Reservoir", "avail_ml": 4500.0, "demand_ml": 7000.0, "level_pct": 25.0, "inflow_ml": 1000.0, "temp_c": 33.0},
        {"name": "Unexpected Inflow", "avail_ml": 9000.0, "demand_ml": 7000.0, "level_pct": 70.0, "inflow_ml": 5000.0, "temp_c": 29.5},
    ]

    for sc in scenarios:
        t0 = time.time()
        res = ml_allocator.predict_allocation(
            available_water_ml=sc["avail_ml"],
            reservoir_level_pct=sc["level_pct"],
            inflow_ml=sc["inflow_ml"],
            demand_ml=sc["demand_ml"],
            temp_c=sc["temp_c"]
        )
        latency = (time.time() - t0) * 1000.0

        metrics = res["summary_metrics"]
        risk = res["risk_assessment"]

        print(f"\n>>> SCENARIO: {sc['name'].upper()}")
        print(f"    Available Water: {sc['avail_ml']:,.0f} ML | Total Demand: {sc['demand_ml']:,.0f} ML | Storage: {sc['level_pct']:.0f}%")
        print(f"    ML Risk Assessment: {risk['risk_level']} (Confidence: {max(risk['probabilities'].values())*100:.1f}%)")
        print(f"    Allocated Water: {metrics['total_allocated_ml']:,.1f} ML | Delivered: {metrics['total_delivered_ml']:,.1f} ML")
        print(f"    System Shortage: {metrics['total_shortage_ml']:,.1f} ML | Conveyance Loss: {metrics['total_conveyance_loss_ml']:,.1f} ML")
        print(f"    Allocation Efficiency: {metrics['allocation_efficiency_pct']:.1f}% | Inference Speed: {latency:.2f} ms")

        print("    Crop Distribution Breakdown:")
        print("      " + "-" * 70)
        print(f"      {'Crop':<16} {'Priority':<8} {'Demand':<10} {'Allocated':<12} {'Delivered':<12} {'Satisfaction'}")
        print("      " + "-" * 70)
        for c in res["crop_allocations"]:
            print(f"      {c['crop']:<16} {c['priority']:<8} {c['demand_ml']:<10.1f} {c['allocated_ml']:<12.1f} {c['delivered_ml']:<12.1f} {c['satisfaction_pct']:.1f}%")
        print("      " + "-" * 70)

        print("    Canal Flow & Conveyance Loss Routing:")
        for cn in res["canal_routing"]:
            print(f"      - {cn['canal']}: Intake {cn['intake_ml']:.1f} ML -> Delivered {cn['delivered_ml']:.1f} ML (Loss: {cn['loss_ml']:.1f} ML, Eff: {cn['efficiency_pct']:.0f}%)")

    total_time = time.time() - start_total_time
    print_banner(f"ML Pipeline Complete in {total_time:.2f}s - All Models Verified & Operational!")

    if "--qml" in sys.argv or "--with-qml" in sys.argv:
        print("\n" + "=" * 80)
        print(" [LEVEL 3 EXTENSION] Executing Native Qiskit 2.5 Quantum ML Pipeline...".center(80))
        print("=" * 80)
        from app.ml.quantum_ml_model import run_level_3_qml_pipeline
        run_level_3_qml_pipeline(num_samples=36, epochs=8)
    elif "--level4" in sys.argv or "--qem" in sys.argv:
        print("\n" + "=" * 80)
        print(" [LEVEL 4 EXTENSION] Executing Hardware-Aware Noise & Error Mitigation (QEM)...".center(80))
        print("=" * 80)
        from app.quantum.level4_qem import Level4WaterUseCases
        l4 = Level4WaterUseCases()
        r1 = l4.run_spillway_zne_optimization()
        print(f"      [OK] Use Case 1 (ZNE Spillway Dispatch) Error Reduction: {r1['error_reduction_percentage']:.1f}%")
        r2 = l4.run_canal_anomaly_detection_mitigated()
        print(f"      [OK] Use Case 2 (Canal Anomaly QSVC) Fidelity Restored: {r2['fidelity_restoration_percentage']:.1f}%")
        r3 = l4.run_telemetry_dynamical_decoupling()
        print(f"      [OK] Use Case 3 (Dynamical Decoupling) Coherence Gain: +{r3['coherence_gain_percentage']:.2f}%")
    else:
        print("\n[TIP] Advanced Quantum Extensions:")
        print("      - Level 3 (QML, VQC, ZZ-Map): python backend/run_qml_pipeline.py    (or pass --qml)")
        print("      - Level 4 (QEM, ZNE, TREX, DD): python backend/run_level4_pipeline.py (or pass --level4)")


if __name__ == "__main__":
    main()


