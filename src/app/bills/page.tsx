"use client";
import { useEffect, useState } from "react";

type Bill = {
  bill_id: number;
  citizen: string;
  utility: string;
  amount: number | string;
  due_date: string;
  payment_status: "Paid" | "Unpaid";
};

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bills")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch bills");
      })
      .then((data) => {
        setBills(data.bills || []);
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
        <p className="text-red-800">Error loading bills: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bills</h1>
        <p className="text-gray-600">Manage utility bills and payment status</p>
      </div>

      {/* Bills Table */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Bills</h2>
          <span className="text-sm text-gray-500">
            Total: {bills?.length || 0} bills
          </span>
        </div>

        {(bills?.length || 0) === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No bills found</p>
            <p className="text-sm">
              Bills will appear here when data is available
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Bill ID
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Citizen
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Utility
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bills?.map((bill, index) => (
                  <tr
                    key={bill.bill_id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {bill.bill_id}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {bill.citizen}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      <span className="capitalize">{bill.utility}</span>
                    </td>
                    <td className="p-4 text-sm font-semibold text-green-600">
                      {formatAmount(bill.amount)}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {formatDate(bill.due_date)}
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          bill.payment_status
                        )}`}
                      >
                        {bill.payment_status}
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
            Total Bills
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {bills?.length || 0}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Paid
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {
              bills?.filter((b) => b.payment_status.toLowerCase() === "paid")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Unpaid
          </h3>
          <p className="text-2xl font-bold text-red-600">
            {
              bills?.filter((b) => b.payment_status.toLowerCase() === "unpaid")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Total Amount
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            $
            {bills
              .reduce(
                (sum, b) =>
                  sum +
                  (typeof b.amount === "string"
                    ? parseFloat(b.amount)
                    : b.amount),
                0
              )
              .toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
