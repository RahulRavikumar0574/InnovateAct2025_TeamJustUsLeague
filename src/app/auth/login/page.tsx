'use client';
import type { NextPage } from 'next';
import Link from 'next/link';

const LoginPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">Login</h2>
        <form className="space-y-6" onSubmit={async (e) => {
          e.preventDefault();
          const email = (e.target as any).email.value;
          const password = (e.target as any).password.value;
          if (email === 'admin@example.com' && password === 'admin123') {
            localStorage.setItem('role', 'admin');
            window.location.href = '/admin';
          } else if (email === 'supervisor@example.com' && password === 'supervisor123') {
            localStorage.setItem('role', 'supervisor');
            window.location.href = '/supervisor';
          } else {
            alert('Invalid credentials. Try admin@example.com/admin123 or supervisor@example.com/supervisor123');
          }
        }}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-cyan-400 hover:text-cyan-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
