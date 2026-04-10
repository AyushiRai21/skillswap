import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageFade from './PageFade';

const sampleCategories = [
  'Programming', 'Technology', 'Design', 'Music', 'Cooking',
  'Language', 'Photography', 'Marketing', 'Fitness', 'Arts',
  'Writing', 'Personal Dev'
];

export default function BrowseSkills() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [requesterName, setRequesterName] = useState(user?.name || '');
  const [requesterEmail, setRequesterEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/skills')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSkills(data);
      })
      .catch(err => console.error(err));
  }, []);

  const filtered = skills.filter((s) => {
    const matchesCategory = category === 'All' || s.category === category;
    const matchesQuery = s.title.toLowerCase().includes(query.toLowerCase()) || 
                       (s.user?.name || '').toLowerCase().includes(query.toLowerCase()) || 
                       s.desc.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <PageFade className="min-h-screen mesh-gradient-premium py-32 px-4 sm:px-8 overflow-hidden relative">
      {/* Floating Top Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
        <div className="glass px-8 py-4 rounded-[30px] border-white/60 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black italic tracking-tighter text-slate-900 flex items-center gap-2 group">
              <div className="w-8 h-8 bg-slate-900 rounded-lg group-hover:rotate-12 transition-transform shadow-lg" />
              SKILLSWAP
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Dashboard</Link>
              <Link to="/roadmap" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Roadmap AI</Link>
              <Link to="/browse" className="text-[10px] font-black uppercase tracking-widest text-teal-600 border-b-2 border-teal-500 pb-1">Explore</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="px-4 py-2 bg-slate-100/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white transition-all">Account</Link>
            <Link to="/" onClick={() => { localStorage.clear(); }} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">Logout</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16">
           <div className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4">Discovery Engine</div>
           <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">Global <span className="text-teal-600">Exchange</span> Hub</h1>
           <p className="text-slate-500 font-bold max-w-xl text-lg italic">"Connecting minds through shared expertise. Search for any skill, find your next mentor, or become one."</p>
        </header>

        {/* Search & Filters */}
        <div className="glass rounded-[40px] p-8 shadow-2xl border-white/60 mb-12 flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 w-full relative group">
                <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by skill, topic or user..." 
                    className="w-full pl-16 pr-8 py-5 bg-white/40 border-2 border-white rounded-[25px] font-black text-lg outline-none focus:border-teal-500/50 transition-all placeholder:text-slate-300 italic"
                />
            </div>
            <div className="w-full lg:w-64">
                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-8 py-5 bg-white/40 border-2 border-white rounded-[25px] font-black text-sm uppercase tracking-widest outline-none focus:border-teal-500/50 transition-all appearance-none cursor-pointer"
                >
                    <option>All Categories</option>
                    {sampleCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((s, i) => (
                <div key={s._id || i} className="glass rounded-[45px] p-10 border-white/60 shadow-xl hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 group relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full group-hover:scale-150 transition-transform duration-700" />
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest italic">{s.category}</span>
                        <div className="flex -space-x-2">
                             <div className="w-8 h-8 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center font-black text-white text-[10px] italic">{(s.user?.name || s.tutor || 'A').charAt(0)}</div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-4 uppercase italic group-hover:text-teal-600 transition-colors leading-tight">{s.title}</h3>
                    <p className="text-slate-500 font-bold text-sm mb-10 italic line-clamp-3 leading-relaxed">"{s.desc || 'No description provided.'}"</p>

                    <div className="mt-auto flex items-center justify-between relative z-10">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {s.user?.name || s.tutor || 'Unknown'}
                        </div>
                        <button 
                            onClick={() => { setSelectedSkill(s); setShowModal(true); setSuccessMsg(''); }}
                            className="p-3 bg-teal-500 text-white rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg glow-teal"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                        </button>
                    </div>
                </div>
            ))}
            {filtered.length === 0 && (
                <div className="col-span-full py-40 text-center opacity-20">
                    <div className="text-7xl mb-8">🔍</div>
                    <p className="text-3xl font-black uppercase tracking-[1em] italic">No Matches Found</p>
                </div>
            )}
        </div>
      </div>

      {/* Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="glass w-full max-w-xl rounded-[50px] p-12 border-white shadow-2xl relative z-10 animate-fade-in-up">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 uppercase italic">Initiate <span className="text-teal-600">Swap</span></h2>
            <p className="text-slate-500 font-bold mb-8 text-sm italic">Requesting knowledge for: {selectedSkill?.title}</p>
            
            {successMsg ? (
                <div className="bg-emerald-500 text-white p-6 rounded-[30px] font-black text-center shadow-lg animate-bounce mb-4">
                    Neural Message Sent! ⚡
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input value={requesterName} onChange={e => setRequesterName(e.target.value)} placeholder="Your Name" className="px-6 py-4 bg-white/40 border-2 border-white rounded-2xl font-black text-sm outline-none focus:border-teal-500 transition-all" />
                        <input value={requesterEmail} onChange={e => setRequesterEmail(e.target.value)} placeholder="Contact Email" className="px-6 py-4 bg-white/40 border-2 border-white rounded-2xl font-black text-sm outline-none focus:border-teal-500 transition-all" />
                    </div>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Neural Message (Your goals, availability, etc.)" className="w-full px-6 py-4 bg-white/40 border-2 border-white rounded-3xl font-black text-sm outline-none focus:border-teal-500 transition-all h-32 resize-none" />
                    
                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setShowModal(false)} className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                        <button 
                            disabled={loading || !requesterEmail}
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    const token = localStorage.getItem('token');
                                    const res = await fetch('http://localhost:5000/api/requests', {
                                        method: 'POST',
                                        headers: { 
                                            'Content-Type': 'application/json',
                                            'Authorization': token ? `Bearer ${token}` : ''
                                        },
                                        body: JSON.stringify({
                                            skillTitle: selectedSkill.title,
                                            skillCategory: selectedSkill.category,
                                            tutor: selectedSkill.user?.name || selectedSkill.tutor,
                                            tutorEmail: selectedSkill.user?.email || selectedSkill.tutorEmail,
                                            requesterName,
                                            requesterEmail,
                                            message,
                                        }),
                                    });
                                    if (res.ok) {
                                        setSuccessMsg(true);
                                        // Reset modal after 2 seconds
                                        setTimeout(() => {
                                            setShowModal(false);
                                            setSuccessMsg(false);
                                            setMessage('');
                                        }, 2500);
                                    }
                                    else alert('Swap Initiation Failed');
                                } catch (e) { alert('Neural Error'); }
                                setLoading(false);
                            }}
                            className="flex-[2] py-5 bg-teal-600 text-white rounded-3xl font-black uppercase tracking-tighter text-xl hover:bg-teal-700 transition-all shadow-xl glow-teal disabled:opacity-50"
                        >
                            {loading ? 'Transmitting...' : 'Send Request'}
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </PageFade>
  );
}
