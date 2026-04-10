import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import PageFade from './PageFade';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loginMode, setLoginMode] = useState('password'); // 'password', 'otp', or 'phone'
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState(''); // shown on screen when SMTP not configured
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSendOtp() {
    const isPhone = loginMode === 'phone';
    const endpoint = isPhone ? '/auth/send-phone-otp' : '/auth/send-otp';
    const body = isPhone ? { phone } : { email };
    
    if (!isPhone && !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (isPhone && phone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to send OTP');
      } else {
        setOtpSent(true);
        setError('');
        if (data.devOtp) setDevOtp(data.devOtp); // dev mode
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setError('');
    
    if ((loginMode === 'otp' || loginMode === 'phone') && !otpSent) {
      handleSendOtp();
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let body = {};
      
      if (loginMode === 'password') {
        endpoint = '/auth/login';
        body = { email, password };
      } else if (loginMode === 'otp') {
        endpoint = '/auth/verify-otp';
        body = { email, otp };
      } else if (loginMode === 'phone') {
        endpoint = '/auth/verify-phone-otp';
        body = { phone, otp };
      }
      
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) { 
        setError(data.message || 'Login failed'); 
        setLoading(false); 
        return; 
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('justLoggedIn', 'true');
      navigate('/dashboard');
    } catch (err) {
      console.error(err); 
      setError('Network error');
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <PageFade className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden bg-white">

        {/* Left visual */}
        <div className="hidden md:flex relative bg-gradient-to-br from-teal-500 via-emerald-500 to-indigo-600 flex-col justify-center p-12 text-white">
          <div className="relative z-10">
            <h3 className="text-5xl font-extrabold mb-6 leading-tight">Welcome back to SkillSwap</h3>
            <p className="text-xl opacity-90 max-w-sm mb-8">Sign in to continue swapping skills, finding tutors, and growing your profile.</p>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">🤝</div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">🎓</div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">✨</div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-900/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right: form */}
        <div className="p-8 md:p-14">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-bold mb-2 text-gray-800">Sign In</h2>
            <p className="text-gray-500 mb-8">Choose your preferred login method</p>

            <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
              <button 
                onClick={() => { setLoginMode('password'); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${loginMode === 'password' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'}`}
              >
                Password
              </button>
              <button 
                onClick={() => { setLoginMode('otp'); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${loginMode === 'otp' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'}`}
              >
                Email OTP
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}

            {devOtp && otpSent && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 text-sm animate-pulse">
                <strong>[DEV MODE] OTP:</strong> {devOtp} (Use this to test login)
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {loginMode !== 'phone' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    disabled={otpSent}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full rounded-xl border-gray-200 shadow-sm px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-gray-50"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    disabled={otpSent}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 00000 00000"
                    className="block w-full rounded-xl border-gray-200 shadow-sm px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-gray-50"
                  />
                </div>
              )}

              {loginMode === 'password' ? (
                <div className="animate-fade-in">
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    <button type="button" className="text-xs text-teal-600 hover:underline">Forgot password?</button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border-gray-200 shadow-sm px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-gray-50"
                  />
                </div>
              ) : (
                <div className="animate-fade-in">
                  {otpSent ? (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {loginMode === 'phone' ? '4-Digit Mobile OTP' : '6-Digit Email OTP'}
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={loginMode === 'phone' ? 4 : 6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder={loginMode === 'phone' ? "0000" : "000000"}
                        className="block w-full rounded-xl border-gray-200 shadow-sm px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-gray-50 text-center text-2xl tracking-widest"
                      />
                      <button 
                        type="button" 
                        onClick={() => setOtpSent(false)} 
                        className="mt-2 text-xs text-gray-500 hover:text-teal-600 transition-colors"
                      >
                        Change {loginMode === 'phone' ? 'phone number' : 'email address'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 bg-teal-50 p-3 rounded-lg border border-teal-100">
                      We'll send a {loginMode === 'phone' ? '4-digit' : '6-digit'} one-time password to your {loginMode === 'phone' ? 'mobile' : 'email'} to verify your identity.
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-200 font-bold text-lg transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </span>
                ) : (
                  (loginMode === 'otp' || loginMode === 'phone') && !otpSent ? 'Send OTP' : 'Sign In'
                )}
              </button>
            </form>

            <div className="mt-10 border-t pt-8">
              <p className="text-center text-sm text-gray-400 mb-6">Or continue with</p>
              <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                  <GoogleLogin
                    theme="outline"
                    shape="circle"
                    width="100%"
                    onSuccess={async (credentialResponse) => {
                      setLoading(true);
                      try {
                        const decoded = jwtDecode(credentialResponse.credential);
                        const res = await fetch('http://localhost:5000/auth/google-login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: decoded.email,
                            name: decoded.name,
                            profileImage: decoded.picture,
                            googleId: decoded.sub
                          })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.message);
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        navigate('/dashboard');
                      } catch (err) {
                        setError('Google Login failed');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    onError={() => {
                      setError('Google Login failed');
                    }}
                  />
                </div>
                <button 
                  onClick={() => { setLoginMode('phone'); setError(''); setOtpSent(false); }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-all font-medium text-gray-700"
                >
                  <span className="text-xl">📱</span>
                  Mobile OTP
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              New to SkillSwap?{' '}
              <button className="text-teal-600 font-bold hover:underline" onClick={() => navigate('/signup')}>
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </PageFade>
  );
}
