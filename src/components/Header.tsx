'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loggedInCandidate = localStorage.getItem('loggedInCandidate');
    if (loggedInCandidate) {
      const candidate = JSON.parse(loggedInCandidate);
      setIsLoggedIn(true);
      setUserName(candidate.name);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInCandidate');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/candidates/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              ESOL
            </Link>
            <nav className="ml-10 flex items-center space-x-4">
              <Link
                href="/candidates"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/candidates') && !pathname.includes('/login') && !pathname.includes('/register')
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Candidates
              </Link>
              <Link
                href="/client-login"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/client-login'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Client Login
              </Link>
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/dashboard'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {userName}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/candidates/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/candidates/login'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/candidates/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/candidates/register'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 