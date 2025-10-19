"use client";
import { useEffect, useState } from "react";

type Healthcare = {
  hospital_id: number;
  name: string;
  location: string;
  capacity: number;
};

export default function HealthcarePage() {
  const [healthcare, setHealthcare] = useState<Healthcare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/healthcare")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch healthcare data");
      })
      .then((data) => {
        setHealthcare(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const getCapacityLevel = (capacity: number) => {
    if (capacity >= 300)
      return { text: "Large", color: "bg-green-100 text-green-800" };
    if (capacity >= 150)
      return { text: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Small", color: "bg-blue-100 text-blue-800" };
  };

  const getCapacityBar = (capacity: number) => {
    const maxCapacity =
      healthcare.length > 0
        ? Math.max(...healthcare.map((h) => h.capacity))
        : 1;
    const percentage = (capacity / maxCapacity) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-blue-600 h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    );
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
        <p className="text-red-800">Error loading healthcare data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare</h1>
        <p className="text-gray-600">
          Manage city healthcare facilities and hospitals
        </p>
      </div>

      {/* Healthcare Table */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Healthcare Facilities
          </h2>
          <span className="text-sm text-gray-500">
            Total: {healthcare.length} hospitals
          </span>
        </div>

        {healthcare.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No healthcare facilities found</p>
            <p className="text-sm">
              Healthcare data will appear here when available
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
                    Hospital Name
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Capacity Usage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {healthcare.map((hospital, index) => (
                  <tr
                    key={hospital.hospital_id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {hospital.hospital_id}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900">
                      {hospital.name}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {hospital.location}
                    </td>
                    <td className="p-4 text-sm font-semibold text-blue-600">
                      {hospital.capacity.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          getCapacityLevel(hospital.capacity).color
                        }`}
                      >
                        {getCapacityLevel(hospital.capacity).text}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          {getCapacityBar(hospital.capacity)}
                        </div>
                        <span className="text-xs text-gray-500 min-w-0">
                          {hospital.capacity}
                        </span>
                      </div>
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
            Total Hospitals
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {healthcare.length}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Large Hospitals
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {healthcare.filter((h) => h.capacity >= 300).length}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Medium Hospitals
          </h3>
          <p className="text-2xl font-bold text-yellow-600">
            {
              healthcare.filter((h) => h.capacity >= 150 && h.capacity < 300)
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Small Hospitals
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {healthcare.filter((h) => h.capacity < 150).length}
          </p>
        </div>
      </div>

      {/* Capacity Analysis */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Capacity Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {healthcare
                .reduce((sum, h) => sum + h.capacity, 0)
                .toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Bed Capacity</p>
            <p className="text-xs text-gray-500 mt-2">Across all facilities</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {healthcare.length > 0
                ? Math.round(
                    healthcare.reduce((sum, h) => sum + h.capacity, 0) /
                      healthcare.length
                  ).toLocaleString()
                : 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Average Capacity</p>
            <p className="text-xs text-gray-500 mt-2">Per facility</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {healthcare.length > 0
                ? Math.max(
                    ...healthcare.map((h) => h.capacity)
                  ).toLocaleString()
                : 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Largest Facility</p>
            <p className="text-xs text-gray-500 mt-2">Maximum capacity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
