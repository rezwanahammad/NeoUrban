"use client";
import { useEffect, useState } from "react";

type Citizen = {
  citizen_id: number;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  address: string;
  contact: string;
};

export default function CitizensPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/citizens")
      .then((res) => res.json())
      .then((data) => setCitizens(data.citizens || []));
  }, []);

  const filteredCitizens = citizens.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          All Citizens List
        </h2>
        <div className="mb-5 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <table className="min-w-full text-sm text-slate-700">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-blue-50 text-slate-900 uppercase text-xs tracking-wider">
                <th className="p-3 border-b text-left">ID</th>
                <th className="p-3 border-b text-left">Name</th>
                <th className="p-3 border-b text-left">Age</th>
                <th className="p-3 border-b text-left">Gender</th>
              </tr>
            </thead>
            <tbody>
              {filteredCitizens.length > 0 ? (
                filteredCitizens.map((c) => (
                  <tr
                    key={c.citizen_id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-3 border-b">{c.citizen_id}</td>
                    <td className="p-3 border-b font-medium text-slate-800">
                      {c.name}
                    </td>
                    <td className="p-3 border-b">{c.age}</td>
                    <td className="p-3 border-b">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          c.gender === "Male"
                            ? "bg-blue-100 text-blue-800"
                            : c.gender === "Female"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {c.gender}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-6 text-slate-500 italic"
                  >
                    No citizens found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="text-sm text-slate-500 mt-4 text-right">
          Showing {filteredCitizens.length} of {citizens.length} citizens
        </div>
      </div>
    </div>
  );
}
