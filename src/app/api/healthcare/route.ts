import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
    // Main healthcare facilities query
    const facilitiesQuery = `
      SELECT hospital_id as id, name, location, capacity
      FROM Healthcare
      ORDER BY id
    `;
    
    // Capacity statistics query using aggregations
    const statisticsQuery = `
      SELECT 
        COUNT(*) AS total_facilities,
        SUM(capacity) AS total_capacity,
        AVG(capacity) AS average_capacity,
        MAX(capacity) AS largest_capacity,
        MIN(capacity) AS smallest_capacity
      FROM Healthcare
    `;
    
    // Execute both queries
    const [facilities] = await db.query(facilitiesQuery);
    const [stats] = await db.query(statisticsQuery);
    
    // Define interface for statistics result
    interface CapacityStats {
      total_facilities: number;
      total_capacity: number;
      average_capacity: number;
      largest_capacity: number;
      smallest_capacity: number;
    }

    const statisticsResult = Array.isArray(stats) && stats.length > 0 
      ? (stats[0] as CapacityStats)
      : {
          total_facilities: 0,
          total_capacity: 0,
          average_capacity: 0,
          largest_capacity: 0,
          smallest_capacity: 0
        };

    return Response.json({
      facilities: facilities,
      statistics: statisticsResult
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}