import os
import csv
import json
import math
import numpy as np

os.makedirs('data', exist_ok=True)
np.random.seed(42)

# 1. Reservoirs
reservoirs = [
    {
        "id": "res_1",
        "name": "Nagarjuna Sagar Reservoir",
        "lat": 16.5775,
        "lng": 79.3142,
        "max_capacity_mcm": 6500.0,
        "current_storage_mcm": 4680.0,
        "min_reserve_mcm": 1200.0,
        "expected_inflow_mcm": 620.0,
        "expected_outflow_mcm": 450.0,
        "current_level_m": 175.5,
        "max_level_m": 179.8,
        "status": "Optimal"
    },
    {
        "id": "res_2",
        "name": "Srisailam Reservoir",
        "lat": 16.0863,
        "lng": 78.8996,
        "max_capacity_mcm": 6100.0,
        "current_storage_mcm": 4120.0,
        "min_reserve_mcm": 1000.0,
        "expected_inflow_mcm": 580.0,
        "expected_outflow_mcm": 410.0,
        "current_level_m": 265.2,
        "max_level_m": 270.0,
        "status": "Optimal"
    },
    {
        "id": "res_3",
        "name": "Pulichintala Project",
        "lat": 16.7570,
        "lng": 80.0540,
        "max_capacity_mcm": 1280.0,
        "current_storage_mcm": 890.0,
        "min_reserve_mcm": 250.0,
        "expected_inflow_mcm": 210.0,
        "expected_outflow_mcm": 180.0,
        "current_level_m": 51.8,
        "max_level_m": 53.3,
        "status": "Normal"
    },
    {
        "id": "res_4",
        "name": "Prakasam Barrage (Krishna Delta)",
        "lat": 16.5097,
        "lng": 80.6053,
        "max_capacity_mcm": 87.0,
        "current_storage_mcm": 72.0,
        "min_reserve_mcm": 20.0,
        "expected_inflow_mcm": 340.0,
        "expected_outflow_mcm": 310.0,
        "current_level_m": 17.4,
        "max_level_m": 17.5,
        "status": "Normal"
    }
]

# 2. Regions
regions = [
    {
        "id": "reg_1",
        "name": "Guntur",
        "lat": 16.3067,
        "lng": 80.4365,
        "priority": 5,
        "total_irrigated_area_ha": 185000,
        "active_farmers": 62000,
        "soil_type": "Black Cotton",
        "groundwater_depth_m": 8.5
    },
    {
        "id": "reg_2",
        "name": "Vijayawada",
        "lat": 16.5062,
        "lng": 80.6480,
        "priority": 4,
        "total_irrigated_area_ha": 120000,
        "active_farmers": 41000,
        "soil_type": "Alluvial",
        "groundwater_depth_m": 5.2
    },
    {
        "id": "reg_3",
        "name": "Krishna Delta",
        "lat": 16.1800,
        "lng": 81.1300,
        "priority": 5,
        "total_irrigated_area_ha": 210000,
        "active_farmers": 78000,
        "soil_type": "Coastal Alluvial Clay",
        "groundwater_depth_m": 4.1
    },
    {
        "id": "reg_4",
        "name": "Prakasam",
        "lat": 15.5057,
        "lng": 80.0499,
        "priority": 3,
        "total_irrigated_area_ha": 145000,
        "active_farmers": 49000,
        "soil_type": "Red Sandy Loam",
        "groundwater_depth_m": 12.8
    },
    {
        "id": "reg_5",
        "name": "Palnadu",
        "lat": 16.3400,
        "lng": 79.9800,
        "priority": 4,
        "total_irrigated_area_ha": 160000,
        "active_farmers": 54000,
        "soil_type": "Black Loam",
        "groundwater_depth_m": 10.4
    }
]

# 3. Canals
canals = [
    {
        "id": "can_1",
        "name": "Nagarjuna Right Main Canal",
        "source_reservoir_id": "res_1",
        "destination_region_id": "reg_1",
        "capacity_mcm": 350.0,
        "current_flow_mcm": 240.0,
        "loss_pct": 0.12,
        "efficiency": 0.88,
        "status": "Normal",
        "path": [[16.5775, 79.3142], [16.4800, 79.8500], [16.3067, 80.4365]]
    },
    {
        "id": "can_2",
        "name": "Nagarjuna Left Main Canal",
        "source_reservoir_id": "res_1",
        "destination_region_id": "reg_2",
        "capacity_mcm": 310.0,
        "current_flow_mcm": 210.0,
        "loss_pct": 0.14,
        "efficiency": 0.86,
        "status": "Normal",
        "path": [[16.5775, 79.3142], [16.7000, 79.9500], [16.5062, 80.6480]]
    },
    {
        "id": "can_3",
        "name": "Srisailam Right Branch Canal (SRBC)",
        "source_reservoir_id": "res_2",
        "destination_region_id": "reg_4",
        "capacity_mcm": 280.0,
        "current_flow_mcm": 180.0,
        "loss_pct": 0.15,
        "efficiency": 0.85,
        "status": "Normal",
        "path": [[16.0863, 78.8996], [15.8200, 79.4500], [15.5057, 80.0499]]
    },
    {
        "id": "can_4",
        "name": "Palnadu Feeder Canal",
        "source_reservoir_id": "res_1",
        "destination_region_id": "reg_5",
        "capacity_mcm": 220.0,
        "current_flow_mcm": 150.0,
        "loss_pct": 0.11,
        "efficiency": 0.89,
        "status": "Normal",
        "path": [[16.5775, 79.3142], [16.4200, 79.6800], [16.3400, 79.9800]]
    },
    {
        "id": "can_5",
        "name": "Pulichintala Link Canal",
        "source_reservoir_id": "res_3",
        "destination_region_id": "reg_1",
        "capacity_mcm": 190.0,
        "current_flow_mcm": 130.0,
        "loss_pct": 0.09,
        "efficiency": 0.91,
        "status": "Normal",
        "path": [[16.7570, 80.0540], [16.5500, 80.2500], [16.3067, 80.4365]]
    },
    {
        "id": "can_6",
        "name": "Krishna Main Delta High-Level Canal",
        "source_reservoir_id": "res_4",
        "destination_region_id": "reg_3",
        "capacity_mcm": 420.0,
        "current_flow_mcm": 310.0,
        "loss_pct": 0.08,
        "efficiency": 0.92,
        "status": "Normal",
        "path": [[16.5097, 80.6053], [16.3200, 80.8900], [16.1800, 81.1300]]
    },
    {
        "id": "can_7",
        "name": "Distributary 1 - Guntur East",
        "source_reservoir_id": "res_4",
        "destination_region_id": "reg_1",
        "capacity_mcm": 140.0,
        "current_flow_mcm": 95.0,
        "loss_pct": 0.10,
        "efficiency": 0.90,
        "status": "Normal",
        "path": [[16.5097, 80.6053], [16.4100, 80.5200], [16.3067, 80.4365]]
    },
    {
        "id": "can_8",
        "name": "Distributary 2 - Palnadu South",
        "source_reservoir_id": "res_2",
        "destination_region_id": "reg_5",
        "capacity_mcm": 160.0,
        "current_flow_mcm": 110.0,
        "loss_pct": 0.13,
        "efficiency": 0.87,
        "status": "Normal",
        "path": [[16.0863, 78.8996], [16.2100, 79.5200], [16.3400, 79.9800]]
    }
]

# 4. Crops (7 crop types distributed across 5 regions)
crops = [
    {
        "id": "crop_1",
        "crop": "Rice",
        "region_id": "reg_3",
        "area_ha": 85000,
        "growth_stage": "Flowering",
        "base_water_requirement_mm": 1200,
        "total_demand_mcm": 320.0,
        "priority": 5,
        "current_allocation_mcm": 275.0,
        "deficit_mcm": 45.0,
        "season": "Kharif"
    },
    {
        "id": "crop_2",
        "crop": "Rice",
        "region_id": "reg_1",
        "area_ha": 72000,
        "growth_stage": "Vegetative",
        "base_water_requirement_mm": 1150,
        "total_demand_mcm": 260.0,
        "priority": 5,
        "current_allocation_mcm": 220.0,
        "deficit_mcm": 40.0,
        "season": "Kharif"
    },
    {
        "id": "crop_3",
        "crop": "Cotton",
        "region_id": "reg_5",
        "area_ha": 64000,
        "growth_stage": "Vegetative",
        "base_water_requirement_mm": 700,
        "total_demand_mcm": 155.0,
        "priority": 4,
        "current_allocation_mcm": 135.0,
        "deficit_mcm": 20.0,
        "season": "Kharif"
    },
    {
        "id": "crop_4",
        "crop": "Maize",
        "region_id": "reg_2",
        "area_ha": 45000,
        "growth_stage": "Sowing",
        "base_water_requirement_mm": 550,
        "total_demand_mcm": 90.0,
        "priority": 3,
        "current_allocation_mcm": 80.0,
        "deficit_mcm": 10.0,
        "season": "Rabi"
    },
    {
        "id": "crop_5",
        "crop": "Sugarcane",
        "region_id": "reg_1",
        "area_ha": 38000,
        "growth_stage": "Maturity",
        "base_water_requirement_mm": 1500,
        "total_demand_mcm": 190.0,
        "priority": 4,
        "current_allocation_mcm": 155.0,
        "deficit_mcm": 35.0,
        "season": "Perennial"
    },
    {
        "id": "crop_6",
        "crop": "Groundnut",
        "region_id": "reg_4",
        "area_ha": 52000,
        "growth_stage": "Vegetative",
        "base_water_requirement_mm": 500,
        "total_demand_mcm": 95.0,
        "priority": 3,
        "current_allocation_mcm": 75.0,
        "deficit_mcm": 20.0,
        "season": "Rabi"
    },
    {
        "id": "crop_7",
        "crop": "Vegetables",
        "region_id": "reg_2",
        "area_ha": 28000,
        "growth_stage": "Flowering",
        "base_water_requirement_mm": 450,
        "total_demand_mcm": 60.0,
        "priority": 4,
        "current_allocation_mcm": 55.0,
        "deficit_mcm": 5.0,
        "season": "Zaid"
    },
    {
        "id": "crop_8",
        "crop": "Wheat",
        "region_id": "reg_4",
        "area_ha": 32000,
        "growth_stage": "Sowing",
        "base_water_requirement_mm": 450,
        "total_demand_mcm": 55.0,
        "priority": 2,
        "current_allocation_mcm": 40.0,
        "deficit_mcm": 15.0,
        "season": "Rabi"
    },
    {
        "id": "crop_9",
        "crop": "Cotton",
        "region_id": "reg_1",
        "area_ha": 41000,
        "growth_stage": "Flowering",
        "base_water_requirement_mm": 720,
        "total_demand_mcm": 110.0,
        "priority": 4,
        "current_allocation_mcm": 95.0,
        "deficit_mcm": 15.0,
        "season": "Kharif"
    },
    {
        "id": "crop_10",
        "crop": "Vegetables",
        "region_id": "reg_3",
        "area_ha": 31000,
        "growth_stage": "Vegetative",
        "base_water_requirement_mm": 420,
        "total_demand_mcm": 50.0,
        "priority": 4,
        "current_allocation_mcm": 45.0,
        "deficit_mcm": 5.0,
        "season": "Zaid"
    }
]

# Write CSV helpers
def save_csv(filename, data_list):
    if not data_list:
        return
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        # If any field is list/dict, convert to JSON string
        clean_rows = []
        keys = list(data_list[0].keys())
        for item in data_list:
            row = {}
            for k, v in item.items():
                if isinstance(v, (list, dict)):
                    row[k] = json.dumps(v)
                else:
                    row[k] = v
            clean_rows.append(row)
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(clean_rows)

save_csv('data/reservoirs.csv', reservoirs)
save_csv('data/regions.csv', regions)
save_csv('data/canals.csv', canals)
save_csv('data/crops.csv', crops)

# 5. 36-Month Historical Weather, Rainfall, Inflow, and Demand Timeseries
months = []
weather = []
rainfall = []
inflow_history = []
demand_history = []

years = [2023, 2024, 2025]
month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

for y in years:
    for m_idx, m_name in enumerate(month_names, 1):
        month_str = f"{y}-{m_idx:02d}"
        
        # Indian seasonal profile
        # Jun-Sep = Monsoon (high rain, high inflow, moderate temp, high humidity)
        # Oct-Jan = Post-monsoon / Rabi (moderate rain/inflow, cooler, high crop demand)
        # Feb-May = Summer (high temp, low humidity, low rain, high ET demand)
        is_monsoon = 6 <= m_idx <= 9
        is_summer = 3 <= m_idx <= 5
        
        if is_monsoon:
            base_temp = 29.0 + np.random.uniform(-1.5, 2.0)
            base_humidity = 78.0 + np.random.uniform(-5.0, 10.0)
            base_rain = 180.0 + np.sin((m_idx - 5) * math.pi / 4) * 140.0 + np.random.uniform(-30, 40)
            base_inflow_mult = 3.5 + np.random.uniform(-0.5, 0.8)
        elif is_summer:
            base_temp = 36.5 + np.random.uniform(-1.0, 3.5)
            base_humidity = 45.0 + np.random.uniform(-6.0, 8.0)
            base_rain = 15.0 + np.random.uniform(-8.0, 20.0)
            base_inflow_mult = 0.4 + np.random.uniform(-0.1, 0.2)
        else:
            base_temp = 25.5 + np.random.uniform(-2.0, 2.0)
            base_humidity = 62.0 + np.random.uniform(-5.0, 8.0)
            base_rain = 35.0 + np.random.uniform(-10.0, 25.0)
            base_inflow_mult = 1.0 + np.random.uniform(-0.2, 0.3)
        
        base_rain = max(2.0, base_rain)
        soil_moisture = min(95.0, max(15.0, (base_humidity * 0.4 + base_rain * 0.2 + np.random.uniform(-5, 5))))
        evapotranspiration = max(2.5, (base_temp * 0.22 - base_humidity * 0.04 + np.random.uniform(0.1, 0.5)))
        
        weather.append({
            "month": month_str,
            "avg_temperature_c": round(base_temp, 1),
            "avg_humidity_pct": round(base_humidity, 1),
            "evapotranspiration_mm_day": round(evapotranspiration, 2),
            "avg_soil_moisture_pct": round(soil_moisture, 1)
        })
        
        for reg in regions:
            reg_rain = max(0.0, base_rain * (1.0 + (reg["priority"] - 3) * 0.05 + np.random.uniform(-0.15, 0.15)))
            rainfall.append({
                "month": month_str,
                "region_id": reg["id"],
                "rainfall_mm": round(reg_rain, 1),
                "anomaly_pct": round((reg_rain - 95.0) / 95.0 * 100, 1)
            })
            
        for res in reservoirs:
            res_inflow = max(10.0, (res["expected_inflow_mcm"] * 0.3) * base_inflow_mult + np.random.uniform(-25, 30))
            inflow_history.append({
                "month": month_str,
                "reservoir_id": res["id"],
                "inflow_mcm": round(res_inflow, 1),
                "inflow_anomaly_pct": round((res_inflow - res["expected_inflow_mcm"]) / res["expected_inflow_mcm"] * 100, 1)
            })
            
        for crp in crops:
            crop_factor = 1.2 if is_summer else (1.0 if is_monsoon else 0.85)
            crp_demand = max(5.0, crp["total_demand_mcm"] * crop_factor * (1.0 - (base_rain / 500.0)) + np.random.uniform(-8, 10))
            demand_history.append({
                "month": month_str,
                "crop_id": crp["id"],
                "region_id": crp["region_id"],
                "demand_mcm": round(crp_demand, 1)
            })

save_csv('data/weather.csv', weather)
save_csv('data/rainfall.csv', rainfall)
save_csv('data/inflow_history.csv', inflow_history)
save_csv('data/water_demand_history.csv', demand_history)

print("Generated all demo CSV datasets successfully in data/ directory.")
