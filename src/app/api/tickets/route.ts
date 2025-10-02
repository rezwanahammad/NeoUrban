import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
    // Main tickets query with analytics
    const ticketsQuery = `
      SELECT t.ticket_id, c.name AS citizen_name, tr.type AS transport_type, 
             tr.route, t.fare, t.booking_date,
             -- Aggregations per transport type
             COUNT(*) OVER (PARTITION BY tr.type) AS tickets_per_type,
             AVG(t.fare) OVER (PARTITION BY tr.type) AS avg_fare_per_type,
             SUM(t.fare) OVER (PARTITION BY tr.type) AS revenue_per_type,
             -- Citizen analytics
             COUNT(*) OVER (PARTITION BY c.citizen_id) AS citizen_ticket_count,
             SUM(t.fare) OVER (PARTITION BY c.citizen_id) AS citizen_total_spent
      FROM Tickets t
      INNER JOIN Citizens c ON t.citizen_id = c.citizen_id
      INNER JOIN Transportation tr ON t.transport_id = tr.transport_id
      ORDER BY t.booking_date DESC
    `;

    // High spenders using GROUP BY and HAVING
    const highSpendersQuery = `
      SELECT c.name, SUM(t.fare) AS total_spent, COUNT(*) AS ticket_count
      FROM Citizens c
      INNER JOIN Tickets t ON c.citizen_id = t.citizen_id
      GROUP BY c.citizen_id, c.name
      HAVING SUM(t.fare) > 50
      ORDER BY total_spent DESC
      LIMIT 5
    `;

    // Route performance with aggregations (COUNT, SUM, AVG, MIN, MAX)
    const routePerformanceQuery = `
      SELECT tr.route, tr.type,
             COUNT(t.ticket_id) AS total_bookings,
             SUM(t.fare) AS total_revenue,
             AVG(t.fare) AS avg_fare,
             MIN(t.fare) AS min_fare,
             MAX(t.fare) AS max_fare
      FROM Transportation tr
      LEFT OUTER JOIN Tickets t ON tr.transport_id = t.transport_id
      GROUP BY tr.transport_id, tr.route, tr.type
      ORDER BY total_revenue DESC
      LIMIT 5
    `;

    // Transport type summary with simple aggregations
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

    // Recent bookings with subquery
    const recentBookingsQuery = `
      SELECT c.name, tr.type, tr.route, t.fare, t.booking_date
      FROM Tickets t
      INNER JOIN Citizens c ON t.citizen_id = c.citizen_id
      INNER JOIN Transportation tr ON t.transport_id = tr.transport_id
      WHERE t.booking_date >= (SELECT DATE_SUB(MAX(booking_date), INTERVAL 7 DAY) FROM Tickets)
      ORDER BY t.booking_date DESC
      LIMIT 10
    `;

    // Execute all queries
    const [tickets] = await db.query(ticketsQuery);
    const [highSpenders] = await db.query(highSpendersQuery);
    const [routePerformance] = await db.query(routePerformanceQuery);
    const [transportSummary] = await db.query(transportSummaryQuery);
    const [recentBookings] = await db.query(recentBookingsQuery);

    return Response.json({
      tickets,
      analytics: {
        highSpenders,
        routePerformance,
        transportSummary,
        recentBookings
      }
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}