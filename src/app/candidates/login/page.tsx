"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

interface ErrorResponse {
  error: string;
}

export default function CandidateLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ErrorResponse).error || "Failed to send OTP");
      }

      setStep("otp");
      setMessage(`OTP has been sent to ${email}`);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setMessage(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ErrorResponse).error || "Failed to verify OTP");
      }

      // Store candidate info in localStorage
      localStorage.setItem("candidateEmail", email);
      router.push("/candidates/profile");
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setMessage(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8">Candidate Login</h1>
          
          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
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
                    setMessage("");
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
                {loading ? "Sending..." : "Send OTP"}
              </button>

              <div className="text-center">
                <Link href="/candidates/register" className="text-sm text-gray-400 hover:text-gray-300">
                  Don&apos;t have an account? Register here
                </Link>
              </div>
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
                    setMessage("");
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
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
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
      </div>
    </div>
  );
} 