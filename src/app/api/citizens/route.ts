import { getDB } from "../../../lib/db";

export async function GET() {
  try {
    const db = getDB();
    const [rows] = await db.query("SELECT * FROM Citizens");
    return Response.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
