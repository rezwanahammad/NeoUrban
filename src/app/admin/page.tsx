"use client";
import { useState } from "react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("citizens");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form states for each table
  const [citizenForm, setCitizenForm] = useState({
    name: "",
    age: "",
    address: "",
    contact: "",
  });
  const [healthcareForm, setHealthcareForm] = useState({
    name: "",
    location: "",
    capacity: "",
    emergency_services: "Yes",
  });
  const [utilityForm, setUtilityForm] = useState({
    type: "Electricity",
    provider: "",
  });
  const [serviceForm, setServiceForm] = useState({
    service_name: "",
    category: "Waste",
    provider: "",
  });
  const [appointmentForm, setAppointmentForm] = useState({
    citizen_id: "",
    hospital_id: "",
    doctor_name: "",
    appointment_date: "",
    status: "Scheduled",
  });
  const [billForm, setBillForm] = useState({
    citizen_id: "",
    utility_id: "",
    amount: "",
    due_date: "",
    payment_status: "Unpaid",
  });
  const [ticketForm, setTicketForm] = useState({
    citizen_id: "",
    transport_id: "",
    fare: "",
    booking_date: "",
  });

  const tables = [
    { id: "citizens", name: "Citizens" },
    { id: "healthcare", name: "Healthcare" },
    { id: "utilities", name: "Utilities" },
    { id: "services", name: "Services" },
    { id: "appointments", name: "Appointments" },
    { id: "bills", name: "Bills" },
    { id: "tickets", name: "Tickets" },
  ];

  // Add new record
  const handleSubmit = async (e: React.FormEvent, tableName: string) => {
    e.preventDefault();
    setLoading(true);

    try {
      let formData;
      switch (tableName) {
        case "citizens":
          formData = citizenForm;
          break;
        case "healthcare":
          formData = healthcareForm;
          break;
        case "utilities":
          formData = utilityForm;
          break;
        case "services":
          formData = serviceForm;
          break;
        case "appointments":
          formData = appointmentForm;
          break;
        case "bills":
          formData = billForm;
          break;
        case "tickets":
          formData = ticketForm;
          break;
        default:
          formData = {};
      }

      const response = await fetch(`/api/admin/${tableName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(`Successfully added ${tableName} record!`);
        // Reset form
        switch (tableName) {
          case "citizens":
            setCitizenForm({
              name: "",
              age: "",
              address: "",
              contact: "",
            });
            break;
          case "healthcare":
            setHealthcareForm({
              name: "",
              location: "",
              capacity: "",
              emergency_services: "Yes",
            });
            break;
          case "utilities":
            setUtilityForm({ type: "Electricity", provider: "" });
            break;
          case "services":
            setServiceForm({
              service_name: "",
              category: "Waste",
              provider: "",
            });
            break;
          case "appointments":
            setAppointmentForm({
              citizen_id: "",
              hospital_id: "",
              doctor_name: "",
              appointment_date: "",
              status: "Scheduled",
            });
            break;
          case "bills":
            setBillForm({
              citizen_id: "",
              utility_id: "",
              amount: "",
              due_date: "",
              payment_status: "Unpaid",
            });
            break;
          case "tickets":
            setTicketForm({
              citizen_id: "",
              transport_id: "",
              fare: "",
              booking_date: "",
            });
            break;
        }
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || error.message}`);
      }
    } catch (error) {
      setMessage(`Error adding ${tableName}: ${error}`);
    }
    setLoading(false);
  };

  const renderForm = (tableName: string) => {
    switch (tableName) {
      case "citizens":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={citizenForm.name}
              onChange={(e) =>
                setCitizenForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={citizenForm.age}
              onChange={(e) =>
                setCitizenForm((prev) => ({ ...prev, age: e.target.value }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={citizenForm.address}
              onChange={(e) =>
                setCitizenForm((prev) => ({ ...prev, address: e.target.value }))
              }
              className="p-3 border rounded-lg col-span-2"
              required
            />
            <input
              type="tel"
              placeholder="Contact"
              value={citizenForm.contact}
              onChange={(e) =>
                setCitizenForm((prev) => ({ ...prev, contact: e.target.value }))
              }
              className="p-3 border rounded-lg"
            />
          </div>
        );

      case "healthcare":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Hospital Name"
              value={healthcareForm.name}
              onChange={(e) =>
                setHealthcareForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={healthcareForm.location}
              onChange={(e) =>
                setHealthcareForm((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              value={healthcareForm.capacity}
              onChange={(e) =>
                setHealthcareForm((prev) => ({
                  ...prev,
                  capacity: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
            />
            <select
              value={healthcareForm.emergency_services}
              onChange={(e) =>
                setHealthcareForm((prev) => ({
                  ...prev,
                  emergency_services: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        );

      case "utilities":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={utilityForm.type}
              onChange={(e) =>
                setUtilityForm((prev) => ({ ...prev, type: e.target.value }))
              }
              className="p-3 border rounded-lg"
            >
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Internet">Internet</option>
              <option value="Gas">Gas</option>
            </select>
            <input
              type="text"
              placeholder="Provider Name"
              value={utilityForm.provider}
              onChange={(e) =>
                setUtilityForm((prev) => ({
                  ...prev,
                  provider: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              required
            />
          </div>
        );

      case "services":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Service Name"
              value={serviceForm.service_name}
              onChange={(e) =>
                setServiceForm((prev) => ({
                  ...prev,
                  service_name: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <select
              value={serviceForm.category}
              onChange={(e) =>
                setServiceForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
            >
              <option value="Waste">Waste</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Transport">Transport</option>
              <option value="Healthcare">Healthcare</option>
            </select>
            <input
              type="text"
              placeholder="Provider"
              value={serviceForm.provider}
              onChange={(e) =>
                setServiceForm((prev) => ({
                  ...prev,
                  provider: e.target.value,
                }))
              }
              className="p-3 border rounded-lg col-span-2"
              required
            />
          </div>
        );

      case "appointments":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Citizen ID"
              value={appointmentForm.citizen_id}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  citizen_id: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Hospital ID"
              value={appointmentForm.hospital_id}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  hospital_id: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Doctor Name"
              value={appointmentForm.doctor_name}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  doctor_name: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="datetime-local"
              value={appointmentForm.appointment_date}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  appointment_date: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <select
              value={appointmentForm.status}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              title="Appointment Status"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        );

      case "bills":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Citizen ID"
              value={billForm.citizen_id}
              onChange={(e) =>
                setBillForm((prev) => ({ ...prev, citizen_id: e.target.value }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Utility ID"
              value={billForm.utility_id}
              onChange={(e) =>
                setBillForm((prev) => ({ ...prev, utility_id: e.target.value }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              step="0.01"
              value={billForm.amount}
              onChange={(e) =>
                setBillForm((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="date"
              value={billForm.due_date}
              onChange={(e) =>
                setBillForm((prev) => ({ ...prev, due_date: e.target.value }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <select
              value={billForm.payment_status}
              onChange={(e) =>
                setBillForm((prev) => ({
                  ...prev,
                  payment_status: e.target.value,
                }))
              }
              className="p-3 border rounded-lg col-span-2"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        );

      case "tickets":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Citizen ID"
              value={ticketForm.citizen_id}
              onChange={(e) =>
                setTicketForm((prev) => ({
                  ...prev,
                  citizen_id: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Transport ID"
              value={ticketForm.transport_id}
              onChange={(e) =>
                setTicketForm((prev) => ({
                  ...prev,
                  transport_id: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Fare Amount"
              value={ticketForm.fare}
              onChange={(e) =>
                setTicketForm((prev) => ({ ...prev, fare: e.target.value }))
              }
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="date"
              placeholder="Booking Date"
              value={ticketForm.booking_date}
              onChange={(e) =>
                setTicketForm((prev) => ({
                  ...prev,
                  booking_date: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              required
            />
          </div>
        );

      default:
        return <div>Form not implemented for {tableName}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage your database records</p>
            </div>
            <div className="text-sm text-gray-500">No login required</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("Error")
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => setActiveTab(table.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === table.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {table.name}
            </button>
          ))}
        </div>

        {/* Current Table Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Add New {tables.find((t) => t.id === activeTab)?.name} Record
          </h2>

          <form
            onSubmit={(e) => handleSubmit(e, activeTab)}
            className="space-y-6"
          >
            {renderForm(activeTab)}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Adding..."
                : `Add ${tables.find((t) => t.id === activeTab)?.name} Record`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
