import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const query = `
    SELECT r.request_id, c.name AS citizen_name, s.service_name, s.category, 
           r.status, r.priority, r.request_date
    FROM Requests r
    JOIN Citizens c ON r.citizen_id = c.citizen_id
    JOIN Services s ON r.service_id = s.service_id
    ORDER BY r.request_date DESC
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