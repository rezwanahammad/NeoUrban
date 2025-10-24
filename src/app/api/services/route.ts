import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const createViewQuery = `
    CREATE OR REPLACE VIEW ServicesView AS
    SELECT 
      service_id, 
      service_name, 
      category, 
      provider
    FROM Services
    ORDER BY service_id;
  `;

  const selectFromViewQuery = `SELECT * FROM ServicesView`;

  try {
    const db = getDB();

    await db.query(createViewQuery);

    const [rows] = await db.query(selectFromViewQuery);
    return Response.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
