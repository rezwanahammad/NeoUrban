import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const createViewQuery = `
    CREATE OR REPLACE VIEW UtilitiesView AS
    SELECT utility_id, type, provider
    FROM Utilities
    ORDER BY utility_id
  `;
  
  const selectQuery = `SELECT * FROM UtilitiesView`;

  try {
    const db = getDB();
    
    await db.execute(createViewQuery);
    
    const [rows] = await db.query(selectQuery);
    return Response.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}