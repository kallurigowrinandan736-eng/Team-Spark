export interface GateStatus {
  id: number;
  name: string;
  status: "Open" | "Closed";
  liftFt: number;
  dischargeCusecs: number;
  lastUpdated: string;
  type: string;
}

export interface GateLog {
  id: string;
  timestamp: string;
  action: string;
  gatesAffected: string;
  dischargeChange: string;
  authorizedBy: string;
  status: "Completed" | "Active" | "Scheduled";
}

export interface HydrologyDataPoint {
  time: string;
  levelFt: number;
  storageTmc: number;
  inflowCusecs: number;
  outflowCusecs: number;
}

export interface DamDetailedRecord {
  id: string;
  name: string;
  formalName: string;
  river: string;
  basin: string;
  location: string;
  district: string;
  state: string;
  statusBadge: string;
  statusType: "Operational" | "Under Construction" | "Maintenance";
  coordinates: [number, number]; // [lat, lng]
  elevationMslFt: number;
  
  // Hero and imagery
  heroImage: string;
  surroundingsImage: string;
  caption: string;
  
  // Key Metrics
  currentLevelFt: number;
  fullReservoirLevelFt: number;
  minimumDrawDownLevelFt: number;
  maximumWaterLevelFt: number;
  levelPct: number;
  level24hDeltaPct: number;
  
  grossCapacityTmc: number;
  liveCapacityTmc: number;
  deadStorageTmc: number;
  currentStorageTmc: number;
  floodCushionTmc: number;
  
  inflowCusecs: number;
  inflowCumecs: number;
  inflowTrendPct: number;
  inflowSource: string;
  
  outflowCusecs: number;
  outflowCumecs: number;
  outflowTrendPct: number;
  outflowDestination: string;
  
  rainfallMm: number;
  rainfallTrendPct: number;
  catchmentRainfallDesc: string;
  
  totalGates: number;
  openGates: number;
  spillwayDischargeCusecs: number;
  powerhouseDischargeCusecs: number;
  
  // Weather
  weather: {
    tempC: number;
    condition: string;
    rainfall24hMm: number;
    humidityPct: number;
    windSpeedKmh: number;
    windDirection: string;
    pressureHpa: number;
    visibilityKm: number;
    forecast: { day: string; temp: string; rain: string; condition: string }[];
  };
  
  // Historical telemetry datasets
  telemetry: {
    daily: HydrologyDataPoint[];
    weekly: HydrologyDataPoint[];
    monthly: HydrologyDataPoint[];
  };
  
  // Gates array
  gates: GateStatus[];
  
  // Historical logs
  gateLogs: GateLog[];
  
  // Technical specs
  specs: {
    damType: string;
    heightMeters: number;
    heightFeet: number;
    lengthMeters: number;
    lengthFeet: number;
    spillwayCapacityCusecs: number;
    hydroCapacityMw: string;
    nearestTown: string;
    commissionYear: number;
    seismicZone: string;
    authority: string;
  };
}

export const DAM_DETAILS_DATA: Record<string, DamDetailedRecord> = {
  srisailam: {
    id: "srisailam",
    name: "Srisailam Dam",
    formalName: "Sri Neelam Sanjiva Reddy Sagar (Srisailam Project)",
    river: "Krishna River",
    basin: "Krishna River Basin (Middle Krishna Sub-Basin)",
    location: "Nandyal & Nagarkurnool Districts, Andhra Pradesh / Telangana",
    district: "Nandyal District",
    state: "Andhra Pradesh",
    statusBadge: "Operational • Spillway Discharge Active",
    statusType: "Operational",
    coordinates: [16.0867, 78.8967],
    elevationMslFt: 885.0,
    
    heroImage: "/images/srisailam.webp",
    surroundingsImage: "/images/hero-dam.webp",
    caption: "Panoramic view of Srisailam Dam wall spanning the deep Krishna River gorge amidst the Nallamala Forest range.",
    
    currentLevelFt: 874.2,
    fullReservoirLevelFt: 885.0,
    minimumDrawDownLevelFt: 834.0,
    maximumWaterLevelFt: 892.0,
    levelPct: 78.4,
    level24hDeltaPct: 2.1,
    
    grossCapacityTmc: 215.8,
    liveCapacityTmc: 178.7,
    deadStorageTmc: 36.3,
    currentStorageTmc: 169.1,
    floodCushionTmc: 46.7,
    
    inflowCusecs: 142500,
    inflowCumecs: 4035,
    inflowTrendPct: 12.4,
    inflowSource: "Upstream Jurala releases, Tungabhadra confluence & catchment runoff",
    
    outflowCusecs: 138200,
    outflowCumecs: 3913,
    outflowTrendPct: -3.8,
    outflowDestination: "Spillway discharge to Nagarjuna Sagar & twin powerhouse off-takes",
    
    rainfallMm: 24.5,
    rainfallTrendPct: 18.0,
    catchmentRainfallDesc: "Heavy localized showers in Western Ghats & upper catchment basin",
    
    totalGates: 12,
    openGates: 8,
    spillwayDischargeCusecs: 112000,
    powerhouseDischargeCusecs: 26200,
    
    weather: {
      tempC: 27.5,
      condition: "Overcast with Catchment Rain",
      rainfall24hMm: 24.5,
      humidityPct: 76,
      windSpeedKmh: 14.8,
      windDirection: "NW",
      pressureHpa: 1008,
      visibilityKm: 8.5,
      forecast: [
        { day: "Tomorrow", temp: "26°C", rain: "32 mm", condition: "Moderate Rain" },
        { day: "Thursday", temp: "28°C", rain: "18 mm", condition: "Scattered Showers" },
        { day: "Friday", temp: "29°C", rain: "6 mm", condition: "Partly Cloudy" }
      ]
    },
    
    telemetry: {
      daily: [
        { time: "00:00", levelFt: 872.8, storageTmc: 166.4, inflowCusecs: 135000, outflowCusecs: 128000 },
        { time: "03:00", levelFt: 873.0, storageTmc: 166.9, inflowCusecs: 138000, outflowCusecs: 130000 },
        { time: "06:00", levelFt: 873.3, storageTmc: 167.4, inflowCusecs: 140000, outflowCusecs: 132000 },
        { time: "09:00", levelFt: 873.7, storageTmc: 168.1, inflowCusecs: 144500, outflowCusecs: 136000 },
        { time: "12:00", levelFt: 874.0, storageTmc: 168.7, inflowCusecs: 143200, outflowCusecs: 138200 },
        { time: "15:00", levelFt: 874.2, storageTmc: 169.1, inflowCusecs: 142500, outflowCusecs: 138200 },
        { time: "18:00", levelFt: 874.3, storageTmc: 169.3, inflowCusecs: 141000, outflowCusecs: 138000 },
        { time: "21:00", levelFt: 874.4, storageTmc: 169.5, inflowCusecs: 139500, outflowCusecs: 137800 }
      ],
      weekly: [
        { time: "Day -6", levelFt: 868.5, storageTmc: 158.2, inflowCusecs: 98000, outflowCusecs: 92000 },
        { time: "Day -5", levelFt: 869.8, storageTmc: 160.8, inflowCusecs: 112000, outflowCusecs: 104000 },
        { time: "Day -4", levelFt: 871.1, storageTmc: 163.2, inflowCusecs: 125000, outflowCusecs: 118000 },
        { time: "Day -3", levelFt: 872.4, storageTmc: 165.6, inflowCusecs: 134000, outflowCusecs: 126000 },
        { time: "Day -2", levelFt: 873.1, storageTmc: 167.0, inflowCusecs: 141000, outflowCusecs: 134000 },
        { time: "Yesterday", levelFt: 873.8, storageTmc: 168.3, inflowCusecs: 144000, outflowCusecs: 138000 },
        { time: "Today", levelFt: 874.2, storageTmc: 169.1, inflowCusecs: 142500, outflowCusecs: 138200 }
      ],
      monthly: [
        { time: "Jan", levelFt: 852.0, storageTmc: 112.0, inflowCusecs: 38800, outflowCusecs: 51200 },
        { time: "Feb", levelFt: 846.5, storageTmc: 103.5, inflowCusecs: 30000, outflowCusecs: 42400 },
        { time: "Mar", levelFt: 840.8, storageTmc: 94.8, inflowCusecs: 21900, outflowCusecs: 33500 },
        { time: "Apr", levelFt: 837.2, storageTmc: 88.4, inflowCusecs: 15900, outflowCusecs: 28200 },
        { time: "May", levelFt: 835.1, storageTmc: 82.0, inflowCusecs: 18400, outflowCusecs: 26500 },
        { time: "Jun", levelFt: 850.4, storageTmc: 120.5, inflowCusecs: 77700, outflowCusecs: 56500 },
        { time: "Jul", levelFt: 864.2, storageTmc: 149.0, inflowCusecs: 109500, outflowCusecs: 84700 },
        { time: "Aug", levelFt: 871.8, storageTmc: 164.2, inflowCusecs: 128900, outflowCusecs: 104200 },
        { time: "Sep", levelFt: 874.2, storageTmc: 169.1, inflowCusecs: 142500, outflowCusecs: 138200 }
      ]
    },
    
    gates: [
      { id: 1, name: "Gate 1", status: "Closed", liftFt: 0.0, dischargeCusecs: 0, lastUpdated: "Today, 06:00 IST", type: "Radial Crest Gate (Left Flank)" },
      { id: 2, name: "Gate 2", status: "Closed", liftFt: 0.0, dischargeCusecs: 0, lastUpdated: "Today, 06:00 IST", type: "Radial Crest Gate" },
      { id: 3, name: "Gate 3", status: "Open", liftFt: 10.0, dischargeCusecs: 14000, lastUpdated: "Today, 08:30 IST", type: "Radial Crest Gate" },
      { id: 4, name: "Gate 4", status: "Open", liftFt: 10.0, dischargeCusecs: 14000, lastUpdated: "Today, 08:30 IST", type: "Radial Crest Gate" },
      { id: 5, name: "Gate 5", status: "Open", liftFt: 12.0, dischargeCusecs: 16800, lastUpdated: "Today, 10:15 IST", type: "Radial Crest Gate (Center)" },
      { id: 6, name: "Gate 6", status: "Open", liftFt: 12.0, dischargeCusecs: 16800, lastUpdated: "Today, 10:15 IST", type: "Radial Crest Gate (Center)" },
      { id: 7, name: "Gate 7", status: "Open", liftFt: 12.0, dischargeCusecs: 16800, lastUpdated: "Today, 10:15 IST", type: "Radial Crest Gate (Center)" },
      { id: 8, name: "Gate 8", status: "Open", liftFt: 10.0, dischargeCusecs: 14000, lastUpdated: "Today, 08:30 IST", type: "Radial Crest Gate" },
      { id: 9, name: "Gate 9", status: "Open", liftFt: 10.0, dischargeCusecs: 14000, lastUpdated: "Today, 08:30 IST", type: "Radial Crest Gate" },
      { id: 10, name: "Gate 10", status: "Open", liftFt: 4.0, dischargeCusecs: 5600, lastUpdated: "Today, 11:45 IST", type: "Radial Crest Gate" },
      { id: 11, name: "Gate 11", status: "Closed", liftFt: 0.0, dischargeCusecs: 0, lastUpdated: "Today, 06:00 IST", type: "Radial Crest Gate" },
      { id: 12, name: "Gate 12", status: "Closed", liftFt: 0.0, dischargeCusecs: 0, lastUpdated: "Today, 06:00 IST", type: "Radial Crest Gate (Right Flank)" }
    ],
    
    gateLogs: [
      { id: "LOG-01", timestamp: "Today, 11:45 IST", action: "Gate 10 partial lift calibrated", gatesAffected: "Gate 10", dischargeChange: "+5,600 cusecs", authorizedBy: "Executive Engineer (Dam Safety)", status: "Active" },
      { id: "LOG-02", timestamp: "Today, 10:15 IST", action: "Spillway center crest gates raised to 12 ft", gatesAffected: "Gates 5, 6, 7", dischargeChange: "+12,400 cusecs", authorizedBy: "Chief Engineer (Water Resources)", status: "Completed" },
      { id: "LOG-03", timestamp: "Today, 08:30 IST", action: "Gates 3, 4, 8, 9 adjusted to 10 ft lift", gatesAffected: "Gates 3, 4, 8, 9", dischargeChange: "+18,000 cusecs", authorizedBy: "Superintending Engineer", status: "Completed" },
      { id: "LOG-04", timestamp: "Today, 06:00 IST", action: "Morning gate inspection & hydraulic lock check", gatesAffected: "Gates 1 to 12", dischargeChange: "Nominal", authorizedBy: "Dam Instrumentation Unit", status: "Completed" },
      { id: "LOG-05", timestamp: "Yesterday, 22:30 IST", action: "Right Bank Powerhouse increased to full 770 MW generation", gatesAffected: "Turbines 1 - 7", dischargeChange: "+4,500 cusecs", authorizedBy: "APGENCO Load Dispatch", status: "Completed" }
    ],
    
    specs: {
      damType: "Masonry & Concrete Gravity Dam",
      heightMeters: 145.0,
      heightFeet: 476.0,
      lengthMeters: 512.0,
      lengthFeet: 1680.0,
      spillwayCapacityCusecs: 1320000,
      hydroCapacityMw: "1,670 MW (Right Bank 770 MW + Left Bank 900 MW)",
      nearestTown: "Srisailam / Sunnipenta (2.5 km)",
      commissionYear: 1980,
      seismicZone: "Zone II (Low Damage Risk)",
      authority: "Water Resources Department (AP) & Krishna River Management Board (KRMB)"
    }
  },
  
  nagarjunasagar: {
    id: "nagarjunasagar",
    name: "Nagarjuna Sagar Dam",
    formalName: "Nagarjuna Sagar Multi-Purpose Dam",
    river: "Krishna River",
    basin: "Krishna River Basin (Lower Krishna Reach)",
    location: "Nalgonda District (Telangana) & Palnadu District (AP)",
    district: "Palnadu District",
    state: "Andhra Pradesh / Telangana border",
    statusBadge: "Operational • Full Reservoir Retention",
    statusType: "Operational",
    coordinates: [16.5775, 79.3136],
    elevationMslFt: 590.0,
    
    heroImage: "/images/nagarjunasagar.webp",
    surroundingsImage: "/images/hero-dam.webp",
    caption: "The world's largest masonry dam holding one of India's largest man-made reservoirs across Krishna River.",
    
    currentLevelFt: 582.4,
    fullReservoirLevelFt: 590.0,
    minimumDrawDownLevelFt: 510.0,
    maximumWaterLevelFt: 594.0,
    levelPct: 82.1,
    level24hDeltaPct: 3.4,
    
    grossCapacityTmc: 312.0,
    liveCapacityTmc: 180.0,
    deadStorageTmc: 132.0,
    currentStorageTmc: 256.2,
    floodCushionTmc: 55.8,
    
    inflowCusecs: 144800,
    inflowCumecs: 4100,
    inflowTrendPct: 14.5,
    inflowSource: "Srisailam tailrace discharge and local catchment flows",
    
    outflowCusecs: 123600,
    outflowCumecs: 3500,
    outflowTrendPct: 2.1,
    outflowDestination: "Right Main Canal, Left Main Canal, and river discharge to Prakasam Barrage",
    
    rainfallMm: 18.2,
    rainfallTrendPct: 8.5,
    catchmentRainfallDesc: "Steady rainfall across Nalgonda and Palnadu districts",
    
    totalGates: 26,
    openGates: 14,
    spillwayDischargeCusecs: 95000,
    powerhouseDischargeCusecs: 28600,
    
    weather: {
      tempC: 28.5,
      condition: "Partly Cloudy with Humid Breeze",
      rainfall24hMm: 18.2,
      humidityPct: 70,
      windSpeedKmh: 12.5,
      windDirection: "WNW",
      pressureHpa: 1010,
      visibilityKm: 9.0,
      forecast: [
        { day: "Tomorrow", temp: "28°C", rain: "15 mm", condition: "Scattered Showers" },
        { day: "Thursday", temp: "29°C", rain: "10 mm", condition: "Partly Cloudy" },
        { day: "Friday", temp: "30°C", rain: "2 mm", condition: "Sunny Intervals" }
      ]
    },
    
    telemetry: {
      daily: [
        { time: "00:00", levelFt: 581.5, storageTmc: 253.0, inflowCusecs: 138000, outflowCusecs: 120000 },
        { time: "06:00", levelFt: 581.9, storageTmc: 254.2, inflowCusecs: 141000, outflowCusecs: 121000 },
        { time: "12:00", levelFt: 582.2, storageTmc: 255.4, inflowCusecs: 145000, outflowCusecs: 123600 },
        { time: "18:00", levelFt: 582.4, storageTmc: 256.2, inflowCusecs: 144800, outflowCusecs: 123600 }
      ],
      weekly: [
        { time: "Day -6", levelFt: 576.2, storageTmc: 238.0, inflowCusecs: 110000, outflowCusecs: 98000 },
        { time: "Day -4", levelFt: 578.5, storageTmc: 244.5, inflowCusecs: 126000, outflowCusecs: 108000 },
        { time: "Day -2", levelFt: 580.8, storageTmc: 251.0, inflowCusecs: 139000, outflowCusecs: 119000 },
        { time: "Today", levelFt: 582.4, storageTmc: 256.2, inflowCusecs: 144800, outflowCusecs: 123600 }
      ],
      monthly: [
        { time: "Jan", levelFt: 565.0, storageTmc: 202.0, inflowCusecs: 49400, outflowCusecs: 63600 },
        { time: "Mar", levelFt: 554.0, storageTmc: 172.0, inflowCusecs: 28300, outflowCusecs: 42400 },
        { time: "May", levelFt: 546.0, storageTmc: 151.0, inflowCusecs: 24700, outflowCusecs: 30000 },
        { time: "Jul", levelFt: 572.0, storageTmc: 225.0, inflowCusecs: 134200, outflowCusecs: 109500 },
        { time: "Sep", levelFt: 582.4, storageTmc: 256.2, inflowCusecs: 144800, outflowCusecs: 123600 }
      ]
    },
    
    gates: Array.from({ length: 26 }, (_, i) => ({
      id: i + 1,
      name: `Gate ${i + 1}`,
      status: i >= 6 && i <= 19 ? "Open" : "Closed",
      liftFt: i >= 6 && i <= 19 ? 8.0 : 0.0,
      dischargeCusecs: i >= 6 && i <= 19 ? 6785 : 0,
      lastUpdated: "Today, 11:00 IST",
      type: "Radial Crest Gate"
    })),
    
    gateLogs: [
      { id: "LOG-NS-01", timestamp: "Today, 11:00 IST", action: "Spillway discharge maintained through 14 central gates", gatesAffected: "Gates 7 to 20", dischargeChange: "Constant", authorizedBy: "KRMB Joint Monitoring Cell", status: "Active" },
      { id: "LOG-NS-02", timestamp: "Today, 07:30 IST", action: "Right Canal Jawahar feeder discharge stabilized", gatesAffected: "Canal Sluice", dischargeChange: "+2,200 cusecs", authorizedBy: "NSP Canals Circle", status: "Completed" }
    ],
    
    specs: {
      damType: "Masonry Gravity Dam with Earth Fill Flanks",
      heightMeters: 124.0,
      heightFeet: 407.0,
      lengthMeters: 4865.0,
      lengthFeet: 15961.0,
      spillwayCapacityCusecs: 1715000,
      hydroCapacityMw: "816 MW (1 x 110 MW conventional + 7 x 100.8 MW reversible)",
      nearestTown: "Macherla (24 km) / Miryalaguda (60 km)",
      commissionYear: 1967,
      seismicZone: "Zone II (Low Damage Risk)",
      authority: "Krishna River Management Board (KRMB)"
    }
  },
  
  prakasam: {
    id: "prakasam",
    name: "Prakasam Barrage",
    formalName: "Prakasam Barrage (Krishna Delta Head Regulator)",
    river: "Krishna River",
    basin: "Krishna Delta Sub-Basin",
    location: "Vijayawada, NTR District & Guntur District, Andhra Pradesh",
    district: "NTR District / Guntur",
    state: "Andhra Pradesh",
    statusBadge: "Operational • Delta Head Regulation",
    statusType: "Operational",
    coordinates: [16.5058, 80.6067],
    elevationMslFt: 57.05,
    
    heroImage: "/images/prakasam.webp",
    surroundingsImage: "/images/hero-dam.webp",
    caption: "Iconic barrage across Krishna River connecting Vijayawada and Guntur, feeding 1.3 million acres of fertile delta.",
    
    currentLevelFt: 56.8,
    fullReservoirLevelFt: 57.05,
    minimumDrawDownLevelFt: 50.0,
    maximumWaterLevelFt: 59.0,
    levelPct: 91.2,
    level24hDeltaPct: 0.8,
    
    grossCapacityTmc: 11.4,
    liveCapacityTmc: 3.07,
    deadStorageTmc: 8.33,
    currentStorageTmc: 10.4,
    floodCushionTmc: 1.0,
    
    inflowCusecs: 44140,
    inflowCumecs: 1250,
    inflowTrendPct: 6.2,
    inflowSource: "Pulichintala discharge & Munneru/Paleru tributaries",
    
    outflowCusecs: 41670,
    outflowCumecs: 1180,
    outflowTrendPct: 5.8,
    outflowDestination: "Krishna Delta Eastern & Western Canals, surplus to sea",
    
    rainfallMm: 31.0,
    rainfallTrendPct: 22.0,
    catchmentRainfallDesc: "Monsoon squalls across Vijayawada and Amaravati capital region",
    
    totalGates: 70,
    openGates: 42,
    spillwayDischargeCusecs: 28000,
    powerhouseDischargeCusecs: 0,
    
    weather: {
      tempC: 29.2,
      condition: "Tropical Overcast with High Humidity",
      rainfall24hMm: 31.0,
      humidityPct: 82,
      windSpeedKmh: 16.2,
      windDirection: "SE",
      pressureHpa: 1007,
      visibilityKm: 7.5,
      forecast: [
        { day: "Tomorrow", temp: "28°C", rain: "25 mm", condition: "Thunderstorms" },
        { day: "Thursday", temp: "30°C", rain: "12 mm", condition: "Passing Showers" },
        { day: "Friday", temp: "31°C", rain: "4 mm", condition: "Warm and Humid" }
      ]
    },
    
    telemetry: {
      daily: [
        { time: "00:00", levelFt: 56.6, storageTmc: 10.2, inflowCusecs: 42000, outflowCusecs: 40000 },
        { time: "06:00", levelFt: 56.7, storageTmc: 10.3, inflowCusecs: 43500, outflowCusecs: 41000 },
        { time: "12:00", levelFt: 56.8, storageTmc: 10.4, inflowCusecs: 44140, outflowCusecs: 41670 },
        { time: "18:00", levelFt: 56.8, storageTmc: 10.4, inflowCusecs: 44000, outflowCusecs: 41600 }
      ],
      weekly: [
        { time: "Day -6", levelFt: 56.2, storageTmc: 9.8, inflowCusecs: 35000, outflowCusecs: 33000 },
        { time: "Day -4", levelFt: 56.5, storageTmc: 10.1, inflowCusecs: 38000, outflowCusecs: 36000 },
        { time: "Day -2", levelFt: 56.7, storageTmc: 10.3, inflowCusecs: 42000, outflowCusecs: 39500 },
        { time: "Today", levelFt: 56.8, storageTmc: 10.4, inflowCusecs: 44140, outflowCusecs: 41670 }
      ],
      monthly: [
        { time: "Jan", levelFt: 56.2, storageTmc: 9.9, inflowCusecs: 33500, outflowCusecs: 32500 },
        { time: "Mar", levelFt: 55.4, storageTmc: 9.1, inflowCusecs: 22900, outflowCusecs: 22600 },
        { time: "May", levelFt: 54.8, storageTmc: 8.5, inflowCusecs: 18400, outflowCusecs: 18000 },
        { time: "Jul", levelFt: 56.5, storageTmc: 10.2, inflowCusecs: 47600, outflowCusecs: 45900 },
        { time: "Sep", levelFt: 56.8, storageTmc: 10.4, inflowCusecs: 44140, outflowCusecs: 41670 }
      ]
    },
    
    gates: Array.from({ length: 70 }, (_, i) => ({
      id: i + 1,
      name: `Gate ${i + 1}`,
      status: i >= 14 && i <= 55 ? "Open" : "Closed",
      liftFt: i >= 14 && i <= 55 ? 3.5 : 0.0,
      dischargeCusecs: i >= 14 && i <= 55 ? 666 : 0,
      lastUpdated: "Today, 12:30 IST",
      type: "Vertical Lift Gate"
    })),
    
    gateLogs: [
      { id: "LOG-PK-01", timestamp: "Today, 12:30 IST", action: "42 Barrage gates maintained at 3.5 ft lift", gatesAffected: "Gates 15 to 56", dischargeChange: "Constant", authorizedBy: "Executive Engineer (Krishna Delta)", status: "Active" },
      { id: "LOG-PK-02", timestamp: "Today, 09:00 IST", action: "Western Delta main feeder opened to 7,500 cusecs for kharif transplanting", gatesAffected: "Ryves & West Canals", dischargeChange: "+1,200 cusecs", authorizedBy: "Irrigation Superintendent", status: "Completed" }
    ],
    
    specs: {
      damType: "Barrage with Regulators & Road Bridge",
      heightMeters: 12.0,
      heightFeet: 39.4,
      lengthMeters: 1223.5,
      lengthFeet: 4014.0,
      spillwayCapacityCusecs: 1190000,
      hydroCapacityMw: "None (Direct Irrigation & Drinking Water Supply)",
      nearestTown: "Vijayawada City (0 km)",
      commissionYear: 1957,
      seismicZone: "Zone III (Moderate Damage Risk)",
      authority: "Andhra Pradesh Water Resources Department"
    }
  },
  
  polavaram: {
    id: "polavaram",
    name: "Polavaram Project",
    formalName: "Indira Sagar (Polavaram) National Multi-Purpose Irrigation Project",
    river: "Godavari River",
    basin: "Godavari River Basin (Lower Godavari Reach)",
    location: "Polavaram, Eluru & Alluri Sitharama Raju Districts, Andhra Pradesh",
    district: "Eluru District",
    state: "Andhra Pradesh",
    statusBadge: "Under Construction • Priority National Project",
    statusType: "Under Construction",
    coordinates: [17.2567, 81.6567],
    elevationMslFt: 150.0,
    
    heroImage: "/images/polavaram.webp",
    surroundingsImage: "/images/hero-dam.webp",
    caption: "Major national irrigation project across Godavari River creating inter-basin transfer link to Krishna basin.",
    
    currentLevelFt: 112.5,
    fullReservoirLevelFt: 150.0,
    minimumDrawDownLevelFt: 98.0,
    maximumWaterLevelFt: 155.0,
    levelPct: 42.0,
    level24hDeltaPct: 1.5,
    
    grossCapacityTmc: 194.0,
    liveCapacityTmc: 75.2,
    deadStorageTmc: 118.8,
    currentStorageTmc: 81.5,
    floodCushionTmc: 112.5,
    
    inflowCusecs: 183600,
    inflowCumecs: 5200,
    inflowTrendPct: 18.0,
    inflowSource: "Godavari main stem, Indravati & Sabari confluences",
    
    outflowCusecs: 169500,
    outflowCumecs: 4800,
    outflowTrendPct: 16.5,
    outflowDestination: "Spillway cofferdam discharge downstream towards Dowleswaram",
    
    rainfallMm: 45.0,
    rainfallTrendPct: 28.0,
    catchmentRainfallDesc: "Heavy monsoon depressions in Dandakaranya catchment forests",
    
    totalGates: 48,
    openGates: 24,
    spillwayDischargeCusecs: 169500,
    powerhouseDischargeCusecs: 0,
    
    weather: {
      tempC: 26.8,
      condition: "Tropical Monsoon Downpour",
      rainfall24hMm: 45.0,
      humidityPct: 88,
      windSpeedKmh: 18.0,
      windDirection: "SW",
      pressureHpa: 1005,
      visibilityKm: 6.0,
      forecast: [
        { day: "Tomorrow", temp: "26°C", rain: "40 mm", condition: "Heavy Rain" },
        { day: "Thursday", temp: "27°C", rain: "25 mm", condition: "Thunderstorms" },
        { day: "Friday", temp: "28°C", rain: "14 mm", condition: "Scattered Showers" }
      ]
    },
    
    telemetry: {
      daily: [
        { time: "00:00", levelFt: 110.8, storageTmc: 78.5, inflowCusecs: 172000, outflowCusecs: 158000 },
        { time: "06:00", levelFt: 111.4, storageTmc: 79.6, inflowCusecs: 178000, outflowCusecs: 164000 },
        { time: "12:00", levelFt: 112.1, storageTmc: 80.8, inflowCusecs: 184000, outflowCusecs: 169000 },
        { time: "18:00", levelFt: 112.5, storageTmc: 81.5, inflowCusecs: 183600, outflowCusecs: 169500 }
      ],
      weekly: [
        { time: "Day -6", levelFt: 105.0, storageTmc: 68.0, inflowCusecs: 120000, outflowCusecs: 110000 },
        { time: "Day -4", levelFt: 107.5, storageTmc: 72.5, inflowCusecs: 145000, outflowCusecs: 132000 },
        { time: "Day -2", levelFt: 110.2, storageTmc: 77.0, inflowCusecs: 168000, outflowCusecs: 154000 },
        { time: "Today", levelFt: 112.5, storageTmc: 81.5, inflowCusecs: 183600, outflowCusecs: 169500 }
      ],
      monthly: [
        { time: "Jan", levelFt: 102.0, storageTmc: 62.0, inflowCusecs: 56500, outflowCusecs: 54700 },
        { time: "Mar", levelFt: 98.5, storageTmc: 56.0, inflowCusecs: 31800, outflowCusecs: 31400 },
        { time: "May", levelFt: 96.0, storageTmc: 52.0, inflowCusecs: 30000, outflowCusecs: 29700 },
        { time: "Jul", levelFt: 108.0, storageTmc: 74.0, inflowCusecs: 173000, outflowCusecs: 162400 },
        { time: "Sep", levelFt: 112.5, storageTmc: 81.5, inflowCusecs: 183600, outflowCusecs: 169500 }
      ]
    },
    
    gates: Array.from({ length: 48 }, (_, i) => ({
      id: i + 1,
      name: `Gate ${i + 1}`,
      status: i >= 12 && i <= 35 ? "Open" : "Closed",
      liftFt: i >= 12 && i <= 35 ? 7.0 : 0.0,
      dischargeCusecs: i >= 12 && i <= 35 ? 7062 : 0,
      lastUpdated: "Today, 10:00 IST",
      type: "Radial Spillway Gate (16m x 20m)"
    })),
    
    gateLogs: [
      { id: "LOG-PV-01", timestamp: "Today, 10:00 IST", action: "Monsoon flood diversion via 24 spillway crest blocks", gatesAffected: "Gates 13 to 36", dischargeChange: "Constant high flow", authorizedBy: "Polavaram Project Authority (PPA)", status: "Active" },
      { id: "LOG-PV-02", timestamp: "Yesterday, 16:00 IST", action: "Upper cofferdam and approach channel acoustic profiling", gatesAffected: "Approach Channel", dischargeChange: "Nominal", authorizedBy: "CWC Site Engineers", status: "Completed" }
    ],
    
    specs: {
      damType: "Earth-cum-Rockfill Dam with Concrete Spillway",
      heightMeters: 48.0,
      heightFeet: 157.5,
      lengthMeters: 2914.0,
      lengthFeet: 9560.0,
      spillwayCapacityCusecs: 5000000,
      hydroCapacityMw: "960 MW (12 x 80 MW under construction)",
      nearestTown: "Rajahmundry (35 km)",
      commissionYear: 2026,
      seismicZone: "Zone III (Moderate Damage Risk)",
      authority: "Polavaram Project Authority (PPA) / Ministry of Jal Shakti"
    }
  }
};
