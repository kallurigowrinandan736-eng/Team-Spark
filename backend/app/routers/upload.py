import io
import json
import logging
import pandas as pd
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Dict, Any, List
from app.data_loader import data_store
from app.schemas import Reservoir, Canal, Region, Crop

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/upload", tags=["Data Upload & Ingestion"])

REQUIRED_COLUMNS = {
    "reservoirs": ["id", "name", "lat", "lng", "max_capacity_mcm", "current_storage_mcm", "min_reserve_mcm"],
    "canals": ["id", "name", "source_reservoir_id", "destination_region_id", "capacity_mcm", "loss_pct"],
    "crops": ["id", "crop", "region_id", "area_ha", "total_demand_mcm", "priority"],
    "regions": ["id", "name", "lat", "lng", "priority"]
}

@router.post("/csv")
async def upload_csv_file(
    file: UploadFile = File(...),
    dataset_type: str = Form(...)
):
    if dataset_type not in REQUIRED_COLUMNS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported dataset type '{dataset_type}'. Allowed types: {list(REQUIRED_COLUMNS.keys())}"
        )

    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")

    # Schema Validation
    required_cols = REQUIRED_COLUMNS[dataset_type]
    missing_cols = [col for col in required_cols if col not in df.columns]
    if missing_cols:
        return {
            "status": "error",
            "message": f"CSV is missing required columns: {missing_cols}",
            "valid_rows_count": 0,
            "errors": [f"Missing required header: {c}" for c in missing_cols]
        }

    # Missing values imputation
    null_count = int(df.isnull().sum().sum())
    warnings = []
    if null_count > 0:
        for col in df.columns:
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].fillna(df[col].median())
            else:
                df[col] = df[col].ffill().bfill().fillna("Unknown")
        warnings.append(f"Auto-imputed {null_count} missing values using median/forward-fill.")

    row_errors = []
    valid_records = []
    records = df.to_dict(orient="records")

    for idx, row in enumerate(records, start=1):
        try:
            if dataset_type == "reservoirs":
                # ensure default values for extra fields
                row.setdefault("expected_inflow_mcm", 250.0)
                row.setdefault("expected_outflow_mcm", 200.0)
                row.setdefault("current_level_m", 150.0)
                row.setdefault("max_level_m", 160.0)
                row.setdefault("status", "Normal")
                valid_records.append(Reservoir(**row))
            elif dataset_type == "canals":
                row.setdefault("current_flow_mcm", row["capacity_mcm"] * 0.7)
                row.setdefault("efficiency", round(1.0 - row["loss_pct"], 2))
                row.setdefault("status", "Normal")
                if isinstance(row.get("path"), str):
                    try:
                        row["path"] = json.loads(row["path"])
                    except Exception:
                        row["path"] = []
                valid_records.append(Canal(**row))
            elif dataset_type == "crops":
                row.setdefault("growth_stage", "Vegetative")
                row.setdefault("base_water_requirement_mm", 600.0)
                row.setdefault("current_allocation_mcm", row["total_demand_mcm"] * 0.8)
                row.setdefault("deficit_mcm", row["total_demand_mcm"] * 0.2)
                row.setdefault("season", "Kharif")
                valid_records.append(Crop(**row))
            elif dataset_type == "regions":
                row.setdefault("total_irrigated_area_ha", 100000.0)
                row.setdefault("active_farmers", 35000)
                row.setdefault("soil_type", "Loam")
                row.setdefault("groundwater_depth_m", 8.0)
                valid_records.append(Region(**row))
        except Exception as err:
            row_errors.append(f"Row {idx} validation failed: {str(err)}")

    if valid_records and len(row_errors) < len(records):
        # Update live data store
        if dataset_type == "reservoirs":
            data_store.reservoirs = valid_records
        elif dataset_type == "canals":
            data_store.canals = valid_records
        elif dataset_type == "crops":
            data_store.crops = valid_records
        elif dataset_type == "regions":
            data_store.regions = valid_records

    return {
        "status": "success" if not row_errors else "partial_success",
        "dataset_type": dataset_type,
        "total_rows": len(records),
        "valid_rows_count": len(valid_records),
        "warnings": warnings,
        "errors": row_errors[:10],
        "preview": [r.dict() if hasattr(r, 'dict') else r for r in valid_records[:5]]
    }
