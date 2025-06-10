"use client";
import React, { useState } from "react";

type Candidate = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "New" | "In Review" | "Shortlisted" | "Rejected";
  skills: string[];
  experience: string;
  education: string;
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
    education: "B.S. Computer Science"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 234-567-8902",
    status: "In Review",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    experience: "3 years",
    education: "M.S. Data Science"
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "+1 234-567-8903",
    status: "Shortlisted",
    skills: ["Java", "Spring Boot", "AWS"],
    experience: "7 years",
    education: "B.E. Software Engineering"
  }
];

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "loggedIn">("email");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleSendOtp = () => {
    const generatedOtp = "123456";
    setSentOtp(generatedOtp);
    setStep("otp");
    setMessage("OTP sent to your email (mock)");
  };

  const handleVerifyOtp = () => {
    if (otp === sentOtp) {
      setMessage("OTP verified! Login successful.");
      setStep("loggedIn");
    } else {
      setMessage("Invalid OTP. Please try again.");
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

        {/* Candidate Details Modal */}
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

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="text-white">{selectedCandidate.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Phone</p>
                      <p className="text-white">{selectedCandidate.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, index) => (
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
                  <p className="text-gray-300">{selectedCandidate.experience}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Education</h3>
                  <p className="text-gray-300">{selectedCandidate.education}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
                  <span className={`${getStatusColor(selectedCandidate.status)} text-white px-3 py-1 rounded-full text-sm`}>
                    {selectedCandidate.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-black">
      <div className="bg-gray-900 shadow rounded p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">Client Login</h1>
        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-600 bg-gray-800 text-white p-2 w-full mb-4 rounded focus:border-blue-500 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
              onClick={handleSendOtp}
              disabled={!email}
            >
              Send OTP
            </button>
          </>
        )}
        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="border border-gray-600 bg-gray-800 text-white p-2 w-full mb-4 rounded focus:border-blue-500 focus:ring-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
              onClick={handleVerifyOtp}
              disabled={!otp}
            >
              Verify OTP
            </button>
          </>
        )}
        {message && <p className="mt-4 text-center text-gray-300">{message}</p>}
      </div>
    </main>
  );
} 