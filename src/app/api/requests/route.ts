import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
    // Main requests with analytics
    const requestsQuery = `
      SELECT r.request_id, c.name AS citizen_name, s.service_name, s.category, 
             r.status, r.priority, r.request_date, c.age, c.gender,
             -- Aggregations
             COUNT(*) OVER (PARTITION BY r.status) AS status_count,
             COUNT(*) OVER (PARTITION BY s.category) AS category_count,
             AVG(c.age) OVER (PARTITION BY r.priority) AS avg_age_by_priority,
             -- Days since request
             DATEDIFF(CURRENT_DATE, r.request_date) AS days_open
      FROM Requests r
      INNER JOIN Citizens c ON r.citizen_id = c.citizen_id
      INNER JOIN Services s ON r.service_id = s.service_id
      ORDER BY r.request_date DESC
    `;

    // High-demand citizens using GROUP BY and HAVING
    const highDemandCitizensQuery = `
      SELECT c.name, COUNT(*) AS total_requests, s.category
      FROM Citizens c
      INNER JOIN Requests r ON c.citizen_id = r.citizen_id
      INNER JOIN Services s ON r.service_id = s.service_id
      GROUP BY c.citizen_id, c.name, s.category
      HAVING COUNT(*) > 2
      ORDER BY total_requests DESC
      LIMIT 5
    `;

    // Service status summary using LEFT OUTER JOIN and aggregations
    const statusSummaryQuery = `
      SELECT r.status,
             COUNT(r.request_id) AS total_requests,
             AVG(DATEDIFF(CURRENT_DATE, r.request_date)) AS avg_days_open,
             MIN(r.request_date) AS oldest_request,
             MAX(r.request_date) AS newest_request
      FROM Requests r
      LEFT OUTER JOIN Services s ON r.service_id = s.service_id
      GROUP BY r.status
      ORDER BY total_requests DESC
    `;

    // Service category analysis with subquery
    const categoryAnalysisQuery = `
      SELECT s.category, COUNT(r.request_id) AS total_requests,
             AVG(DATEDIFF(CURRENT_DATE, r.request_date)) AS avg_days_open
      FROM Services s
      INNER JOIN Requests r ON s.service_id = r.service_id
      WHERE r.request_date >= (SELECT DATE_SUB(MAX(request_date), INTERVAL 30 DAY) FROM Requests)
      GROUP BY s.category
      ORDER BY total_requests DESC
    `;

    // Execute all queries
    const [requests] = await db.query(requestsQuery);
    const [highDemandCitizens] = await db.query(highDemandCitizensQuery);
    const [statusSummary] = await db.query(statusSummaryQuery);
    const [categoryAnalysis] = await db.query(categoryAnalysisQuery);

    return Response.json({
      requests,
      analytics: {
        highDemandCitizens,
        statusSummary,
        categoryAnalysis
      }
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}