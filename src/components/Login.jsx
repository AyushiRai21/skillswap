import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageFade from './PageFade';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.includes('@') || password.length < 6) {
      setError('Please enter a valid email and password (min 6 chars).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
      });
      const body = await res.json();
      if (!res.ok) { setError(body.message || 'Login failed'); setLoading(false); return; }
      localStorage.setItem('token', body.token);
      localStorage.setItem('user', JSON.stringify(body.user));
      localStorage.setItem('justLoggedIn', 'true');
      navigate('/dashboard');
    } catch (err) {
      console.error(err); setError('Network error');
    } finally { setLoading(false); }
  }

  return (
    <PageFade className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-xl overflow-hidden">

        {/* Left visual */}
        <div className="hidden md:block relative bg-gradient-to-br from-teal-400 via-emerald-400 to-indigo-500">
          <div className="absolute inset-0 bg-[url('/assets/login-left.jpg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
          <div className="relative h-full p-12 flex flex-col justify-center text-white">
            <h3 className="text-4xl font-extrabold mb-4 headline-reveal">Welcome back</h3>
            <p className="max-w-xs">Sign in to continue swapping skills, finding tutors, and managing your profile.</p>
            <div className="flex gap-3 mt-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full"></div>
              <div className="w-12 h-12 bg-pink-100 rounded-full"></div>
              <div className="w-12 h-12 bg-purple-100 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="bg-white p-8 md:p-12 pulse-border">
          <h2 className="text-3xl font-bold mb-4 headline-reveal">Sign In</h2>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-float" style={{ animationDelay: '40ms' }}>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2 input-glow"
              />
            </div>

            <div className="animate-float" style={{ animationDelay: '80ms' }}>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2 input-glow"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full shadow-md disabled:opacity-60 btn-glow"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">Or continue with</p>
            <div className="mt-3 flex gap-3 justify-center">
              <button className="px-4 py-2 bg-gray-100 rounded-md">Google</button>
              <button className="px-4 py-2 bg-gray-100 rounded-md">GitHub</button>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button className="text-teal-600 font-medium" onClick={() => navigate('/signup')}>
              Create one
            </button>
          </p>
        </div>
      </div>
    </PageFade>
  );
}
