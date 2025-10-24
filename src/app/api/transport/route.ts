import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
    /**
     * Transportation SQL Query:
     * - Fetches all transportation systems with their details
     * - Includes transport ID, type, route, and capacity
     * - Ordered by capacity in descending order for better visualization
     */
    const facilitiesQuery = `
      SELECT transport_id as id, type, route, capacity
      FROM Transportation
      ORDER BY id
    `;
    
    /**
     * Transportation Statistics SQL Query:
     * - Calculates total transport systems count
     * - Computes total capacity across all systems
     * - Calculates average capacity per system
     * - Finds highest capacity system
     * - Counts systems by type (Bus, Metro, Train)
     * - All calculations done at database level for performance
     */
    const statisticsQuery = `
      SELECT 
        COUNT(*) as total_systems,
        SUM(capacity) as total_capacity,
        AVG(capacity) as average_capacity,
        MAX(capacity) as highest_capacity,
        MIN(capacity) as lowest_capacity,
        SUM(CASE WHEN type = 'Bus' THEN 1 ELSE 0 END) as bus_count,
        SUM(CASE WHEN type = 'Metro' THEN 1 ELSE 0 END) as metro_count,
        SUM(CASE WHEN type = 'Train' THEN 1 ELSE 0 END) as train_count
      FROM Transportation
    `;

    // Execute both queries
    const [systems] = await db.query(facilitiesQuery);
    const [stats] = await db.query(statisticsQuery);
    
    // Define interface for statistics result
    interface TransportStats {
      total_systems: number;
      total_capacity: number;
      average_capacity: number;
      highest_capacity: number;
      lowest_capacity: number;
      bus_count: number;
      metro_count: number;
      train_count: number;
    }

    const statisticsResult = Array.isArray(stats) && stats.length > 0 
      ? (stats[0] as TransportStats)
      : {
          total_systems: 0,
          total_capacity: 0,
          average_capacity: 0,
          highest_capacity: 0,
          lowest_capacity: 0,
          bus_count: 0,
          metro_count: 0,
          train_count: 0
        };

    return Response.json({
      systems: systems,
      statistics: statisticsResult
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}