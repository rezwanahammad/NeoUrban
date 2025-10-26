"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Types for dashboard data
type DashboardStats = {
  totalCitizens: number;
  activeRequests: number;
  monthlyRevenue: number;
  transportTickets: number;
  pendingBills: number;
};

type RecentCitizen = {
  citizen_id: number;
  name: string;
  age: number;
  gender: string;
};

type RecentRequest = {
  request_id: number;
  citizen_name: string;
  service_name: string;
  category: string;
  status: string;
  priority: string;
  request_date: string;
};

type ChartData = {
  requestStatus: Array<{ status: string; count: number }>;
  genderDistribution: Array<{ gender: string; count: number }>;
};

type DashboardData = {
  stats: DashboardStats;
  charts: ChartData;
  recent: {
    citizens: RecentCitizen[];
    requests: RecentRequest[];
  };
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
  };

  // Chart color schemes
  const chartColors = {
    primary: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"],
    secondary: [
      "#DBEAFE",
      "#D1FAE5",
      "#FEF3C7",
      "#FEE2E2",
      "#EDE9FE",
      "#CFFAFE",
    ],
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart configurations
  const getRequestStatusChart = () => {
    if (!dashboardData?.charts.requestStatus) return null;

    const data = {
      labels: dashboardData.charts.requestStatus.map((item) => item.status),
      datasets: [
        {
          data: dashboardData.charts.requestStatus.map((item) => item.count),
          backgroundColor: chartColors.primary,
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverBackgroundColor: chartColors.secondary,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            padding: 20,
            font: {
              size: 12,
            },
          },
        },
      },
    };

    return <Doughnut data={data} options={options} />;
  };

  const getGenderDistributionChart = () => {
    if (!dashboardData?.charts.genderDistribution) return null;

    const data = {
      labels: dashboardData.charts.genderDistribution.map(
        (item) => item.gender
      ),
      datasets: [
        {
          data: dashboardData.charts.genderDistribution.map(
            (item) => item.count
          ),
          backgroundColor: ["#F59E0B", "#10B981", "#8B5CF6"],
          borderWidth: 0,
          hoverBackgroundColor: ["#FBBF24", "#34D399", "#A78BFA"],
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right" as const,
          labels: {
            padding: 20,
            font: {
              size: 12,
            },
          },
        },
      },
    };

    return <Pie data={data} options={options} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-6">
        <p className="text-red-800">Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          NeoUrban Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Smart City Management Analytics & Insights
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide mb-2">
                Total Citizens
              </h3>
              <p className="text-3xl font-bold">
                {dashboardData?.stats.totalCitizens || 0}
              </p>
              <p className="text-sm opacity-75 mt-1">Registered users</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide mb-2">
                Active Requests
              </h3>
              <p className="text-3xl font-bold">
                {dashboardData?.stats.activeRequests || 0}
              </p>
              <p className="text-sm opacity-75 mt-1">Service requests</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide mb-2">
                Monthly Revenue
              </h3>
              <p className="text-3xl font-bold">
                {formatCurrency(dashboardData?.stats.monthlyRevenue || 0)}
              </p>
              <p className="text-sm opacity-75 mt-1">From utilities</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide mb-2">
                Transport Tickets
              </h3>
              <p className="text-3xl font-bold">
                {dashboardData?.stats.transportTickets || 0}
              </p>
              <p className="text-sm opacity-75 mt-1">Recent bookings</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide mb-2">
                Pending Bills
              </h3>
              <p className="text-3xl font-bold">
                {dashboardData?.stats.pendingBills || 0}
              </p>
              <p className="text-sm opacity-75 mt-1">Overdue payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Request Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Request Status</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Distribution
            </span>
          </div>
          <div className="h-64">{getRequestStatusChart()}</div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Citizen Demographics
            </h2>
            <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              By Gender
            </span>
          </div>
          <div className="h-64">{getGenderDistributionChart()}</div>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Citizens Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Citizens</h2>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Latest 5 entries
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Gender
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData?.recent.citizens.map((citizen) => (
                  <tr
                    key={citizen.citizen_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-sm font-medium text-gray-900">
                      #{citizen.citizen_id}
                    </td>
                    <td className="p-4 text-sm text-gray-900 font-medium">
                      {citizen.name}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {citizen.age} years
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          citizen.gender === "Male"
                            ? "bg-blue-100 text-blue-800"
                            : citizen.gender === "Female"
                            ? "bg-pink-100 text-pink-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {citizen.gender}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Requests Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Recent Service Requests
            </h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              Latest activity
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Citizen
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData?.recent.requests.map((request) => (
                  <tr
                    key={request.request_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-900 font-medium">
                      {request.citizen_name}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div>
                        <div className="font-medium">
                          {request.service_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.category}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : request.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "Pending"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : request.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {request.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a
          href="/citizens"
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center hover:shadow-lg hover:bg-gray-50 transition-all duration-200 group"
        >
          <p className="text-sm font-semibold text-gray-700">Manage Citizens</p>
        </a>
        <a
          href="/requests"
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center hover:shadow-lg hover:bg-gray-50 transition-all duration-200 group"
        >
          <p className="text-sm font-semibold text-gray-700">View Requests</p>
        </a>
        <a
          href="/bills"
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center hover:shadow-lg hover:bg-gray-50 transition-all duration-200 group"
        >
          <p className="text-sm font-semibold text-gray-700">Billing</p>
        </a>
        <a
          href="/transport"
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center hover:shadow-lg hover:bg-gray-50 transition-all duration-200 group"
        >
          <p className="text-sm font-semibold text-gray-700">Transport</p>
        </a>
      </div>
    </div>
  );
}
