import React from 'react';
import Reveal from './Reveal';

export default function Features() {
  const items = [
    { title: 'Personalized Recommendations', desc: 'Our AI-powered system suggests skills and matches based on your interests, experience level, and learning goals.', emoji: '✨' },
    { title: 'Smart Skill-Matching', desc: 'Find the perfect skill exchange partner with our intelligent matching algorithm.', emoji: '🎯' },
    { title: 'Verified Profiles', desc: 'Every member goes through verification to ensure a trusted community.', emoji: '🛡️' },
  ];
  return (
    <section id="how" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold">Features that make skill-swapping easy</h2>
          <p className="mt-3 text-gray-600">Powerful tools designed to help you find, connect, and learn from the right people</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((it) => (
              <div key={it.title} className="p-6 rounded-2xl bg-white shadow hover:shadow-lg transition">
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-lg bg-emerald-50 mb-4 text-xl">{it.emoji}</div>
                <h3 className="text-xl font-semibold">{it.title}</h3>
                <p className="mt-2 text-gray-600">{it.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
