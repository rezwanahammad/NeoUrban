

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

type HospitalPerformance = {
  hospital_name: string;
  location: string;
  total_appointments: number;
  completed_appointments: number;
  completion_rate: string;
};

type StatusSummary = {
  status: string;
  appointment_count: number;
  percentage: string;
};

type RecentAppointment = {
  appointment_id: number;
  citizen_name: string;
  hospital_name: string;
  location: string;
  doctor_name: string;
  appointment_date: string;
  status: string;
  days_ago: number;
};

type AppointmentsData = {
  appointments: Appointment[];
  analytics: {
    hospitalPerformance: HospitalPerformance[];
    statusSummary: StatusSummary[];
    recentAppointments: RecentAppointment[];
  };
};

export default function AppointmentsPage() {
  const [data, setData] = useState<AppointmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";

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
        <p className="text-red-800">Error loading appointments: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Medical Appointments
        </h1>
      </div>

      {/* All Appointments Section */}
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          All Medical Appointments
        </h2>
        <p className="text-sm text-gray-600 mb-4"></p>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  ID
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Citizen
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Hospital
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Location
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Doctor
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
                    {appointment.appointment_id}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {appointment.citizen_name}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {appointment.hospital_name}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {appointment.location}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {appointment.doctor_name}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {formatDate(appointment.appointment_date)}
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        {/*Hospital Performance */}
        <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-red-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Hospital Performance
            </h2>
          </div>

          {data?.analytics?.hospitalPerformance &&
          data.analytics.hospitalPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Hospital Name
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Location
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Total Appointments
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Completed
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Completion Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.analytics.hospitalPerformance.map(
                    (hospital: HospitalPerformance, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900 border-b font-medium">
                          {hospital.hospital_name}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {hospital.location}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b font-bold">
                          {hospital.total_appointments}
                        </td>
                        <td className="p-3 text-sm text-green-600 border-b font-bold">
                          {hospital.completed_appointments}
                        </td>
                        <td className="p-3 text-sm text-red-600 border-b font-bold">
                          {hospital.completion_rate}%
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hospital performance data found
            </p>
          )}
        </div>

        {/*Status Summary */}
        <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-blue-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Status Summary
            </h2>
          </div>

          {data?.analytics?.statusSummary &&
          data.analytics.statusSummary.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.analytics.statusSummary.map(
                (status: StatusSummary, index: number) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg bg-blue-50 border-2 border-blue-300"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <span
                        className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${getStatusColor(
                          status.status
                        )}`}
                      >
                        {status.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Count:</span>{" "}
                        <span className="text-2xl font-bold text-gray-900">
                          {status.appointment_count}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Percentage:</span>{" "}
                        <span className="text-xl font-bold text-blue-600">
                          {status.percentage}%
                        </span>
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No status summary data found
            </p>
          )}
        </div>

        {/*Recent Appointments */}
        <div className="bg-white p-6 shadow-lg rounded-lg border-l-4 border-green-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Recent Appointments
            </h2>
          </div>

          {data?.analytics?.recentAppointments &&
          data.analytics.recentAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      ID
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Citizen
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Hospital
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Doctor
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Date
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.analytics.recentAppointments.map(
                    (appointment: RecentAppointment, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900 border-b font-medium">
                          #{appointment.appointment_id}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {appointment.citizen_name}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {appointment.hospital_name}
                        </td>
              
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {appointment.doctor_name}
                        </td>
                        <td className="p-3 text-sm text-gray-900 border-b">
                          {formatDate(appointment.appointment_date)}
                        </td>
                        <td className="p-3 text-sm border-b">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                       
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No recent appointments found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
