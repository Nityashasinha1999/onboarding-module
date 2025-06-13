"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ErrorResponse {
  message: string;
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

export default function CandidateLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setMessage("OTP sent successfully!");
      setOtpSent(true);
      setResendCooldown(30); // Set 30 seconds cooldown
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      // Get candidates from localStorage
      const candidates = JSON.parse(localStorage.getItem("candidates") || "[]");
      const currentCandidate = candidates.find((c: Candidate) => c.email === email);

      if (!currentCandidate) {
        // If candidate doesn't exist, create a new one
        const candidateId = Date.now().toString();
        const newCandidate: Candidate = {
          id: candidateId,
          name: email.split("@")[0], // Use email username as name
          email: email,
          role: "Developer", // Default role
          location: {
            lat: 0,
            lng: 0,
          },
          client: "ESOL",
          status: "Active",
        };

        // Add new candidate to the list
        candidates.push(newCandidate);
        localStorage.setItem("candidates", JSON.stringify(candidates));
        localStorage.setItem("candidateId", candidateId);
      } else {
        // If candidate exists, store their ID
        localStorage.setItem("candidateId", currentCandidate.id);
      }

      setMessage("OTP verified successfully!");
      router.push("/candidates/profile");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gray-900 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Candidate Login</h1>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {otpSent && (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                  required
                />
                <div className="mt-2 text-sm text-gray-400">
                  {resendCooldown > 0 ? (
                    <span>Resend OTP in {resendCooldown} seconds</span>
                  ) : (
                    <button
                      onClick={handleSendOTP}
                      disabled={isLoading}
                      className="text-blue-500 hover:text-blue-400 disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {message && (
              <div
                className={`p-3 rounded-lg ${
                  message.includes("successfully")
                    ? "bg-green-900 text-green-200"
                    : "bg-red-900 text-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="space-y-3">
              {!otpSent ? (
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              ) : (
                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              )}
            </div>

            <div className="text-center text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/candidates/register"
                className="text-blue-500 hover:text-blue-400"
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 