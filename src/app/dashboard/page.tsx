"use client";
import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, PieLabelRenderProps } from "recharts";

const data = [
  { name: "Candidates", value: 60 },
  { name: "Clients", value: 40 },
];

const candidateDetails = [
  { id: 1, name: "Alice Smith", email: "alice@example.com" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com" },
];

const clientDetails = [
  { id: 1, name: "Acme Corp", contact: "acme@example.com" },
  { id: 2, name: "Beta LLC", contact: "beta@example.com" },
];

const COLORS = ["#0088FE", "#00C49F"];

export default function DashboardPage() {
  const [drill, setDrill] = useState<string | null>(null);

  const handlePieClick = (_: any, idx: number) => setDrill(data[idx].name);
  const renderLabel = ({ name, percent }: PieLabelRenderProps) => `${name}: ${(percent ? percent * 100 : 0).toFixed(0)}%`;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2">
          {drill === null && <p>Click a section of the chart to drill down.</p>}
          {drill === "Candidates" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Candidates</h2>
              <ul>
                {candidateDetails.map((c) => (
                  <li key={c.id} className="mb-2 p-2 border rounded">
                    <span className="font-medium">{c.name}</span> - {c.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {drill === "Clients" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Clients</h2>
              <ul>
                {clientDetails.map((c) => (
                  <li key={c.id} className="mb-2 p-2 border rounded">
                    <span className="font-medium">{c.name}</span> - {c.contact}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 