"use client";
import { useEffect, useState } from "react";

type Ticket = {
  ticket_id: number;
  citizen_name: string;
  transport_type: "Bus" | "Metro" | "Train";
  route: string;
  fare: number | string;
  booking_date: string;
};

type TicketsData = {
  tickets: Ticket[];
  analytics: {
    highSpenders: any[];
    routePerformance: any[];
    transportSummary: any[];
    recentBookings: any[];
  };
};

export default function TicketsPage() {
  const [data, setData] = useState<TicketsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch tickets data");
      })
      .then((ticketsData) => {
        setData(ticketsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const formatFare = (fare: number | string) => {
    const numFare = typeof fare === "string" ? parseFloat(fare) : fare;
    return `$${numFare.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading tickets data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transport Tickets</h1>
        <p className="text-gray-600">SQL Analytics Dashboard</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {[
            { id: "overview", label: "Overview" },
            { id: "spenders", label: "High Spenders" },
            { id: "routes", label: "Routes" },
            { id: "analytics", label: "Analytics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-white text-blue-700 shadow"
                  : "text-blue-100 hover:text-white hover:bg-white/[0.12]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 shadow rounded-lg text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Total Tickets</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{data?.tickets?.length || 0}</p>
            </div>
            <div className="bg-white p-6 shadow rounded-lg text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatFare(
                  data?.tickets?.reduce((sum, t) => {
                    const fare = typeof t.fare === "string" ? parseFloat(t.fare) : t.fare;
                    return sum + fare;
                  }, 0) || 0
                )}
              </p>
            </div>
            <div className="bg-white p-6 shadow rounded-lg text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Average Fare</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {(data?.tickets?.length || 0) > 0
                  ? formatFare(
                      (data?.tickets?.reduce((sum, t) => {
                        const fare = typeof t.fare === "string" ? parseFloat(t.fare) : t.fare;
                        return sum + fare;
                      }, 0) || 0) / (data?.tickets?.length || 1)
                    )
                  : "$0.00"}
              </p>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Tickets</h2>
            <div className="space-y-3">
              {data?.tickets?.slice(0, 10).map((ticket) => (
                <div key={ticket.ticket_id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <h3 className="font-semibold">{ticket.citizen_name}</h3>
                    <p className="text-sm text-gray-600">{ticket.route} ({ticket.transport_type})</p>
                    <p className="text-xs text-gray-500">{formatDate(ticket.booking_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{formatFare(ticket.fare)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* High Spenders Tab */}
      {activeTab === "spenders" && (
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4">High Spenders</h2>
          <p className="text-sm text-gray-600 mb-4">SQL: INNER JOIN + GROUP BY + HAVING</p>
          <div className="space-y-3">
            {data?.analytics?.highSpenders?.map((spender: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <h3 className="font-semibold">{spender.name}</h3>
                  <p className="text-sm text-gray-600">{spender.ticket_count} tickets</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatFare(spender.total_spent)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Routes Tab */}
      {activeTab === "routes" && (
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4">Route Performance</h2>
          <p className="text-sm text-gray-600 mb-4">SQL: LEFT OUTER JOIN + Aggregations (COUNT, SUM, AVG, MIN, MAX)</p>
          <div className="space-y-3">
            {data?.analytics?.routePerformance?.map((route: any, index: number) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{route.route} ({route.type})</h3>
                    <p className="text-sm text-gray-600">{route.total_bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatFare(route.total_revenue || 0)}</p>
                    <p className="text-sm text-gray-600">
                      Range: {formatFare(route.min_fare || 0)} - {formatFare(route.max_fare || 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Transport Summary</h2>
            <p className="text-sm text-gray-600 mb-4">SQL: INNER JOIN + GROUP BY</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.analytics?.transportSummary?.map((transport: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold text-lg">{transport.transport_type}</h3>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Bookings:</span> {transport.total_bookings}</p>
                    <p><span className="font-medium">Revenue:</span> {formatFare(transport.total_revenue || 0)}</p>
                    <p><span className="font-medium">Average:</span> {formatFare(transport.avg_fare || 0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            <p className="text-sm text-gray-600 mb-4">SQL: Subquery for date filtering</p>
            <div className="space-y-2">
              {data?.analytics?.recentBookings?.slice(0, 8).map((booking: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{booking.name}</span> - {booking.route} ({booking.type})
                  </div>
                  <div className="text-right">
                    <span className="text-green-600">{formatFare(booking.fare)}</span>
                    <p className="text-xs text-gray-500">{formatDate(booking.booking_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}