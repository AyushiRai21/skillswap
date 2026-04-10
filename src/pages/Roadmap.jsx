import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageFade from '../components/PageFade';

export default function Roadmap() {
    const navigate = useNavigate();
    const [skill, setSkill] = useState('');
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const generateRoadmap = () => {
        if (!skill.trim()) return;
        setLoading(true);
        // Simulate AI call
        setTimeout(() => {
            const mockRoadmap = {
                title: skill,
                steps: [
                    { id: 1, title: 'Fundamental Logic', desc: `Master the core principles and history of ${skill}. Build your mental framework.`, duration: 'Phase 1' },
                    { id: 2, title: 'Practical Patterns', desc: `Implementing the standard workflows and industry-recognized techniques.`, duration: 'Phase 2' },
                    { id: 3, title: 'Project Incubation', desc: `Design and execute three "Alpha" level projects to solidify your intuition.`, duration: 'Phase 3' },
                    { id: 4, title: 'Black Belt Mastery', desc: `Advanced optimizations, edge-case handling, and peer-to-peer mentoring.`, duration: 'Mastery' }
                ]
            };
            setRoadmap(mockRoadmap);
            setLoading(false);
        }, 1500);
    };

    return (
        <PageFade className="min-h-screen mesh-gradient-premium py-24 px-4 overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full animate-float-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-200/30 blur-[120px] rounded-full animate-float-slow" style={{ animationDelay: '2s' }} />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header / Nav */}
                <div className="flex items-center justify-between mb-12">
                     <Link to="/dashboard" className="px-6 py-3 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        Exit to Home
                     </Link>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic hidden sm:block">AI Roadmapping Neural Engine v2.0</div>
                </div>

                <div className="glass rounded-[50px] p-12 shadow-2xl border-white/60 text-center mb-10">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">
                        AI <span className="text-teal-600">Neural</span> Path
                    </h1>
                    <p className="text-slate-500 font-bold mb-12 max-w-lg mx-auto leading-relaxed">Input your target expertise and let the AI architect a mathematically optimized learning sequence for you.</p>

                    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 p-2 bg-white/40 rounded-[35px] border-2 border-white shadow-2xl group focus-within:border-teal-400 transition-all">
                        <input 
                            value={skill} 
                            onChange={e => setSkill(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && generateRoadmap()}
                            className="flex-1 bg-transparent px-8 py-5 outline-none font-black text-xl placeholder:text-slate-300 italic"
                            placeholder="What do you want to master?" 
                        />
                        <button 
                            onClick={generateRoadmap}
                            disabled={loading}
                            className="px-10 py-5 bg-slate-900 text-white rounded-[28px] font-black text-lg hover:bg-teal-600 transition-all shadow-xl glow-teal disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-tighter"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    Synthesizing...
                                </>
                            ) : 'Generate Path'}
                        </button>
                    </div>
                </div>

                {roadmap && !loading ? (
                    <div className="space-y-8 mt-20 relative before:hidden sm:before:block before:content-[''] before:absolute before:left-[111px] before:top-20 before:bottom-20 before:w-1 before:bg-white/40 before:rounded-full">
                        {roadmap.steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-12 group">
                                <div className="hidden sm:flex flex-shrink-0 items-center justify-center">
                                    <div className="w-28 h-28 rounded-full bg-slate-900 text-white border-8 border-white shadow-2xl flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:bg-teal-500 group-hover:border-teal-50 cursor-default">
                                        <div className="text-[10px] font-black opacity-40 uppercase">Phase</div>
                                        <div className="text-4xl font-black italic">{step.id}</div>
                                    </div>
                                </div>
                                <div className="flex-1 glass rounded-[40px] p-10 border-white/60 shadow-xl group-hover:translate-x-2 transition-transform duration-500 relative">
                                    <div className="sm:hidden mb-4 inline-block px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Phase {step.id}</div>
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">{step.title}</h3>
                                        <span className="px-6 py-2 bg-teal-50 text-teal-600 font-black text-[10px] rounded-full border border-teal-100 uppercase tracking-[0.2em]">{step.duration}</span>
                                    </div>
                                    <p className="text-slate-500 font-bold leading-relaxed text-lg italic">"{step.desc}"</p>
                                    
                                    <div className="mt-8 flex gap-4">
                                         <Link to="/dashboard" className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-teal-600 transition-colors">Find Mentors for this Step</Link>
                                         <button className="px-6 py-3 border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:border-teal-500 hover:text-teal-600 transition-colors">Mark Complete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !loading && (
                    <div className="text-center py-40 opacity-10 flex flex-col items-center">
                        <div className="flex gap-8 text-7xl mb-8">
                            <span>🧠</span><span>⚡</span><span>📊</span>
                        </div>
                        <p className="text-2xl font-black uppercase tracking-[1em] italic">System Standby</p>
                    </div>
                )}

                {/* Footer Buttons for Explore */}
                <div className="mt-24 text-center pb-24">
                    <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] mb-8">Ready to swap skills with real humans?</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/dashboard" className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-900 rounded-[30px] font-black text-lg hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-tighter">
                            Explore Skill Swappers
                        </Link>
                        <Link to="/profile" className="px-10 py-5 bg-teal-600 text-white rounded-[30px] font-black text-lg hover:bg-teal-700 transition-all shadow-xl glow-teal active:scale-95 uppercase tracking-tighter">
                            View My Mastery
                        </Link>
                    </div>
                </div>
            </div>
        </PageFade>
    );
}
