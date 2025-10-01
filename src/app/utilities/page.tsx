"use client";
import { useEffect, useState } from "react";

type Utility = {
  utility_id: number;
  type: "Electricity" | "Water" | "Internet" | "Gas";
  provider: string;
};

export default function UtilitiesPage() {
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/utilities")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch utilities data");
      })
      .then((data) => {
        setUtilities(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "electricity":
        return "bg-yellow-100 text-yellow-800";
      case "water":
        return "bg-blue-100 text-blue-800";
      case "internet":
        return "bg-purple-100 text-purple-800";
      case "gas":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "electricity":
        return "⚡";
      case "water":
        return "💧";
      case "internet":
        return "🌐";
      case "gas":
        return "🔥";
      default:
        return "⚙️";
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
        <p className="text-red-800">Error loading utilities data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Utilities</h1>
        <p className="text-gray-600">
          Manage city utility providers and services
        </p>
      </div>

      {/* Utilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from(new Set(utilities.map((u) => u.type))).map((type) => {
          const typeUtilities = utilities.filter((u) => u.type === type);
          return (
            <div
              key={type}
              className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="text-center">
                <span className="text-4xl mb-4 block">{getTypeIcon(type)}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{type}</h3>
                <span
                  className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getTypeColor(
                    type
                  )}`}
                >
                  {typeUtilities.length} Provider
                  {typeUtilities.length > 1 ? "s" : ""}
                </span>
                <div className="mt-4 space-y-2">
                  {typeUtilities.map((utility) => (
                    <div
                      key={utility.utility_id}
                      className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                    >
                      {utility.provider}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Utilities Table */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            All Utility Providers
          </h2>
          <span className="text-sm text-gray-500">
            Total: {utilities.length} providers
          </span>
        </div>

        {utilities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No utilities found</p>
            <p className="text-sm">
              Utility data will appear here when available
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
                    Provider
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {utilities.map((utility, index) => (
                  <tr
                    key={utility.utility_id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {utility.utility_id}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {getTypeIcon(utility.type)}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {utility.type}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {utility.provider}
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                          utility.type
                        )}`}
                      >
                        {utility.type}
                      </span>
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
            Electricity ⚡
          </h3>
          <p className="text-2xl font-bold text-yellow-600">
            {
              utilities.filter((u) => u.type.toLowerCase() === "electricity")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Water 💧
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {utilities.filter((u) => u.type.toLowerCase() === "water").length}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Internet 🌐
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {
              utilities.filter((u) => u.type.toLowerCase() === "internet")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Gas 🔥
          </h3>
          <p className="text-2xl font-bold text-red-600">
            {utilities.filter((u) => u.type.toLowerCase() === "gas").length}
          </p>
        </div>
      </div>

      {/* Provider Analysis */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Provider Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(new Set(utilities.map((u) => u.provider))).map(
            (provider) => {
              const providerUtilities = utilities.filter(
                (u) => u.provider === provider
              );
              const uniqueTypes = new Set(providerUtilities.map((u) => u.type));

              return (
                <div
                  key={provider}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border"
                >
                  <h3 className="font-bold text-gray-800 mb-2">{provider}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {providerUtilities.length} service
                    {providerUtilities.length > 1 ? "s" : ""} •{" "}
                    {uniqueTypes.size} type{uniqueTypes.size > 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(uniqueTypes).map((type) => (
                      <span
                        key={type}
                        className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getTypeColor(
                          type
                        )}`}
                      >
                        <span className="mr-1">{getTypeIcon(type)}</span>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Service Coverage */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Service Coverage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Essential Services
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="flex items-center space-x-2">
                  <span>💧</span>
                  <span>Water Supply</span>
                </span>
                <span className="font-semibold text-blue-600">
                  {utilities.filter((u) => u.type === "Water").length} provider
                  {utilities.filter((u) => u.type === "Water").length > 1
                    ? "s"
                    : ""}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>Electricity</span>
                </span>
                <span className="font-semibold text-yellow-600">
                  {utilities.filter((u) => u.type === "Electricity").length}{" "}
                  provider
                  {utilities.filter((u) => u.type === "Electricity").length > 1
                    ? "s"
                    : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Additional Services
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="flex items-center space-x-2">
                  <span>🌐</span>
                  <span>Internet</span>
                </span>
                <span className="font-semibold text-purple-600">
                  {utilities.filter((u) => u.type === "Internet").length}{" "}
                  provider
                  {utilities.filter((u) => u.type === "Internet").length > 1
                    ? "s"
                    : ""}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="flex items-center space-x-2">
                  <span>🔥</span>
                  <span>Gas Supply</span>
                </span>
                <span className="font-semibold text-red-600">
                  {utilities.filter((u) => u.type === "Gas").length} provider
                  {utilities.filter((u) => u.type === "Gas").length > 1
                    ? "s"
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
