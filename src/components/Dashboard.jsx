import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageFade from './PageFade';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
const socket = io('http://localhost:5000');

export default function Dashboard() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem('token');

  const [requests, setRequests] = useState([]);
  const [activeView, setActiveView] = useState('dashboard'); 
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);

  async function loadData() {
    try {
      const res = await fetch('http://localhost:5000/api/requests');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadData();

    if (user) {
        socket.emit('join_user', user.id);
        socket.on('new_notification', () => {
             // Refresh data whenever something happens
             loadData();
        });
        socket.on('online_users', (users) => {
             setOnlineUsers(users);
        });
    }

    return () => {
        socket.off('new_notification');
        socket.off('online_users');
    };
  }, [token, navigate, user]);

  const [showReview, setShowReview] = useState(false);
  const [targetReviewee, setTargetReviewee] = useState(null);

  const sampleProducts = [
    { title: 'Crypter - NFT UI Kit', price: '$3,250.00', status: 'Active' },
    { title: 'Bento Pro 2.0 Illustrations', price: '$7,890.00', status: 'Active' },
    { title: 'Fleet - travel shopping kit', price: '$1,500.00', status: 'Offline' },
    { title: 'SimpleSocial UI Design Kit', price: '$9,999.99', status: 'Active' },
  ];

  // Interactive row for each request
  function InteractiveRequestRow({ r, onStatusChange }) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(r.status || 'pending');
    function updateStatus(next) {
      // optimistic UI update
      setStatus(next);
      if (onStatusChange) onStatusChange(r, next);
    }
    return (
      <div className="interactive-row p-3 rounded mb-3 flex items-start justify-between">
        <div>
          <div className="font-semibold">{r.skillTitle}</div>
          <div className="text-sm text-gray-600">From: {r.requesterName} • {new Date(r.createdAt).toLocaleString()}</div>
          {open && <div className="mt-2 text-sm text-gray-700">{r.message || 'No additional message provided.'}</div>}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className={`badge px-3 py-1 rounded-full ${status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {status}
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={() => updateStatus('accepted')} className="px-3 py-1 bg-emerald-600 text-white rounded">Accept</button>
            <button onClick={() => updateStatus('rejected')} className="px-3 py-1 border rounded">Decline</button>
            {status === 'accepted' && (
               <button 
                onClick={() => { setTargetReviewee(r.tutorId || r.tutor); setShowReview(true); }}
                className="px-3 py-1 bg-indigo-600 text-white rounded font-bold"
               >
                 Review Guru
               </button>
            )}
            <button onClick={() => setOpen(!open)} className="px-2 py-1 text-sm text-gray-500">{open ? 'Hide' : 'Details'}</button>
          </div>
        </div>
      </div>
    );
  }

  // Community summary: active users, top skills
  function CommunitySummary({ requests }) {
    const [selected, setSelected] = useState(null);
    const users = new Set(requests.map(r => r.requesterEmail || r.tutorEmail).filter(Boolean));
    const skillCounts = {};
    requests.forEach(r => { if (r.skillTitle) skillCounts[r.skillTitle] = (skillCounts[r.skillTitle] || 0) + 1; });
    const skills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500">Active users</div>
            <div className="text-2xl font-bold">{users.size}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Requests</div>
            <div className="text-2xl font-bold">{requests.length}</div>
          </div>
        </div>

        <div className="mb-3 text-sm text-gray-600">Top requested skills</div>
        <div className="flex flex-wrap gap-2">
          {skills.map(([skill, count]) => (
            <button key={skill} onClick={() => setSelected(selected === skill ? null : skill)} className={`px-3 py-1 rounded-full text-sm ${selected === skill ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              {skill} <span className="ml-2 text-xs text-gray-500">{count}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-4 text-sm">
            <div className="font-medium mb-2">Requests for: {selected}</div>
            {requests.filter(r => r.skillTitle === selected).map(r => (
              <div key={r._id} className="p-2 border-b last:border-b-0">
                <div className="font-medium">{r.requesterName} • {r.requesterEmail}</div>
                <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Skills (persisted locally per user)
  const skillsKey = user ? `skills:${user.email}` : 'skills:guest';
  const eventsKey = user ? `activity:${user.email}` : 'activity:guest';
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/api/skills/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setSkills(data);
        })
        .catch(err => console.error("Failed to load skills", err));
    }
  }, []);
  const [events, setEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem(eventsKey)) || []; } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  function persistSkills(next) { setSkills(next); localStorage.setItem(skillsKey, JSON.stringify(next)); }
  function persistEvent(ev) { const next = [ev, ...events].slice(0, 50); setEvents(next); localStorage.setItem(eventsKey, JSON.stringify(next)); }

  const [allSkills, setAllSkills] = useState([]);
  const [matches, setMatches] = useState({ perfect: [], partial: [] });
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (user && token) {
      // Fetch AI Matches
      fetch('http://localhost:5000/api/match', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setMatches(data);
        })
        .catch(err => console.error("Match fetch failed", err));

      // Fetch Leaderboard
      fetch('http://localhost:5000/api/users/leaderboard')
        .then(res => res.json())
        .then(data => {
          setLeaderboard(data.slice(0, 5));
        })
        .catch(err => console.error("Leaderboard fetch failed", err));
    }
  }, [user, token]);




  async function addSkill(payload) {
    try {
      const res = await fetch('http://localhost:5000/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const savedSkill = await res.json();
        setSkills(prev => [savedSkill, ...prev]);
        persistEvent({ type: 'skill.added', text: `You added skill: ${savedSkill.title}`, time: Date.now() });
        setShowAdd(false);
      } else {
        alert('Failed to add skill');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding skill');
    }
  }

  function handleRequestStatusChange(r, status) {
    persistEvent({ type: 'request.status', text: `${r.requesterName || r.requesterEmail} - ${r.skillTitle} →  \${status}`, time: Date.now() });
    // send status update to backend and sync local state
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/requests/${r._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error('Failed to update status');
        const data = await res.json();
        const updated = data.request;
        setRequests(prev => prev.map(p => (p._id === updated._id ? updated : p)));
      } catch (err) {
        console.error('Failed to update request status', err);
      }
    })();
  }

  const incoming = user ? requests.filter(r => (r.tutor === user.email || r.tutorEmail === user.email || r.tutor === user.name)) : [];
  const myRequests = user ? requests.filter(r => (r.requesterEmail === user.email || r.requesterName === user.name)) : [];

  return (
    <PageFade className="min-h-screen mesh-gradient-premium py-24 px-4 sm:px-8">
      {/* Floating Top Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
        <div className="glass px-8 py-4 rounded-[30px] border-white/60 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black italic tracking-tighter text-slate-900 flex items-center gap-2 group">
              <div className="w-8 h-8 bg-slate-900 rounded-lg group-hover:rotate-12 transition-transform shadow-lg" />
              SKILLSWAP
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-teal-600 border-b-2 border-teal-500 pb-1">Dashboard</Link>
              <Link to="/roadmap" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Roadmap AI</Link>
              <Link to="/browse" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Explore</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="px-4 py-2 bg-slate-100/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white transition-all">Account</Link>
            <Link to="/" onClick={() => { localStorage.clear(); }} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">Logout</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto pt-10">
        
        {/* Header Hero */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
          <div className="animate-float">
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4">
              Hello, <span className="text-teal-600 headline-reveal">{(user && user.name) || 'Swapper'}!</span>
            </h1>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-slate-700 tracking-tight">{(user && user.streak) || 0} Day Streak</span>
              </div>
              <div className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                <span className="text-2xl">⚡</span>
                <span className="font-bold text-slate-700 tracking-tight">Level {(user && user.level) || 1}</span>
              </div>
              <div className="px-4 py-2 bg-indigo-500 text-white rounded-2xl shadow-lg glow-indigo flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-100"></span>
                </span>
                <span className="font-bold tracking-tight">{onlineUsers.length} Online Now</span>
              </div>
              <div className="px-4 py-2 bg-teal-500 text-white rounded-2xl shadow-lg glow-teal flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                <span className="text-2xl">✨</span>
                <span className="font-bold tracking-tight">{(user && user.points) || 0} Karma Pts</span>
              </div>
              <Link to="/profile" className="text-sm font-bold text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-2xl border border-teal-200 transition-all">
                Update Profile →
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowAdd(true)}
              className="px-8 py-5 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3"
            >
              Offer Skill
              <svg className="w-6 h-6 border-2 border-white rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
            </button>
            <Link 
              to="/roadmap"
              className="px-8 py-5 bg-teal-500 text-white rounded-3xl font-black text-xl hover:bg-teal-600 transition-all hover:scale-105 active:scale-95 shadow-2xl glow-teal flex items-center gap-3"
            >
              AI Roadmap
              <span className="text-2xl">🪄</span>
            </Link>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Incoming Swap Requests - Span 2 */}
          <div className="md:col-span-2 bg-white/80 backdrop-blur-xl border border-white rounded-[40px] p-8 shadow-sm hover:shadow-xl transition-all h-full flex flex-col group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black tracking-tight text-slate-800">Incoming <span className="text-teal-600 italic">Swaps</span></h3>
              <div className="bg-teal-100 text-teal-700 font-black px-4 py-1 rounded-full text-xs animate-pulse">
                {incoming.length} ACTIVE
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              {incoming.map((r, idx) => (
                <div key={idx} className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-teal-300 transition-all hover:translate-x-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-black text-slate-800 text-lg uppercase tracking-tight">{r.skillTitle}</div>
                      <div className="text-slate-500 font-medium">{r.requesterName} wants to learn</div>
                    </div>
                    <button 
                      onClick={() => handleRequestStatusChange(r, 'accepted')}
                      className="px-6 py-2 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition"
                    >
                      Swap Now
                    </button>
                  </div>
                </div>
              ))}
              {incoming.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <span className="text-6xl mb-4 grayscale opacity-50">📫</span>
                  <p className="font-bold">Inbox is currently quiet.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Matching - Span 1 */}
          <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl flex flex-col justify-between overflow-hidden relative border border-slate-800 group">
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none group-hover:scale-150 transition-transform duration-700">
               <svg className="w-40 h-40 text-teal-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-2">Neural Match Engine</div>
              <h3 className="text-2xl font-black text-white mb-2 leading-tight">AI Matching</h3>
              <p className="text-slate-400 font-medium mb-8 text-sm italic">Perfect swaps found for you.</p>
              
              <div className="space-y-4">
                {((matches?.perfect?.length || 0) > 0 ? matches.perfect : (matches?.partial || [])).slice(0, 3).map((match, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition cursor-pointer group">
                    <img src={match.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.name}`} className="w-10 h-10 rounded-full border-2 border-teal-500/50" alt="" />
                    <div className="overflow-hidden">
                      <div className="text-white font-black text-xs truncate uppercase italic">{match.name}</div>
                      <div className="text-teal-400 text-[10px] font-black uppercase tracking-widest truncate">Offers: {match.skillsOffered?.[0] || 'Skill'}</div>
                    </div>
                  </div>
                ))}
                {(!matches?.perfect?.length && !matches?.partial?.length) && (
                   <div className="text-[10px] text-slate-500 font-bold italic py-4 opacity-50">Searching for neural links...</div>
                )}
              </div>
            </div>
            <Link to="/browse" className="w-full mt-6 py-4 bg-teal-500 text-white font-black rounded-[25px] hover:bg-teal-400 transition-all uppercase tracking-widest text-xs text-center shadow-lg transform active:scale-95">
               Expand Hub
            </Link>
          </div>

          {/* Leaderboard - Span 1 */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Top <span className="text-teal-600">Gurus</span></h3>
                <span className="text-xs font-black text-slate-400">Karma</span>
              </div>
              <div className="space-y-4">
                {leaderboard.map((u, i) => (
                  <div key={i} className="flex items-center justify-between group/row">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black w-4 ${i === 0 ? 'text-yellow-500' : 'text-slate-300'}`}>{i + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                        <img src={u.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="text-xs font-black text-slate-600 group-hover/row:text-teal-600 transition-colors">{u.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{u.karma || 0}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span>Vetted Swappers</span>
               <span className="text-teal-500">View All</span>
            </div>
          </div>
          
        </div>

        {/* Section Lower: My Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <h4 className="text-3xl font-black text-slate-800 mb-8 uppercase tracking-tighter flex items-center gap-3">
              <span className="w-4 h-4 bg-teal-500 rounded-full glow-teal"></span>
              Inventory <span className="text-slate-300">Of My Skills</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((s, idx) => (
                <div key={idx} className="group glass border border-white/80 p-6 rounded-[35px] hover:shadow-2xl hover:scale-105 transition-all duration-300 flex justify-between items-center cursor-default">
                  <div>
                    <div className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-1">{s.level}</div>
                    <div className="text-2xl font-black text-slate-800">{s.title}</div>
                    <div className="text-sm text-slate-500 font-medium line-clamp-1">{s.desc}</div>
                  </div>
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl group-hover:bg-teal-500 transition-colors">
                    {s.title.charAt(0)}
                  </div>
                </div>
              ))}
              <button onClick={() => setShowAdd(true)} className="border-4 border-dashed border-slate-200 rounded-[35px] p-6 hover:bg-white hover:border-teal-400 transition-all flex flex-col items-center justify-center text-slate-300 hover:text-teal-500">
                <span className="text-4xl mb-1">+</span>
                <span className="font-black uppercase tracking-widest text-xs">List New Talent</span>
              </button>
            </div>
          </div>

          <div>
             <h4 className="text-3xl font-black text-slate-800 mb-8 uppercase tracking-tighter">Activity <span className="text-slate-300">Log</span></h4>
             <div className="space-y-6">
                {events.slice(0, 4).map((ev, i) => (
                  <div key={i} className="flex gap-4 items-start pb-6 border-b border-slate-200 last:border-b-0 group">
                    <div className="w-2 h-2 rounded-full bg-slate-900 mt-2 group-hover:scale-150 transition-transform"></div>
                    <div>
                      <div className="font-bold text-slate-800">{ev.text}</div>
                      <div className="text-xs text-slate-400 font-black">{new Date(ev.time).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-slate-400 font-bold italic">No recent log entries.</p>
                )}
             </div>
          </div>
        </div>

      </div>

      {/* Modern Modals Context */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg backdrop-saturate-150" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-xl p-10 overflow-hidden">
            <h4 className="text-3xl font-black text-slate-900 mb-6 italic tracking-tighter">Share your <span className="text-teal-600 underline">Gifts</span></h4>
            <AddSkillForm onAdd={addSkill} onCancel={() => setShowAdd(false)} />
          </div>
        </div>
      )}

      {showRequestForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg backdrop-saturate-150" onClick={() => setShowRequestForm(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-xl p-10 overflow-hidden">
            <h4 className="text-3xl font-black text-slate-900 mb-6 italic tracking-tighter">What are talking <span className="text-teal-600 underline">about?</span></h4>
            <RequestForm onCreate={async (payload) => {
              try {
                const body = { ...payload, requesterName: user.name, requesterEmail: user.email };
                const res = await fetch('http://localhost:5000/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
                if (!res.ok) throw new Error('Failed to create request');
                const data = await res.json();
                const created = data.request;
                setRequests(prev => [created, ...prev]);
                persistEvent({ type: 'request.create', text: `Request sent: ${created.skillTitle}`, time: Date.now() });
                setShowRequestForm(false);
              } catch (err) {
                alert('Could not create request');
              }
            }} onCancel={() => setShowRequestForm(false)} />
          </div>
        </div>
      )}

      {showReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg" onClick={() => setShowReview(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 overflow-hidden">
            <h4 className="text-2xl font-black text-slate-900 mb-6 italic tracking-tighter">Rate your <span className="text-teal-600">Guru</span></h4>
             <ReviewForm 
                reviewee={targetReviewee} 
                onClose={() => setShowReview(false)} 
                onSuccess={() => {
                   toast.success('Karma Points Awarded! Badge Level UP! 🛡️', { icon: '🔥', duration: 4000 });
                }}
            />
          </div>
        </div>
      )}

    </PageFade>
  );
}

function ReviewForm({ reviewee, onClose, onSuccess }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ revieweeId: reviewee, rating, comment })
            });
            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                toast.error('Review submission failed.');
            }
        } catch (e) {
            toast.error('Network Error during review.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex justify-center gap-4 text-3xl">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                        key={star} 
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-all hover:scale-125 ${rating >= star ? 'scale-110 opacity-100' : 'opacity-20 grayscale'}`}
                    >
                        {star <= rating ? '⭐' : '☆'}
                    </button>
                ))}
            </div>
            <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                className="w-full p-4 bg-slate-50 border rounded-2xl text-sm italic" 
                placeholder="What did you learn? Was the mentor helpful?"
            />
            <div className="flex gap-4">
                 <button type="submit" disabled={loading} className="flex-1 py-4 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-teal-600 transition shadow-xl">
                    {loading ? 'Submitting...' : 'Confirm Review'}
                 </button>
            </div>
        </form>
    );
}

const categories = [
  'Programming', 'Technology', 'Design', 'Music', 'Cooking',
  'Language', 'Photography', 'Marketing', 'Fitness', 'Arts',
  'Writing', 'Personal Dev', 'Other'
];

function AddSkillForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Technology');

  function submit(e) {
    e.preventDefault();
    if (!title) return alert('Enter a title');
    onAdd({ title, level, desc, category });
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-sm text-gray-600">Skill</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded input-glow" placeholder="e.g. React.js" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600">Level</label>
        <select value={level} onChange={e => setLevel(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
          <option>Expert</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600">Short description</label>
        <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" placeholder="What will you teach?" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Add Skill</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
}

function RequestForm({ onCreate, onCancel }) {
  const [skillTitle, setSkillTitle] = useState('');
  const [tutor, setTutor] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('Technology');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!skillTitle) return alert('Enter a skill title');
    setLoading(true);
    try {
      await onCreate({ skillTitle, tutor, message, skillCategory: category });
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-sm text-gray-600">Skill (What do you want to learn?)</label>
        <input value={skillTitle} onChange={e => setSkillTitle(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" placeholder="e.g. French Conversation" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600">Preferred Tutor (optional)</label>
        <input value={tutor} onChange={e => setTutor(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" placeholder="Name of tutor if known" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Message</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" rows={3} placeholder="Describe what you need help with..." />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded">{loading ? 'Requesting…' : 'Request Skill'}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
}
