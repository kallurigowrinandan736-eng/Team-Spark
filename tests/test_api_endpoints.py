"""
FastAPI HTTP Endpoint Verification Suite for Stage 4 ML Pipeline
Tests:
- GET /api/predictions/inflow/metadata
- POST /api/predictions/inflow (valid input)
- POST /api/predictions/inflow (invalid input)
- GET /api/predictions/inflow/history
- GET /api/predictions/inflow (multi-reservoir forecast)
- POST /api/pipeline/run (ML connected to Water Allocation Optimizer)
"""

import sys
from pathlib import Path
from fastapi.testclient import TestClient

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR / "backend"))

from app.main import app

client = TestClient(app)


def test_metadata_endpoint():
    res = client.get("/api/predictions/inflow/metadata")
    assert res.status_code == 200, f"Failed with {res.status_code}: {res.text}"
    data = res.json()
    assert "evaluation_metrics" in data
    assert data["algorithm"] == "Random Forest Regressor"
    assert data["evaluation_metrics"]["mcm"]["mae"] <= 40.0
    print("[PASS] GET /api/predictions/inflow/metadata: Model metrics validated.")


def test_post_inflow_valid():
    payload = {
        "reservoir_id": "res_1",
        "prediction_period": "2026-07",
        "rainfall_anomaly_pct": 10.0,
        "rainfall_factor": 1.1,
        "inflow_factor": 1.0
    }
    res = client.post("/api/predictions/inflow", json=payload)
    assert res.status_code == 200, f"Failed with {res.status_code}: {res.text}"
    data = res.json()
    assert data["reservoir_id"] == "res_1"
    assert data["prediction_period"] == "2026-07"
    assert data["predicted_inflow_mcm"] > 0.0
    assert data["predicted_inflow_ml"] > 0.0
    assert data["status"] == "valid_prediction"
    print(f"[PASS] POST /api/predictions/inflow: Predicted {data['predicted_inflow_ml']} ML ({data['predicted_inflow_mcm']} MCM).")


def test_post_inflow_invalid_reservoir():
    payload = {
        "reservoir_id": "res_invalid_999",
        "prediction_period": "2026-07"
    }
    res = client.post("/api/predictions/inflow", json=payload)
    assert res.status_code == 400
    print("[PASS] POST /api/predictions/inflow: Properly rejected invalid reservoir_id with HTTP 400.")


def test_get_inflow_history_endpoint():
    res = client.get("/api/predictions/inflow/history?reservoir_id=res_1")
    assert res.status_code == 200
    data = res.json()
    assert len(data["history"]) == 36
    assert len(data["test_eval"]) == 12
    assert "rainfall_mm" in data["history"][0]
    print(f"[PASS] GET /api/predictions/inflow/history: Returned 36 history + 12 test points with rainfall.")


def test_get_multi_reservoir_forecast():
    res = client.get("/api/predictions/inflow?horizon_days=30&current_month=8")
    assert res.status_code == 200
    data = res.json()
    assert len(data["forecasts"]) >= 4
    assert data["label"] == "Trained Random Forest Regressor (Stage 4)"
    print("[PASS] GET /api/predictions/inflow: Stage 4 model generated multi-reservoir forecast.")


def test_pipeline_run_endpoint():
    res = client.post("/api/pipeline/run", json={})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["comparison"]["classical"]["metrics"]["demand_satisfaction_pct"] > 0
    print("[PASS] POST /api/pipeline/run: Full optimization pipeline completed with Stage 4 ML.")


if __name__ == "__main__":
    print("=" * 60)
    print("Running FastAPI HTTP Endpoint Test Suite")
    print("=" * 60)
    test_metadata_endpoint()
    test_post_inflow_valid()
    test_post_inflow_invalid_reservoir()
    test_get_inflow_history_endpoint()
    test_get_multi_reservoir_forecast()
    test_pipeline_run_endpoint()
    print("\n" + "=" * 60)
    print("ALL HTTP ENDPOINT TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)
