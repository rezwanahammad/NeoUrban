import { getDB } from "../../../lib/db";

export async function GET() {
  const query = `
    SELECT b.bill_id, c.name AS citizen, u.type AS utility, b.amount, b.due_date, b.payment_status
    FROM Bills b
    JOIN Citizens c ON b.citizen_id = c.citizen_id
    JOIN Utilities u ON b.utility_id = u.utility_id
  `;
  try {
    const db = getDB();
    const [rows] = await db.query(query);
    return Response.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
