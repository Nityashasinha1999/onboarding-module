'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState("");

  useEffect(() => {
    // Check if user is logged in by looking for candidateId in localStorage
    const candidateId = localStorage.getItem('candidateId');
    setIsLoggedIn(!!candidateId);
    if (candidateId) {
      const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
      const currentCandidate = candidates.find((c: any) => c.id === candidateId);
      setCandidateEmail(currentCandidate?.email || '');
    }
  }, [pathname]); // Re-check on pathname change

  const handleLogout = () => {
    localStorage.removeItem('candidateId');
    setIsLoggedIn(false);
    setCandidateEmail('');
    router.push('/');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              ESOL
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`${
                    isActive('/')
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Home
                </Link>
                {isLoggedIn && (
                  <Link
                    href="/candidates/profile"
                    className={`${
                      isActive('/candidates/profile')
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    } px-3 py-2 rounded-md text-sm font-medium`}
                  >
                    Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">{candidateEmail}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/candidates/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/candidates/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 