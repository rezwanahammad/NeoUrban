import { getDB } from "../../../lib/db";

export async function GET() {
  try {
    const db = getDB();
    const [citizens] = await db.query("SELECT * FROM Citizens ORDER BY citizen_id DESC");
    return Response.json({ citizens });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
