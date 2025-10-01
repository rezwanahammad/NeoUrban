import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const query = `
    SELECT t.ticket_id, c.name AS citizen_name, tr.type AS transport_type, 
           tr.route, t.fare, t.booking_date
    FROM Tickets t
    JOIN Citizens c ON t.citizen_id = c.citizen_id
    JOIN Transportation tr ON t.transport_id = tr.transport_id
    ORDER BY t.booking_date DESC
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