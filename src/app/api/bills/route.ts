import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
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

    // use of UNION ALL
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
