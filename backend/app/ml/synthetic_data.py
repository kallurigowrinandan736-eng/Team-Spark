import numpy as np
import pandas as pd
from typing import Tuple

CROP_COEFFICIENTS = {
    "Rice": {"Sowing": 1.05, "Vegetative": 1.15, "Flowering": 1.35, "Maturity": 0.95},
    "Wheat": {"Sowing": 0.40, "Vegetative": 0.80, "Flowering": 1.15, "Maturity": 0.50},
    "Cotton": {"Sowing": 0.45, "Vegetative": 0.85, "Flowering": 1.20, "Maturity": 0.65},
    "Maize": {"Sowing": 0.40, "Vegetative": 0.80, "Flowering": 1.15, "Maturity": 0.60},
    "Sugarcane": {"Sowing": 0.50, "Vegetative": 1.00, "Flowering": 1.25, "Maturity": 0.85},
    "Groundnut": {"Sowing": 0.45, "Vegetative": 0.75, "Flowering": 1.05, "Maturity": 0.55},
    "Vegetables": {"Sowing": 0.50, "Vegetative": 0.85, "Flowering": 1.05, "Maturity": 0.75}
}

def generate_demand_training_data(n_samples: int = 1500, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)
    crops_list = ["Rice", "Wheat", "Cotton", "Maize", "Sugarcane", "Groundnut", "Vegetables"]
    stages_list = ["Sowing", "Vegetative", "Flowering", "Maturity"]
    regions_list = ["reg_1", "reg_2", "reg_3", "reg_4", "reg_5"]
    
    data = []
    for _ in range(n_samples):
        crop = np.random.choice(crops_list)
        stage = np.random.choice(stages_list)
        region = np.random.choice(regions_list)
        area_ha = float(np.random.uniform(20000, 90000))
        temp_c = float(np.random.uniform(20.0, 42.0))
        humidity_pct = float(np.random.uniform(35.0, 85.0))
        rainfall_mm = float(np.random.exponential(40.0))
        soil_moisture_pct = float(np.random.uniform(15.0, 90.0))
        
        # Penman-Monteith ET0 proxy (Hargreaves-Samani / Turc approximation)
        et0_mm_day = max(2.0, (temp_c * 0.22 - humidity_pct * 0.04 + np.random.uniform(0.1, 0.4)))
        kc = CROP_COEFFICIENTS.get(crop, {}).get(stage, 0.85)
        
        # Effective rainfall (USDA SCS method proxy)
        peff_mm = max(0.0, rainfall_mm * 0.75 if rainfall_mm < 75 else rainfall_mm * 0.65 + 7.5)
        
        # Net irrigation requirement: (Kc * ET0 * 30 days - Peff) * (1 - SoilMoisture/150)
        net_irrig_mm = max(10.0, (kc * et0_mm_day * 30.0 - peff_mm) * (1.2 - soil_moisture_pct / 200.0))
        
        # Total Demand in MCM = net_irrig_mm * 10^-3 m * (area_ha * 10^4 m^2) / 10^6 m^3 = net_irrig_mm * area_ha * 10^-5
        demand_mcm = (net_irrig_mm * area_ha * 1e-5) * np.random.uniform(0.92, 1.08)
        demand_mcm = max(5.0, round(float(demand_mcm), 2))
        
        data.append({
            "crop": crop,
            "growth_stage": stage,
            "region_id": region,
            "area_ha": round(area_ha, 0),
            "temperature_c": round(temp_c, 1),
            "humidity_pct": round(humidity_pct, 1),
            "rainfall_mm": round(rainfall_mm, 1),
            "soil_moisture_pct": round(soil_moisture_pct, 1),
            "et0_mm_day": round(et0_mm_day, 2),
            "demand_mcm": demand_mcm
        })
    return pd.DataFrame(data)

def generate_inflow_training_data(n_samples: int = 1200, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)
    reservoirs = ["res_1", "res_2", "res_3", "res_4"]
    data = []
    
    for _ in range(n_samples):
        res_id = np.random.choice(reservoirs)
        month = int(np.random.randint(1, 13))
        rainfall_catchment_mm = float(np.random.exponential(65.0))
        temp_c = float(np.random.uniform(22.0, 40.0))
        prev_storage_mcm = float(np.random.uniform(100.0, 5000.0))
        
        # Seasonal base multiplier
        is_monsoon = 6 <= month <= 9
        season_mult = 3.8 if is_monsoon else (0.45 if 3 <= month <= 5 else 1.1)
        
        res_scale = 1.0 if res_id == "res_1" else (0.9 if res_id == "res_2" else (0.35 if res_id == "res_3" else 0.45))
        
        # Inflow = Catchment Area * Runoff Coefficient * Rainfall
        runoff_coeff = 0.35 if is_monsoon else 0.18
        inflow = (rainfall_catchment_mm * runoff_coeff * res_scale * season_mult * 5.0) + (prev_storage_mcm * 0.02)
        inflow = max(10.0, inflow * np.random.uniform(0.85, 1.15))
        
        data.append({
            "reservoir_id": res_id,
            "month": month,
            "rainfall_catchment_mm": round(rainfall_catchment_mm, 1),
            "temperature_c": round(temp_c, 1),
            "prev_storage_mcm": round(prev_storage_mcm, 1),
            "inflow_mcm": round(float(inflow), 1)
        })
    return pd.DataFrame(data)
