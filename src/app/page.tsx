"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Types
type Citizen = {
  citizen_id: number;
  name: string;
  age: number;
  gender: string;
};
type Ticket = {
  ticket_id: number;
  citizen_name: string;
  transport_type: string;
  route: string;
  fare: number | string | null | undefined;
  booking_date: string;
};
type Request = {
  request_id: number;
  citizen_name: string;
  service_name: string;
  category: string;
  status: string;
  priority: string;
  request_date: string;
};
type Bill = {
  bill_id: number;
  citizen: string;
  utility: string;
  amount: number | string | null | undefined;
  due_date: string;
  payment_status: string;
};
type RequestStatus = { status: string; count: number };
type BillTrend = { month: string; total: number };

export default function Dashboard() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format fare
  const formatFare = (fare: number | string | null | undefined) => {
    if (fare === null || fare === undefined) return "$0.00";
    const numFare = typeof fare === "string" ? parseFloat(fare) : fare;
    if (isNaN(numFare)) return "$0.00";
    return `$${numFare.toFixed(2)}`;
  };

  // Helper function to get request status data for chart
  const getRequestStatusData = () => {
    const statusCounts =
      requests?.reduce((acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

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
            setTickets(ticketsData.tickets?.slice(0, 5) || []);
          }
        } catch {
          console.log("Tickets API not available yet");
        }

        // Fetch requests (when API is ready)
        try {
          const requestsResponse = await fetch("/api/requests");
          if (requestsResponse.ok) {
            const requestsData = await requestsResponse.json();
            setRequests(requestsData.requests || []);
          }
        } catch {
          console.log("Requests API not available yet");
        }

        // Fetch bills (when API is ready)
        try {
          const billsResponse = await fetch("/api/bills");
          if (billsResponse.ok) {
            const billsData = await billsResponse.json();
            setBills(billsData.bills || []);
          }
        } catch {
          console.log("Bills API not available yet");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Colors for charts
  const COLORS = ["#0088FE", "#FFBB28", "#00C49F"];

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
              {requests?.length || 0}
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
                bills?.reduce((sum, b) => {
                  if (b.amount === null || b.amount === undefined) return sum;
                  const amount =
                    typeof b.amount === "string"
                      ? parseFloat(b.amount)
                      : b.amount;
                  if (isNaN(amount)) return sum;
                  return sum + amount;
                }, 0) || 0
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
              {tickets?.length || 0}
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
            ) : requests?.length > 0 ? (
              <PieChart width={280} height={280}>
                <Pie
                  data={getRequestStatusData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {getRequestStatusData().map((entry, index) => (
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
          ) : tickets?.length > 0 ? (
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
                  {tickets?.map((t, index) => (
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
                        {t.citizen_name}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {t.transport_type} - {t.route}
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

        {/* Recent Bills Summary */}
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Bills</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : bills?.length > 0 ? (
            <div className="space-y-4">
              {bills?.slice(0, 3).map((bill) => (
                <div
                  key={bill.bill_id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {bill.citizen}
                    </p>
                    <p className="text-sm text-gray-600">{bill.utility}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatFare(bill.amount)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        bill.payment_status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {bill.payment_status}
                    </span>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-500">
                  Total: {bills?.length || 0} bills
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-lg mb-2">No billing data available</p>
              <p className="text-sm">Bills will appear here when available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
