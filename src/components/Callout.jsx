import React from 'react';
import Reveal from './Reveal';

export default function Callout() {
  return (
    <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
      <Reveal>
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-emerald-600 text-white rounded-2xl p-10 lg:p-16 shadow-lg">
            <h2 className="text-3xl lg:text-4xl font-bold text-center">Perfect for everyone</h2>
            <p className="mt-4 text-center max-w-3xl mx-auto">Whether you're a student looking to expand your knowledge, a professional seeking new skills, or a lifelong learner passionate about growth - SkillSwap is your platform.</p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button className="px-5 py-2 bg-emerald-500/90 hover:bg-emerald-500 rounded-full shadow-md">🎓 Students</button>
              <button className="px-5 py-2 bg-emerald-500/80 hover:bg-emerald-500 rounded-full shadow-md">💼 Professionals</button>
              <button className="px-5 py-2 bg-emerald-500/70 hover:bg-emerald-500 rounded-full shadow-md">📚 Lifelong Learners</button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
