import { getDB } from "../../../lib/db";

export const runtime = "nodejs";

interface CountResult {
  count: number;
}

interface RevenueResult {
  revenue: number | null;
}

interface CitizenResult {
  citizen_id: number;
  name: string;
  age: number;
  gender: string;
}

interface RequestStatusResult {
  status: string;
  count: number;
}

interface RecentRequestResult {
  request_id: number;
  citizen_name: string;
  service_name: string;
  category: string;
  status: string;
  priority: string;
  request_date: string;
}

interface GenderStatsResult {
  gender: string;
  count: number;
}

export async function GET() {
  try {
    const db = getDB();
    
    // Get total counts
    const [citizensCount] = await db.query("SELECT COUNT(*) as count FROM Citizens");
    const [requestsCount] = await db.query("SELECT COUNT(*) as count FROM Requests WHERE status != 'Completed'");
    const [billsRevenue] = await db.query("SELECT SUM(amount) as revenue FROM Bills WHERE payment_status = 'Paid'");
    const [ticketsCount] = await db.query("SELECT COUNT(*) as count FROM Tickets WHERE booking_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)");
    
    // Get recent citizens (last 5)
    const [recentCitizens] = await db.query(`
      SELECT citizen_id, name, age, gender 
      FROM Citizens 
      ORDER BY citizen_id DESC 
      LIMIT 5
    `);
    
    // Get request status breakdown
    const [requestStatus] = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM Requests 
      GROUP BY status
      ORDER BY count DESC
    `);
    
    // Get pending bills count
    const [pendingBills] = await db.query(`
      SELECT COUNT(*) as count 
      FROM Bills 
      WHERE payment_status = 'Unpaid' AND due_date < CURRENT_DATE
    `);
    
    // Get gender distribution
    const [genderStats] = await db.query(`
      SELECT 
        gender,
        COUNT(*) as count
      FROM Citizens
      GROUP BY gender
    `);

    // Get recent requests (last 5)
    const [recentRequests] = await db.query(`
      SELECT 
        r.request_id,
        c.name as citizen_name,
        s.service_name,
        s.category,
        r.status,
        r.priority,
        r.request_date
      FROM Requests r
      JOIN Citizens c ON r.citizen_id = c.citizen_id
      JOIN Services s ON r.service_id = s.service_id
      ORDER BY r.request_date DESC
      LIMIT 5
    `);

    return Response.json({
      stats: {
        totalCitizens: (citizensCount as CountResult[])[0]?.count || 0,
        activeRequests: (requestsCount as CountResult[])[0]?.count || 0,
        monthlyRevenue: (billsRevenue as RevenueResult[])[0]?.revenue || 0,
        transportTickets: (ticketsCount as CountResult[])[0]?.count || 0,
        pendingBills: (pendingBills as CountResult[])[0]?.count || 0
      },
      charts: {
        requestStatus: requestStatus as RequestStatusResult[],
        genderDistribution: genderStats as GenderStatsResult[]
      },
      recent: {
        citizens: recentCitizens as CitizenResult[],
        requests: recentRequests as RecentRequestResult[]
      }
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}