import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const query = `
    SELECT transport_id, type, route, capacity
    FROM Transportation
    ORDER BY transport_id
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