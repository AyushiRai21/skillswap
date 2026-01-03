import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageFade from './PageFade';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('prefillEmail') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agree) return alert('Please accept the Terms of Use');
    if (password.length < 6) return alert('Password must be at least 6 characters');
    if (password !== confirm) return alert('Passwords do not match');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password }),
      });
      const body = await res.json();
      if (!res.ok) return alert(body.message || 'Registration failed');
      localStorage.setItem('token', body.token);
      localStorage.setItem('user', JSON.stringify(body.user));
      localStorage.setItem('justLoggedIn', 'true');
      localStorage.removeItem('prefillEmail');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally { setLoading(false); }
  }

  return (
    <PageFade className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-xl overflow-hidden">

        {/* Left: visual with gradient overlay */}
        <div className="hidden md:block relative bg-gradient-to-br from-pink-500 via-violet-500 to-indigo-600">
          <div className="absolute inset-0 bg-[url('/assets/signup-left.jpg')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 to-pink-400/40" />
          <div className="relative h-full p-12 flex flex-col justify-center text-white">
            <h3 className="text-4xl font-extrabold mb-4">Sign Up</h3>
            <p className="max-w-xs">Join SkillSwap to teach or learn practical skills — connect, schedule, and exchange knowledge.</p>
          </div>
        </div>

        {/* Right: form */}
        <div className="bg-white p-8 md:p-12 pulse-border">
          <h2 className="text-3xl font-bold mb-6 headline-reveal" style={{ animationDelay: '0s' }}>Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-float" style={{ animationDelay: '0.05s' }}>
              <label className="block text-sm text-gray-600">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-md transition-transform duration-150 focus:scale-105 focus:shadow-md input-glow" placeholder="Name..." />
            </div>

            <div className="animate-float" style={{ animationDelay: '0.09s' }}>
              <label className="block text-sm text-gray-600">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-md transition-transform duration-150 focus:scale-105 focus:shadow-md input-glow" placeholder="Email address..." />
            </div>

            <div className="animate-float" style={{ animationDelay: '0.13s' }}>
              <label className="block text-sm text-gray-600">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md transition-transform duration-150 focus:scale-105 focus:shadow-md input-glow" placeholder="Username..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="animate-float" style={{ animationDelay: '0.17s' }}>
                <label className="block text-sm text-gray-600">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-md transition-transform duration-150 focus:scale-105 focus:shadow-md input-glow" placeholder="********" />
              </div>
              <div className="animate-float" style={{ animationDelay: '0.21s' }}>
                <label className="block text-sm text-gray-600">Repeat Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-md transition-transform duration-150 focus:scale-105 focus:shadow-md input-glow" placeholder="********" />
              </div>
            </div>

            <div className="flex items-center space-x-2 animate-float" style={{ animationDelay: '0.25s' }}>
              <input id="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="h-4 w-4 text-pink-600 border-gray-300 rounded" />
              <label htmlFor="agree" className="text-sm text-gray-600">I agree to the Terms of Use</label>
            </div>

            <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-full shadow-md disabled:opacity-60 btn-glow">
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">Already have an account? <button onClick={() => navigate('/login')} className="text-pink-600 font-medium">Sign in →</button></p>
        </div>
      </div>
    </PageFade>
  );
}
