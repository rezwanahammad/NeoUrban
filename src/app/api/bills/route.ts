import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
    // Main bills query with analytics
    const billsQuery = `
SELECT 
    b.bill_id,
    c.name AS citizen,
    u.type AS utility,
    u.provider,
    b.amount,
    b.due_date,
    b.payment_status,
    CASE 
        WHEN b.due_date < CURRENT_DATE AND b.payment_status = 'Unpaid' 
        THEN DATEDIFF(CURRENT_DATE, b.due_date) 
        ELSE 0 
    END AS days_overdue
FROM Bills b
INNER JOIN Citizens c ON b.citizen_id = c.citizen_id
INNER JOIN Utilities u ON b.utility_id = u.utility_id
ORDER BY b.due_date DESC;
    `;

    // High unpaid bills (similar to your example)
    const highUnpaidQuery = `
      SELECT c.name, SUM(b.amount) AS total_unpaid, COUNT(*) AS unpaid_count,
             AVG(b.amount) AS avg_unpaid_amount,
             MAX(DATEDIFF(CURRENT_DATE, b.due_date)) AS max_days_overdue
      FROM Citizens c
      INNER JOIN Bills b ON c.citizen_id = b.citizen_id
      WHERE b.payment_status = 'Unpaid'
      GROUP BY c.citizen_id, c.name
      HAVING SUM(b.amount) > (SELECT AVG(amount) FROM Bills WHERE payment_status = 'Unpaid')
      ORDER BY total_unpaid DESC
    `;

    // Utility type summary with LEFT OUTER JOIN and aggregations
    const utilitySummaryQuery = `
      SELECT u.type,
             COUNT(b.bill_id) AS total_bills,
             SUM(b.amount) AS total_amount,
             AVG(b.amount) AS avg_amount,
             MIN(b.amount) AS min_amount,
             MAX(b.amount) AS max_amount
      FROM Utilities u
      LEFT OUTER JOIN Bills b ON u.utility_id = b.utility_id
      GROUP BY u.type
      ORDER BY total_amount DESC
    `;

    // Payment status analysis with subquery
    const paymentStatusQuery = `
      SELECT payment_status, 
             COUNT(*) AS bill_count,
             SUM(amount) AS total_amount,
             AVG(amount) AS avg_amount
      FROM Bills
      WHERE due_date >= (SELECT DATE_SUB(MAX(due_date), INTERVAL 30 DAY) FROM Bills)
      GROUP BY payment_status
      ORDER BY total_amount DESC
    `;

    // Execute all queries
    const [bills] = await db.query(billsQuery);
    const [highUnpaid] = await db.query(highUnpaidQuery);
    const [utilitySummary] = await db.query(utilitySummaryQuery);
    const [paymentStatus] = await db.query(paymentStatusQuery);

    return Response.json({
      bills,
      analytics: {
        highUnpaid,
        utilitySummary,
        paymentStatus
      }
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
