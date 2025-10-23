/*
 * Citizens Management Page
 *
 * Displays data from /api/citizens which executes 1 simple query:
 *
 * 1. All Citizens List
 *    SQL Techniques: SELECT * FROM Citizens (basic SELECT query)
 */

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

  useEffect(() => {
    fetch("/api/citizens")
      .then((res) => res.json())
      .then((data) => setCitizens(data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Citizens</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-slate-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Age</th>
            <th className="p-2 border">Gender</th>
          </tr>
        </thead>
        <tbody>
          {citizens.map((c) => (
            <tr key={c.citizen_id} className="hover:bg-slate-100">
              <td className="p-2 border">{c.citizen_id}</td>
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.age}</td>
              <td className="p-2 border">{c.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
