"use client";
import { useEffect, useState } from "react";

type Bill = {
  bill_id: number;
  citizen: string;
  utility: string;
  provider: string;
  amount: number | string;
  due_date: string;
  payment_status: "Paid" | "Unpaid";
  days_overdue: number;
};

type BillsData = {
  bills: Bill[];
  analytics: {
    highUnpaid: any[];
    utilitySummary: any[];
    paymentStatus: any[];
  };
};

export default function BillsPage() {
  const [data, setData] = useState<BillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bills")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch bills");
      })
      .then((billsData) => {
        setData(billsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return `$${numAmount.toFixed(2)}`;
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
        <p className="text-red-800">Error loading bills data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💰 Bills Management
        </h1>
        <p className="text-gray-600">SQL Query Results from Bills API</p>
      </div>

      {/* All Bills Section - Main Query */}
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📋 All Bills (Main Query)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          <strong>SQL Used:</strong> INNER JOIN + CASE statement for days
          overdue
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Bill ID
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Citizen
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Utility
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Provider
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Amount
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Days Overdue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.bills?.map((bill) => (
                <tr key={bill.bill_id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium text-gray-900">
                    #{bill.bill_id}
                  </td>
                  <td className="p-3 text-sm text-gray-900">{bill.citizen}</td>
                  <td className="p-3 text-sm text-gray-900">{bill.utility}</td>
                  <td className="p-3 text-sm text-gray-600">{bill.provider}</td>
                  <td className="p-3 text-sm font-bold text-green-600">
                    {formatAmount(bill.amount)}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {formatDate(bill.due_date)}
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        bill.payment_status
                      )}`}
                    >
                      {bill.payment_status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    {bill.days_overdue > 0 ? (
                      <span className="text-red-600 font-semibold">
                        {bill.days_overdue} days
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Total Bills</p>
            <p className="text-2xl font-bold text-blue-600">
              {data?.bills?.length || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Paid Bills</p>
            <p className="text-2xl font-bold text-green-600">
              {data?.bills?.filter(
                (b) => b.payment_status.toLowerCase() === "paid"
              ).length || 0}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Unpaid Bills</p>
            <p className="text-2xl font-bold text-red-600">
              {data?.bills?.filter(
                (b) => b.payment_status.toLowerCase() === "unpaid"
              ).length || 0}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatAmount(
                data?.bills?.reduce((sum, b) => {
                  const amount =
                    typeof b.amount === "string"
                      ? parseFloat(b.amount)
                      : b.amount;
                  return sum + amount;
                }, 0) || 0
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Query Results */}
      {/* Query 1: High Unpaid Bills */}
      <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-red-500">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🔴 Query 1: High Unpaid Bills
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            <strong>SQL Used:</strong> INNER JOIN + GROUP BY + HAVING + Subquery
          </p>
          <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto">
            <code>
              SELECT c.name, SUM(b.amount) AS total_unpaid, COUNT(*) AS
              unpaid_count
              <br />
              FROM Citizens c INNER JOIN Bills b ON c.citizen_id = b.citizen_id
              <br />
              WHERE b.payment_status = 'Unpaid'
              <br />
              GROUP BY c.citizen_id, c.name
              <br />
              HAVING SUM(b.amount) &gt; (SELECT AVG(amount) FROM Bills WHERE
              payment_status = 'Unpaid')
            </code>
          </div>
        </div>

        {data?.analytics?.highUnpaid && data.analytics.highUnpaid.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Citizen Name
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Total Unpaid
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Unpaid Count
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Avg Unpaid Amount
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Max Days Overdue
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.analytics.highUnpaid.map((item: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-900 border-b font-medium">
                      {item.name}
                    </td>
                    <td className="p-3 text-sm text-red-600 border-b font-bold">
                      {formatAmount(item.total_unpaid)}
                    </td>
                    <td className="p-3 text-sm text-gray-900 border-b">
                      {item.unpaid_count}
                    </td>
                    <td className="p-3 text-sm text-gray-900 border-b">
                      {formatAmount(item.avg_unpaid_amount)}
                    </td>
                    <td className="p-3 text-sm text-gray-900 border-b">
                      {item.max_days_overdue > 0 ? (
                        <span className="text-red-600 font-semibold">
                          {item.max_days_overdue} days
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No high unpaid bills found
          </p>
        )}
      </div>

      {/* Query 2: Utility Summary */}
      <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-blue-500">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🔵 Query 2: Utility Type Summary
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            <strong>SQL Used:</strong> LEFT OUTER JOIN + GROUP BY + Aggregations
            (COUNT, SUM, AVG, MIN, MAX)
          </p>
          <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto">
            <code>
              SELECT u.type, COUNT(b.bill_id), SUM(b.amount), AVG(b.amount),
              MIN(b.amount), MAX(b.amount)
              <br />
              FROM Utilities u LEFT OUTER JOIN Bills b ON u.utility_id =
              b.utility_id
              <br />
              GROUP BY u.type
            </code>
          </div>
        </div>

        {data?.analytics?.utilitySummary &&
        data.analytics.utilitySummary.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Utility Type
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Total Bills
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Total Amount
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Avg Amount
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Min Amount
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Max Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.analytics.utilitySummary.map(
                  (item: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-900 border-b font-medium">
                        {item.type}
                      </td>
                      <td className="p-3 text-sm text-gray-900 border-b">
                        {item.total_bills}
                      </td>
                      <td className="p-3 text-sm text-green-600 border-b font-bold">
                        {formatAmount(item.total_amount || 0)}
                      </td>
                      <td className="p-3 text-sm text-gray-900 border-b">
                        {formatAmount(item.avg_amount || 0)}
                      </td>
                      <td className="p-3 text-sm text-gray-900 border-b">
                        {formatAmount(item.min_amount || 0)}
                      </td>
                      <td className="p-3 text-sm text-gray-900 border-b">
                        {formatAmount(item.max_amount || 0)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No utility summary found
          </p>
        )}
      </div>

      {/* Query 3: Payment Status */}
      <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-green-500">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🟢 Query 3: Payment Status Analysis (Last 30 Days)
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            <strong>SQL Used:</strong> Subquery + GROUP BY + Aggregations
          </p>
          <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto">
            <code>
              SELECT payment_status, COUNT(*) AS bill_count, SUM(amount),
              AVG(amount)
              <br />
              FROM Bills
              <br />
              WHERE due_date &gt;= (SELECT DATE_SUB(MAX(due_date), INTERVAL 30
              DAY) FROM Bills)
              <br />
              GROUP BY payment_status
            </code>
          </div>
        </div>

        {data?.analytics?.paymentStatus &&
        data.analytics.paymentStatus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.analytics.paymentStatus.map((item: any, index: number) => (
              <div
                key={index}
                className={`p-6 rounded-lg ${
                  item.payment_status === "Paid"
                    ? "bg-green-50 border-2 border-green-300"
                    : "bg-red-50 border-2 border-red-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.payment_status}
                  </h3>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      item.payment_status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.bill_count} bills
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Total Amount:</span>{" "}
                    <span className="text-lg font-bold text-gray-900">
                      {formatAmount(item.total_amount)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Average Amount:</span>{" "}
                    <span className="font-semibold text-gray-900">
                      {formatAmount(item.avg_amount)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No payment status data found
          </p>
        )}
      </div>
    </div>
  );
}
