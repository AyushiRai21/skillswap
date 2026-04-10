import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageFade from '../components/PageFade';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
    }
  }, [token, navigate]);

  return (
    <PageFade className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="glass max-w-md w-full p-10 rounded-[40px] text-center shadow-2xl border-white">
        {status === 'verifying' && (
          <div className="animate-pulse">
            <div className="text-4xl mb-4">🔮</div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Verifying Neural Link...</h2>
          </div>
        )}
        {status === 'success' && (
          <div className="animate-fade-in-up">
            <div className="text-4xl mb-4 text-emerald-500">✨</div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-emerald-600">Verification Successful!</h2>
            <p className="text-slate-500 font-bold mt-4 italic">Your account is now fully active. Redirecting to login...</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-red-500">Verification Failed</h2>
            <p className="text-slate-500 font-bold mt-4 italic">The link is invalid or has expired. Please try registering again or contact support.</p>
            <button onClick={() => navigate('/login')} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-600 transition-all">Back to Login</button>
          </div>
        )}
      </div>
    </PageFade>
  );
}
