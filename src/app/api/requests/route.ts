import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

/*
 * Requests API - Returns 6 analytical queries using only allowed SQL operations
 * 
 * Query 1: Main requests list
 *   - DISTINCT for unique records
 *   - INNER JOIN with Citizens and Services tables
 *   - CASE statement for status labels
 *   - Multi-column ORDER BY (request_date DESC, priority ASC)
 *   - Column aliasing with AS
 * 
 * Query 2: High-demand citizens
 *   - INNER JOIN with USING clause (natural join alternative)
 *   - WHERE with IN clause for active statuses
 *   - GROUP BY for multiple columns
 *   - HAVING with COUNT filter (> 1)
 *   - Aggregate functions: COUNT, MAX
 * 
 * Query 3: Status summary with Common Table Expression (CTE)
 *   - WITH clause defining StatusCounts CTE
 *   - Subquery in SELECT for percentage calculation
 *   - GROUP BY status
 *   - Aggregate functions: COUNT, MIN, MAX
 *   - Arithmetic expressions for percentage (ROUND)
 * 
 * Query 4: Category analysis
 *   - Multiple INNER JOINs (Services, Requests, Citizens)
 *   - NOT IN to exclude certain categories
 *   - GROUP BY for category and service
 *   - HAVING with COUNT filter
 *   - AVG aggregate function
 * 
 * Query 5: Priority analysis with Set Operations
 *   - UNION (not UNION ALL) to combine three separate queries
 *   - Separate SELECT for each priority level (High, Medium, Low)
 *   - INNER JOIN in each query
 *   - Aggregate functions: COUNT, AVG
 *   - ORDER BY at the end
 * 
 * Query 6: Age range analysis
 *   - BETWEEN operator for age ranges (0-18, 19-35, 36-60, 60+)
 *   - CASE statement for age group categorization
 *   - COUNT DISTINCT for unique counts
 *   - Multiple INNER JOINs
 *   - GROUP BY for age group and category
 */

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
          c.age AS citizen_age, 
          c.gender AS citizen_gender,
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

    // Query 2: High-demand citizens - NATURAL JOIN alternative, GROUP BY, HAVING
    const highDemandCitizensQuery = `
      SELECT 
          c.name AS citizen_name, 
          c.age,
          c.gender,
          COUNT(*) AS total_requests, 
          s.category AS service_category,
          MAX(r.request_date) AS last_request_date
      FROM Citizens c
      INNER JOIN Requests r USING (citizen_id)
      INNER JOIN Services s ON r.service_id = s.service_id
      WHERE r.status IN ('Pending', 'In Progress')
      GROUP BY c.citizen_id, c.name, c.age, c.gender, s.category
      HAVING COUNT(*) > 1
      ORDER BY total_requests DESC
    `;

    // Query 3: Status summary with Common Table Expression (CTE)
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

    // Query 4: Category analysis with Subquery in FROM
    const categoryAnalysisQuery = `
      SELECT 
          s.category,
          s.service_name,
          COUNT(r.request_id) AS total_requests,
          AVG(c.age) AS avg_citizen_age
      FROM Services s
      INNER JOIN Requests r ON s.service_id = r.service_id
      INNER JOIN Citizens c ON r.citizen_id = c.citizen_id
      WHERE s.category NOT IN ('Cancelled', 'Deprecated')
      GROUP BY s.category, s.service_name
      HAVING COUNT(r.request_id) > 0
      ORDER BY total_requests DESC
    `;

    // Query 5: Priority analysis with Set Operations - UNION
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

    // Query 6: Age range analysis - BETWEEN, Arithmetic Expressions
    const ageRangeQuery = `
      SELECT 
          CASE
              WHEN c.age BETWEEN 0 AND 18 THEN 'Youth (0-18)'
              WHEN c.age BETWEEN 19 AND 35 THEN 'Young Adult (19-35)'
              WHEN c.age BETWEEN 36 AND 60 THEN 'Adult (36-60)'
              ELSE 'Senior (60+)'
          END AS age_group,
          COUNT(DISTINCT r.request_id) AS request_count,
          COUNT(DISTINCT c.citizen_id) AS citizen_count,
          s.category
      FROM Citizens c
      INNER JOIN Requests r ON c.citizen_id = r.citizen_id
      INNER JOIN Services s ON r.service_id = s.service_id
      GROUP BY age_group, s.category
      ORDER BY request_count DESC
    `;

    // Execute all queries
    const [requests] = await db.query(requestsQuery);
    const [highDemandCitizens] = await db.query(highDemandCitizensQuery);
    const [statusSummary] = await db.query(statusSummaryQuery);
    const [categoryAnalysis] = await db.query(categoryAnalysisQuery);
    const [priorityAnalysis] = await db.query(priorityAnalysisQuery);
    const [ageRange] = await db.query(ageRangeQuery);

    return Response.json({
      requests,
      analytics: {
        highDemandCitizens,
        statusSummary,
        categoryAnalysis,
        priorityAnalysis,
        ageRange
      }
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}