import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

/*
 * Bills API - Returns 2 analytical queries using only allowed SQL operations
 * 
 * Query 1: Main bills list
 *   - DISTINCT for unique records
 *   - INNER JOIN with Citizens and Utilities tables
 *   - CASE statement for bill status logic
 *   - Multi-column ORDER BY (due_date DESC, amount DESC)
 *   - Column aliasing with AS
 * 
 * Query 2: Payment status breakdown
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
      ORDER BY b.due_date DESC
    `;

    // Query 2: Payment status with Set Operations - UNION ALL
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
    const [paymentStatus] = await db.query(paymentStatusQuery);

    return Response.json({
      bills,
      analytics: {
        paymentStatus
      }
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
