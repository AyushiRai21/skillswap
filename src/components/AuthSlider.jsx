import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthSlider({ defaultMode = 'signin' }) {
  const [mode, setMode] = useState(defaultMode); // 'signin' or 'signup'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (res.ok) {
        const body = await res.json();
        localStorage.setItem('token', body.token);
        localStorage.setItem('user', JSON.stringify(body.user));
        navigate('/dashboard');
      } else {
        alert('Sign in failed');
      }
    } catch (err) {
      console.error(err); alert('Network error');
    } finally { setLoading(false); }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      if (res.ok) {
        const body = await res.json();
        localStorage.setItem('token', body.token);
        localStorage.setItem('user', JSON.stringify(body.user));
        navigate('/dashboard');
      } else {
        alert('Sign up failed');
      }
    } catch (err) {
      console.error(err); alert('Network error');
    } finally { setLoading(false); }
  }

  // show form panel when in 'signin' or 'signup' (shift left by 50%),
  // show visual panel when mode is default visual state (no shift)
  const translate = mode === 'signin' || mode === 'signup' ? '-50%' : '0%';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-5xl h-[560px] rounded-xl shadow-xl overflow-hidden relative bg-white flex">

        {/* Slider inner - width 200% */}
        <div className="relative w-full h-full overflow-hidden">
          <div className="flex w-[200%] h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(${translate})` }}>

            {/* Left panel (visual + CTA) */}
            <div className="w-1/2 h-full flex items-center justify-center bg-gradient-to-br from-teal-400 via-emerald-400 to-indigo-500 text-white p-10">
              <div className="max-w-xs text-center">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full inline-flex items-center justify-center mb-4">SS</div>
                  <h2 className="text-4xl font-extrabold">Welcome Back!</h2>
                </div>
                <p className="text-sm mb-6">To keep connected with us please login with your personal info</p>
                <button onClick={() => setMode('signin')} className="mt-4 px-8 py-3 border border-white/60 rounded-full text-white hover:brightness-95">SIGN IN</button>
              </div>
            </div>

            {/* Right panel (forms) */}
            <div className="w-1/2 h-full bg-white p-10 flex items-center justify-center">
              <div className="w-full max-w-md">
                {mode === 'signup' ? (
                  <div>
                    <h3 className="text-3xl font-bold text-teal-600 mb-4">Create Account</h3>
                    <div className="flex gap-3 mb-4">
                      <button className="w-10 h-10 rounded-full bg-gray-100" aria-label="facebook">f</button>
                      <button className="w-10 h-10 rounded-full bg-gray-100" aria-label="google">G+</button>
                      <button className="w-10 h-10 rounded-full bg-gray-100" aria-label="linkedin">in</button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">or use your email for registration:</p>
                    <form onSubmit={handleSignUp} className="space-y-3">
                      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full px-4 py-3 border bg-gray-50 rounded" />
                      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 border bg-gray-50 rounded" />
                      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full px-4 py-3 border bg-gray-50 rounded" />
                      <div className="pt-3">
                        <button type="submit" disabled={loading} className="w-1/2 block mx-auto px-6 py-3 bg-teal-500 text-white rounded-full">{loading ? 'Signing…' : 'SIGN UP'}</button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Sign In</h3>
                    <p className="text-sm text-gray-500 mb-4">or use your email for sign in:</p>
                    <form onSubmit={handleSignIn} className="space-y-3">
                      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 border bg-gray-50 rounded" />
                      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full px-4 py-3 border bg-gray-50 rounded" />
                      <div className="pt-3 flex gap-3">
                        <button type="submit" disabled={loading} className="px-6 py-3 bg-teal-500 text-white rounded-full">{loading ? 'Signing…' : 'SIGN IN'}</button>
                        <button type="button" onClick={()=>setMode('signup')} className="px-4 py-3 border rounded-full">Create Account</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
