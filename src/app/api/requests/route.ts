import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
    // Query 1: Main requests - INNER JOIN, DISTINCT, Column Aliasing, Multi-column ORDER BY
    const requestsQuery = `
      SELECT DISTINCT
          r.request_id, 
          c.name AS citizen_name, 
          s.service_name, 
          s.category AS service_category, 
          r.status AS request_status, 
          r.priority AS request_priority, 
          r.request_date, 
          CASE 
              WHEN r.status = 'Completed' THEN 'Done'
              WHEN r.status = 'In Progress' THEN 'Active'
              ELSE 'Waiting'
          END AS status_label
      FROM Requests r
      INNER JOIN Citizens c ON r.citizen_id = c.citizen_id
      INNER JOIN Services s ON r.service_id = s.service_id
      ORDER BY r.request_date DESC, r.priority ASC
    `;

    //use of WITH clause
    const statusSummaryQuery = `
      WITH StatusCounts AS (
          SELECT 
              r.status,
              COUNT(r.request_id) AS total_requests,
              MIN(r.request_date) AS oldest_request,
              MAX(r.request_date) AS newest_request
          FROM Requests r
          GROUP BY r.status
      )
      SELECT 
          sc.status,
          sc.total_requests,
          sc.oldest_request,
          sc.newest_request,
          ROUND(sc.total_requests * 100.0 / (SELECT SUM(total_requests) FROM StatusCounts), 2) AS percentage
      FROM StatusCounts sc
      ORDER BY sc.total_requests DESC
    `;

    // use of UNION to combine priority levels
    const priorityAnalysisQuery = `
      SELECT 
          'High' AS priority_level,
          COUNT(*) AS request_count,
          AVG(c.age) AS avg_age
      FROM Requests r
      INNER JOIN Citizens c ON r.citizen_id = c.citizen_id
      WHERE r.priority = 'High'
      UNION
      SELECT 
          'Medium' AS priority_level,
          COUNT(*) AS request_count,
          AVG(c.age) AS avg_age
      FROM Requests r
      INNER JOIN Citizens c ON r.citizen_id = c.citizen_id
      WHERE r.priority = 'Medium'
      UNION
      SELECT 
          'Low' AS priority_level,
          COUNT(*) AS request_count,
          AVG(c.age) AS avg_age
      FROM Requests r
      INNER JOIN Citizens c ON r.citizen_id = c.citizen_id
      WHERE r.priority = 'Low'
      ORDER BY request_count DESC
    `;

    const [requests] = await db.query(requestsQuery);
    const [statusSummary] = await db.query(statusSummaryQuery);
    const [priorityAnalysis] = await db.query(priorityAnalysisQuery);

    return Response.json({
      requests,
      analytics: {
        statusSummary,
        priorityAnalysis,
      }
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}