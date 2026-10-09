import { AQUAFLOW_CONFIG, FEATURED_DAMS, DamInfo, CanalItem } from "../data/aquaFlowConfig";

export class WaterService {
  /**
   * Fetches all featured dams with telemetry metrics.
   * Clearly marked as Demo Hydrology Data.
   */
  static async getDams(): Promise<DamInfo[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(FEATURED_DAMS), 50);
    });
  }

  /**
   * Fetches a single dam by ID.
   */
  static async getDamById(id: string): Promise<DamInfo | undefined> {
    const dam = FEATURED_DAMS.find((d) => d.id === id);
    return Promise.resolve(dam || FEATURED_DAMS[0]);
  }

  /**
   * Searches dams and canals by search query string.
   */
  static async searchInfrastructure(query: string): Promise<{
    dams: DamInfo[];
    canals: { name: string; details: string; link: string }[];
  }> {
    const q = query.toLowerCase().trim();
    if (!q) return { dams: [], canals: [] };

    const matchingDams = FEATURED_DAMS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.river.toLowerCase().includes(q)
    );

    const canalNames = [
      { name: "Nagarjuna Sagar Right Main Canal", details: "980 km network • Guntur Command", link: "/canals" },
      { name: "Nagarjuna Sagar Left Main Canal", details: "Nalgonda & Khammam command", link: "/canals" },
      { name: "Polavaram Right Main Canal", details: "Inter-basin link to Krishna Delta", link: "/canals" },
      { name: "Krishna Delta Main Canal System", details: "Active 95% flow • Vijayawada", link: "/canals" },
      { name: "Tungabhadra High Level Canal", details: "Rayalaseema irrigation branch", link: "/canals" }
    ];

    const matchingCanals = canalNames.filter((c) =>
      c.name.toLowerCase().includes(q) || c.details.toLowerCase().includes(q)
    );

    return { dams: matchingDams, canals: matchingCanals };
  }

  /**
   * Retrieves weather and atmospheric telemetry for AP / Telangana river catchments.
   */
  static getWeatherSummary() {
    return AQUAFLOW_CONFIG.weather;
  }
}
