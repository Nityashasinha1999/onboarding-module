'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Header from '@/components/Header';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export default function CandidateProfile() {
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const loggedInCandidate = localStorage.getItem('loggedInCandidate');
    if (!loggedInCandidate) {
      router.push('/candidates/login');
      return;
    }
    setCandidate(JSON.parse(loggedInCandidate));
  }, [router]);

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Full Name</label>
                    <p className="mt-1">{candidate.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Email</label>
                    <p className="mt-1">{candidate.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Phone</label>
                    <p className="mt-1">{candidate.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Address</label>
                    <p className="mt-1">{candidate.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Member Since</label>
                    <p className="mt-1">{new Date(candidate.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="h-[300px] rounded-lg overflow-hidden">
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={candidate.location}
                    zoom={13}
                  >
                    <Marker position={candidate.location} />
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 