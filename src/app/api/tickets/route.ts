import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
    const ticketsQuery = `
      SELECT 
    t.ticket_id,
    c.name AS citizen_name,
    tr.type AS transport_type,
    tr.route,
    t.fare,
    t.booking_date
FROM Tickets t
INNER JOIN Citizens c ON t.citizen_id = c.citizen_id
INNER JOIN Transportation tr ON t.transport_id = tr.transport_id
ORDER BY ticket_id;
    `;

    const highSpendersQuery = `
      SELECT c.name, SUM(t.fare) AS total_spent, COUNT(*) AS ticket_count
      FROM Citizens c
      INNER JOIN Tickets t ON c.citizen_id = t.citizen_id
      GROUP BY c.citizen_id, c.name
      HAVING SUM(t.fare) > 100
      ORDER BY total_spent DESC
    `;

    const routePerformanceQuery = `
      SELECT tr.route, tr.type,
             COUNT(t.ticket_id) AS total_bookings,
             SUM(t.fare) AS total_revenue,
             AVG(t.fare) AS avg_fare
      FROM Transportation tr
      LEFT OUTER JOIN Tickets t ON tr.transport_id = t.transport_id
      GROUP BY tr.transport_id, tr.route, tr.type
      ORDER BY total_revenue DESC
    `;

    const transportSummaryQuery = `
      SELECT tr.type AS transport_type,
             COUNT(t.ticket_id) AS total_bookings,
             SUM(t.fare) AS total_revenue,
             AVG(t.fare) AS avg_fare
      FROM Transportation tr
      INNER JOIN Tickets t ON tr.transport_id = t.transport_id
      GROUP BY tr.type
      ORDER BY total_revenue DESC
    `;

    const [tickets] = await db.query(ticketsQuery);
    const [highSpenders] = await db.query(highSpendersQuery);
    const [routePerformance] = await db.query(routePerformanceQuery);
    const [transportSummary] = await db.query(transportSummaryQuery);

    return Response.json({
      tickets,
      analytics: {
        highSpenders,
        routePerformance,
        transportSummary,
        
      }
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}