import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
    // Create a view for days calculation using basic SQL
    const createDaysOpenViewQuery = `
      CREATE OR REPLACE VIEW RequestDaysView AS
      SELECT 
          r.request_id,
          r.citizen_id,
          r.service_id,
          r.status,
          r.priority,
          r.request_date,
          (YEAR(CURRENT_DATE) - YEAR(r.request_date)) * 365 + 
          (MONTH(CURRENT_DATE) - MONTH(r.request_date)) * 30 + 
          (DAY(CURRENT_DATE) - DAY(r.request_date)) AS days_open
      FROM Requests r
    `;
    
    await db.query(createDaysOpenViewQuery);
    
    // Main requests with analytics using INNER JOIN and window functions
    const requestsQuery = `
      SELECT 
          v.request_id, 
          c.name AS citizen_name, 
          s.service_name, 
          s.category, 
          v.status, 
          v.priority, 
          v.request_date, 
          c.age, 
          c.gender,
          COUNT(*) OVER (PARTITION BY v.status) AS status_count,
          COUNT(*) OVER (PARTITION BY s.category) AS category_count,
          AVG(c.age) OVER (PARTITION BY v.priority) AS avg_age_by_priority,
          v.days_open
      FROM RequestDaysView v
      INNER JOIN Citizens c ON v.citizen_id = c.citizen_id
      INNER JOIN Services s ON v.service_id = s.service_id
      ORDER BY v.request_date DESC
    `;

    // High-demand citizens using GROUP BY and HAVING with INNER JOIN
    const highDemandCitizensQuery = `
      SELECT 
          c.name, 
          COUNT(*) AS total_requests, 
          s.category
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
      SELECT 
          v.status,
          COUNT(v.request_id) AS total_requests,
          AVG(v.days_open) AS avg_days_open,
          MIN(v.request_date) AS oldest_request,
          MAX(v.request_date) AS newest_request
      FROM RequestDaysView v
      LEFT OUTER JOIN Services s ON v.service_id = s.service_id
      GROUP BY v.status
      ORDER BY total_requests DESC
    `;

    // Service category analysis with subquery
    const categoryAnalysisQuery = `
      SELECT 
          s.category, 
          COUNT(v.request_id) AS total_requests,
          AVG(v.days_open) AS avg_days_open
      FROM Services s
      INNER JOIN RequestDaysView v ON s.service_id = v.service_id
      WHERE v.request_date >= (
          SELECT DATE_SUB(MAX(request_date), INTERVAL 30 DAY) 
          FROM Requests
      )
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