"use client";
import { useEffect, useState } from "react";

type Service = {
  service_id: number;
  service_name: string;
  category: "Waste" | "Electricity" | "Water" | "Transport" | "Healthcare";
  provider: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch services data");
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "waste":
        return "bg-orange-100 text-orange-800";
      case "electricity":
        return "bg-yellow-100 text-yellow-800";
      case "water":
        return "bg-blue-100 text-blue-800";
      case "transport":
        return "bg-purple-100 text-purple-800";
      case "healthcare":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "waste":
        return "🗑️";
      case "electricity":
        return "⚡";
      case "water":
        return "💧";
      case "transport":
        return "🚌";
      case "healthcare":
        return "🏥";
      default:
        return "🏢";
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
        <p className="text-red-800">Error loading services data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">City Services</h1>
        <p className="text-gray-600">
          Manage and monitor all city services and providers
        </p>
      </div>

      {/* Services Table */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Services</h2>
          <span className="text-sm text-gray-500">
            Total: {services.length} services
          </span>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No services found</p>
            <p className="text-sm">
              Services data will appear here when available
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
                    Service Name
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service, index) => (
                  <tr
                    key={service.service_id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {service.service_id}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span>{getCategoryIcon(service.category)}</span>
                        <span>{service.service_name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                          service.category
                        )}`}
                      >
                        {service.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {service.provider}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Total Services
          </h3>
          <p className="text-2xl font-bold text-blue-600">{services.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Waste 🗑️
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            {
              services.filter((s) => s.category.toLowerCase() === "waste")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Electricity ⚡
          </h3>
          <p className="text-2xl font-bold text-yellow-600">
            {
              services.filter((s) => s.category.toLowerCase() === "electricity")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Water 💧
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {
              services.filter((s) => s.category.toLowerCase() === "water")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Healthcare 🏥
          </h3>
          <p className="text-2xl font-bold text-pink-600">
            {
              services.filter((s) => s.category.toLowerCase() === "healthcare")
                .length
            }
          </p>
        </div>
      </div>
    </div>
  );
}
