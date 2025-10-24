import { getDB } from "../../../../../lib/db";

export const runtime = "nodejs";

type RelatedRecords = {
  bills_count: number;
  requests_count: number;
  appointments_count: number;
  tickets_count: number;
};

// UPDATE citizen
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDB();
    const { name, age, gender, address, contact } = await request.json();
    
    const updateQuery = `
      UPDATE Citizens 
      SET name = ?, age = ?, gender = ?, address = ?, contact = ?
      WHERE citizen_id = ?
    `;
    
    const result = await db.query(updateQuery, [
      name,
      age,
      gender,
      address,
      contact,
      params.id
    ]);

    return Response.json({ 
      success: true, 
      message: "Citizen updated successfully",
      result 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message }), 
      { status: 500 }
    );
  }
}

// DELETE citizen
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDB();
    
    // Check if citizen has related records (bills, requests, etc.)
    const checkRelatedQuery = `
      SELECT 
        (SELECT COUNT(*) FROM Bills WHERE citizen_id = ?) as bills_count,
        (SELECT COUNT(*) FROM Requests WHERE citizen_id = ?) as requests_count,
        (SELECT COUNT(*) FROM Appointments WHERE citizen_id = ?) as appointments_count,
        (SELECT COUNT(*) FROM Tickets WHERE citizen_id = ?) as tickets_count
    `;
    
    const [relatedRecords] = await db.query(checkRelatedQuery, [
      params.id, params.id, params.id, params.id
    ]);

    const related = (relatedRecords as RelatedRecords[])[0];
    const totalRelated = related.bills_count + related.requests_count + 
                        related.appointments_count + related.tickets_count;

    if (totalRelated > 0) {
      return Response.json({
        error: "Cannot delete citizen with existing records",
        details: {
          bills: related.bills_count,
          requests: related.requests_count,
          appointments: related.appointments_count,
          tickets: related.tickets_count
        }
      }, { status: 400 });
    }

    // Safe to delete citizen
    const deleteQuery = `DELETE FROM Citizens WHERE citizen_id = ?`;
    const result = await db.query(deleteQuery, [params.id]);

    return Response.json({ 
      success: true, 
      message: "Citizen deleted successfully",
      result 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message }), 
      { status: 500 }
    );
  }
}