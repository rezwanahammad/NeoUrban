import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

/*
 * Bills API - Returns 5 analytical queries using only allowed SQL operations
 * 
 * Query 1: Main bills list
 *   - DISTINCT for unique records
 *   - INNER JOIN with Citizens and Utilities tables
 *   - CASE statement for bill status logic
 *   - Multi-column ORDER BY (due_date DESC, amount DESC)
 *   - Column aliasing with AS
 * 
 * Query 2: High unpaid bills analysis
 *   - INNER JOIN with Citizens
 *   - WHERE with IN clause for multiple status values
 *   - GROUP BY for aggregating by citizen
 *   - HAVING with subquery to filter above-average unpaid amounts
 *   - All 5 aggregate functions: COUNT, SUM, AVG, MAX, MIN
 * 
 * Query 3: Utility summary
 *   - LEFT OUTER JOIN to include all utilities (even without bills)
 *   - GROUP BY utility type
 *   - All aggregate functions: COUNT, SUM, AVG, MIN, MAX
 * 
 * Query 4: Amount range analysis
 *   - BETWEEN operator for amount ranges (0-100, 101-500, etc.)
 *   - CASE statement for range categorization
 *   - NOT IN to exclude cancelled bills
 *   - INNER JOIN with Utilities
 *   - GROUP BY for range and utility type
 * 
 * Query 5: Payment status breakdown
 *   - UNION ALL set operation to combine Paid and Unpaid results
 *   - Separate SELECT statements for each payment status
 *   - Aggregate functions: COUNT, SUM, AVG
 *   - ORDER BY for sorting results
 */

export async function GET() {
  try {
    const db = getDB();
    
    // Query 1: Main bills query - INNER JOIN, Column Aliasing, ORDER BY, DISTINCT
    const billsQuery = `
      SELECT DISTINCT
          b.bill_id,
          c.name AS citizen_name,
          u.type AS utility_type,
          u.provider AS utility_provider,
          b.amount AS bill_amount,
          b.due_date,
          b.payment_status,
          CASE 
              WHEN b.due_date < CURRENT_DATE AND b.payment_status = 'Unpaid' THEN 'Overdue'
              WHEN b.payment_status = 'Unpaid' THEN 'Pending'
              ELSE 'Paid'
          END AS bill_status
      FROM Bills b
      INNER JOIN Citizens c ON b.citizen_id = c.citizen_id
      INNER JOIN Utilities u ON b.utility_id = u.utility_id
      ORDER BY b.due_date DESC, b.amount DESC
    `;

    // Query 2: High unpaid bills - Subquery in HAVING, GROUP BY, Aggregate Functions
    const highUnpaidQuery = `
      SELECT 
          c.name AS citizen_name, 
          SUM(b.amount) AS total_unpaid, 
          COUNT(*) AS unpaid_count,
          AVG(b.amount) AS avg_unpaid_amount,
          MAX(b.amount) AS max_amount,
          MIN(b.amount) AS min_amount
      FROM Citizens c
      INNER JOIN Bills b ON c.citizen_id = b.citizen_id
      WHERE b.payment_status IN ('Unpaid', 'Pending')
      GROUP BY c.citizen_id, c.name
      HAVING SUM(b.amount) > (
          SELECT AVG(amount) 
          FROM Bills 
          WHERE payment_status IN ('Unpaid', 'Pending')
      )
      ORDER BY total_unpaid DESC
    `;

    // Query 3: Utility summary - LEFT OUTER JOIN, Aggregations, UNION
    const utilitySummaryQuery = `
      SELECT 
          u.type AS utility_type,
          COUNT(b.bill_id) AS total_bills,
          SUM(b.amount) AS total_amount,
          AVG(b.amount) AS avg_amount,
          MIN(b.amount) AS min_amount,
          MAX(b.amount) AS max_amount
      FROM Utilities u
      LEFT OUTER JOIN Bills b ON u.utility_id = b.utility_id
      GROUP BY u.utility_id, u.type
      ORDER BY total_amount DESC
    `;

    // Query 4: Amount range analysis - BETWEEN, Pattern Matching with LIKE
    const amountRangeQuery = `
      SELECT 
          CASE
              WHEN b.amount BETWEEN 0 AND 100 THEN 'Low (0-100)'
              WHEN b.amount BETWEEN 101 AND 500 THEN 'Medium (101-500)'
              WHEN b.amount BETWEEN 501 AND 1000 THEN 'High (501-1000)'
              ELSE 'Very High (1000+)'
          END AS amount_range,
          COUNT(*) AS bill_count,
          SUM(b.amount) AS total_amount,
          u.type AS utility_type
      FROM Bills b
      INNER JOIN Utilities u ON b.utility_id = u.utility_id
      WHERE b.payment_status NOT IN ('Cancelled')
      GROUP BY amount_range, u.type
      ORDER BY total_amount DESC
    `;

    // Query 5: Payment status with Set Operations - UNION ALL
    const paymentStatusQuery = `
      SELECT 
          'Paid' AS payment_status, 
          COUNT(*) AS bill_count,
          SUM(amount) AS total_amount,
          AVG(amount) AS avg_amount
      FROM Bills
      WHERE payment_status = 'Paid'
      UNION ALL
      SELECT 
          'Unpaid' AS payment_status, 
          COUNT(*) AS bill_count,
          SUM(amount) AS total_amount,
          AVG(amount) AS avg_amount
      FROM Bills
      WHERE payment_status = 'Unpaid'
      ORDER BY total_amount DESC
    `;

    // Execute all queries
    const [bills] = await db.query(billsQuery);
    const [highUnpaid] = await db.query(highUnpaidQuery);
    const [utilitySummary] = await db.query(utilitySummaryQuery);
    const [amountRange] = await db.query(amountRangeQuery);
    const [paymentStatus] = await db.query(paymentStatusQuery);

    return Response.json({
      bills,
      analytics: {
        highUnpaid,
        utilitySummary,
        amountRange,
        paymentStatus
      }
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
