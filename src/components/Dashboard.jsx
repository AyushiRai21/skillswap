import React, { useEffect, useState } from 'react';
import PageFade from './PageFade';
import ExploreSkills from './ExploreSkills';
import Chat from './Chat';

export default function Dashboard() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [requests, setRequests] = useState([]);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'explore'
  const [loading, setLoading] = useState(true);

  // animated stats
  const [customersCount, setCustomersCount] = useState(0);
  const [balanceCount, setBalanceCount] = useState(0);
  // animated stat counters for visual flair
  const [skillsCount, setSkillsCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [incomingCountState, setIncomingCountState] = useState(0);
  const [eventsCountState, setEventsCountState] = useState(0);

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

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

  function persistSkills(next) { setSkills(next); localStorage.setItem(skillsKey, JSON.stringify(next)); }
  function persistEvent(ev) { const next = [ev, ...events].slice(0, 50); setEvents(next); localStorage.setItem(eventsKey, JSON.stringify(next)); }

  const [allSkills, setAllSkills] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Fetch all skills for matching
    fetch('http://localhost:5000/api/skills')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllSkills(data);
      })
      .catch(err => console.error(err));
  }, []);

  // Placeholder for useEffect matching logic - removing from here to place after myRequests definition

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
    persistEvent({ type: 'request.status', text: `${r.requesterName || r.requesterEmail} - ${r.skillTitle} → ${status}`, time: Date.now() });
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

  useEffect(() => {
    if (user && myRequests.length > 0 && allSkills.length > 0) {
      // Simple matching logic: Find skills that match the title of my requests
      const newMatches = [];
      myRequests.forEach(req => {
        const potentialTutors = allSkills.filter(s =>
          s.user && s.user._id !== user._id && // Not me
          (s.title.toLowerCase().includes(req.skillTitle.toLowerCase()) ||
            req.skillTitle.toLowerCase().includes(s.title.toLowerCase()))
        );
        potentialTutors.forEach(tutorSkill => {
          newMatches.push({ request: req, match: tutorSkill });
        });
      });
      // Deduplicate matches
      const uniqueMatches = Array.from(new Set(newMatches.map(m => m.match._id)))
        .map(id => newMatches.find(m => m.match._id === id));

      setMatches(uniqueMatches);
    }
  }, [user, myRequests, allSkills]);

  return (
    <PageFade className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left sidebar inside dashboard */}
        <aside className="col-span-2 hidden lg:block">
          <div className="bg-white rounded-2xl p-4 shadow sticky top-28">
            <ul className="space-y-2 text-sm text-gray-600">
              <li className={`p-3 rounded-lg cursor-pointer ${activeView === 'dashboard' ? 'bg-emerald-50 font-medium' : 'hover:bg-gray-50'}`} onClick={() => setActiveView('dashboard')}>Dashboard</li>
              <li className={`p-3 rounded-lg cursor-pointer ${activeView === 'explore' ? 'bg-emerald-50 font-medium' : 'hover:bg-gray-50'}`} onClick={() => setActiveView('explore')}>Explore Skills</li>
              <li className={`p-3 rounded-lg cursor-pointer ${activeView === 'messages' ? 'bg-emerald-50 font-medium' : 'hover:bg-gray-50'}`} onClick={() => setActiveView('messages')}>Messages</li>
              <li className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setShowAdd(true)}>Offer Skill</li>
              <li className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setShowRequestForm(true)}>Exchange</li>
            </ul>
          </div>
        </aside>

        {/* Main content (center) */}
        <main className="col-span-12 lg:col-span-7">
          {activeView === 'explore' ? (
            <ExploreSkills />
          ) : activeView === 'messages' ? (
            <Chat user={user} />
          ) : (
            <div className="w-full animate-page-fade">
              {/* Header / Hero */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 headline-reveal">
                    Hello, {user.name || 'User'}!
                  </h1>
                  <p className="text-gray-500 mt-2 animate-float" style={{ animationDelay: '100ms' }}>
                    Ready to learn or teach something new today?
                  </p>
                </div>

                <div className="flex items-center gap-3 animate-float" style={{ animationDelay: '200ms' }}>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-semibold flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Offer Skill
                  </button>
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all font-semibold flex items-center gap-2"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    Exchange
                  </button>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Column: Requests & Priority Items (Span 2) */}
                <div className="xl:col-span-2 space-y-8">

                  {/* Incoming Requests */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-animate" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                        Incoming Requests
                      </h3>
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-500">
                        {incoming.length} pending
                      </span>
                    </div>

                    {loading && <div className="text-center py-8 text-gray-400">Loading...</div>}
                    {!loading && incoming.length === 0 && (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                        <p className="text-gray-500">No incoming requests yet. Share your profile!</p>
                      </div>
                    )}
                    <div className="space-y-3">
                      {incoming.map((r, idx) => (
                        <InteractiveRequestRow key={r._id} r={r} onStatusChange={handleRequestStatusChange} />
                      ))}
                    </div>
                  </div>

                  {/* My Learning Requests */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-animate" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
                        Skills I Want to Learn
                      </h3>
                      <button onClick={() => setShowRequestForm(true)} className="text-sm text-emerald-600 font-medium hover:underline">+ New Request</button>
                    </div>

                    {myRequests.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                        <p className="text-gray-500 mb-2">You haven't asked to learn anything yet.</p>
                        <button onClick={() => setShowRequestForm(true)} className="text-emerald-600 font-semibold text-sm">Make a Request</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myRequests.map(r => (
                          <div key={r._id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all flex justify-between items-start">
                            <div>
                              <div className="font-bold text-gray-800">{r.skillTitle}</div>
                              <div className="text-sm text-gray-500 mt-1 line-clamp-2">{r.message || 'No details'}</div>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded capitalize ${r.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{r.status || 'pending'}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Column: Inventory & Stats (Span 1) */}
                <div className="space-y-8">

                  {/* Smart Matches / Recommendations */}
                  {matches.length > 0 && (
                    <div className="bg-gradient-to-b from-emerald-50 to-white rounded-2xl p-6 shadow-sm border border-emerald-100 animate-fade-in">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="text-xl">✨</span> Recommended for You
                      </h3>
                      <div className="space-y-4">
                        {matches.slice(0, 3).map((m, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition">
                            <div className="font-semibold text-gray-800">{m.match.title}</div>
                            <div className="text-xs text-gray-500 mt-1">Tutor: {m.match.user ? m.match.user.name : 'Unknown'}</div>
                            <button
                              onClick={() => { setActiveView('messages'); /* ideally open chat with this user */ }}
                              className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                              Message Tutor
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* My Offered Skills */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-animate" style={{ animationDelay: '500ms' }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800">My Skills</h3>
                      <button onClick={() => setShowAdd(true)} className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">+</button>
                    </div>

                    {skills.length === 0 ? (
                      <div className="text-center py-8 text-sm text-gray-500">
                        No skills added.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {skills.map((s, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default group">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                              {s.title.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-800 truncate">{s.title}</div>
                              <div className="text-xs text-gray-500">{s.level} • {s.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setShowAdd(true)} className="w-full mt-4 py-2 text-sm text-emerald-600 font-medium border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors">
                      Add New Skill
                    </button>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-animate" style={{ animationDelay: '600ms' }}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-200 border-2 border-white"></div>
                        <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">John</span> requested Web Dev.</p>
                        <span className="text-xs text-gray-400">2h ago</span>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-200 border-2 border-white"></div>
                        <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Sarah</span> accepted Photo.</p>
                        <span className="text-xs text-gray-400">1d ago</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Modals */}
              {showRequestForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center dialog-pop">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRequestForm(false)} />
                  <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-2xl font-bold text-gray-800">Request a Skill</h4>
                      <button onClick={() => setShowRequestForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <RequestForm onCreate={async (payload) => {
                      try {
                        const body = { ...payload, requesterName: user.name, requesterEmail: user.email };
                        const res = await fetch('http://localhost:5000/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
                        if (!res.ok) throw new Error('Failed to create request');
                        const data = await res.json();
                        const created = data.request;
                        setRequests(prev => [created, ...prev]);
                        persistEvent({ type: 'request.create', text: `You requested: ${created.skillTitle}`, time: Date.now() });
                        setShowRequestForm(false);
                      } catch (err) {
                        console.error(err);
                        alert('Could not create request');
                      }
                    }} onCancel={() => setShowRequestForm(false)} />
                  </div>
                </div>
              )}

              {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center dialog-pop">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
                  <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-2xl font-bold text-gray-800">Offer a Skill</h4>
                      <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <AddSkillForm onAdd={addSkill} onCancel={() => setShowAdd(false)} />
                  </div>
                </div>
              )}

            </div>
          )}
        </main>

        {/* Removed static products panel — interactive summary shown in main */}
      </div>
    </PageFade>
  );
}

function AddSkillForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [desc, setDesc] = useState('');
  function submit(e) {
    e.preventDefault();
    if (!title) return alert('Enter a title');
    onAdd({ title, level, desc });
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-sm text-gray-600">Skill</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded input-glow" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Level</label>
        <select value={level} onChange={e => setLevel(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600">Short description</label>
        <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
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
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!skillTitle) return alert('Enter a skill title');
    setLoading(true);
    try {
      await onCreate({ skillTitle, tutor, message });
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-sm text-gray-600">Skill</label>
        <input value={skillTitle} onChange={e => setSkillTitle(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Preferred Tutor (optional)</label>
        <input value={tutor} onChange={e => setTutor(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Message</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" rows={4} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded">{loading ? 'Requesting…' : 'Request Skill'}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
}
