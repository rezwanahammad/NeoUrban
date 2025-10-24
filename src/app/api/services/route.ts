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

    // 1️⃣ Create or update the view (safe to run every time)
    await db.query(createViewQuery);

    // 2️⃣ Fetch data from the view
    const [rows] = await db.query(selectFromViewQuery);

    // 3️⃣ Return as JSON
    return Response.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
