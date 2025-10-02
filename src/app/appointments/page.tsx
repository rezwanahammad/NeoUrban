"use client";
import { useEffect, useState } from "react";

type Appointment = {
  appointment_id: number;
  citizen_name: string;
  hospital_name: string;
  location: string;
  doctor_name: string;
  appointment_date: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

type AppointmentsData = {
  appointments: Appointment[];
  analytics: {
    hospitalPerformance: {
      hospital_name: string;
      location: string;
      total_appointments: number;
      completed_appointments: number;
      completion_rate: string;
    }[];
    statusSummary: {
      status: string;
      appointment_count: number;
      percentage: string;
    }[];
    recentAppointments: Appointment[];
  };
};

export default function AppointmentsPage() {
  const [data, setData] = useState<AppointmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch appointments data");
      })
      .then((appointmentsData) => {
        setData(appointmentsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "✅";
      case "scheduled":
        return "📅";
      case "cancelled":
        return "❌";
      default:
        return "📋";
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
        <p className="text-red-800">Error loading appointments data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Healthcare Appointments
        </h1>
        <p className="text-gray-600">
          SQL Analytics Dashboard for Medical Appointments
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {[
            { id: "overview", label: "Overview" },
            { id: "hospitals", label: "Hospitals" },
            { id: "status", label: "Status" },
            { id: "analytics", label: "Analytics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-white text-blue-700 shadow"
                  : "text-blue-100 hover:text-white hover:bg-white/[0.12]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 shadow rounded-lg text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                Total Appointments
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {data?.appointments?.length || 0}
              </p>
            </div>
            <div className="bg-white p-6 shadow rounded-lg text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                Completed
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {data?.appointments?.filter(
                  (a) => a.status.toLowerCase() === "completed"
                ).length || 0}
              </p>
            </div>
            <div className="bg-white p-6 shadow rounded-lg text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                Scheduled
              </h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {data?.appointments?.filter(
                  (a) => a.status.toLowerCase() === "scheduled"
                ).length || 0}
              </p>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Appointments
            </h2>
            <div className="space-y-3">
              {data?.appointments?.slice(0, 8).map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <h3 className="font-semibold flex items-center space-x-2">
                      <span>{getStatusIcon(appointment.status)}</span>
                      <span>{appointment.citizen_name}</span>
                    </h3>
                    <p className="text-sm text-gray-600">
                      Dr. {appointment.doctor_name} at{" "}
                      {appointment.hospital_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDate(appointment.appointment_date)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(appointment.appointment_date)}
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hospital Performance Tab */}
      {activeTab === "hospitals" && (
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4">Hospital Performance</h2>
          <p className="text-sm text-gray-600 mb-4">
            SQL: LEFT OUTER JOIN + Aggregations (COUNT, AVG) + GROUP BY + HAVING
          </p>
          <div className="space-y-4">
            {data?.analytics?.hospitalPerformance?.map(
              (
                hospital: {
                  hospital_name: string;
                  location: string;
                  total_appointments: number;
                  completed_appointments: number;
                  completion_rate: string;
                },
                index: number
              ) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">
                        🏥 {hospital.hospital_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        📍 {hospital.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <span className="font-medium">Appointments:</span>{" "}
                        {hospital.total_appointments}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Completed:</span>{" "}
                        {hospital.completed_appointments}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Success Rate:</span>{" "}
                        {parseFloat(hospital.completion_rate).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Status Summary Tab */}
      {activeTab === "status" && (
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4">Status Summary</h2>
          <p className="text-sm text-gray-600 mb-4">
            SQL: GROUP BY + Percentage calculation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.analytics?.statusSummary?.map(
              (
                status: {
                  status: string;
                  appointment_count: number;
                  percentage: string;
                },
                index: number
              ) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg text-center"
                >
                  <div className="text-3xl mb-2">
                    {getStatusIcon(status.status)}
                  </div>
                  <h3 className="font-semibold text-lg">{status.status}</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {status.appointment_count}
                  </p>
                  <p className="text-sm text-gray-600">
                    {parseFloat(status.percentage).toFixed(1)}% of total
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Appointment Timeline</h2>
            <p className="text-sm text-gray-600 mb-4">
              SQL: INNER JOIN + Subquery for recent data
            </p>
            <div className="space-y-2">
              {data?.analytics?.recentAppointments
                ?.slice(0, 10)
                .map((appointment: Appointment, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium">
                        {appointment.citizen_name}
                      </span>
                      <span className="text-gray-600">
                        {" "}
                        → Dr. {appointment.doctor_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{appointment.hospital_name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(appointment.appointment_date)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">All Appointments Table</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Patient
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Doctor
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Hospital
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.appointments?.map((appointment) => (
                    <tr
                      key={appointment.appointment_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="p-3 text-sm font-medium text-gray-900">
                        #{appointment.appointment_id}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {appointment.citizen_name}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        Dr. {appointment.doctor_name}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        <div>
                          <p>{appointment.hospital_name}</p>
                          <p className="text-xs text-gray-500">
                            {appointment.location}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        <div>
                          <p>{formatDate(appointment.appointment_date)}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(appointment.appointment_date)}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}{" "}
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
