import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  // Create a view for utilities data
  const createViewQuery = `
    CREATE OR REPLACE VIEW UtilitiesView AS
    SELECT utility_id, type, provider
    FROM Utilities
    ORDER BY utility_id
  `;
  
  // Query from the view
  const selectQuery = `SELECT * FROM UtilitiesView`;

  try {
    const db = getDB();
    
    // First create/update the view
    await db.execute(createViewQuery);
    
    // Then query from the view
    const [rows] = await db.query(selectQuery);
    return Response.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}