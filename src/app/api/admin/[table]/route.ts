import { getDB } from "../../../../lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const db = getDB();
    const url = new URL(request.url);
    const table = url.pathname.split('/').pop();

    if (!table) {
      return Response.json({ error: "Table name required" }, { status: 400 });
    }

    let query = "";
    switch (table) {
      case "citizens":
        query = "SELECT * FROM Citizens ORDER BY citizen_id DESC LIMIT 50";
        break;
      case "healthcare":
        query = "SELECT * FROM Healthcare ORDER BY hospital_id DESC LIMIT 50";
        break;
      case "utilities":
        query = "SELECT * FROM Utilities ORDER BY utility_id DESC LIMIT 50";
        break;
      case "services":
        query = "SELECT * FROM Services ORDER BY service_id DESC LIMIT 50";
        break;
      case "appointments":
        query = "SELECT * FROM Appointments ORDER BY appointment_id DESC LIMIT 50";
        break;
      case "bills":
        query = "SELECT * FROM Bills ORDER BY bill_id DESC LIMIT 50";
        break;
      case "requests":
        query = "SELECT * FROM ServiceRequests ORDER BY request_id DESC LIMIT 50";
        break;
      case "tickets":
        query = "SELECT * FROM Tickets ORDER BY ticket_id DESC LIMIT 50";
        break;
      case "transport":
        query = "SELECT * FROM Transport ORDER BY transport_id DESC LIMIT 50";
        break;
      default:
        return Response.json({ error: "Invalid table name" }, { status: 400 });
    }

    const [rows] = await db.query(query);
    return Response.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDB();
    const url = new URL(request.url);
    const table = url.pathname.split('/').pop();
    const data = await request.json();

    if (!table) {
      return Response.json({ error: "Table name required" }, { status: 400 });
    }

    let query = "";
    let values: (string | number)[] = [];

    switch (table) {
      case "citizens":
        query = "INSERT INTO Citizens (name, age, address, contact) VALUES (?, ?, ?, ?)";
        values = [data.name, data.age, data.address, data.contact];
        break;
      
      case "healthcare":
        query = "INSERT INTO Healthcare (name, location, capacity, emergency_services) VALUES (?, ?, ?, ?)";
        values = [data.name, data.location, data.capacity, data.emergency_services];
        break;
      
      case "utilities":
        query = "INSERT INTO Utilities (type, provider) VALUES (?, ?)";
        values = [data.type, data.provider];
        break;
      
      case "services":
        query = "INSERT INTO Services (service_name, category, provider) VALUES (?, ?, ?)";
        values = [data.service_name, data.category, data.provider];
        break;
      
      case "appointments":
        query = "INSERT INTO Appointments (citizen_id, hospital_id, doctor_name, appointment_date, status) VALUES (?, ?, ?, ?, ?)";
        values = [data.citizen_id, data.hospital_id, data.doctor_name, data.appointment_date, data.status];
        break;
      
      case "bills":
        query = "INSERT INTO Bills (citizen_id, utility_id, amount, due_date, payment_status) VALUES (?, ?, ?, ?, ?)";
        values = [data.citizen_id, data.utility_id, data.amount, data.due_date, data.payment_status];
        break;
      
      case "requests":
        query = "INSERT INTO ServiceRequests (citizen_id, service_id, request_date, status, priority, description) VALUES (?, ?, ?, ?, ?, ?)";
        values = [data.citizen_id, data.service_id, data.request_date, data.status, data.priority, data.description];
        break;
      
      case "tickets":
        query = "INSERT INTO Tickets (citizen_id, transport_id, fare, booking_date) VALUES (?, ?, ?, ?)";
        values = [data.citizen_id, data.transport_id, data.fare, data.booking_date];
        break;
      
      case "transport":
        query = "INSERT INTO Transport (route_name, type, fare, schedule) VALUES (?, ?, ?, ?)";
        values = [data.route_name, data.type, data.fare, data.schedule];
        break;
      
      default:
        return Response.json({ error: "Invalid table name" }, { status: 400 });
    }

    await db.execute(query, values);
    return Response.json({ success: true, message: "Record added successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: message }, { status: 500 });
  }
}