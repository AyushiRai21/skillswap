import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageFade from './PageFade';

export default function Signup() {
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('prefillEmail') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSendOtp(e) {
    e.preventDefault();
    setError('');
    if (!agree) { setError('Please accept the Terms of Use'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to send OTP'); return; }
      setStep(2);
      if (data.devOtp) setDevOtp(data.devOtp);
    } catch (err) {
      setError('Network error: Could not reach the server');
    } finally { setLoading(false); }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password, otp }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Registration failed'); setLoading(false); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('justLoggedIn', 'true');
      localStorage.removeItem('prefillEmail');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Network error: Could not reach the server');
    } finally { setLoading(false); }
  }

  async function handleGoogleSignup() {
    setLoading(true);
    try {
      const mockGoogleData = {
        email: "demo.user@gmail.com",
        name: "Demo User",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        googleId: "123456789"
      };
      const res = await fetch('http://localhost:5000/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockGoogleData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Google Signup failed');
    } finally { setLoading(false); }
  }

  return (
    <PageFade className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden bg-white">

        {/* Left: visual */}
        <div className="hidden md:flex relative bg-gradient-to-br from-pink-500 via-violet-500 to-indigo-600 flex-col justify-center p-12 text-white overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl">🔄</span>
              <span className="font-bold text-xl tracking-tight">SkillSwap</span>
            </div>
            <h3 className="text-5xl font-extrabold mb-6 leading-tight">Join the community of learners</h3>
            <p className="text-lg opacity-90 max-w-sm mb-10">Teach what you know, learn what you don't. Connect with skilled people around the world.</p>
            <div className="grid grid-cols-2 gap-4 max-w-xs">
              {['🎨 Design', '💻 Coding', '🎵 Music', '📸 Photography'].map(s => (
                <div key={s} className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-medium">{s}</div>
              ))}
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-900/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right: form */}
        <div className="p-8 md:p-14 overflow-y-auto">
          <div className="max-w-md mx-auto">

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === 1 ? 'bg-violet-600 text-white' : 'bg-green-500 text-white'}`}>
                {step === 1 ? '1' : '✓'}
              </div>
              <div className={`flex-1 h-1 rounded transition-all ${step === 2 ? 'bg-violet-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === 2 ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                2
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-1 text-gray-800">
              {step === 1 ? 'Create Account' : 'Verify Email'}
            </h2>
            <p className="text-gray-500 mb-8">
              {step === 1 ? 'Fill in your details to get started' : `We sent a 6-digit code to ${email}`}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            {devOtp && step === 2 && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 text-sm animate-pulse rounded-lg">
                <strong>[DEV MODE] OTP:</strong> {devOtp} (Use this to test signup)
              </div>
            )}


            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    placeholder="Your name" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    placeholder="you@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Username <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    placeholder="@username" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm</label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      placeholder="••••••••" />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input id="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                    className="h-4 w-4 mt-0.5 text-violet-600 border-gray-300 rounded" />
                  <label htmlFor="agree" className="text-sm text-gray-600">
                    I agree to the <span className="text-violet-600 font-medium cursor-pointer hover:underline">Terms of Use</span> and <span className="text-violet-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>
                  </label>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-xl shadow-lg font-bold text-lg transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Sending OTP...
                    </span>
                  ) : 'Continue →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center py-4">
                  <div className="text-6xl mb-4">📬</div>
                  <p className="text-gray-600 text-sm">Check your inbox and enter the 6-digit code below.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">Enter OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-center text-3xl font-mono tracking-widest"
                  />
                </div>

                <button type="submit" disabled={loading || otp.length < 6}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-xl shadow-lg font-bold text-lg transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Verifying...
                    </span>
                  ) : 'Create Account ✓'}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500">Didn't receive the code?</p>
                  <button type="button" onClick={() => { setStep(1); setDevOtp(''); setOtp(''); setError(''); }}
                    className="text-sm text-violet-600 font-medium hover:underline">
                    ← Go back and resend
                  </button>
                </div>
              </form>
            )}

            {step === 1 && (
              <div className="mt-8 border-t pt-8">
                <p className="text-center text-sm text-gray-400 mb-6">Or continue with</p>
                <div className="flex gap-4">
                  <button 
                    onClick={handleGoogleSignup}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
                  >
                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="" />
                    Google
                  </button>
                  <button 
                    onClick={() => navigate('/login')} // Redirect to login for phone since phone login handles new users too
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-violet-50 hover:border-violet-200 transition-all font-medium text-gray-700"
                  >
                    <span className="text-xl">📱</span>
                    Mobile OTP
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mt-8 border-t pt-8">
                <p className="text-center text-sm text-gray-400 mb-6">Or continue with</p>
                <div className="flex gap-4">
                  <button 
                    onClick={handleGoogleSignup}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
                  >
                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="" />
                    Google
                  </button>
                  <button 
                    onClick={() => navigate('/login')} // Redirect to login for phone since phone login handles new users too
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-violet-50 hover:border-violet-200 transition-all font-medium text-gray-700"
                  >
                    <span className="text-xl">📱</span>
                    Mobile OTP
                  </button>
                </div>
              </div>
            )}

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-violet-600 font-bold hover:underline">Sign in</button>
            </p>
          </div>
        </div>
      </div>
    </PageFade>
  );
}
