'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

export default function CandidateLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOTP = () => {
    console.log("Button clicked");
    console.log("Email value:", email);
    setError('');
    
    // Validate email
    if (!validateEmail(email)) {
      console.log("Email validation failed");
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Generate and store OTP
      const generatedOTP = generateOTP();
      const otpData = {
        code: generatedOTP,
        timestamp: Date.now(),
        email: email
      };
      localStorage.setItem('candidateOTP', JSON.stringify(otpData));
      
      // For development, show OTP in console
      console.log('Generated OTP:', generatedOTP);
      
      setStep('otp');
    } catch (err: any) {
      console.log("Error in handleSendOTP:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    setError('');
    setLoading(true);

    try {
      // Get stored OTP
      const storedOTPData = JSON.parse(localStorage.getItem('candidateOTP') || '{}');
      
      if (!storedOTPData.code || !storedOTPData.timestamp) {
        throw new Error('No OTP found. Please request a new OTP.');
      }

      // Check if OTP is expired (5 minutes)
      if (Date.now() - storedOTPData.timestamp > 5 * 60 * 1000) {
        throw new Error('OTP has expired. Please request a new OTP.');
      }

      // Verify OTP
      if (storedOTPData.code !== otp) {
        throw new Error('Invalid OTP');
      }

      // Get candidate data
      const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
      const candidate = candidates.find((c: any) => c.email.toLowerCase() === email.toLowerCase());

      if (!candidate) {
        throw new Error('Candidate not found');
      }

      // Clear OTP
      localStorage.removeItem('candidateOTP');

      // Store logged in user info
      localStorage.setItem('loggedInCandidate', JSON.stringify(candidate));
      router.push('/candidates/profile');
    } catch (err: any) {
      setError(err.message);
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
          
          {step === 'email' ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="email-input" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email-input"
                  name="email"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    console.log("Email changed:", e.target.value);
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your email address"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col space-y-4">
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
                
                <p className="text-center text-sm text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/candidates/register" className="text-blue-400 hover:text-blue-300">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="otp-input" className="block text-sm font-medium mb-2">
                  Enter OTP
                </label>
                <input
                  id="otp-input"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter 6-digit OTP"
                />
                <p className="mt-2 text-sm text-gray-400">
                  We've sent a 6-digit OTP to {email}
                </p>
              </div>

              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col space-y-4">
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep('email')}
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