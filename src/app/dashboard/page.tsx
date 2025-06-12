"use client";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, PieLabelRenderProps } from "recharts";
import Header from '@/components/Header';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

interface AnalyticsData {
  totalCandidates: number;
  onboardedCandidates: number;
  locationBreakdown: Array<{
    location: string;
    count: number;
  }>;
  roleBreakdown: Array<{
    role: string;
    count: number;
  }>;
  clientBreakdown: Array<{
    client: string;
    count: number;
  }>;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  location: string;
  role: string;
  client: string;
  onboarded: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [drill, setDrill] = useState<string | null>(null);

  const handlePieClick = (_: any, idx: number) => setDrill(data[idx].name);
  const renderLabel = ({ name, percent }: PieLabelRenderProps) => `${name}: ${(percent ? percent * 100 : 0).toFixed(0)}%`;

  useEffect(() => {
    // In a real app, this would be an API call
    const candidates = JSON.parse(localStorage.getItem('candidates') || '[]') as Candidate[];
    
    // Calculate analytics
    const analytics: AnalyticsData = {
      totalCandidates: candidates.length,
      onboardedCandidates: candidates.filter(c => c.onboarded).length,
      locationBreakdown: Object.entries(
        candidates.reduce<Record<string, number>>((acc, curr) => {
          acc[curr.location] = (acc[curr.location] || 0) + 1;
          return acc;
        }, {})
      ).map(([location, count]) => ({ location, count })),
      roleBreakdown: Object.entries(
        candidates.reduce<Record<string, number>>((acc, curr) => {
          acc[curr.role] = (acc[curr.role] || 0) + 1;
          return acc;
        }, {})
      ).map(([role, count]) => ({ role, count })),
      clientBreakdown: Object.entries(
        candidates.reduce<Record<string, number>>((acc, curr) => {
          acc[curr.client] = (acc[curr.client] || 0) + 1;
          return acc;
        }, {})
      ).map(([client, count]) => ({ client, count })),
    };

    setData(analytics);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  const candidates = JSON.parse(localStorage.getItem('candidates') || '[]') as Candidate[];
  const filteredCandidates = candidates.filter((c: Candidate) => {
    if (selectedClient && c.client !== selectedClient) return false;
    if (selectedLocation && c.location !== selectedLocation) return false;
    if (selectedRole && c.role !== selectedRole) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-400">Total Candidates</h3>
              <p className="text-3xl font-bold mt-2">{data.totalCandidates}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-400">Onboarded Candidates</h3>
              <p className="text-3xl font-bold mt-2">{data.onboardedCandidates}</p>
              <p className="text-sm text-gray-400 mt-1">
                {((data.onboardedCandidates / data.totalCandidates) * 100).toFixed(1)}% onboarded
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Location Breakdown */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Location Breakdown</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.locationBreakdown}
                      dataKey="count"
                      nameKey="location"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data.locationBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Role Breakdown */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Role Breakdown</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.roleBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Client Breakdown */}
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium mb-4">Client Breakdown</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.clientBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="client" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filtered Candidates List */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Filtered Candidates</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.client}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 