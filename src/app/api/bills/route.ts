import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
    // Create a view for overdue bills calculation using basic SQL
    const createOverdueViewQuery = `
      CREATE OR REPLACE VIEW OverdueBillsView AS
      SELECT 
          b.bill_id,
          b.citizen_id,
          b.utility_id,
          b.amount,
          b.due_date,
          b.payment_status,
          CASE 
              WHEN b.due_date < CURRENT_DATE AND b.payment_status = 'Unpaid' 
              THEN (YEAR(CURRENT_DATE) - YEAR(b.due_date)) * 365 + 
                   (MONTH(CURRENT_DATE) - MONTH(b.due_date)) * 30 + 
                   (DAY(CURRENT_DATE) - DAY(b.due_date))
              ELSE 0 
          END AS days_overdue
      FROM Bills b
    `;
    
    await db.query(createOverdueViewQuery);
    
    // Main bills query using INNER JOIN and the view
    const billsQuery = `
      SELECT 
          v.bill_id,
          c.name AS citizen,
          u.type AS utility,
          u.provider,
          v.amount,
          v.due_date,
          v.payment_status,
          v.days_overdue
      FROM OverdueBillsView v
      INNER JOIN Citizens c ON v.citizen_id = c.citizen_id
      INNER JOIN Utilities u ON v.utility_id = u.utility_id
      ORDER BY v.due_date DESC
    `;

    // High unpaid bills with subquery for average calculation
    const highUnpaidQuery = `
      SELECT 
          c.name, 
          SUM(v.amount) AS total_unpaid, 
          COUNT(*) AS unpaid_count,
          AVG(v.amount) AS avg_unpaid_amount,
          MAX(v.days_overdue) AS max_days_overdue
      FROM Citizens c
      INNER JOIN OverdueBillsView v ON c.citizen_id = v.citizen_id
      WHERE v.payment_status = 'Unpaid'
      GROUP BY c.citizen_id, c.name
      HAVING SUM(v.amount) > (
          SELECT AVG(amount) 
          FROM Bills 
          WHERE payment_status = 'Unpaid'
      )
      ORDER BY total_unpaid DESC
    `;

    // Utility type summary with LEFT OUTER JOIN and aggregations
    const utilitySummaryQuery = `
      SELECT 
          u.type,
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

    // Payment status analysis with subquery and date arithmetic
    const paymentStatusQuery = `
      SELECT 
          payment_status, 
          COUNT(*) AS bill_count,
          SUM(amount) AS total_amount,
          AVG(amount) AS avg_amount
      FROM Bills
      WHERE due_date >= (
          SELECT DATE_SUB(MAX(due_date), INTERVAL 30 DAY) 
          FROM Bills
      )
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
