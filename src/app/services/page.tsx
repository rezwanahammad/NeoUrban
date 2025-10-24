

"use client";
import { useEffect, useState } from "react";

type Service = {
  service_id: number;
  service_name: string;
  category: "Waste" | "Electricity" | "Water" | "Transport" | "Healthcare";
  provider: string;
};

const categoryColors: Record<Service["category"], string> = {
  Waste: "bg-yellow-100 text-yellow-800",
  Electricity: "bg-blue-100 text-blue-800",
  Water: "bg-cyan-100 text-cyan-800",
  Transport: "bg-green-100 text-green-800",
  Healthcare: "bg-red-100 text-red-800",
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

  // Summary statistics
  const totalServices = services.length;
  const categoryCounts = services.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

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
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Services Management
        </h1>
      </div>



      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Services</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.service_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{service.service_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.service_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categoryColors[service.category]}`}>
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {service.provider}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found</p>
          </div>
        )}
      </div>

            {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-500">Total Services</div>
          <div className="text-2xl font-bold text-blue-700">{totalServices}</div>
        </div>
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <div key={cat} className="rounded-lg p-4 text-center bg-gray-50">
            <div className={`text-xs font-semibold mb-1 rounded ${categoryColors[cat as Service["category"]]}`}>
              {cat}
            </div>
            <div className="text-lg font-bold text-gray-700">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}