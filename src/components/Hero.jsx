import React from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from './Reveal';

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      <div className="hero-blob left" />
      <div className="hero-blob right" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 text-center">
        <div className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">✨ The future of peer-to-peer learning</div>
        <Reveal>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-slate-900">
            Exchange skills,
            <span className="block text-teal-600">grow together.</span>
          </h1>

          <p className="mt-6 text-gray-600 max-w-3xl mx-auto text-lg">
            SkillSwap connects people who want to learn with people who can teach. No money changes hands—just knowledge for knowledge.
          </p>

          <div className="mt-10 hero-ctas flex items-center justify-center gap-4">
            <button onClick={() => navigate('/signup')} className="primary btn-glow shadow-sm">Start Swapping Today →</button>
            <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} className="secondary">How it works</button>
          </div>
        </Reveal>
      </div>

      <div className="w-full trusted-strip text-white py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
          <div className="text-sm font-medium">Trusted by community members, teachers, and learners worldwide</div>
        </div>
      </div>
    </section>
  );
}
