import React, { useEffect, useState } from 'react';
import Reveal from './Reveal';

export default function Stats() {
  const [learners, setLearners] = useState(0);
  useEffect(() => {
    let target = 100000;
    let current = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(t); }
      setLearners(current);
    }, 25);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold">Trusted by learners and teachers worldwide</h2>
          <p className="mt-4 text-gray-600">Join a global community of passionate individuals sharing knowledge and growing together</p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 items-center max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-lg mb-3">👥</div>
              <div className="text-2xl font-extrabold">{Math.round(learners / 1000)}K+</div>
              <div className="text-sm text-gray-500">Active Learners</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-50 rounded-lg mb-3">🌍</div>
              <div className="text-2xl font-extrabold">150+</div>
              <div className="text-sm text-gray-500">Countries</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-50 rounded-lg mb-3">🏅</div>
              <div className="text-2xl font-extrabold">50K+</div>
              <div className="text-sm text-gray-500">Expert Teachers</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-50 rounded-lg mb-3">📈</div>
              <div className="text-2xl font-extrabold">1M+</div>
              <div className="text-sm text-gray-500">Skills Exchanged</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
