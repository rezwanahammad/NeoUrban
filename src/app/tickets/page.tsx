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

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch tickets data");
      })
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const getTransportTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "bus":
        return "bg-blue-100 text-blue-800";
      case "metro":
        return "bg-green-100 text-green-800";
      case "train":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "bus":
        return "🚌";
      case "metro":
        return "🚇";
      case "train":
        return "🚆";
      default:
        return "🚌";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFare = (fare: number | string) => {
    const numFare = typeof fare === "string" ? parseFloat(fare) : fare;
    return `$${numFare.toFixed(2)}`;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Transport Tickets
        </h1>
        <p className="text-gray-600">
          Manage transportation ticket bookings and payments
        </p>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {getTransportIcon(ticket.transport_type)}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Ticket #{ticket.ticket_id}
                  </h3>
                  <p className="text-sm text-gray-600">{ticket.citizen_name}</p>
                </div>
              </div>
              <span
                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTransportTypeColor(
                  ticket.transport_type
                )}`}
              >
                {ticket.transport_type}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Route:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {ticket.route}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fare:</span>
                <span className="text-lg font-bold text-green-600">
                  {formatFare(ticket.fare)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Booking Date:</span>
                <span className="text-gray-900">
                  {formatDate(ticket.booking_date)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Tickets</h2>
          <span className="text-sm text-gray-500">
            Total: {tickets.length} tickets
          </span>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No tickets found</p>
            <p className="text-sm">
              Transport tickets will appear here when data is available
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Citizen
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Transport
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Fare
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Booking Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket.ticket_id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="p-4 text-sm font-medium text-gray-900">
                      #{ticket.ticket_id}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {ticket.citizen_name}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {getTransportIcon(ticket.transport_type)}
                        </span>
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTransportTypeColor(
                            ticket.transport_type
                          )}`}
                        >
                          {ticket.transport_type}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {ticket.route}
                    </td>
                    <td className="p-4 text-sm font-bold text-green-600">
                      {formatFare(ticket.fare)}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {formatDate(ticket.booking_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Total Tickets
          </h3>
          <p className="text-2xl font-bold text-blue-600">{tickets.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Bus Tickets 🚌
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {
              tickets.filter((t) => t.transport_type.toLowerCase() === "bus")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Metro Tickets 🚇
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {
              tickets.filter((t) => t.transport_type.toLowerCase() === "metro")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Train Tickets 🚆
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {
              tickets.filter((t) => t.transport_type.toLowerCase() === "train")
                .length
            }
          </p>
        </div>
      </div>

      {/* Revenue Analysis */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Revenue Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {formatFare(
                tickets.reduce((sum, t) => {
                  const fare =
                    typeof t.fare === "string" ? parseFloat(t.fare) : t.fare;
                  return sum + fare;
                }, 0)
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
            <p className="text-xs text-gray-500 mt-2">From all ticket sales</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {tickets.length > 0
                ? formatFare(
                    tickets.reduce((sum, t) => {
                      const fare =
                        typeof t.fare === "string"
                          ? parseFloat(t.fare)
                          : t.fare;
                      return sum + fare;
                    }, 0) / tickets.length
                  )
                : "$0.00"}
            </p>
            <p className="text-sm text-gray-600 mt-1">Average Fare</p>
            <p className="text-xs text-gray-500 mt-2">Per ticket</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {tickets.length > 0
                ? formatFare(
                    Math.max(
                      ...tickets.map((t) =>
                        typeof t.fare === "string" ? parseFloat(t.fare) : t.fare
                      )
                    )
                  )
                : "$0.00"}
            </p>
            <p className="text-sm text-gray-600 mt-1">Highest Fare</p>
            <p className="text-xs text-gray-500 mt-2">Premium ticket</p>
          </div>
        </div>
      </div>

      {/* Transport Type Analysis */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Transport Type Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(new Set(tickets.map((t) => t.transport_type))).map(
            (type) => {
              const typeTickets = tickets.filter(
                (t) => t.transport_type === type
              );
              const typeRevenue = typeTickets.reduce((sum, t) => {
                const fare =
                  typeof t.fare === "string" ? parseFloat(t.fare) : t.fare;
                return sum + fare;
              }, 0);

              return (
                <div
                  key={type}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getTransportIcon(type)}</span>
                    <h3 className="font-bold text-gray-800">{type}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tickets:</span>
                      <span className="font-semibold">
                        {typeTickets.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue:</span>
                      <span className="font-semibold text-green-600">
                        {formatFare(typeRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Fare:</span>
                      <span className="font-semibold">
                        {typeTickets.length > 0
                          ? formatFare(typeRevenue / typeTickets.length)
                          : "$0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Bookings
        </h2>
        <div className="space-y-3">
          {tickets
            .sort(
              (a, b) =>
                new Date(b.booking_date).getTime() -
                new Date(a.booking_date).getTime()
            )
            .slice(0, 5)
            .map((ticket) => (
              <div
                key={ticket.ticket_id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center bg-white p-2 rounded-lg shadow-sm">
                    <span className="text-2xl">
                      {getTransportIcon(ticket.transport_type)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {ticket.citizen_name}
                    </h3>
                    <p className="text-sm text-gray-600">{ticket.route}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(ticket.booking_date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {formatFare(ticket.fare)}
                  </p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransportTypeColor(
                      ticket.transport_type
                    )}`}
                  >
                    {ticket.transport_type}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No recent bookings</p>
            <p className="text-sm">
              Recent ticket bookings will be displayed here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
