"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

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

// Dynamically import the Google Maps component with no SSR
const MapComponent = dynamic(
  () => import('@/components/MapComponent'),
  { ssr: false }
);

export default function CandidateProfile() {
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India center

  useEffect(() => {
    const candidateId = localStorage.getItem("candidateId");
    if (!candidateId) {
      router.push("/candidates/login");
      return;
    }

    try {
      const candidates = JSON.parse(localStorage.getItem("candidates") || "[]");
      const currentCandidate = candidates.find((c: Candidate) => c.id === candidateId);
      
      if (currentCandidate) {
        setCandidate(currentCandidate);
        // Set map center to candidate's location if available
        if (currentCandidate.location.lat !== 0 && currentCandidate.location.lng !== 0) {
          setMapCenter(currentCandidate.location);
        }
      } else {
        // If candidate not found in the list but ID exists, redirect to login
        router.push("/candidates/login");
      }
    } catch (error) {
      console.error("Error loading candidate data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-900 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Candidate Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">Name</h2>
                <p className="text-white text-lg">{candidate.name}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">Email</h2>
                <p className="text-white text-lg">{candidate.email}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">Role</h2>
                <p className="text-white text-lg">{candidate.role}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">Location</h2>
                <div className="h-[300px] rounded-lg overflow-hidden mb-4">
                  <MapComponent
                    center={mapCenter}
                    markerPosition={candidate.location}
                  />
                </div>
                <p className="text-white text-sm">
                  Latitude: {candidate.location.lat}
                  <br />
                  Longitude: {candidate.location.lng}
                </p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">Client</h2>
                <p className="text-white text-lg">{candidate.client}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">Status</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  candidate.status === "Active" 
                    ? "bg-green-900 text-green-200"
                    : "bg-yellow-900 text-yellow-200"
                }`}>
                  {candidate.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 