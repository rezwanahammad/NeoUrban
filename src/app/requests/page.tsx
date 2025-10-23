/*
 * Service Requests Management Page
 *
 * Displays data from /api/requests which executes 6 SQL queries:
 *
 * 1. Main Requests List
 *    SQL Techniques: DISTINCT, INNER JOIN (Citizens, Services), CASE statement,
 *    Multi-column ORDER BY, Column aliasing
 *
 * 2. High-Demand Citizens
 *    SQL Techniques: INNER JOIN with USING clause, WHERE with IN, GROUP BY,
 *    HAVING with COUNT filter, MAX aggregate
 *
 * 3. Status Summary with Common Table Expression
 *    SQL Techniques: WITH clause (CTE), Subquery in SELECT, GROUP BY,
 *    MIN/MAX aggregates, Arithmetic expressions (ROUND)
 *
 * 4. Category Analysis
 *    SQL Techniques: Multiple INNER JOINs, NOT IN clause, GROUP BY,
 *    HAVING with COUNT, AVG aggregate
 *
 * 5. Priority Analysis
 *    SQL Techniques: UNION set operation, Multiple SELECT statements,
 *    INNER JOIN, COUNT and AVG aggregates
 *
 * 6. Age Range Analysis
 *    SQL Techniques: BETWEEN operator, CASE for age groups, COUNT DISTINCT,
 *    Multiple INNER JOINs, GROUP BY
 */

"use client";
import { useEffect, useState } from "react";

type Request = {
  request_id: number;
  citizen_name: string;
  service_name: string;
  category: string;
  status: string | null | undefined;
  priority: string | null | undefined;
  request_date: string;
  age: number;
  gender: string;
  days_open: number;
};

type HighDemandCitizen = {
  name: string;
  category: string;
  total_requests: number;
};

type StatusSummary = {
  status: string;
  total_requests: number;
  avg_days_open: number;
  oldest_request: string;
  newest_request: string;
};

type CategoryAnalysis = {
  category: string;
  total_requests: number;
  avg_days_open: number;
};

type RequestsData = {
  requests: Request[];
  analytics: {
    highDemandCitizens: HighDemandCitizen[];
    statusSummary: StatusSummary[];
    categoryAnalysis: CategoryAnalysis[];
  };
};

export default function RequestsPage() {
  const [data, setData] = useState<RequestsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/requests")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch requests");
      })
      .then((requestsData) => {
        setData(requestsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string | null | undefined) => {
    if (!priority) return "bg-gray-100 text-gray-800";

    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
        <p className="text-red-800">Error loading requests: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📋 Service Requests
        </h1>
        <p className="text-gray-600">SQL Query Results from Requests API</p>
      </div>

      {/* All Requests Section - Main Query */}
      <div className="bg-white p-6 shadow-lg rounded-lg">

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Request ID
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Citizen
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Service
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Category
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Priority
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Date
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Days Open
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.requests?.map((request) => (
                <tr key={request.request_id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium text-gray-900">
                    #{request.request_id}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {request.citizen_name}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {request.service_name}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {request.category}
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      {request.priority}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {formatDate(request.request_date)}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {request.days_open} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Total Requests</p>
            <p className="text-2xl font-bold text-blue-600">
              {data?.requests?.length || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {data?.requests?.filter(
                (r) => r.status?.toLowerCase() === "completed"
              ).length || 0}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {data?.requests?.filter(
                (r) => r.status?.toLowerCase() === "in progress"
              ).length || 0}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {data?.requests?.filter(
                (r) => r.status?.toLowerCase() === "pending"
              ).length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Query Results */}
      <div className="space-y-6">
        {/*Query 1: High-Demand Citizens */}
        <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-red-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Query 1: High-Demand Citizens (INNER JOIN + GROUP BY + HAVING)
            </h2>
          </div>

          {data?.analytics?.highDemandCitizens &&
          data.analytics.highDemandCitizens.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Citizen Name
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Service Category
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Total Requests
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.analytics.highDemandCitizens.map(
                    (item: HighDemandCitizen, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900 border-b font-medium">
                          {item.name}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {item.category}
                        </td>
                        <td className="p-3 text-sm text-red-600 border-b font-bold">
                          {item.total_requests}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No high-demand citizens found
            </p>
          )}
        </div>

        {/*Query 2: Status Summary */}
        <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-blue-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Query 2: Status Summary (VIEW + LEFT OUTER JOIN + Aggregations)
            </h2>
          </div>

          {data?.analytics?.statusSummary &&
          data.analytics.statusSummary.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Status
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Total Requests
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Avg Days Open
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Oldest Request
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Newest Request
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.analytics.statusSummary.map(
                    (item: StatusSummary, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 text-sm border-b">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b font-bold">
                          {item.total_requests}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {Math.round(item.avg_days_open || 0)} days
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {formatDate(item.oldest_request)}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {formatDate(item.newest_request)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No status summary found
            </p>
          )}
        </div>

        {/*Query 3: Category Analysis */}
        <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-green-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Query 3: Category Analysis (VIEW + Subquery + GROUP BY)
            </h2>
          </div>

          {data?.analytics?.categoryAnalysis &&
          data.analytics.categoryAnalysis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.analytics.categoryAnalysis.map(
                (item: CategoryAnalysis, index: number) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg bg-green-50 border-2 border-green-300"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.category}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Requests:</span>{" "}
                        <span className="text-lg font-bold text-gray-900">
                          {item.total_requests}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Avg Days Open:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          {Math.round(item.avg_days_open || 0)} days
                        </span>
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No category analysis data found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
