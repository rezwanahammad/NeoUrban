/*
 * Transportation Management Page
 *
 * Displays data from /api/transport which executes 2 queries:
 *
 * 1. All Transportation Systems List
 *    SQL Techniques: SELECT with specific columns, ORDER BY capacity DESC
 *
 * 2. Transportation Statistics
 *    SQL Techniques: COUNT(*), SUM(), AVG(), MAX(), MIN(), CASE WHEN aggregations
 *    Performance: All calculations moved from frontend to SQL for efficiency
 */

"use client";
import { useEffect, useState } from "react";

type Transport = {
  id: number;
  type: "Bus" | "Metro" | "Train";
  route: string;
  capacity: number;
};

type TransportStats = {
  total_systems: number;
  total_capacity: number;
  average_capacity: number;
  highest_capacity: number;
  lowest_capacity: number;
  bus_count: number;
  metro_count: number;
  train_count: number;
};

type TransportData = {
  systems: Transport[];
  statistics: TransportStats;
};

export default function TransportPage() {
  const [transportData, setTransportData] = useState<TransportData>({
    systems: [],
    statistics: {
      total_systems: 0,
      total_capacity: 0,
      average_capacity: 0,
      highest_capacity: 0,
      lowest_capacity: 0,
      bus_count: 0,
      metro_count: 0,
      train_count: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/transport")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch transport data");
      })
      .then((data: TransportData) => {
        console.log("Transport API Response:", data);
        setTransportData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const getTypeColor = (type: string) => {
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

  const getCapacityLevel = (capacity: number) => {
    if (capacity >= 1000) return { text: "High", color: "text-green-600" };
    if (capacity >= 500) return { text: "Medium", color: "text-yellow-600" };
    return { text: "Low", color: "text-red-600" };
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
        <p className="text-red-800">Error loading transport data: {error}</p>
      </div>
    );
  }

  const { systems, statistics } = transportData;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Transportation
        </h1>
        <p className="text-gray-600">
          Manage city transportation systems and routes
        </p>
      </div>

      {/* Transport Table */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            All Transport Systems
          </h2>

        </div>

        {transportData.systems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No transport systems found</p>
            <p className="text-sm">
              Transport data will appear here when available
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {systems.map((transport, index) => (
                  <tr
                    key={transport.id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {transport.id}
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                          transport.type
                        )}`}
                      >
                        {transport.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {transport.route}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900">
                      {transport.capacity.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`font-semibold ${
                          getCapacityLevel(transport.capacity).color
                        }`}
                      >
                        {getCapacityLevel(transport.capacity).text} Capacity
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats - Using SQL calculated values */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Total Systems
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {statistics.total_systems}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Bus Routes
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {statistics.bus_count}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Metro Lines
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {statistics.metro_count}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Train Routes
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {statistics.train_count}
          </p>
        </div>
      </div>

      {/* Capacity Overview - Now using SQL calculated statistics */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Capacity Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {statistics.total_capacity.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Capacity</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(statistics.average_capacity).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Average Capacity</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {statistics.highest_capacity.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Highest Capacity</p>
          </div>
           <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {statistics.lowest_capacity.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Lowest Capacity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
