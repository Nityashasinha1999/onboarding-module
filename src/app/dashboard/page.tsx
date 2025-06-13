"use client";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Header from '@/components/Header';

interface AnalyticsData {
  totalCandidates: number;
  locationBreakdown: Array<{ name: string; value: number }>;
  roleBreakdown: Array<{ name: string; value: number }>;
  clientBreakdown: Array<{ name: string; value: number }>;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  location: {
    lat: number;
    lng: number;
  };
  client: string;
  status: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCandidates: 0,
    locationBreakdown: [],
    roleBreakdown: [],
    clientBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      try {
        const candidatesData = localStorage.getItem("candidates");
        if (!candidatesData) {
          setLoading(false);
          return;
        }

        const candidates: Candidate[] = JSON.parse(candidatesData);

        // Calculate analytics
        const locationMap = new Map<string, number>();
        const roleMap = new Map<string, number>();
        const clientMap = new Map<string, number>();

        candidates.forEach((candidate) => {
          // Handle location
          const locationKey = `${candidate.location.lat},${candidate.location.lng}`;
          locationMap.set(
            locationKey,
            (locationMap.get(locationKey) || 0) + 1
          );

          // Handle role
          roleMap.set(candidate.role, (roleMap.get(candidate.role) || 0) + 1);

          // Handle client
          clientMap.set(
            candidate.client,
            (clientMap.get(candidate.client) || 0) + 1
          );
        });

        setAnalytics({
          totalCandidates: candidates.length,
          locationBreakdown: Array.from(locationMap.entries()).map(
            ([name, value]) => ({ name, value })
          ),
          roleBreakdown: Array.from(roleMap.entries()).map(([name, value]) => ({
            name,
            value,
          })),
          clientBreakdown: Array.from(clientMap.entries()).map(
            ([name, value]) => ({ name, value })
          ),
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-400">Total Candidates</h3>
              <p className="text-3xl font-bold mt-2">{analytics.totalCandidates}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location Breakdown */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Location Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.locationBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {analytics.locationBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
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
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.roleBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Client Breakdown */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Client Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.clientBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {analytics.clientBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 