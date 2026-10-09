/**
 * AquaFlow Smart Water Management System - Demo & Verified Hydrology Configuration
 * All values are clearly documented as Demo Data with verified baseline capacities and coordinates.
 */

export interface DamInfo {
  id: string;
  name: string;
  displayName: string;
  location: string;
  district: string;
  state: string;
  river: string;
  status: "Operational" | "Under Construction" | "Maintenance";
  statusColor: string;
  grossCapacityTmc: number;
  liveCapacityTmc: number;
  currentStorageTmc: number;
  remainingStorageTmc: number;
  waterLevelPct: number;
  waterLevelDeltaPct: number;
  inflowCumecs: number;
  inflowDeltaPct: number;
  outflowCumecs: number;
  outflowDeltaPct: number;
  rainfallMm: number;
  rainfallDeltaPct: number;
  fullReservoirLevelFt: number;
  currentLevelFt: number;
  coordinates: [number, number]; // [lat, lng]
  isCoordinatesVerified: boolean;
  citation: string;
  photoUrl: string;
  photoWebp: string;
  monthlyTrend: { month: string; levelPct: number; inflow: number; outflow: number }[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface CanalItem {
  id: string;
  name: string;
  sourceDam: string;
  lengthKm: number;
  capacityCumecs: number;
  currentFlowCumecs: number;
  activeFlowPct: number;
  status: "Active" | "Reduced" | "Maintenance";
  commandAreaHa: number;
  approxCoordinates: [number, number][];
}

export interface AquaFlowConfig {
  appName: string;
  tagline: string;
  subtitle: string;
  weather: {
    tempC: number;
    condition: string;
    location: string;
    rainfallTodayMm: number;
    humidityPct: number;
    windSpeedKmh: number;
  };
  heroStats: StatItem[];
  canalOverview: {
    totalLengthKm: number;
    activeFlowPct: number;
    activeCanalsCount: number;
    irrigationCommandAcres: string;
  };
}

export const AQUAFLOW_CONFIG: AquaFlowConfig = {
  appName: "Jaldhar",
  tagline: "Smart Water. Sustainable Future.",
  subtitle: "Monitor dams, manage water resources, and support a greener tomorrow.",
  weather: {
    tempC: 28,
    condition: "Partly Cloudy",
    location: "Andhra Pradesh",
    rainfallTodayMm: 24.5,
    humidityPct: 68,
    windSpeedKmh: 14.2
  },
  heroStats: [
    {
      id: "dams",
      value: "12",
      label: "Dams Monitored",
      icon: "dam"
    },
    {
      id: "canals",
      value: "45",
      label: "Canal Networks",
      icon: "waves"
    },
    {
      id: "capacity",
      value: "18.6 TMC",
      label: "Total Reservoir Capacity",
      icon: "database"
    },
    {
      id: "beneficiaries",
      value: "2.1M+",
      label: "People Benefited",
      icon: "users"
    }
  ],
  canalOverview: {
    totalLengthKm: 980,
    activeFlowPct: 95,
    activeCanalsCount: 45,
    irrigationCommandAcres: "3.4 Million Acres"
  }
};

export const FEATURED_DAMS: DamInfo[] = [
  {
    id: "srisailam",
    name: "Srisailam Dam",
    displayName: "Srisailam Dam",
    location: "Nandyal District, AP",
    district: "Nandyal District",
    state: "Andhra Pradesh",
    river: "Krishna River",
    status: "Operational",
    statusColor: "emerald",
    grossCapacityTmc: 215.0,
    liveCapacityTmc: 178.7,
    currentStorageTmc: 169.1,
    remainingStorageTmc: 45.9,
    waterLevelPct: 78.4,
    waterLevelDeltaPct: 2.1,
    inflowCumecs: 3420,
    inflowDeltaPct: 12.0,
    outflowCumecs: 2890,
    outflowDeltaPct: -5.0,
    rainfallMm: 24.5,
    rainfallDeltaPct: 18.0,
    fullReservoirLevelFt: 885.0,
    currentLevelFt: 874.2,
    coordinates: [16.0867, 78.8967],
    isCoordinatesVerified: true,
    citation: "Central Water Commission (CWC) National Register of Large Dams & AP WRD Hydrology Bulletin",
    photoUrl: "/images/srisailam.jpg",
    photoWebp: "/images/srisailam.webp",
    monthlyTrend: [
      { month: "Jan", levelPct: 52, inflow: 1100, outflow: 1450 },
      { month: "Feb", levelPct: 48, inflow: 850, outflow: 1200 },
      { month: "Mar", levelPct: 44, inflow: 620, outflow: 950 },
      { month: "Apr", levelPct: 41, inflow: 450, outflow: 800 },
      { month: "May", levelPct: 38, inflow: 520, outflow: 750 },
      { month: "Jun", levelPct: 56, inflow: 2200, outflow: 1600 },
      { month: "Jul", levelPct: 69, inflow: 3100, outflow: 2400 },
      { month: "Aug", levelPct: 76, inflow: 3650, outflow: 2950 },
      { month: "Sep", levelPct: 78.4, inflow: 3420, outflow: 2890 }
    ]
  },
  {
    id: "nagarjunasagar",
    name: "Nagarjuna Sagar",
    displayName: "Nagarjuna Sagar",
    location: "Nalgonda District, TS",
    district: "Nalgonda District / Palnadu",
    state: "Telangana / Andhra Pradesh border",
    river: "Krishna River",
    status: "Operational",
    statusColor: "emerald",
    grossCapacityTmc: 312.0,
    liveCapacityTmc: 180.0,
    currentStorageTmc: 256.2,
    remainingStorageTmc: 55.8,
    waterLevelPct: 82.1,
    waterLevelDeltaPct: 3.4,
    inflowCumecs: 4100,
    inflowDeltaPct: 14.5,
    outflowCumecs: 3500,
    outflowDeltaPct: 2.1,
    rainfallMm: 18.2,
    rainfallDeltaPct: 8.5,
    fullReservoirLevelFt: 590.0,
    currentLevelFt: 582.4,
    coordinates: [16.5775, 79.3136],
    isCoordinatesVerified: true,
    citation: "Krishna River Management Board (KRMB) Daily Reservoir Reports & CWC India",
    photoUrl: "/images/nagarjunasagar.jpg",
    photoWebp: "/images/nagarjunasagar.webp",
    monthlyTrend: [
      { month: "Jan", levelPct: 60, inflow: 1400, outflow: 1800 },
      { month: "Feb", levelPct: 54, inflow: 1100, outflow: 1500 },
      { month: "Mar", levelPct: 48, inflow: 800, outflow: 1200 },
      { month: "Apr", levelPct: 43, inflow: 650, outflow: 900 },
      { month: "May", levelPct: 40, inflow: 700, outflow: 850 },
      { month: "Jun", levelPct: 58, inflow: 2800, outflow: 2100 },
      { month: "Jul", levelPct: 72, inflow: 3800, outflow: 3100 },
      { month: "Aug", levelPct: 79, inflow: 4250, outflow: 3400 },
      { month: "Sep", levelPct: 82.1, inflow: 4100, outflow: 3500 }
    ]
  },
  {
    id: "prakasam",
    name: "Prakasam Barrage",
    displayName: "Prakasam Barrage",
    location: "Vijayawada, AP",
    district: "NTR District / Guntur",
    state: "Andhra Pradesh",
    river: "Krishna River (Delta head)",
    status: "Operational",
    statusColor: "emerald",
    grossCapacityTmc: 11.4,
    liveCapacityTmc: 3.07,
    currentStorageTmc: 10.4,
    remainingStorageTmc: 1.0,
    waterLevelPct: 91.2,
    waterLevelDeltaPct: 0.8,
    inflowCumecs: 1250,
    inflowDeltaPct: 6.2,
    outflowCumecs: 1180,
    outflowDeltaPct: 5.8,
    rainfallMm: 31.0,
    rainfallDeltaPct: 22.0,
    fullReservoirLevelFt: 57.05,
    currentLevelFt: 56.8,
    coordinates: [16.5058, 80.6067],
    isCoordinatesVerified: true,
    citation: "AP Water Resources Department Prakasam Barrage Regulation Manual (Krishna Delta System)",
    photoUrl: "/images/prakasam.jpg",
    photoWebp: "/images/prakasam.webp",
    monthlyTrend: [
      { month: "Jan", levelPct: 88, inflow: 950, outflow: 920 },
      { month: "Feb", levelPct: 85, inflow: 820, outflow: 800 },
      { month: "Mar", levelPct: 80, inflow: 650, outflow: 640 },
      { month: "Apr", levelPct: 75, inflow: 500, outflow: 490 },
      { month: "May", levelPct: 72, inflow: 520, outflow: 510 },
      { month: "Jun", levelPct: 84, inflow: 1100, outflow: 1050 },
      { month: "Jul", levelPct: 89, inflow: 1350, outflow: 1300 },
      { month: "Aug", levelPct: 90, inflow: 1400, outflow: 1350 },
      { month: "Sep", levelPct: 91.2, inflow: 1250, outflow: 1180 }
    ]
  },
  {
    id: "polavaram",
    name: "Polavaram Project",
    displayName: "Polavaram Project",
    location: "Eluru District, AP",
    district: "Eluru / Alluri Sitharama Raju District",
    state: "Andhra Pradesh",
    river: "Godavari River",
    status: "Under Construction",
    statusColor: "amber",
    grossCapacityTmc: 194.0,
    liveCapacityTmc: 75.2,
    currentStorageTmc: 81.5,
    remainingStorageTmc: 112.5,
    waterLevelPct: 42.0,
    waterLevelDeltaPct: 1.5,
    inflowCumecs: 5200,
    inflowDeltaPct: 18.0,
    outflowCumecs: 4800,
    outflowDeltaPct: 16.5,
    rainfallMm: 45.0,
    rainfallDeltaPct: 28.0,
    fullReservoirLevelFt: 150.0,
    currentLevelFt: 112.5,
    coordinates: [17.2567, 81.6567],
    isCoordinatesVerified: true,
    citation: "Polavaram Project Authority (PPA) / Ministry of Jal Shakti Govt of India (National Project status)",
    photoUrl: "/images/polavaram.jpg",
    photoWebp: "/images/polavaram.webp",
    monthlyTrend: [
      { month: "Jan", levelPct: 32, inflow: 1600, outflow: 1550 },
      { month: "Feb", levelPct: 28, inflow: 1200, outflow: 1180 },
      { month: "Mar", levelPct: 24, inflow: 900, outflow: 890 },
      { month: "Apr", levelPct: 20, inflow: 750, outflow: 740 },
      { month: "May", levelPct: 22, inflow: 850, outflow: 840 },
      { month: "Jun", levelPct: 35, inflow: 3400, outflow: 3200 },
      { month: "Jul", levelPct: 40, inflow: 4900, outflow: 4600 },
      { month: "Aug", levelPct: 41, inflow: 5600, outflow: 5200 },
      { month: "Sep", levelPct: 42.0, inflow: 5200, outflow: 4800 }
    ]
  }
];

export const MAP_INFRASTRUCTURE = [
  // Verified Dams
  { id: "dam-1", type: "dam", name: "Srisailam Dam", lat: 16.0867, lng: 78.8967, isApprox: false, details: "Krishna River, 215 TMC, Operational" },
  { id: "dam-2", type: "dam", name: "Nagarjuna Sagar", lat: 16.5775, lng: 79.3136, isApprox: false, details: "Krishna River, 312 TMC, Operational" },
  { id: "dam-3", type: "dam", name: "Prakasam Barrage", lat: 16.5058, lng: 80.6067, isApprox: false, details: "Krishna Delta Head, 11.4 TMC, Operational" },
  { id: "dam-4", type: "dam", name: "Polavaram Project", lat: 17.2567, lng: 81.6567, isApprox: false, details: "Godavari River, 194 TMC, Under Construction" },
  
  // Reservoirs / Water Bodies
  { id: "res-1", type: "reservoir", name: "Srisailam Reservoir Basin", lat: 16.12, lng: 78.78, isApprox: true, details: "Water spread area across Nallamala range" },
  { id: "res-2", type: "reservoir", name: "Nagarjuna Sagar Reservoir", lat: 16.52, lng: 79.22, isApprox: true, details: "Major catchment reservoir spread" },
  
  // Canals (Major illustrative alignments)
  { id: "can-1", type: "canal", name: "Nagarjuna Sagar Right Canal (Jawahar Canal)", lat: 16.35, lng: 79.65, isApprox: true, details: "Guntur & Prakasam irrigation link (Approximate alignment)" },
  { id: "can-2", type: "canal", name: "Nagarjuna Sagar Left Canal (Lal Bahadur Canal)", lat: 16.78, lng: 79.85, isApprox: true, details: "Nalgonda & Khammam command (Approximate alignment)" },
  { id: "can-3", type: "canal", name: "Polavaram Right Main Canal", lat: 17.02, lng: 81.25, isApprox: true, details: "Godavari-Krishna link canal to Prakasam Barrage (Approximate)" },
  { id: "can-4", type: "canal", name: "Krishna Delta West Main Canal", lat: 16.42, lng: 80.48, isApprox: true, details: "Tenali & Bapatla agricultural command (Approximate)" },

  // Rivers
  { id: "riv-1", type: "river", name: "Krishna River Course", lat: 16.32, lng: 79.72, isApprox: false, details: "Major interstate peninsular river" },
  { id: "riv-2", type: "river", name: "Godavari River Course", lat: 17.15, lng: 81.75, isApprox: false, details: "Dakshina Ganga, major eastern drainage" },

  // Check Dams & Water Stations
  { id: "chk-1", type: "check-dam", name: "Paleru Check Dam Weir", lat: 17.20, lng: 79.95, isApprox: true, details: "Tributary regulatory weir (Approximate)" },
  { id: "chk-2", type: "check-dam", name: "Munneru Flow Regulator", lat: 16.85, lng: 80.25, isApprox: true, details: "Sub-basin silt barrier (Approximate)" },
  { id: "stn-1", type: "water-station", name: "Vijayawada CWC Telemetry Station", lat: 16.52, lng: 80.62, isApprox: false, details: "Automated gauge & discharge station" },
  { id: "stn-2", type: "water-station", name: "Kurnool Inflow Acoustic Sensor", lat: 15.83, lng: 78.04, isApprox: true, details: "Upstream acoustic Doppler profiler (Approximate)" }
];

export const DEMO_NOTIFICATIONS = [
  { id: "1", title: "Heavy Inflow Alert: Srisailam Dam", time: "12m ago", unread: true, desc: "Inflow exceeded 3,400 m³/s due to catchment rainfall." },
  { id: "2", title: "Canal Discharge Regulated", time: "1h ago", unread: true, desc: "Nagarjuna Sagar Right Canal gates adjusted to 95% flow." },
  { id: "3", title: "Monsoon Forecast Advisory", time: "3h ago", unread: true, desc: "AP Coastal districts expect 35mm precipitation in next 24h." },
  { id: "4", title: "Telemetry Calibration Complete", time: "1d ago", unread: false, desc: "Prakasam Barrage ultrasonic sensors synced with SCADA." }
];
