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

type HighSpender = {
  name: string;
  total_spent: number;
  total_bookings: number;
};

type RoutePerformance = {
  route: string;
  total_tickets: number;
  total_revenue: number;
  avg_fare: number;
};

type TransportSummary = {
  transport_type: string;
  total_tickets: number;
  total_revenue: number;
  avg_fare: number;
};

type RecentBooking = {
  ticket_id: number;
  citizen_name: string;
  transport_type: string;
  route: string;
  fare: number;
  booking_date: string;
  days_ago: number;
};

type TicketsData = {
  tickets: Ticket[];
  analytics: {
    highSpenders: HighSpender[];
    routePerformance: RoutePerformance[];
    transportSummary: TransportSummary[];
    recentBookings: RecentBooking[];
  };
};

export default function TicketsPage() {
  const [data, setData] = useState<TicketsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const formatFare = (fare: number | string | null | undefined) => {
    if (fare === null || fare === undefined) return "$0.00";
    const numFare = typeof fare === "string" ? parseFloat(fare) : fare;
    if (isNaN(numFare)) return "$0.00";
    return `$${numFare.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTransportColor = (transport: string | null | undefined) => {
    if (!transport) return "bg-gray-100 text-gray-800";

    switch (transport.toLowerCase()) {
      case "bus":
        return "bg-orange-100 text-orange-800";
      case "metro":
        return "bg-blue-100 text-blue-800";
      case "train":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
        <p className="text-red-800">Error loading tickets: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎫 Transport Tickets
        </h1>
        <p className="text-gray-600">SQL Query Results from Tickets API</p>
      </div>

      {/* All Tickets Section - Main Query */}
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎫 All Transport Tickets (Main Query)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          <strong>SQL Used:</strong> INNER JOIN + Window Functions
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Ticket ID
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Citizen
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Transport
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Route
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Fare
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Booking Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.tickets?.map((ticket) => (
                <tr key={ticket.ticket_id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium text-gray-900">
                    #{ticket.ticket_id}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {ticket.citizen_name}
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransportColor(
                        ticket.transport_type
                      )}`}
                    >
                      {ticket.transport_type}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-900">{ticket.route}</td>
                  <td className="p-3 text-sm text-gray-900 font-bold">
                    {formatFare(ticket.fare)}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {formatDate(ticket.booking_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Total Tickets</p>
            <p className="text-2xl font-bold text-blue-600">
              {data?.tickets?.length || 0}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Bus Tickets</p>
            <p className="text-2xl font-bold text-orange-600">
              {data?.tickets?.filter((t) => t.transport_type === "Bus")
                .length || 0}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Metro Tickets</p>
            <p className="text-2xl font-bold text-blue-600">
              {data?.tickets?.filter((t) => t.transport_type === "Metro")
                .length || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Train Tickets</p>
            <p className="text-2xl font-bold text-green-600">
              {data?.tickets?.filter((t) => t.transport_type === "Train")
                .length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Query Results */}
      <div className="space-y-6">
        {/* Query 1: High Spenders */}
        <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-red-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Query 1: High Spenders
            </h2>
            <p className="text-sm text-gray-600 mb-2"></p>
          </div>

          {data?.analytics?.highSpenders &&
          data.analytics.highSpenders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.analytics.highSpenders.map(
                (spender: HighSpender, index: number) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg bg-red-50 border-2 border-red-300"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {spender.name}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Spent:</span>{" "}
                        <span className="text-2xl font-bold text-red-600">
                          {formatFare(spender.total_spent)}
                        </span>
                      </p>
                      {/* <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Bookings:</span>{' '}
                        <span className="font-semibold text-gray-900">{spender.total_bookings}</span>
                      </p> */}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No high spenders found
            </p>
          )}
        </div>

        {/* Query 2: Route Performance */}
        <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-blue-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Query 2: Route Performance
            </h2>
            <p className="text-sm text-gray-600 mb-2"></p>
          </div>

          {data?.analytics?.routePerformance &&
          data.analytics.routePerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Route
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Total Revenue
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Avg Fare
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.analytics.routePerformance.map(
                    (route: RoutePerformance, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900 border-b font-medium">
                          {route.route}
                        </td>
                        <td className="p-3 text-sm text-blue-600 border-b font-bold">
                          {formatFare(route.total_revenue)}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {formatFare(route.avg_fare)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No route performance data found
            </p>
          )}
        </div>

        {/* Query 3: Transport Summary */}
        <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-green-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Query 3: Transport Summary
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>SQL Used:</strong> GROUP BY + Aggregations (COUNT, SUM,
              AVG)
            </p>
          </div>

          {data?.analytics?.transportSummary &&
          data.analytics.transportSummary.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.analytics.transportSummary.map(
                (transport: TransportSummary, index: number) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg bg-green-50 border-2 border-green-300"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <span
                        className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${getTransportColor(
                          transport.transport_type
                        )}`}
                      >
                        {transport.transport_type}
                      </span>
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Tickets:</span>{" "}
                        <span className="text-lg font-bold text-gray-900">
                          {transport.total_tickets}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Revenue:</span>{" "}
                        <span className="text-xl font-bold text-green-600">
                          {formatFare(transport.total_revenue)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Average Fare:</span>{" "}
                        <span className="text-lg font-bold text-blue-600">
                          {formatFare(transport.avg_fare)}
                        </span>
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No transport summary data found
            </p>
          )}
        </div>

        {/* Query 4: Recent Bookings */}
        <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-purple-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🟣 Query 4: Recent Bookings (Last 30 Days)
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>SQL Used:</strong> Subquery + DATEDIFF + INNER JOIN
            </p>
          </div>

          {data?.analytics?.recentBookings &&
          data.analytics.recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Ticket ID
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Citizen
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Transport
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Route
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Fare
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Date
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Days Ago
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.analytics.recentBookings.map(
                    (booking: RecentBooking, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900 border-b font-medium">
                          #{booking.ticket_id}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {booking.citizen_name}
                        </td>
                        <td className="p-3 text-sm border-b">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransportColor(
                              booking.transport_type
                            )}`}
                          >
                            {booking.transport_type}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {booking.route}
                        </td>
                        <td className="p-3 text-sm text-purple-600 border-b font-bold">
                          {formatFare(booking.fare)}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {formatDate(booking.booking_date)}
                        </td>
                        <td className="p-3 text-sm text-gray-600 border-b">
                          {booking.days_ago} days
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No recent bookings found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
