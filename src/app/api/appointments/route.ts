import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const query = `
    SELECT a.appointment_id, c.name AS citizen_name, h.name AS hospital_name, 
           h.location, a.doctor_name, a.appointment_date, a.status
    FROM Appointments a
    JOIN Citizens c ON a.citizen_id = c.citizen_id
    JOIN Healthcare h ON a.hospital_id = h.hospital_id
    ORDER BY a.appointment_date DESC
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