import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDB();
    
    // Main appointments query
    const appointmentsQuery = `
      SELECT a.appointment_id, c.name AS citizen_name, h.name AS hospital_name, 
             h.location, a.doctor_name, a.appointment_date, a.status
      FROM Appointments a
      INNER JOIN Citizens c ON a.citizen_id = c.citizen_id
      INNER JOIN Healthcare h ON a.hospital_id = h.hospital_id
      ORDER BY a.appointment_date DESC
    `;

    // Hospital performance with aggregations (COUNT, AVG)
    const hospitalPerformanceQuery = `
      SELECT h.name AS hospital_name, h.location,
             COUNT(a.appointment_id) AS total_appointments,
             SUM(CASE WHEN a.status = 'Completed' THEN 1 ELSE 0 END) AS completed_appointments,
             AVG(CASE WHEN a.status = 'Completed' THEN 1.0 ELSE 0.0 END) * 100 AS completion_rate
      FROM Healthcare h
      LEFT OUTER JOIN Appointments a ON h.hospital_id = a.hospital_id
      GROUP BY h.hospital_id, h.name, h.location
      HAVING COUNT(a.appointment_id) > 0
      ORDER BY total_appointments DESC
    `;

    // Status summary with GROUP BY
    const statusSummaryQuery = `
      SELECT status,
             COUNT(*) AS appointment_count,
             COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Appointments) AS percentage
      FROM Appointments
      GROUP BY status
      ORDER BY appointment_count DESC
    `;

    // Recent appointments with subquery
    const recentAppointmentsQuery = `
      SELECT c.name AS citizen_name, h.name AS hospital_name, 
             a.doctor_name, a.appointment_date, a.status
      FROM Appointments a
      INNER JOIN Citizens c ON a.citizen_id = c.citizen_id
      INNER JOIN Healthcare h ON a.hospital_id = h.hospital_id
      WHERE a.appointment_date >= (SELECT DATE_SUB(MAX(appointment_date), INTERVAL 7 DAY) FROM Appointments)
      ORDER BY a.appointment_date DESC
      LIMIT 10
    `;

    // Execute all queries
    const [appointments] = await db.query(appointmentsQuery);
    const [hospitalPerformance] = await db.query(hospitalPerformanceQuery);
    const [statusSummary] = await db.query(statusSummaryQuery);
    const [recentAppointments] = await db.query(recentAppointmentsQuery);

    return Response.json({
      appointments,
      analytics: {
        hospitalPerformance,
        statusSummary,
        recentAppointments
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}