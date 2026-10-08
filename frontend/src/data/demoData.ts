import { Reservoir, Canal, Region, Crop, ScenarioDefinition } from "../lib/types";

export const DEMO_RESERVOIRS: Reservoir[] = [
  {
    id: "res_1",
    name: "Nagarjuna Sagar Reservoir",
    lat: 16.5775,
    lng: 79.3142,
    max_capacity_mcm: 6500.0,
    current_storage_mcm: 4680.0,
    min_reserve_mcm: 1200.0,
    expected_inflow_mcm: 620.0,
    expected_outflow_mcm: 450.0,
    current_level_m: 175.5,
    max_level_m: 179.8,
    status: "Optimal"
  },
  {
    id: "res_2",
    name: "Srisailam Reservoir",
    lat: 16.0863,
    lng: 78.8996,
    max_capacity_mcm: 6100.0,
    current_storage_mcm: 4120.0,
    min_reserve_mcm: 1000.0,
    expected_inflow_mcm: 580.0,
    expected_outflow_mcm: 410.0,
    current_level_m: 265.2,
    max_level_m: 270.0,
    status: "Optimal"
  },
  {
    id: "res_3",
    name: "Pulichintala Project",
    lat: 16.7570,
    lng: 80.0540,
    max_capacity_mcm: 1280.0,
    current_storage_mcm: 890.0,
    min_reserve_mcm: 250.0,
    expected_inflow_mcm: 210.0,
    expected_outflow_mcm: 180.0,
    current_level_m: 51.8,
    max_level_m: 53.3,
    status: "Normal"
  },
  {
    id: "res_4",
    name: "Prakasam Barrage (Krishna Delta)",
    lat: 16.5097,
    lng: 80.6053,
    max_capacity_mcm: 87.0,
    current_storage_mcm: 72.0,
    min_reserve_mcm: 20.0,
    expected_inflow_mcm: 340.0,
    expected_outflow_mcm: 310.0,
    current_level_m: 17.4,
    max_level_m: 17.5,
    status: "Normal"
  }
];

export const DEMO_REGIONS: Region[] = [
  {
    id: "reg_1",
    name: "Guntur",
    lat: 16.3067,
    lng: 80.4365,
    priority: 5,
    total_irrigated_area_ha: 185000,
    active_farmers: 62000,
    soil_type: "Black Cotton",
    groundwater_depth_m: 8.5
  },
  {
    id: "reg_2",
    name: "Vijayawada",
    lat: 16.5062,
    lng: 80.6480,
    priority: 4,
    total_irrigated_area_ha: 120000,
    active_farmers: 41000,
    soil_type: "Alluvial",
    groundwater_depth_m: 5.2
  },
  {
    id: "reg_3",
    name: "Krishna Delta",
    lat: 16.1800,
    lng: 81.1300,
    priority: 5,
    total_irrigated_area_ha: 210000,
    active_farmers: 78000,
    soil_type: "Coastal Alluvial Clay",
    groundwater_depth_m: 4.1
  },
  {
    id: "reg_4",
    name: "Prakasam",
    lat: 15.5057,
    lng: 80.0499,
    priority: 3,
    total_irrigated_area_ha: 145000,
    active_farmers: 49000,
    soil_type: "Red Sandy Loam",
    groundwater_depth_m: 12.8
  },
  {
    id: "reg_5",
    name: "Palnadu",
    lat: 16.3400,
    lng: 79.9800,
    priority: 4,
    total_irrigated_area_ha: 160000,
    active_farmers: 54000,
    soil_type: "Black Loam",
    groundwater_depth_m: 10.4
  }
];

export const DEMO_CANALS: Canal[] = [
  {
    id: "can_1",
    name: "Nagarjuna Right Main Canal",
    source_reservoir_id: "res_1",
    destination_region_id: "reg_1",
    capacity_mcm: 350.0,
    current_flow_mcm: 240.0,
    loss_pct: 0.12,
    efficiency: 0.88,
    status: "Normal",
    path: [[16.5775, 79.3142], [16.4800, 79.8500], [16.3067, 80.4365]]
  },
  {
    id: "can_2",
    name: "Nagarjuna Left Main Canal",
    source_reservoir_id: "res_1",
    destination_region_id: "reg_2",
    capacity_mcm: 310.0,
    current_flow_mcm: 210.0,
    loss_pct: 0.14,
    efficiency: 0.86,
    status: "Normal",
    path: [[16.5775, 79.3142], [16.7000, 79.9500], [16.5062, 80.6480]]
  },
  {
    id: "can_3",
    name: "Srisailam Right Branch Canal (SRBC)",
    source_reservoir_id: "res_2",
    destination_region_id: "reg_4",
    capacity_mcm: 280.0,
    current_flow_mcm: 180.0,
    loss_pct: 0.15,
    efficiency: 0.85,
    status: "Normal",
    path: [[16.0863, 78.8996], [15.8200, 79.4500], [15.5057, 80.0499]]
  },
  {
    id: "can_4",
    name: "Palnadu Feeder Canal",
    source_reservoir_id: "res_1",
    destination_region_id: "reg_5",
    capacity_mcm: 220.0,
    current_flow_mcm: 150.0,
    loss_pct: 0.11,
    efficiency: 0.89,
    status: "Normal",
    path: [[16.5775, 79.3142], [16.4200, 79.6800], [16.3400, 79.9800]]
  },
  {
    id: "can_5",
    name: "Pulichintala Link Canal",
    source_reservoir_id: "res_3",
    destination_region_id: "reg_1",
    capacity_mcm: 190.0,
    current_flow_mcm: 130.0,
    loss_pct: 0.09,
    efficiency: 0.91,
    status: "Normal",
    path: [[16.7570, 80.0540], [16.5500, 80.2500], [16.3067, 80.4365]]
  },
  {
    id: "can_6",
    name: "Krishna Main Delta High-Level Canal",
    source_reservoir_id: "res_4",
    destination_region_id: "reg_3",
    capacity_mcm: 420.0,
    current_flow_mcm: 310.0,
    loss_pct: 0.08,
    efficiency: 0.92,
    status: "Normal",
    path: [[16.5097, 80.6053], [16.3200, 80.8900], [16.1800, 81.1300]]
  },
  {
    id: "can_7",
    name: "Distributary 1 - Guntur East",
    source_reservoir_id: "res_4",
    destination_region_id: "reg_1",
    capacity_mcm: 140.0,
    current_flow_mcm: 95.0,
    loss_pct: 0.10,
    efficiency: 0.90,
    status: "Normal",
    path: [[16.5097, 80.6053], [16.4100, 80.5200], [16.3067, 80.4365]]
  },
  {
    id: "can_8",
    name: "Distributary 2 - Palnadu South",
    source_reservoir_id: "res_2",
    destination_region_id: "reg_5",
    capacity_mcm: 160.0,
    current_flow_mcm: 110.0,
    loss_pct: 0.13,
    efficiency: 0.87,
    status: "Normal",
    path: [[16.0863, 78.8996], [16.2100, 79.5200], [16.3400, 79.9800]]
  }
];

export const DEMO_CROPS: Crop[] = [
  {
    id: "crop_1",
    crop: "Rice",
    region_id: "reg_3",
    area_ha: 85000,
    growth_stage: "Flowering",
    base_water_requirement_mm: 1200,
    total_demand_mcm: 320.0,
    priority: 5,
    current_allocation_mcm: 275.0,
    deficit_mcm: 45.0,
    season: "Kharif"
  },
  {
    id: "crop_2",
    crop: "Rice",
    region_id: "reg_1",
    area_ha: 72000,
    growth_stage: "Vegetative",
    base_water_requirement_mm: 1150,
    total_demand_mcm: 260.0,
    priority: 5,
    current_allocation_mcm: 220.0,
    deficit_mcm: 40.0,
    season: "Kharif"
  },
  {
    id: "crop_3",
    crop: "Cotton",
    region_id: "reg_5",
    area_ha: 64000,
    growth_stage: "Vegetative",
    base_water_requirement_mm: 700,
    total_demand_mcm: 155.0,
    priority: 4,
    current_allocation_mcm: 135.0,
    deficit_mcm: 20.0,
    season: "Kharif"
  },
  {
    id: "crop_4",
    crop: "Maize",
    region_id: "reg_2",
    area_ha: 45000,
    growth_stage: "Sowing",
    base_water_requirement_mm: 550,
    total_demand_mcm: 90.0,
    priority: 3,
    current_allocation_mcm: 80.0,
    deficit_mcm: 10.0,
    season: "Rabi"
  },
  {
    id: "crop_5",
    crop: "Sugarcane",
    region_id: "reg_1",
    area_ha: 38000,
    growth_stage: "Maturity",
    base_water_requirement_mm: 1500,
    total_demand_mcm: 190.0,
    priority: 4,
    current_allocation_mcm: 155.0,
    deficit_mcm: 35.0,
    season: "Perennial"
  },
  {
    id: "crop_6",
    crop: "Groundnut",
    region_id: "reg_4",
    area_ha: 52000,
    growth_stage: "Vegetative",
    base_water_requirement_mm: 500,
    total_demand_mcm: 95.0,
    priority: 3,
    current_allocation_mcm: 75.0,
    deficit_mcm: 20.0,
    season: "Rabi"
  },
  {
    id: "crop_7",
    crop: "Vegetables",
    region_id: "reg_2",
    area_ha: 28000,
    growth_stage: "Flowering",
    base_water_requirement_mm: 450,
    total_demand_mcm: 60.0,
    priority: 4,
    current_allocation_mcm: 55.0,
    deficit_mcm: 5.0,
    season: "Zaid"
  },
  {
    id: "crop_8",
    crop: "Wheat",
    region_id: "reg_4",
    area_ha: 32000,
    growth_stage: "Sowing",
    base_water_requirement_mm: 450,
    total_demand_mcm: 55.0,
    priority: 2,
    current_allocation_mcm: 40.0,
    deficit_mcm: 15.0,
    season: "Rabi"
  },
  {
    id: "crop_9",
    crop: "Cotton",
    region_id: "reg_1",
    area_ha: 41000,
    growth_stage: "Flowering",
    base_water_requirement_mm: 720,
    total_demand_mcm: 110.0,
    priority: 4,
    current_allocation_mcm: 95.0,
    deficit_mcm: 15.0,
    season: "Kharif"
  },
  {
    id: "crop_10",
    crop: "Vegetables",
    region_id: "reg_3",
    area_ha: 31000,
    growth_stage: "Vegetative",
    base_water_requirement_mm: 420,
    total_demand_mcm: 50.0,
    priority: 4,
    current_allocation_mcm: 45.0,
    deficit_mcm: 5.0,
    season: "Zaid"
  }
];

export const DEMO_SCENARIOS: ScenarioDefinition[] = [
  {
    id: "scenario_a",
    name: "Scenario A: Normal Monsoon & Standard Allocation",
    description: "Baseline seasonal conditions with typical rainfall, nominal reservoir storage, and steady crop water demand.",
    rainfall_factor: 1.0,
    storage_factor: 1.0,
    inflow_factor: 1.0,
    demand_factor: 1.0,
    canal_capacity_factor: 1.0,
    temperature_delta_c: 0.0
  },
  {
    id: "scenario_b",
    name: "Scenario B: Severe Drought & High Evapotranspiration",
    description: "Critical 60% rainfall deficit, depleted reservoir live storage, high ambient temperatures (+3.5°C), and elevated crop stress.",
    rainfall_factor: 0.40,
    storage_factor: 0.55,
    inflow_factor: 0.35,
    demand_factor: 1.35,
    canal_capacity_factor: 1.0,
    temperature_delta_c: 3.5
  },
  {
    id: "scenario_c",
    name: "Scenario C: Heavy Monsoon & Catchment Inflow Surge",
    description: "Surplus precipitation (+70%), near-capacity reservoir levels, abundant river discharge, and reduced irrigation demand.",
    rainfall_factor: 1.70,
    storage_factor: 1.15,
    inflow_factor: 2.20,
    demand_factor: 0.65,
    canal_capacity_factor: 1.0,
    temperature_delta_c: -1.5
  },
  {
    id: "scenario_d",
    name: "Scenario D: Intensified Kharif Crop Demand",
    description: "Expanded agricultural command area and simultaneous vegetative/flowering stages resulting in +45% crop water demand.",
    rainfall_factor: 0.90,
    storage_factor: 0.90,
    inflow_factor: 0.85,
    demand_factor: 1.45,
    canal_capacity_factor: 1.0,
    temperature_delta_c: 1.0
  },
  {
    id: "scenario_e",
    name: "Scenario E: Upstream Reservoir Depletion",
    description: "Upstream catchment shortfall causing 55% reduction in Nagarjuna Sagar and Srisailam live storages.",
    rainfall_factor: 0.75,
    storage_factor: 0.45,
    inflow_factor: 0.50,
    demand_factor: 1.10,
    canal_capacity_factor: 1.0,
    temperature_delta_c: 1.2
  },
  {
    id: "scenario_f",
    name: "Scenario F: Canal Infrastructure Bottleneck",
    description: "Maintenance closures and siltation reducing main and branch canal conveying capacities by 45%.",
    rainfall_factor: 1.0,
    storage_factor: 1.0,
    inflow_factor: 1.0,
    demand_factor: 1.0,
    canal_capacity_factor: 0.55,
    temperature_delta_c: 0.0
  }
];

export const HISTORICAL_CORRELATIONS = [
  { month: "Jan", rainfall: 8.5, inflow: 120, demand: 280, evapotranspiration: 3.1, storage: 4100 },
  { month: "Feb", rainfall: 12.0, inflow: 95, demand: 310, evapotranspiration: 3.8, storage: 3800 },
  { month: "Mar", rainfall: 18.0, inflow: 80, demand: 390, evapotranspiration: 4.6, storage: 3400 },
  { month: "Apr", rainfall: 24.0, inflow: 70, demand: 440, evapotranspiration: 5.4, storage: 2950 },
  { month: "May", rainfall: 42.0, inflow: 90, demand: 420, evapotranspiration: 5.9, storage: 2500 },
  { month: "Jun", rainfall: 145.0, inflow: 650, demand: 290, evapotranspiration: 4.8, storage: 3300 },
  { month: "Jul", rainfall: 280.0, inflow: 1420, demand: 210, evapotranspiration: 3.9, storage: 4800 },
  { month: "Aug", rainfall: 310.0, inflow: 1650, demand: 220, evapotranspiration: 3.7, storage: 5400 },
  { month: "Sep", rainfall: 220.0, inflow: 1180, demand: 260, evapotranspiration: 3.8, storage: 5200 },
  { month: "Oct", rainfall: 110.0, inflow: 580, demand: 330, evapotranspiration: 3.6, storage: 4900 },
  { month: "Nov", rainfall: 45.0, inflow: 310, demand: 340, evapotranspiration: 3.2, storage: 4600 },
  { month: "Dec", rainfall: 15.0, inflow: 180, demand: 290, evapotranspiration: 2.9, storage: 4350 },
];
