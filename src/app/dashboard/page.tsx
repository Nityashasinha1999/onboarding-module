"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Header from '@/components/Header';

interface AnalyticsData {
  totalCandidates: number;
  onboardedCandidates: number;
  locationBreakdown: { name: string; value: number }[];
  roleBreakdown: { name: string; value: number }[];
  clientBreakdown: { name: string; value: number }[];
}

interface Candidate {
  id: number;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = () => {
      try {
        const candidates = JSON.parse(localStorage.getItem("candidates") || "[]") as Candidate[];

        const analytics: AnalyticsData = {
          totalCandidates: candidates.length,
          onboardedCandidates: candidates.filter((c) => c.onboarded).length,
          locationBreakdown: Object.entries(
            candidates.reduce((acc: Record<string, number>, c) => {
              acc[c.location] = (acc[c.location] || 0) + 1;
              return acc;
            }, {})
          ).map(([name, value]) => ({ name, value })),
          roleBreakdown: Object.entries(
            candidates.reduce((acc: Record<string, number>, c) => {
              acc[c.role] = (acc[c.role] || 0) + 1;
              return acc;
            }, {})
          ).map(([name, value]) => ({ name, value })),
          clientBreakdown: Object.entries(
            candidates.reduce((acc: Record<string, number>, c) => {
              acc[c.client] = (acc[c.client] || 0) + 1;
              return acc;
            }, {})
          ).map(([name, value]) => ({ name, value })),
        };

        setData(analytics);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-black p-8">
        <Header />
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-800 rounded"></div>
              <div className="h-64 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const candidates = JSON.parse(localStorage.getItem('candidates') || '[]') as Candidate[];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location Breakdown */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Location Breakdown</h3>
              <div className="h-64">
                <PieChart width={400} height={300}>
                  <Pie
                    data={data.locationBreakdown}
                    cx={200}
                    cy={150}
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.locationBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>

            {/* Role Breakdown */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Role Breakdown</h3>
              <div className="h-64">
                <BarChart width={400} height={300} data={data.roleBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </div>
            </div>

            {/* Client Breakdown */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Client Breakdown</h3>
              <div className="h-64">
                <BarChart width={400} height={300} data={data.clientBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </div>
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
                  {candidates.map((candidate) => (
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