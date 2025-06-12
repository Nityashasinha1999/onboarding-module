"use client";
import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

type Candidate = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "New" | "In Review" | "Shortlisted" | "Rejected";
  skills: string[];
  experience: string;
  education: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
};

const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 234-567-8901",
    status: "New",
    skills: ["React", "TypeScript", "Node.js"],
    experience: "5 years",
    education: "B.S. Computer Science",
    location: {
      address: "123 Tech Street, San Francisco, CA",
      lat: 37.7749,
      lng: -122.4194
    }
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 234-567-8902",
    status: "In Review",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    experience: "3 years",
    education: "M.S. Data Science",
    location: {
      address: "456 Data Lane, New York, NY",
      lat: 40.7128,
      lng: -74.0060
    }
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "+1 234-567-8903",
    status: "Shortlisted",
    skills: ["Java", "Spring Boot", "AWS"],
    experience: "7 years",
    education: "B.E. Software Engineering",
    location: {
      address: "789 Cloud Road, Seattle, WA",
      lat: 47.6062,
      lng: -122.3321
    }
  }
];

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

interface ErrorResponse {
  error: string;
}

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "loggedIn">("email");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    setLoading(true);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ErrorResponse).error || 'Failed to send OTP');
      }

      setStep("otp");
      setMessage(`OTP has been sent to ${email}`);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setMessage(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ErrorResponse).error || 'Failed to verify OTP');
      }

      setMessage("OTP verified! Login successful.");
      setStep("loggedIn");
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setMessage(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Candidate["status"]) => {
    switch (status) {
      case "New":
        return "bg-blue-500";
      case "In Review":
        return "bg-yellow-500";
      case "Shortlisted":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderCandidateDetails = (candidate: Candidate) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-white">{candidate.email}</p>
          </div>
          <div>
            <p className="text-gray-400">Phone</p>
            <p className="text-white">{candidate.phone}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Experience</h3>
        <p className="text-gray-300">{candidate.experience}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Education</h3>
        <p className="text-gray-300">{candidate.education}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
        <span className={`${getStatusColor(candidate.status)} text-white px-3 py-1 rounded-full text-sm`}>
          {candidate.status}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
        <p className="text-gray-300 mb-4">{candidate.location.address}</p>
        <div className="rounded-lg overflow-hidden">
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: candidate.location.lat, lng: candidate.location.lng }}
              zoom={12}
            >
              <Marker
                position={{ lat: candidate.location.lat, lng: candidate.location.lng }}
              />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );

  if (step === "loggedIn") {
    return (
      <main className="min-h-screen bg-black p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Candidate List</h1>
            <div className="text-gray-300">Logged in as: {email}</div>
          </div>

          <div className="grid gap-6">
            {mockCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => setSelectedCandidate(candidate)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{candidate.name}</h2>
                    <p className="text-gray-400">{candidate.email}</p>
                    <p className="text-gray-400">{candidate.phone}</p>
                    <p className="text-gray-400 mt-2">{candidate.location.address}</p>
                  </div>
                  <span className={`${getStatusColor(candidate.status)} text-white px-3 py-1 rounded-full text-sm`}>
                    {candidate.status}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedCandidate.name}</h2>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {renderCandidateDetails(selectedCandidate)}
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Client Login</h1>
        
        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage('');
                }}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {message && (
              <div className="text-red-500 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setMessage('');
                }}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter OTP"
                maxLength={6}
              />
            </div>

            {message && (
              <div className="text-red-500 text-sm">
                {message}
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <button
                onClick={() => setStep("email")}
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                Change email
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 