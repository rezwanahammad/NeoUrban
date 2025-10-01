"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Types
type Citizen = {
  citizen_id: number;
  name: string;
  age: number;
  gender: string;
};
type Ticket = {
  ticket_id: number;
  citizen_id: number;
  transport_id: number;
  fare: number | string;
  booking_date: string;
};
type RequestStatus = { status: string; count: number };
type BillTrend = { month: string; total: number };

export default function Dashboard() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [requests, setRequests] = useState<RequestStatus[]>([]);
  const [bills, setBills] = useState<BillTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch citizens
        const citizensResponse = await fetch("/api/citizens");
        if (citizensResponse.ok) {
          const citizensData = await citizensResponse.json();
          setCitizens(citizensData.slice(0, 5)); // Show only 5 preview rows
        }

        // Fetch tickets (when API is ready)
        try {
          const ticketsResponse = await fetch("/api/tickets");
          if (ticketsResponse.ok) {
            const ticketsData = await ticketsResponse.json();
            setTickets(ticketsData.slice(0, 5));
          }
        } catch {
          console.log("Tickets API not available yet");
        }

        // Fetch requests (when API is ready)
        try {
          const requestsResponse = await fetch("/api/requests/status");
          if (requestsResponse.ok) {
            const requestsData = await requestsResponse.json();
            setRequests(requestsData);
          }
        } catch {
          console.log("Requests API not available yet");
        }

        // Fetch bills (when API is ready)
        try {
          const billsResponse = await fetch("/api/bills/trends");
          if (billsResponse.ok) {
            const billsData = await billsResponse.json();
            setBills(billsData);
          }
        } catch {
          console.log("Bills API not available yet");
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Colors for charts
  const COLORS = ["#0088FE", "#FFBB28", "#00C49F"];

  // Helper function to format fare
  const formatFare = (fare: number | string) => {
    const numFare = typeof fare === "string" ? parseFloat(fare) : fare;
    return `$${numFare.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to NeoUrban Smart City Management System
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Total Citizens
          </h3>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
          ) : (
            <p className="text-3xl font-bold text-blue-600">
              {citizens.length}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">Registered users</p>
        </div>
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Active Requests
          </h3>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
          ) : (
            <p className="text-3xl font-bold text-green-600">
              {requests.reduce((sum, r) => sum + r.count, 0) || 0}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">Service requests</p>
        </div>
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Monthly Revenue
          </h3>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
          ) : (
            <p className="text-3xl font-bold text-purple-600">
              $
              {(
                bills.reduce((sum, b) => sum + b.total, 0) || 0
              ).toLocaleString()}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">From utilities</p>
        </div>
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Transport Tickets
          </h3>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
          ) : (
            <p className="text-3xl font-bold text-orange-600">
              {tickets.length}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">Recent bookings</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Citizens Table */}
        <div className="col-span-2 bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Citizens</h2>
            <span className="text-sm text-gray-500">
              Showing latest 5 entries
            </span>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {citizens.map((c, index) => (
                    <tr
                      key={c.citizen_id}
                      className={`hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="p-3 text-sm font-medium text-gray-900">
                        {c.citizen_id}
                      </td>
                      <td className="p-3 text-sm text-gray-900">{c.name}</td>
                      <td className="p-3 text-sm text-gray-900">{c.age}</td>
                      <td className="p-3 text-sm text-gray-900">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            c.gender === "Male"
                              ? "bg-blue-100 text-blue-800"
                              : c.gender === "Female"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {c.gender}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Request Status Chart */}
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Request Status
          </h2>
          <div className="flex justify-center">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : requests.length > 0 ? (
              <PieChart width={280} height={280}>
                <Pie
                  data={requests}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {requests.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg mb-2">No request data available</p>
                <p className="text-sm">Request API will be added later</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tickets + Bill Trends */}
      <div className="grid grid-cols-2 gap-6">
        {/* Tickets Table */}
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Tickets</h2>
            <span className="text-sm text-gray-500">Transport bookings</span>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : tickets.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Citizen
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transport
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Fare
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tickets.map((t, index) => (
                    <tr
                      key={t.ticket_id}
                      className={`hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="p-3 text-sm font-medium text-gray-900">
                        {t.ticket_id}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {t.citizen_id}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {t.transport_id}
                      </td>
                      <td className="p-3 text-sm font-semibold text-green-600">
                        {formatFare(t.fare)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <p className="text-lg mb-2">No tickets data</p>
              <p className="text-sm">Tickets API will be added later</p>
            </div>
          )}
        </div>

        {/* Bill Trends Chart */}
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Bill Trends</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : bills.length > 0 ? (
            <LineChart width={400} height={250} data={bills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#0088FE"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-lg mb-2">No billing data available</p>
              <p className="text-sm">Bills API will be added later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
