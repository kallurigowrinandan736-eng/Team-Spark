"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Reservoir, Canal, Region, Crop } from "../lib/types";
import {
  Layers, Droplets, GitBranch, MapPin, Compass,
  Eye, Maximize2, Crosshair, Sparkles, Waves, Globe,
  Search, X, Database, Sprout, ChevronDown, Check,
  Navigation, ExternalLink, ArrowRight, Activity, Building2,
  Tag, Share2, Workflow, Network
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// Dynamic import for React-Leaflet components to avoid SSR window errors
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

export type MapTileStyle = "earth-pro" | "hybrid" | "terrain" | "dark";

interface TileConfig {
  id: MapTileStyle;
  label: string;
  icon: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

const TILE_CONFIGS: Record<MapTileStyle, TileConfig> = {
  "earth-pro": {
    id: "earth-pro",
    label: "Google Earth Pro (Satellite)",
    icon: "🛰️",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics, USDA FSA, USGS, Aerogrid, IGN, IGP",
    maxZoom: 19
  },
  "hybrid": {
    id: "hybrid",
    label: "Earth Pro Hybrid (+Labels & Borders)",
    icon: "🌍",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics & World Boundaries",
    maxZoom: 19
  },
  "terrain": {
    id: "terrain",
    label: "3D Topographic Terrain",
    icon: "🏔️",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Topography &copy; Esri, DeLorme, NAVTEQ, TomTom, Intermap, USGS",
    maxZoom: 19
  },
  "dark": {
    id: "dark",
    label: "Night Mode Neon Grid",
    icon: "🌌",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    maxZoom: 19
  }
};

// High-Resolution Satellite Overlays for Roads, Highways, Streets & Places
const ROADS_OVERLAY_URL =
  "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}";
const BOUNDARIES_OVERLAY_URL =
  "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";

interface CameraPreset {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  description: string;
}

const CAMERA_PRESETS: CameraPreset[] = [
  { id: "basin", name: "Entire Basin", lat: 16.35, lng: 79.85, zoom: 8, description: "Full Krishna Basin Watershed" },
  { id: "nagarjuna", name: "Nagarjuna Sagar", lat: 16.5794, lng: 79.3142, zoom: 12, description: "Nagarjuna Sagar Dam & Gorge" },
  { id: "srisailam", name: "Srisailam Dam", lat: 16.0886, lng: 78.8958, zoom: 12, description: "Deep Canyon Storage Reservoir" },
  { id: "prakasam", name: "Prakasam Barrage", lat: 16.5074, lng: 80.6053, zoom: 12, description: "Vijayawada Delta Diversion Head" },
  { id: "guntur", name: "Guntur Command", lat: 16.306, lng: 80.4365, zoom: 10, description: "Paddy & Cotton Command Zone" }
];

// Curated Water & Geographic Search Index
interface SearchPlace {
  id: string;
  name: string;
  type: "area" | "reservoir" | "canal" | "landmark";
  category: string;
  lat: number;
  lng: number;
  zoom: number;
  details: string;
  regionId?: string;
}

const FAMOUS_WATER_LANDMARKS: SearchPlace[] = [
  { id: "lm_amaravati", name: "Amaravati Capital City", type: "landmark", category: "Capital Region", lat: 16.5131, lng: 80.5165, zoom: 12, details: "Capital of Andhra Pradesh on Krishna River banks" },
  { id: "lm_hyderabad", name: "Hyderabad", type: "landmark", category: "Metropolitan", lat: 17.3850, lng: 78.4867, zoom: 11, details: "Major City & Catchment Zone" },
  { id: "lm_kurnool", name: "Kurnool", type: "landmark", category: "District HQ", lat: 15.8281, lng: 78.0373, zoom: 12, details: "Tungabhadra and Hundri River confluence" },
  { id: "lm_machilipatnam", name: "Machilipatnam", type: "landmark", category: "Coastal Delta", lat: 16.1875, lng: 81.1389, zoom: 12, details: "Krishna River outfall into Bay of Bengal" },
  { id: "lm_tenali", name: "Tenali", type: "landmark", category: "Delta Agriculture", lat: 16.2437, lng: 80.6406, zoom: 13, details: "Key agricultural market & canal hub" },
  { id: "lm_ongole", name: "Ongole", type: "landmark", category: "District HQ", lat: 15.5057, lng: 80.0499, zoom: 12, details: "Prakasam district headquarters" },
  { id: "lm_bhakra", name: "Bhakra Nangal Dam", type: "landmark", category: "Major Indian Dam", lat: 31.4108, lng: 76.4356, zoom: 12, details: "Sutlej River, Himachal Pradesh / Punjab" },
  { id: "lm_tehri", name: "Tehri Dam", type: "landmark", category: "Major Indian Dam", lat: 30.3780, lng: 78.4803, zoom: 12, details: "Bhagirathi River, Uttarakhand" },
  { id: "lm_sardar", name: "Sardar Sarovar Dam", type: "landmark", category: "Major Indian Dam", lat: 21.8290, lng: 73.7483, zoom: 12, details: "Narmada River, Gujarat" },
  { id: "lm_hirakud", name: "Hirakud Dam", type: "landmark", category: "Major Indian Dam", lat: 21.5283, lng: 83.8714, zoom: 12, details: "Mahanadi River, Odisha" },
  { id: "lm_tungabhadra", name: "Tungabhadra Dam", type: "landmark", category: "Major Indian Dam", lat: 15.2638, lng: 76.3387, zoom: 12, details: "Hospet, Karnataka (Krishna Tributary)" },
  { id: "lm_almatti", name: "Almatti Dam", type: "landmark", category: "Upper Krishna Basin", lat: 16.3315, lng: 75.8876, zoom: 12, details: "Krishna River, Karnataka" }
];

interface MapViewProps {
  reservoirs: Reservoir[];
  canals: Canal[];
  regions: Region[];
  crops: Crop[];
  height?: string;
  initialSelectedRegionId?: string | null;
}

export const MapView: React.FC<MapViewProps> = ({
  reservoirs,
  canals,
  regions,
  crops,
  height = "600px",
  initialSelectedRegionId = null
}) => {
  const [mounted, setMounted] = useState(false);
  const [leafletInstance, setLeafletInstance] = useState<any>(null);
  const [tileStyle, setTileStyle] = useState<MapTileStyle>("earth-pro");
  // Reservoirs are HIDDEN by default; only enabled when user searches for a particular place
  const [showReservoirs, setShowReservoirs] = useState(false);
  const [showCanals, setShowCanals] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [showSymbols, setShowSymbols] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showRelations, setShowRelations] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(8);
  const [relationsDrawerOpen, setRelationsDrawerOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string>("basin");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Selected Entities & Relationships State
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(initialSelectedRegionId);
  const [selectedReservoirId, setSelectedReservoirId] = useState<string | null>(null);
  const [selectedCanalId, setSelectedCanalId] = useState<string | null>(null);
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(null);
  const [activeInspectorTab, setActiveInspectorTab] = useState<"reservoirs" | "canals" | "crops">("reservoirs");

  // Search Places State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [nominatimResults, setNominatimResults] = useState<SearchPlace[]>([]);
  const [searchMarker, setSearchMarker] = useState<{
    lat: number;
    lng: number;
    name: string;
    details: string;
    type: string;
  } | null>(null);

  // Dynamically determine which reservoirs to display:
  // Removed by default, enabled ONLY when searching for a particular place/reservoir
  const searchedReservoirs = useMemo(() => {
    // 1. If a specific reservoir was selected / searched
    if (selectedReservoirId) {
      return reservoirs.filter((r) => r.id === selectedReservoirId);
    }

    // 2. If user typed a search query that matches a reservoir name or river
    const q = searchQuery.toLowerCase().trim();
    if (q.length >= 2) {
      const matched = reservoirs.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        (Boolean((r as any).river) && (r as any).river.toLowerCase().includes(q))
      );
      if (matched.length > 0) return matched;
    }

    // 3. If a searched place / marker corresponds to a reservoir
    if (searchMarker) {
      const markerName = searchMarker.name.toLowerCase();
      const matched = reservoirs.filter((r) =>
        r.name.toLowerCase().includes(markerName) ||
        markerName.includes(r.name.toLowerCase())
      );
      if (matched.length > 0) return matched;
    }

    // 4. If a command area / region was searched or selected, show its feeding reservoir(s)
    if (selectedRegionId) {
      const regionCanals = canals.filter((c) => c.destination_region_id === selectedRegionId);
      const feedingResIds = new Set(regionCanals.map((c) => c.source_reservoir_id));
      const matched = reservoirs.filter((r) => feedingResIds.has(r.id));
      if (matched.length > 0) return matched;
    }

    // 5. If user explicitly toggled "Show All Reservoirs" via the layer button
    if (showReservoirs) {
      return reservoirs;
    }

    // Default: REMOVE all reservoir diagrams from the map!
    return [];
  }, [reservoirs, canals, searchQuery, selectedReservoirId, selectedRegionId, searchMarker, showReservoirs]);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // SSR-Safe dynamic loading of client Leaflet
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      import("leaflet").then((mod) => {
        setLeafletInstance(mod.default || mod);
      });
    }
  }, []);

  // Track map zoom dynamically to adjust satellite road network visibility
  useEffect(() => {
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      setCurrentZoom(map.getZoom());
      const handleZoom = () => {
        setCurrentZoom(map.getZoom());
      };
      map.on("zoomend", handleZoom);
      return () => {
        map.off("zoomend", handleZoom);
      };
    }
  }, [mounted]);

  // Synchronize initialSelectedRegionId prop with internal selection
  useEffect(() => {
    if (initialSelectedRegionId !== undefined) {
      handleSelectArea(initialSelectedRegionId);
    }
  }, [initialSelectedRegionId]);

  // =========================================================================
  // RELATIONSHIP TOPOLOGY ENGINE: Reservoir ➔ Canal ➔ Command Area ➔ Crops
  // =========================================================================
  const networkRelations = useMemo(() => {
    return canals.map((can) => {
      const sourceRes = reservoirs.find((r) => r.id === can.source_reservoir_id);
      const destReg = regions.find((r) => r.id === can.destination_region_id);
      const relatedCrops = crops.filter((cr) => cr.region_id === can.destination_region_id);
      const util = (can.current_flow_mcm / Math.max(1, can.capacity_mcm)) * 100;

      return {
        id: `rel_${can.id}`,
        canalId: can.id,
        canalName: can.name,
        canalPath: can.path,
        sourceReservoirId: can.source_reservoir_id,
        sourceReservoirName: sourceRes ? sourceRes.name : "Reservoir",
        sourceResCoord: sourceRes ? ([sourceRes.lat, sourceRes.lng] as [number, number]) : null,
        destRegionId: can.destination_region_id,
        destRegionName: destReg ? destReg.name : "Command Area",
        destRegCoord: destReg ? ([destReg.lat, destReg.lng] as [number, number]) : null,
        crops: relatedCrops,
        flowMcm: can.current_flow_mcm,
        capacityMcm: can.capacity_mcm,
        efficiencyPct: Math.round(can.efficiency * 100),
        lossPct: Math.round(can.loss_pct * 100),
        lossMcm: Number((can.current_flow_mcm * can.loss_pct).toFixed(1)),
        irrigatedAreaHa: destReg ? destReg.total_irrigated_area_ha : 0,
        status: util > 85 ? "High Load" : util < 40 ? "Constrained" : "Optimal"
      };
    });
  }, [canals, reservoirs, regions, crops]);

  // Build searchable index from dynamic props + landmarks
  const searchablePlaces: SearchPlace[] = useMemo(() => {
    const list: SearchPlace[] = [];

    // 1. Areas / Regions
    regions.forEach((r) => {
      list.push({
        id: `reg_${r.id}`,
        name: `${r.name} Command Area`,
        type: "area",
        category: "Command District",
        lat: r.lat,
        lng: r.lng,
        zoom: 11,
        details: `${(r.total_irrigated_area_ha / 1000).toFixed(0)}k ha irrigated • ${r.active_farmers.toLocaleString()} farmers`,
        regionId: r.id
      });
    });

    // 2. Reservoirs
    reservoirs.forEach((res) => {
      list.push({
        id: `res_${res.id}`,
        name: res.name,
        type: "reservoir",
        category: "Storage Reservoir",
        lat: res.lat,
        lng: res.lng,
        zoom: 13,
        details: `${res.current_storage_mcm} / ${res.max_capacity_mcm} MCM • Level: ${res.current_level_m}m`
      });
    });

    // 3. Canals
    canals.forEach((can) => {
      const midPoint =
        can.path && can.path.length > 0
          ? can.path[Math.floor(can.path.length / 2)]
          : [16.35, 79.85];
      list.push({
        id: `can_${can.id}`,
        name: can.name,
        type: "canal",
        category: "Branch Canal",
        lat: midPoint[0],
        lng: midPoint[1],
        zoom: 11,
        details: `Capacity: ${can.capacity_mcm} MCM • Flow: ${can.current_flow_mcm} MCM • Eff: ${Math.round(can.efficiency * 100)}%`
      });
    });

    // 4. Landmarks
    FAMOUS_WATER_LANDMARKS.forEach((lm) => list.push(lm));

    return list;
  }, [regions, reservoirs, canals]);

  // Filtered local search suggestions
  const filteredLocalResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return searchablePlaces
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.details.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchQuery, searchablePlaces]);

  // Debounced online geocoding via OpenStreetMap Nominatim for arbitrary places
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      setNominatimResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&limit=4`,
          { headers: { Accept: "application/json" } }
        );
        if (res.ok) {
          const data = await res.json();
          const mapped: SearchPlace[] = data.map((item: any, idx: number) => ({
            id: `geo_${item.place_id || idx}`,
            name: item.display_name.split(",").slice(0, 2).join(","),
            type: "landmark",
            category: item.type || "Global Place",
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            zoom: 11,
            details: item.display_name
          }));
          setNominatimResults(mapped);
        }
      } catch (err) {
        // Fallback silently to local index
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Area Infrastructure Analysis Engine
  const selectedAreaAnalysis = useMemo(() => {
    if (!selectedRegionId) return null;
    const region = regions.find((r) => r.id === selectedRegionId);
    if (!region) return null;

    const canalsPresent = canals.filter((c) => c.destination_region_id === region.id);
    const feedingResIds = new Set(canalsPresent.map((c) => c.source_reservoir_id));

    const reservoirsPresent = reservoirs.filter((res) => {
      const distKm =
        Math.hypot(
          res.lat - region.lat,
          (res.lng - region.lng) * Math.cos((region.lat * Math.PI) / 180)
        ) * 111;
      return feedingResIds.has(res.id) || distKm < 85;
    });

    const cropsGrown = crops.filter((cr) => cr.region_id === region.id);
    const totalAreaDemandMcm = cropsGrown.reduce((s, c) => s + c.total_demand_mcm, 0);
    const totalAreaDeficitMcm = cropsGrown.reduce((s, c) => s + c.deficit_mcm, 0);
    const totalCanalCapacityMcm = canalsPresent.reduce((s, c) => s + c.capacity_mcm, 0);
    const totalCanalFlowMcm = canalsPresent.reduce((s, c) => s + c.current_flow_mcm, 0);
    const totalReservoirStorageMcm = reservoirsPresent.reduce(
      (s, r) => s + r.current_storage_mcm,
      0
    );

    return {
      region,
      reservoirsPresent,
      canalsPresent,
      cropsGrown,
      totalAreaDemandMcm,
      totalAreaDeficitMcm,
      totalCanalCapacityMcm,
      totalCanalFlowMcm,
      totalReservoirStorageMcm
    };
  }, [selectedRegionId, regions, canals, reservoirs, crops]);

  // Handle Fly To presets
  const handleFlyTo = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    if (preset.id === "basin") {
      setSelectedReservoirId(null);
      setSelectedRegionId(null);
    } else if (preset.id === "srisailam") {
      const res = reservoirs.find((r) => r.name.toLowerCase().includes("srisailam"));
      if (res) setSelectedReservoirId(res.id);
    } else if (preset.id === "nagarjuna") {
      const res = reservoirs.find((r) => r.name.toLowerCase().includes("nagarjuna"));
      if (res) setSelectedReservoirId(res.id);
    } else if (preset.id === "prakasam") {
      const res = reservoirs.find((r) => r.name.toLowerCase().includes("prakasam"));
      if (res) setSelectedReservoirId(res.id);
    } else if (preset.id === "guntur") {
      const reg = regions.find((r) => r.name.toLowerCase().includes("guntur"));
      if (reg) setSelectedRegionId(reg.id);
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([preset.lat, preset.lng], preset.zoom, {
        duration: 1.6,
        easeLinearity: 0.25
      });
    }
  };

  // Select an Area
  const handleSelectArea = (regionId: string | null) => {
    setSelectedRegionId(regionId);
    if (regionId) {
      setSelectedRelationId(null);
      setSelectedCanalId(null);
      const reg = regions.find((r) => r.id === regionId);
      if (reg && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([reg.lat, reg.lng], 10, {
          duration: 1.4,
          easeLinearity: 0.25
        });
      }
    }
  };

  // Select a specific relation
  const handleSelectRelation = (relation: (typeof networkRelations)[0]) => {
    setSelectedRelationId(relation.id);
    setSelectedRegionId(relation.destRegionId);
    setSelectedReservoirId(relation.sourceReservoirId);
    setSelectedCanalId(relation.canalId);

    if (mapInstanceRef.current && relation.sourceResCoord && relation.destRegCoord) {
      // Fit bounds across the relation
      const bounds = [
        relation.sourceResCoord,
        relation.destRegCoord,
        ...(relation.canalPath || [])
      ];
      mapInstanceRef.current.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
  };

  // Select a searched place
  const handleSelectSearchedPlace = (place: SearchPlace) => {
    setSearchQuery(place.name);
    setSearchDropdownOpen(false);

    setSearchMarker({
      lat: place.lat,
      lng: place.lng,
      name: place.name,
      details: place.details,
      type: place.category
    });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.lat, place.lng], place.zoom || 11, {
        duration: 1.6,
        easeLinearity: 0.25
      });
    }

    // Check if searched place matches any reservoir
    const matchedRes = reservoirs.find(
      (r) =>
        place.id === `res_${r.id}` ||
        place.id === r.id ||
        r.name.toLowerCase() === place.name.toLowerCase() ||
        place.name.toLowerCase().includes(r.name.toLowerCase()) ||
        r.name.toLowerCase().includes(place.name.toLowerCase())
    );
    if (matchedRes) {
      setSelectedReservoirId(matchedRes.id);
    } else {
      setSelectedReservoirId(null);
    }

    if (place.regionId) {
      setSelectedRegionId(place.regionId);
    } else {
      const matchedReg = regions.find(
        (r) => r.name.toLowerCase() === place.name.toLowerCase() || place.name.includes(r.name)
      );
      if (matchedReg) {
        setSelectedRegionId(matchedReg.id);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // =========================================================================
  // CUSTOM LEAFLET SYMBOLS (RESERVOIRS, CANALS, COMMAND AREAS)
  // =========================================================================

  const getReservoirIcon = useCallback(
    (res: Reservoir, isFeeding: boolean) => {
      if (!leafletInstance) return undefined;
      const pct = Math.round((res.current_storage_mcm / res.max_capacity_mcm) * 100);
      const isCritical = res.status === "Critical";
      const isSelected = selectedReservoirId === res.id || isFeeding;
      const badgeColor = isSelected ? "#10b981" : isCritical ? "#f43f5e" : pct > 75 ? "#06b6d4" : "#10b981";

      return leafletInstance.divIcon({
        className: "leaflet-symbol-reservoir",
        html: `
          <div style="display: flex; align-items: center; gap: 6px; transform: translate(-50%, -50%); cursor: pointer;">
            <div style="
              width: 38px; height: 38px; border-radius: 12px;
              background: rgba(4, 15, 10, 0.94);
              border: 2.5px solid ${badgeColor};
              box-shadow: 0 0 16px ${badgeColor}99, 0 4px 12px rgba(0,0,0,0.7);
              display: flex; align-items: center; justify-content: center;
              font-size: 19px; position: relative; transition: transform 0.2s ease;
            ">
              <span style="filter: drop-shadow(0 0 4px rgba(255,255,255,0.9));">💧</span>
              <span style="
                position: absolute; top: -3px; right: -3px;
                width: 9px; height: 9px; border-radius: 50%;
                background: ${badgeColor};
                box-shadow: 0 0 8px ${badgeColor};
              "></span>
            </div>
            <div style="
              background: rgba(2, 10, 6, 0.92);
              border: 1px solid rgba(255, 255, 255, 0.25);
              border-radius: 9px;
              padding: 3px 8px;
              color: #ffffff;
              white-space: nowrap;
              box-shadow: 0 4px 14px rgba(0,0,0,0.6);
              backdrop-filter: blur(10px);
            ">
              <div style="font-size: 11px; font-weight: 800; color: #ffffff; line-height: 1.2;">
                ${res.name.replace(" Reservoir", "").replace(" (Krishna Delta)", "")}
              </div>
              <div style="font-size: 9px; font-family: monospace; color: #67e8f9; font-weight: 700;">
                ${res.current_storage_mcm} MCM • ${pct}% Full
              </div>
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });
    },
    [leafletInstance, selectedReservoirId]
  );

  const getCanalIcon = useCallback(
    (can: Canal, isConnected: boolean) => {
      if (!leafletInstance) return undefined;
      const isSelected = selectedCanalId === can.id || isConnected;
      const borderColor = isSelected ? "#10b981" : "#38bdf8";
      const glowColor = isSelected ? "#10b98188" : "#0284c788";

      return leafletInstance.divIcon({
        className: "leaflet-symbol-canal",
        html: `
          <div style="display: flex; align-items: center; gap: 5px; transform: translate(-50%, -50%); cursor: pointer;">
            <div style="
              width: 32px; height: 32px; border-radius: 10px;
              background: rgba(3, 16, 26, 0.94);
              border: 2px solid ${borderColor};
              box-shadow: 0 0 14px ${glowColor}, 0 4px 10px rgba(0,0,0,0.6);
              display: flex; align-items: center; justify-content: center;
              font-size: 16px; position: relative; transition: transform 0.2s ease;
            ">
              <span style="filter: drop-shadow(0 0 3px rgba(255,255,255,0.9));">🌊</span>
            </div>
            <div style="
              background: rgba(3, 16, 26, 0.9);
              border: 1px solid rgba(56, 189, 248, 0.35);
              border-radius: 8px;
              padding: 2px 7px;
              color: #ffffff;
              white-space: nowrap;
              box-shadow: 0 4px 12px rgba(0,0,0,0.6);
              backdrop-filter: blur(8px);
            ">
              <div style="font-size: 10px; font-weight: 700; color: #bae6fd; line-height: 1.2;">
                ${can.name.split(" - ")[0]}
              </div>
              <div style="font-size: 8px; font-family: monospace; color: #34d399; font-weight: 700;">
                ${can.current_flow_mcm} MCM • ${Math.round(can.efficiency * 100)}% Eff
              </div>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    },
    [leafletInstance, selectedCanalId]
  );

  const getAreaIcon = useCallback(
    (reg: Region, isSelected: boolean) => {
      if (!leafletInstance) return undefined;
      const borderColor = isSelected ? "#34d399" : "#a855f7";

      return leafletInstance.divIcon({
        className: "leaflet-symbol-area",
        html: `
          <div style="display: flex; align-items: center; gap: 5px; transform: translate(-50%, -50%); cursor: pointer;">
            <div style="
              width: 32px; height: 32px; border-radius: 50%;
              background: rgba(18, 10, 28, 0.94);
              border: 2px solid ${borderColor};
              box-shadow: 0 0 14px ${borderColor}80, 0 4px 10px rgba(0,0,0,0.6);
              display: flex; align-items: center; justify-content: center;
              font-size: 16px; position: relative; transition: transform 0.2s ease;
            ">
              <span>🌾</span>
            </div>
            <div style="
              background: rgba(14, 8, 22, 0.9);
              border: 1px solid ${borderColor}60;
              border-radius: 8px;
              padding: 2px 7px;
              color: #ffffff;
              white-space: nowrap;
              box-shadow: 0 4px 12px rgba(0,0,0,0.6);
              backdrop-filter: blur(8px);
            ">
              <div style="font-size: 10px; font-weight: 800; color: #ffffff; line-height: 1.2;">
                ${reg.name} Command
              </div>
              <div style="font-size: 8px; font-family: monospace; color: #d8b4fe; font-weight: 700;">
                ${(reg.total_irrigated_area_ha / 1000).toFixed(0)}k ha
              </div>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    },
    [leafletInstance]
  );

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-3xl bg-[#0a160e] border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-mono animate-pulse"
      >
        🛰️ Initializing Google Earth Pro High-Resolution Satellite Map...
      </div>
    );
  }

  const regionShortageMap: Record<string, { totalDemand: number; deficit: number }> = {};
  crops.forEach((cr) => {
    if (!regionShortageMap[cr.region_id]) {
      regionShortageMap[cr.region_id] = { totalDemand: 0, deficit: 0 };
    }
    regionShortageMap[cr.region_id].totalDemand += cr.total_demand_mcm;
    regionShortageMap[cr.region_id].deficit += cr.deficit_mcm;
  });

  const activeTileConfig = TILE_CONFIGS[tileStyle];

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden border dark:border-white/10 border-emerald-200/80 shadow-2xl transition-all duration-300 ${
        isFullscreen ? "h-screen rounded-none" : ""
      }`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP-LEFT HUD: SEARCH PLACES & AREA SELECTOR CONTROLS                   */}
      {/* ========================================================================= */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2 pointer-events-auto max-w-[94vw] sm:max-w-[480px]">
        {/* Top Header Badge & Live Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Earth Pro Branding */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-white shadow-xl shrink-0">
            <Globe className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span className="text-xs font-bold font-mono tracking-tight text-white">
              Google Earth Pro <span className="text-emerald-400 font-semibold">• GIS</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
          </div>

          {/* Interactive Place Search Input */}
          <div className="relative flex-1">
            <div className="flex items-center bg-black/85 backdrop-blur-md rounded-2xl border border-white/20 px-3 py-1.5 shadow-xl focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/30 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                onFocus={() => setSearchDropdownOpen(true)}
                placeholder="Search places, reservoirs, canals, cities..."
                className="w-full bg-transparent text-white text-xs placeholder-slate-400 focus:outline-none"
              />
              {isSearching && (
                <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mr-1 shrink-0" />
              )}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchMarker(null);
                    setSelectedReservoirId(null);
                    setSelectedRegionId(null);
                    setSearchDropdownOpen(false);
                  }}
                  className="text-slate-400 hover:text-white transition-colors p-0.5"
                  title="Clear search and hide reservoir diagrams"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Autocomplete Dropdown */}
            {searchDropdownOpen && (filteredLocalResults.length > 0 || nominatimResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-emerald-500/40 shadow-2xl z-[1050] custom-scrollbar divide-y divide-slate-800/80">
                {filteredLocalResults.length > 0 && (
                  <div className="p-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 px-2 py-1 flex items-center justify-between font-bold">
                      <span>Water Network & Command Areas</span>
                      <span>{filteredLocalResults.length} matches</span>
                    </div>
                    {filteredLocalResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSearchedPlace(item)}
                        className="w-full text-left p-2 rounded-xl hover:bg-emerald-950/50 hover:border-emerald-500/30 border border-transparent transition-all flex items-start gap-2.5 group"
                      >
                        <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5 group-hover:bg-emerald-500/30">
                          {item.type === "area" && <Building2 className="w-3.5 h-3.5" />}
                          {item.type === "reservoir" && <Database className="w-3.5 h-3.5 text-cyan-400" />}
                          {item.type === "canal" && <Waves className="w-3.5 h-3.5 text-sky-400" />}
                          {item.type === "landmark" && <MapPin className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.details}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {nominatimResults.length > 0 && (
                  <div className="p-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 px-2 py-1 font-bold">
                      Global Satellite Geocoding
                    </div>
                    {nominatimResults.map((geo) => (
                      <button
                        key={geo.id}
                        onClick={() => handleSelectSearchedPlace(geo)}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-800/60 transition-all flex items-start gap-2.5 group"
                      >
                        <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0 mt-0.5">
                          <Navigation className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 block truncate">
                            {geo.name}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">{geo.details}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active Searched Reservoir Diagram Pill */}
        {searchedReservoirs.length > 0 && (
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-2xl bg-emerald-950/90 border border-emerald-400/60 shadow-xl backdrop-blur-md text-xs text-emerald-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-semibold text-white">Reservoir Diagram:</span>
              <span className="text-cyan-300 font-bold truncate">
                {searchedReservoirs.map((r) => r.name).join(", ")}
              </span>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchMarker(null);
                setSelectedReservoirId(null);
                setSelectedRegionId(null);
              }}
              className="px-2 py-0.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-[10px] text-white shrink-0 transition-colors font-medium border border-emerald-700/50"
              title="Remove reservoir diagrams from map"
            >
              Hide ✕
            </button>
          </div>
        )}

        {/* Area Selection Chips: "Select Area to inspect reservoirs & canals" */}
        <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl overflow-x-auto max-w-[92vw]">
          <span className="text-[10px] font-mono text-emerald-400 font-bold px-1.5 flex items-center gap-1 shrink-0">
            <Building2 className="w-3 h-3" />
            <span>Select Area:</span>
          </span>
          <button
            onClick={() => handleSelectArea(null)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 ${
              selectedRegionId === null && !selectedRelationId
                ? "bg-slate-700 text-white shadow-md border border-slate-500"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            All Areas ({regions.length})
          </button>
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => handleSelectArea(reg.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                selectedRegionId === reg.id
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30 scale-105"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>📍</span>
              <span>{reg.name}</span>
            </button>
          ))}
        </div>

        {/* Relationship Flow Quick Bar */}
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-500/30 shadow-xl overflow-x-auto">
          <button
            onClick={() => setRelationsDrawerOpen(!relationsDrawerOpen)}
            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md flex items-center gap-1.5 shrink-0 hover:brightness-110 transition-all"
            title="Open Interactive Water Relations Flow Network"
          >
            <Network className="w-3.5 h-3.5" />
            <span>🔗 Water Relations ({networkRelations.length})</span>
          </button>

          <span className="text-[10px] font-mono text-slate-400 px-1 hidden sm:inline">Camera:</span>
          {CAMERA_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleFlyTo(preset)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap ${
                activePreset === preset.id
                  ? "bg-emerald-600 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP-RIGHT: SATELLITE MAP STYLE, ROADS & LAYER TOGGLES                  */}
      {/* ========================================================================= */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end gap-2 pointer-events-auto">
        {/* Style Switcher (Earth Pro vs Hybrid vs Terrain vs Night) */}
        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl">
          {(Object.values(TILE_CONFIGS) as TileConfig[]).map((cfg) => (
            <button
              key={cfg.id}
              onClick={() => setTileStyle(cfg.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                tileStyle === cfg.id
                  ? "bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/30 scale-105"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title={cfg.label}
            >
              <span>{cfg.icon}</span>
              <span className="hidden md:inline">{cfg.label.split(" ")[0]}</span>
            </button>
          ))}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors ml-1"
            title="Toggle Fullscreen Map"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feature Layer Toggles (ROADS ON ZOOM + RELATIONS + SYMBOLS) */}
        <div className="flex flex-wrap items-center justify-end gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-white/20 text-xs shadow-xl max-w-[90vw]">
          {/* Roads Toggle (Visible upon zooming, user requested!) */}
          <button
            onClick={() => setShowRoads(!showRoads)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              showRoads
                ? "bg-sky-500/30 text-sky-300 border border-sky-400/60 shadow-sm"
                : "text-slate-500 border border-transparent"
            }`}
            title="Toggle High-Resolution Satellite Roads & Highways"
          >
            <Navigation className="w-3 h-3" />
            <span>🛣️ Roads {showRoads ? "ON" : "OFF"}</span>
          </button>

          {/* Relations Toggle (User Requested!) */}
          <button
            onClick={() => setShowRelations(!showRelations)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              showRelations
                ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/60 shadow-sm"
                : "text-slate-500 border border-transparent"
            }`}
            title="Toggle Water Flow Relationship Dependency Lines"
          >
            <Workflow className="w-3 h-3" />
            <span>🔗 Relations {showRelations ? "ON" : "OFF"}</span>
          </button>

          {/* Symbols Toggle */}
          <button
            onClick={() => setShowSymbols(!showSymbols)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              showSymbols
                ? "bg-amber-500/30 text-amber-300 border border-amber-400/60 shadow-sm"
                : "text-slate-500 border border-transparent"
            }`}
            title="Toggle Reservoir & Canal Symbols on map"
          >
            <Tag className="w-3 h-3" />
            <span>Symbols</span>
          </button>

          <button
            onClick={() => setShowReservoirs(!showReservoirs)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
              showReservoirs || searchedReservoirs.length > 0
                ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 shadow-sm"
                : "text-slate-500"
            }`}
            title="Reservoirs appear automatically when you search a place, or toggle here to show all"
          >
            💧 Reservoirs {searchedReservoirs.length > 0 ? `(${searchedReservoirs.length} Active)` : "(Search to show)"}
          </button>
          <button
            onClick={() => setShowCanals(!showCanals)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
              showCanals ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/50" : "text-slate-500"
            }`}
          >
            🌊 Canals
          </button>
          <button
            onClick={() => setShowRegions(!showRegions)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
              showRegions ? "bg-indigo-500/30 text-indigo-300 border border-indigo-400/50" : "text-slate-500"
            }`}
          >
            🌾 Areas
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DEDICATED RELATIONS NETWORK FLOW DRAWER                                */}
      {/* ========================================================================= */}
      {relationsDrawerOpen && (
        <div className="absolute top-28 right-3 z-[1050] w-[94vw] sm:w-[460px] max-h-[75vh] flex flex-col rounded-3xl bg-slate-950/95 backdrop-blur-xl border border-cyan-500/50 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="p-3.5 bg-gradient-to-r from-cyan-950/90 via-slate-900/90 to-emerald-950/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Water Network Relations</h4>
                <p className="text-[10px] text-slate-300">
                  Source Reservoir ──► Carrying Canal ──► Command Area & Crops
                </p>
              </div>
            </div>
            <button
              onClick={() => setRelationsDrawerOpen(false)}
              className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar text-xs">
            {networkRelations.map((rel) => {
              const isSelected = selectedRelationId === rel.id;
              return (
                <div
                  key={rel.id}
                  onClick={() => handleSelectRelation(rel)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? "bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg"
                      : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900"
                  }`}
                >
                  {/* Relation Flow Chain Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                      <span className="text-cyan-400">💧 {rel.sourceReservoirName.split(" ")[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-emerald-400">🌾 {rel.destRegionName}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {rel.status}
                    </span>
                  </div>

                  {/* Flow Route & Pipeline */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <Waves className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="font-semibold text-sky-200 truncate">{rel.canalName}</span>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] bg-black/40 p-2 rounded-xl text-center">
                    <div>
                      <span className="text-slate-400 block">Discharge</span>
                      <strong className="text-emerald-400 font-mono">{rel.flowMcm} MCM</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Efficiency</span>
                      <strong className="text-cyan-300 font-mono">{rel.efficiencyPct}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Seepage Loss</span>
                      <strong className="text-rose-400 font-mono">{rel.lossMcm} MCM</strong>
                    </div>
                  </div>

                  {/* Destination Crops Under Irrigation */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>
                      Crops: <strong className="text-slate-200">{rel.crops.map((c) => c.crop).join(", ")}</strong>
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <span>View Route on Map</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BOTTOM-LEFT: SELECTED AREA ASSET INSPECTOR (RESERVOIRS & CANALS)       */}
      {/* ========================================================================= */}
      {selectedAreaAnalysis && (
        <div className="absolute bottom-3 left-3 z-[1000] pointer-events-auto w-[94vw] sm:w-[420px] max-h-[380px] flex flex-col rounded-3xl bg-slate-950/95 backdrop-blur-xl border border-emerald-500/50 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-3.5 bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-cyan-950/80 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">
                    {selectedAreaAnalysis.region.name} Command Area
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold shrink-0">
                    Tier {selectedAreaAnalysis.region.priority}/5
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  Soil: {selectedAreaAnalysis.region.soil_type} • Groundwater: {selectedAreaAnalysis.region.groundwater_depth_m}m
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSelectArea(null)}
              className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
              title="Close Area Inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-900/60 border-b border-white/10 text-xs">
            <div className="p-2 rounded-2xl bg-cyan-950/50 border border-cyan-800/40 flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 block font-mono font-medium">Reservoirs Present</span>
                <span className="text-sm font-extrabold text-white">
                  {selectedAreaAnalysis.reservoirsPresent.length} Reservoirs
                </span>
              </div>
            </div>

            <div className="p-2 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Waves className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 block font-mono font-medium">Canals Traversing</span>
                <span className="text-sm font-extrabold text-white">
                  {selectedAreaAnalysis.canalsPresent.length} Canals
                </span>
              </div>
            </div>
          </div>

          <div className="flex border-b border-slate-800 px-3 bg-slate-950/80">
            <button
              onClick={() => setActiveInspectorTab("reservoirs")}
              className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeInspectorTab === "reservoirs"
                  ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Reservoirs ({selectedAreaAnalysis.reservoirsPresent.length})</span>
            </button>
            <button
              onClick={() => setActiveInspectorTab("canals")}
              className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeInspectorTab === "canals"
                  ? "border-emerald-400 text-emerald-300 bg-emerald-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Canals ({selectedAreaAnalysis.canalsPresent.length})</span>
            </button>
            <button
              onClick={() => setActiveInspectorTab("crops")}
              className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeInspectorTab === "crops"
                  ? "border-amber-400 text-amber-300 bg-amber-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Crops ({selectedAreaAnalysis.cropsGrown.length})</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-2 text-xs">
            {activeInspectorTab === "reservoirs" && (
              <div className="space-y-2">
                {selectedAreaAnalysis.reservoirsPresent.map((res) => {
                  const pct = Math.round((res.current_storage_mcm / res.max_capacity_mcm) * 100);
                  return (
                    <div
                      key={res.id}
                      className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col gap-1.5 group cursor-pointer"
                      onClick={() => {
                        setSelectedReservoirId(res.id);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo([res.lat, res.lng], 12);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          {res.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {pct}% Full
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                        <div>Storage: <strong className="text-slate-200">{res.current_storage_mcm} MCM</strong></div>
                        <div>Capacity: <strong className="text-slate-200">{res.max_capacity_mcm} MCM</strong></div>
                        <div>Level: <strong className="text-slate-200">{res.current_level_m}m</strong></div>
                        <div>Inflow: <strong className="text-emerald-400">+{res.expected_inflow_mcm} MCM</strong></div>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeInspectorTab === "canals" && (
              <div className="space-y-2">
                {selectedAreaAnalysis.canalsPresent.map((can) => {
                  const sourceRes = reservoirs.find((r) => r.id === can.source_reservoir_id);
                  const util = Math.round((can.current_flow_mcm / can.capacity_mcm) * 100);
                  return (
                    <div
                      key={can.id}
                      className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col gap-1.5 group cursor-pointer"
                      onClick={() => {
                        setSelectedCanalId(can.id);
                        if (can.path && can.path.length > 0 && mapInstanceRef.current) {
                          const mid = can.path[Math.floor(can.path.length / 2)];
                          mapInstanceRef.current.flyTo(mid, 11);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5 truncate">
                          <Waves className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{can.name}</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                          {Math.round(can.efficiency * 100)}% Eff.
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                        <div>From: <strong className="text-cyan-300 truncate">{sourceRes ? sourceRes.name.split(" ")[0] : "Reservoir"}</strong></div>
                        <div>Capacity: <strong className="text-slate-200">{can.capacity_mcm} MCM</strong></div>
                        <div>Current Flow: <strong className="text-emerald-300">{can.current_flow_mcm} MCM</strong></div>
                        <div>Seepage Loss: <strong className="text-rose-400">{Math.round(can.loss_pct * 100)}%</strong></div>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                          style={{ width: `${Math.min(100, util)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeInspectorTab === "crops" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-900/60 text-[11px]">
                  <div>Total Demand: <strong className="text-amber-300">{selectedAreaAnalysis.totalAreaDemandMcm.toFixed(1)} MCM</strong></div>
                  <div>Moisture Deficit: <strong className="text-rose-400">{selectedAreaAnalysis.totalAreaDeficitMcm.toFixed(1)} MCM</strong></div>
                  <div>Irrigated Acreage: <strong className="text-slate-200">{(selectedAreaAnalysis.region.total_irrigated_area_ha / 1000).toFixed(0)}k ha</strong></div>
                  <div>Active Farmers: <strong className="text-slate-200">{selectedAreaAnalysis.region.active_farmers.toLocaleString()}</strong></div>
                </div>

                {selectedAreaAnalysis.cropsGrown.map((crop) => (
                  <div
                    key={crop.id}
                    className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{crop.crop}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {(crop.area_ha / 1000).toFixed(0)}k ha • {crop.season} ({crop.growth_stage})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-mono font-bold block">{crop.current_allocation_mcm} MCM</span>
                      <span className="text-[10px] text-slate-400">Demand: {crop.total_demand_mcm} MCM</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BOTTOM-RIGHT: GOOGLE EARTH PRO TELEMETRY HUD BAR                       */}
      {/* ========================================================================= */}
      <div className="absolute bottom-3 right-3 z-[1000] hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-[11px] font-mono text-slate-300 shadow-xl pointer-events-none">
        <div className="flex items-center gap-1 text-emerald-400">
          <Crosshair className="w-3.5 h-3.5" />
          <span>Krishna Basin (16.30° N, 80.10° E)</span>
        </div>
        <span className="text-white/20">•</span>
        <span className="text-sky-300 font-semibold">
          Zoom: {currentZoom}x {currentZoom >= 9 && "• 🛣️ Roads Visible"}
        </span>
        <span className="text-white/20">•</span>
        <span className="text-emerald-300 font-semibold">Google Earth Pro</span>
      </div>

      {/* ========================================================================= */}
      {/* 6. LEAFLET MAP CONTAINER WITH PHOTOREALISTIC SATELLITE TILES              */}
      {/* ========================================================================= */}
      <div style={{ height: "100%", width: "100%" }}>
        <MapContainer
          center={[16.35, 79.85]}
          zoom={8}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", backgroundColor: "#040b06" }}
          ref={(map) => {
            if (map) mapInstanceRef.current = map;
          }}
        >
          {/* Base Photorealistic Satellite TileLayer */}
          <TileLayer
            key={activeTileConfig.id}
            attribution={activeTileConfig.attribution}
            url={activeTileConfig.url}
            maxZoom={activeTileConfig.maxZoom}
          />

          {/* HIGH-RESOLUTION SATELLITE ROADS & HIGHWAYS OVERLAY (VISIBLE ON ZOOM) */}
          {showRoads && (
            <TileLayer
              attribution="Roads &copy; Esri, DeLorme, TomTom"
              url={ROADS_OVERLAY_URL}
              maxZoom={19}
              opacity={currentZoom >= 11 ? 0.95 : currentZoom >= 9 ? 0.8 : 0.5}
            />
          )}

          {/* HIGH-RESOLUTION PLACES, TOWNS, BRIDGES & BOUNDARIES OVERLAY */}
          {showRoads && (
            <TileLayer
              attribution="Places &copy; Esri, HERE"
              url={BOUNDARIES_OVERLAY_URL}
              maxZoom={19}
              opacity={0.88}
            />
          )}

          {/* 1. Agricultural Districts / Command Zones */}
          {showRegions &&
            regions.map((reg) => {
              const isSelected = selectedRegionId === reg.id;
              const shortageData = regionShortageMap[reg.id] || { totalDemand: 100, deficit: 10 };
              const shortagePct = (shortageData.deficit / Math.max(1, shortageData.totalDemand)) * 100;
              const circleColor = isSelected
                ? "#10b981"
                : shortagePct > 25
                ? "#f43f5e"
                : shortagePct > 15
                ? "#f59e0b"
                : "#06b6d4";

              return (
                <Circle
                  key={reg.id}
                  center={[reg.lat, reg.lng]}
                  radius={isSelected ? 32000 : 26000}
                  pathOptions={{
                    color: isSelected ? "#34d399" : circleColor,
                    fillColor: circleColor,
                    fillOpacity: isSelected ? 0.32 : selectedRegionId ? 0.08 : 0.16,
                    weight: isSelected ? 4 : 2,
                    dashArray: isSelected ? undefined : "6 6"
                  }}
                  eventHandlers={{
                    click: () => {
                      handleSelectArea(reg.id);
                    }
                  }}
                />
              );
            })}

          {/* 2. Flowing Canal Networks */}
          {showCanals &&
            canals.map((can) => {
              if (!can.path || can.path.length < 2) return null;
              const isConnectedToSelectedArea = selectedRegionId === can.destination_region_id;
              const isSelectedCanal = selectedCanalId === can.id;
              const isDimmed =
                (selectedRegionId && !isConnectedToSelectedArea) ||
                (selectedCanalId && !isSelectedCanal);

              const util = (can.current_flow_mcm / Math.max(1, can.capacity_mcm)) * 100;
              const lineColor = isConnectedToSelectedArea || isSelectedCanal
                ? "#10b981"
                : util > 85
                ? "#f59e0b"
                : "#06b6d4";

              return (
                <React.Fragment key={can.id}>
                  {/* Outer Water Glow Trail */}
                  <Polyline
                    positions={can.path}
                    pathOptions={{
                      color: isConnectedToSelectedArea || isSelectedCanal ? "#34d399" : "#38bdf8",
                      weight: isConnectedToSelectedArea || isSelectedCanal ? 10 : 8,
                      opacity: isDimmed ? 0.1 : isConnectedToSelectedArea || isSelectedCanal ? 0.6 : 0.35,
                      lineCap: "round"
                    }}
                  />
                  {/* Core Flow Line */}
                  <Polyline
                    positions={can.path}
                    pathOptions={{
                      color: lineColor,
                      weight: isConnectedToSelectedArea || isSelectedCanal ? 6 : 4,
                      opacity: isDimmed ? 0.25 : 0.95,
                      dashArray: isConnectedToSelectedArea || isSelectedCanal ? undefined : "8 8",
                      lineCap: "round"
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedCanalId(can.id);
                        setSelectedRegionId(can.destination_region_id);
                        setSelectedReservoirId(can.source_reservoir_id);
                      }
                    }}
                  />
                </React.Fragment>
              );
            })}

          {/* 3. Major Reservoirs with Concentric Rings (Only enabled when place is searched) */}
          {searchedReservoirs.map((res) => {
              const isFeedingSelectedArea =
                selectedAreaAnalysis?.reservoirsPresent.some((r) => r.id === res.id);
              const isSelectedReservoir = selectedReservoirId === res.id;
              const isDimmed =
                (selectedRegionId && !isFeedingSelectedArea) ||
                (selectedReservoirId && !isSelectedReservoir);

              const storagePct = (res.current_storage_mcm / Math.max(1, res.max_capacity_mcm)) * 100;
              const radius = Math.max(12, Math.min(26, (res.max_capacity_mcm / 6500) * 24));
              const resColor = isFeedingSelectedArea || isSelectedReservoir
                ? "#10b981"
                : res.status === "Critical"
                ? "#f43f5e"
                : storagePct > 75
                ? "#06b6d4"
                : "#10b981";

              return (
                <React.Fragment key={res.id}>
                  <CircleMarker
                    center={[res.lat, res.lng]}
                    radius={isFeedingSelectedArea || isSelectedReservoir ? radius + 12 : radius + 8}
                    pathOptions={{
                      color: resColor,
                      fillColor: resColor,
                      fillOpacity: isDimmed ? 0.08 : isFeedingSelectedArea || isSelectedReservoir ? 0.4 : 0.2,
                      weight: isFeedingSelectedArea || isSelectedReservoir ? 2.5 : 1.5
                    }}
                  />

                  <CircleMarker
                    center={[res.lat, res.lng]}
                    radius={radius}
                    pathOptions={{
                      color: isFeedingSelectedArea || isSelectedReservoir ? "#a7f3d0" : "#ffffff",
                      fillColor: resColor,
                      fillOpacity: isDimmed ? 0.35 : 0.95,
                      weight: isFeedingSelectedArea || isSelectedReservoir ? 3.5 : 2.5
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedReservoirId(res.id);
                      }
                    }}
                  />
                </React.Fragment>
              );
            })}

          {/* ========================================================================= */}
          {/* 4. NETWORK RELATIONSHIP FLOW PATHWAYS (USER REQUESTED!)                   */}
          {/* ========================================================================= */}
          {showRelations &&
            networkRelations.map((rel) => {
              if (!rel.sourceResCoord || !rel.destRegCoord || !rel.canalPath || rel.canalPath.length === 0)
                return null;

              const isDirectlyActive =
                selectedRelationId === rel.id ||
                selectedCanalId === rel.canalId ||
                selectedReservoirId === rel.sourceReservoirId ||
                selectedRegionId === rel.destRegionId;

              const isAnyAssetSelected =
                !!selectedRelationId || !!selectedCanalId || !!selectedReservoirId || !!selectedRegionId;

              const isDimmed = isAnyAssetSelected && !isDirectlyActive;

              const fullRelationPath: [number, number][] = [
                rel.sourceResCoord,
                ...(rel.canalPath as [number, number][]),
                rel.destRegCoord
              ];

              return (
                <Polyline
                  key={`rel_flow_${rel.id}`}
                  positions={fullRelationPath}
                  pathOptions={{
                    color: isDirectlyActive ? "#10b981" : "#06b6d4",
                    weight: isDirectlyActive ? 6 : 2.5,
                    opacity: isDimmed ? 0.08 : isDirectlyActive ? 0.95 : 0.65,
                    dashArray: isDirectlyActive ? "10 8" : "6 8",
                    lineCap: "round"
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedRelationId(rel.id);
                      setSelectedRegionId(rel.destRegionId);
                      setSelectedReservoirId(rel.sourceReservoirId);
                      setSelectedCanalId(rel.canalId);
                    }
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2.5 text-slate-800 text-xs font-sans min-w-[240px]">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                        <span className="font-bold text-sm text-emerald-800 flex items-center gap-1">
                          <span>🔗</span>
                          <span>Water Flow Relation</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {rel.status}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-slate-700">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span className="text-cyan-700">💧 {rel.sourceReservoirName.split(" ")[0]} Dam</span>
                          <span>──►</span>
                          <span className="text-sky-700">🌊 {rel.canalName.split(" ")[0]}</span>
                          <span>──►</span>
                          <span className="text-emerald-700">🌾 {rel.destRegionName}</span>
                        </div>
                        <div>Discharge: <strong>{rel.flowMcm} MCM</strong> (Cap: {rel.capacityMcm} MCM)</div>
                        <div>Efficiency: <strong>{rel.efficiencyPct}%</strong> (Loss: {rel.lossMcm} MCM)</div>
                        <div>Irrigated Command: <strong>{(rel.irrigatedAreaHa / 1000).toFixed(0)}k ha</strong></div>
                        <div>Crops: <strong>{rel.crops.map((c) => c.crop).join(", ")}</strong></div>
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              );
            })}

          {/* ========================================================================= */}
          {/* 5. EXPLICIT VISUAL SYMBOLS ON THE MAP                                     */}
          {/* ========================================================================= */}

          {/* A. RESERVOIR SYMBOLS (💧 BADGE & PIN) - ONLY ENABLED WHEN PLACE IS SEARCHED */}
          {showSymbols &&
            leafletInstance &&
            searchedReservoirs.map((res) => {
              const isFeedingSelectedArea =
                selectedAreaAnalysis?.reservoirsPresent.some((r) => r.id === res.id);
              const resIcon = getReservoirIcon(res, !!isFeedingSelectedArea);
              if (!resIcon) return null;

              const storagePct = (res.current_storage_mcm / Math.max(1, res.max_capacity_mcm)) * 100;

              return (
                <Marker
                  key={`sym_res_${res.id}`}
                  position={[res.lat, res.lng]}
                  icon={resIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedReservoirId(res.id);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo([res.lat, res.lng], 13);
                      }
                    }
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-3 text-slate-800 text-xs font-sans min-w-[220px]">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <span>💧</span>
                          <span>{res.name}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
                          {storagePct.toFixed(0)}% Full
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-700">
                        <div>Storage: <strong>{res.current_storage_mcm} / {res.max_capacity_mcm} MCM</strong></div>
                        <div>Reservoir Level: <strong>{res.current_level_m} m (Full: {res.max_level_m} m)</strong></div>
                        <div>Forecasted Inflow: <strong>{res.expected_inflow_mcm} MCM</strong></div>
                        <div>Environmental Reserve: <strong>{res.min_reserve_mcm} MCM</strong></div>
                        <div className="pt-1 text-[10px] text-emerald-700 font-semibold">
                          ✓ Monitored via Google Earth Pro Imagery
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* B. CANAL SYMBOLS (🌊 BADGE & FLOW PIN AT CANAL MIDPOINT) */}
          {showSymbols &&
            leafletInstance &&
            showCanals &&
            canals.map((can) => {
              if (!can.path || can.path.length < 2) return null;
              const midIndex = Math.floor(can.path.length / 2);
              const midCoord = can.path[midIndex];
              const isConnectedToSelectedArea = selectedRegionId === can.destination_region_id;
              const canIcon = getCanalIcon(can, isConnectedToSelectedArea);
              if (!canIcon) return null;

              const util = (can.current_flow_mcm / Math.max(1, can.capacity_mcm)) * 100;

              return (
                <Marker
                  key={`sym_can_${can.id}`}
                  position={midCoord as [number, number]}
                  icon={canIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedCanalId(can.id);
                      setSelectedRegionId(can.destination_region_id);
                      setSelectedReservoirId(can.source_reservoir_id);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo(midCoord as [number, number], 12);
                      }
                    }
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2.5 text-slate-800 text-xs font-sans">
                      <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 mb-1.5 flex items-center gap-1.5">
                        <Waves className="w-4 h-4 text-cyan-600" />
                        <span>{can.name}</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-700">
                        <div>Max Design Capacity: <strong>{can.capacity_mcm} MCM</strong></div>
                        <div>Active Discharge: <strong>{can.current_flow_mcm} MCM</strong></div>
                        <div>Hydraulic Load: <strong className="text-cyan-700">{util.toFixed(1)}%</strong></div>
                        <div>Conveyance Efficiency: <strong className="text-emerald-600">{Math.round(can.efficiency * 100)}%</strong></div>
                        <div>Seepage Loss: <strong className="text-rose-500">{(can.loss_pct * 100).toFixed(1)}%</strong></div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* C. COMMAND AREA SYMBOLS (🌾 BADGE & PIN) */}
          {showSymbols &&
            leafletInstance &&
            showRegions &&
            regions.map((reg) => {
              const isSelected = selectedRegionId === reg.id;
              const areaIcon = getAreaIcon(reg, isSelected);
              if (!areaIcon) return null;

              const shortageData = regionShortageMap[reg.id] || { totalDemand: 100, deficit: 10 };
              const shortagePct = (shortageData.deficit / Math.max(1, shortageData.totalDemand)) * 100;

              return (
                <Marker
                  key={`sym_reg_${reg.id}`}
                  position={[reg.lat, reg.lng]}
                  icon={areaIcon}
                  eventHandlers={{
                    click: () => {
                      handleSelectArea(reg.id);
                    }
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2.5 text-slate-800 text-xs font-sans">
                      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-1.5 mb-2">
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-1">
                          <span>🌾</span>
                          <span>{reg.name} Command Area</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider bg-emerald-600">
                          {isSelected ? "Selected ✓" : "Active"}
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-700">
                        <div>🌾 Irrigated Acreage: <strong>{(reg.total_irrigated_area_ha / 1000).toFixed(0)}k hectares</strong></div>
                        <div>💧 Irrigation Demand: <strong>{shortageData.totalDemand.toFixed(1)} MCM</strong></div>
                        <div>⚠️ Moisture Deficit: <strong className="text-rose-600">{shortageData.deficit.toFixed(1)} MCM ({shortagePct.toFixed(1)}%)</strong></div>
                        <div>👥 Active Farmers: <strong>{reg.active_farmers.toLocaleString()}</strong></div>
                      </div>
                      <button
                        onClick={() => handleSelectArea(reg.id)}
                        className="w-full mt-2 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                      >
                        Inspect Reservoirs & Canals in {reg.name} →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* 6. Active Search Result Marker */}
          {searchMarker && (
            <CircleMarker
              center={[searchMarker.lat, searchMarker.lng]}
              radius={16}
              pathOptions={{
                color: "#f59e0b",
                fillColor: "#fbbf24",
                fillOpacity: 0.9,
                weight: 3.5
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-2.5 text-slate-900 text-xs font-sans">
                  <div className="font-bold text-sm text-amber-700 flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-1">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>{searchMarker.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mb-1">{searchMarker.details}</div>
                  <div className="text-[10px] text-amber-800 font-mono font-semibold">
                    📍 Coordinates: {searchMarker.lat.toFixed(4)}° N, {searchMarker.lng.toFixed(4)}° E
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};
