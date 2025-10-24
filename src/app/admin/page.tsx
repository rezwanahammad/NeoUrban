"use client";
import { useState, useEffect } from "react";

type Citizen = {
  citizen_id: number;
  name: string;
  age: number;
  gender: string;
  address: string;
  contact: string;
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("citizens");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [editingCitizen, setEditingCitizen] = useState<Citizen | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states for each table
  const [citizenForm, setCitizenForm] = useState({
    name: "",
    age: "",
    gender: "",
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
              gender: "",
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

  // Fetch citizens list
  const fetchCitizens = async () => {
    try {
      const response = await fetch("/api/citizens");
      if (response.ok) {
        const data = await response.json();
        setCitizens(data.citizens || []);
      }
    } catch (error) {
      console.error("Error fetching citizens:", error);
    }
  };

  // Load citizens when component mounts or when activeTab changes to citizens
  useEffect(() => {
    if (activeTab === "citizens") {
      fetchCitizens();
    }
  }, [activeTab]);

  // Update citizen
  const handleUpdateCitizen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCitizen) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/citizens/${editingCitizen.citizen_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editingCitizen.name,
            age: editingCitizen.age,
            gender: editingCitizen.gender,
            address: editingCitizen.address,
            contact: editingCitizen.contact,
          }),
        }
      );

      if (response.ok) {
        setMessage("Citizen updated successfully!");
        setShowEditModal(false);
        setEditingCitizen(null);
        fetchCitizens(); // Refresh the list
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || error.message}`);
      }
    } catch (error) {
      setMessage(`Error updating citizen: ${error}`);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  // Delete citizen
  const handleDeleteCitizen = async (citizenId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this citizen? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/citizens/${citizenId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Citizen deleted successfully!");
        fetchCitizens(); // Refresh the list
      } else {
        const error = await response.json();
        if (error.details) {
          setMessage(
            `Cannot delete: Citizen has ${error.details.bills} bills, ${error.details.requests} requests, ${error.details.appointments} appointments, ${error.details.tickets} tickets`
          );
        } else {
          setMessage(`Error: ${error.error || error.message}`);
        }
      }
    } catch (error) {
      setMessage(`Error deleting citizen: ${error}`);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 5000);
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
            <select
              value={citizenForm.gender}
              onChange={(e) =>
                setCitizenForm((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="p-3 border rounded-lg"
              required
              title="Select Gender"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="tel"
              placeholder="Contact (Phone)"
              value={citizenForm.contact}
              onChange={(e) =>
                setCitizenForm((prev) => ({ ...prev, contact: e.target.value }))
              }
              className="p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Address"
              value={citizenForm.address}
              onChange={(e) =>
                setCitizenForm((prev) => ({ ...prev, address: e.target.value }))
              }
              className="p-3 border rounded-lg"
              required
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
              title="Utility Type"
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
              title="Service Category"
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
              title="Citizen ID"
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
              title="Payment Status"
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
              value={ticketForm.booking_date}
              onChange={(e) =>
                setTicketForm((prev) => ({
                  ...prev,
                  booking_date: e.target.value,
                }))
              }
              className="p-3 border rounded-lg"
              title="Booking Date"
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

        {/* Citizens List - only show for citizens tab */}
        {activeTab === "citizens" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Citizens List
              </h2>
              <button
                onClick={fetchCitizens}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Refresh
              </button>
            </div>

            {citizens.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Age
                      </th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Gender
                      </th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Address
                      </th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Contact
                      </th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {citizens.map((citizen) => (
                      <tr key={citizen.citizen_id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm font-medium text-gray-900">
                          #{citizen.citizen_id}
                        </td>
                        <td className="p-3 text-sm text-gray-900">
                          {citizen.name}
                        </td>
                        <td className="p-3 text-sm text-gray-900">
                          {citizen.age}
                        </td>
                        <td className="p-3 text-sm text-gray-900">
                          {citizen.gender}
                        </td>
                        <td className="p-3 text-sm text-gray-900">
                          {citizen.address}
                        </td>
                        <td className="p-3 text-sm text-gray-900">
                          {citizen.contact}
                        </td>
                        <td className="p-3 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingCitizen(citizen);
                                setShowEditModal(true);
                              }}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteCitizen(citizen.citizen_id)
                              }
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No citizens found. Add some citizens using the form above.
              </p>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingCitizen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Edit Citizen
              </h3>
              <form onSubmit={handleUpdateCitizen} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={editingCitizen.name}
                  onChange={(e) =>
                    setEditingCitizen({
                      ...editingCitizen,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={editingCitizen.age}
                  onChange={(e) =>
                    setEditingCitizen({
                      ...editingCitizen,
                      age: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                  title="Age"
                  required
                />
                <select
                  value={editingCitizen.gender}
                  onChange={(e) =>
                    setEditingCitizen({
                      ...editingCitizen,
                      gender: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                  required
                  title="Select Gender"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="tel"
                  placeholder="Contact (Phone)"
                  value={editingCitizen.contact}
                  onChange={(e) =>
                    setEditingCitizen({
                      ...editingCitizen,
                      contact: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                />
                <textarea
                  placeholder="Address"
                  value={editingCitizen.address}
                  onChange={(e) =>
                    setEditingCitizen({
                      ...editingCitizen,
                      address: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCitizen(null);
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
