import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageFade from './PageFade';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const [mySkills, setMySkills] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState('');

  const [perfectMatches, setPerfectMatches] = useState([]);
  const [partialMatches, setPartialMatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('skills'); // skills | requests

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        // Fetch User
        const resMe = await fetch('http://localhost:5000/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        const dataMe = await resMe.json();

        let currentUser = null;
        if (resMe.ok && dataMe.user) {
          currentUser = dataMe.user;
          setUser(currentUser);
          setName(currentUser.name || '');
          setBio(currentUser.bio || '');
          setProfileImage(currentUser.profileImage || '');
          setInterests(currentUser.skillsInterestedIn || []);
        }

        // Fetch Matches
        const resMatches = await fetch('http://localhost:5000/api/match', { headers: { Authorization: `Bearer ${token}` } });
        const dataMatches = await resMatches.json();
        if (resMatches.ok) {
            setPerfectMatches(dataMatches.perfect || []);
            setPartialMatches(dataMatches.partial || []);
        }

        // Fetch My Skills
        const resSkills = await fetch('http://localhost:5000/api/skills/me', { headers: { Authorization: `Bearer ${token}` } });
        const dataSkills = await resSkills.json();
        if (Array.isArray(dataSkills)) setMySkills(dataSkills);

        // Fetch Requests (and filter by my email)
        if (currentUser && currentUser.email) {
          const resReqs = await fetch('http://localhost:5000/api/requests', { headers: { Authorization: `Bearer ${token}` } });
          const dataReqs = await resReqs.json();
          if (dataReqs.requests && Array.isArray(dataReqs.requests)) {
            const mine = dataReqs.requests.filter(r => r.requesterEmail === currentUser.email);
            setMyRequests(mine);
          }
        }

        // Fetch My Reviews
        if (currentUser && currentUser._id) {
          const resRev = await fetch(`http://localhost:5000/api/reviews/user/${currentUser._id}`, { headers: { Authorization: `Bearer ${token}` } });
          const dataRev = await resRev.json();
          if (Array.isArray(dataRev)) {
            setMyReviews(dataRev);
            // Calculate Avg
            if (dataRev.length > 0) {
              const avg = dataRev.reduce((acc, r) => acc + r.rating, 0) / dataRev.length;
              setAvgRating(avg.toFixed(1));
            }
          }
        }

      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    }
    fetchData();
  }, [token]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!token) return alert('Not authenticated');
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, bio, profileImage, skillsInterestedIn: interests }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        alert('Profile updated');
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally { setSaving(false); }
  }

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!user) return (
    <div className="p-8 text-center text-gray-500">
      <p className="mb-4">Please log in to view your profile.</p>
      <a href="/login" className="text-teal-600 font-bold hover:underline">Sign in</a>
    </div>
  );

  return (
    <PageFade className="min-h-screen mesh-gradient-premium py-24 px-4 sm:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-200/30 blur-[120px] rounded-full animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full animate-float-slow" style={{ animationDelay: '2s' }} />

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
              <Link to="/browse" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Explore</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-teal-600 border border-teal-100 shadow-sm transition-all">Account</Link>
            <Link to="/" onClick={() => { localStorage.clear(); }} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">Logout</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto mb-8 pt-10 relative z-10 flex items-center justify-between">
        <Link to="/dashboard" className="text-slate-900 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
          <svg className="w-5 h-5 border-2 border-slate-900 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back
        </Link>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] hidden sm:block">User Settings</span>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

        {/* Sidebar: Profile Info (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-[40px] p-10 shadow-2xl border-white/60 flex flex-col items-center text-center">
            
            <div className="relative mb-8 group">
              <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-teal-500 to-blue-600 shadow-xl overflow-hidden group-hover:rotate-6 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-white overflow-hidden border-4 border-white">
                  {profileImage ? (
                    <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-200">
                      {name.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              </div>
              <label className="absolute bottom-2 right-2 bg-slate-900 text-white p-3 rounded-2xl cursor-pointer hover:bg-teal-600 shadow-xl transition-all hover:scale-110 active:scale-95">
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>

            <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-1">{name || 'Skill Swapper'}</h2>
            <p className="text-slate-500 font-bold mb-6 italic opacity-70">{user.email}</p>

            <div className="flex flex-wrap justify-center gap-3 mb-10 w-full">
              <div className="px-4 py-2 bg-white/80 rounded-2xl border border-white/50 shadow-sm flex items-center gap-2 hover:translate-y-[-2px] transition-transform">
                <span className="text-xl">⚡</span>
                <span className="font-black text-slate-700 text-xs tracking-widest uppercase">Lvl {user.level || 1}</span>
              </div>
              <div className="px-4 py-2 bg-teal-500 text-white rounded-2xl shadow-lg glow-teal flex items-center gap-2 hover:translate-y-[-2px] transition-transform">
                <span className="text-xl">✨</span>
                <span className="font-black text-xs tracking-widest uppercase">{user.karma || 0} Karma</span>
              </div>
            </div>

            {/* Stats Bento inside Sidebar */}
            <div className="grid grid-cols-2 gap-4 w-full mb-10">
              <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
                <div className="text-2xl font-black text-slate-800">{mySkills.length}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Offered</div>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
                <div className="text-2xl font-black text-slate-800">{avgRating || 0}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="w-full space-y-6 text-left">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-5 py-4 bg-white/40 border-2 border-white rounded-3xl text-sm font-bold focus:border-teal-500 outline-none transition-all placeholder:opacity-30" placeholder="Display Name" />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">About Me</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full px-5 py-4 bg-white/40 border-2 border-white rounded-3xl text-sm font-bold h-32 resize-none focus:border-teal-500 outline-none transition-all placeholder:opacity-30" placeholder="Tell the community who you are..." />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Interests</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {interests.map((it, i) => (
                    <span key={i} className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-2 hover:bg-teal-600 transition-colors">
                      {it}
                      <button onClick={() => setInterests(interests.filter((_, idx) => idx !== i))} className="opacity-50 hover:opacity-100">×</button>
                    </span>
                  ))}
                </div>
                <input 
                  value={interestInput} 
                  onChange={e => setInterestInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && interestInput.trim()) {
                      e.preventDefault();
                      setInterests([...new Set([...interests, interestInput.trim()])]);
                      setInterestInput('');
                    }
                  }}
                  className="w-full px-5 py-4 bg-white/40 border-2 border-white rounded-3xl text-sm font-bold focus:border-teal-500 outline-none transition-all" 
                  placeholder="Type interest + Enter" 
                />
              </div>
            </div>

            <button onClick={save} disabled={saving} className="w-full mt-10 py-5 bg-teal-600 text-white rounded-[30px] font-black text-lg hover:bg-teal-700 transition shadow-2xl glow-teal disabled:opacity-50 uppercase tracking-tighter active:scale-95">
              {saving ? 'Syncing...' : 'Sync Profile'}
            </button>
          </div>
        </div>

        {/* Main Content Area (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Tabs Navigation */}
          <div className="glass rounded-full p-2 flex border-white/60 shadow-xl mb-2 overflow-x-auto no-scrollbar">
            {['skills', 'requests', 'reviews', 'matches'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[100px] py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Active Tab Content Card */}
          <div className="glass rounded-[40px] p-10 shadow-2xl border-white/60 min-h-[600px] flex flex-col">
            
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end mb-8">
                   <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Inventory <span className="text-teal-600 opacity-50 block text-xl not-italic">Of Expertise</span></h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mySkills.map(skill => (
                    <div key={skill._id} className="p-6 bg-white/60 border border-white rounded-[35px] group hover:border-teal-300 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-bold group-hover:bg-teal-500 transition-colors">
                          {skill.title.charAt(0)}
                        </div>
                        <div className="bg-teal-50 text-teal-600 font-black text-[9px] px-3 py-1 rounded-full border border-teal-100 uppercase tracking-widest">
                          {skill.level}
                        </div>
                      </div>
                      <h4 className="text-xl font-black text-slate-800 mb-1">{skill.title}</h4>
                      <p className="text-slate-500 text-xs font-medium line-clamp-2">{skill.desc || "A valuable asset to the community."}</p>
                    </div>
                  ))}
                  {mySkills.length === 0 && <p className="col-span-2 text-center py-20 font-bold text-slate-300 italic text-2xl">Nothing listed yet.</p>}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-6">
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic mb-8">Learning <span className="text-teal-600 opacity-50 block text-xl not-italic">Queue</span></h3>
                <div className="space-y-4">
                  {myRequests.map(req => (
                    <div key={req._id} className="p-6 bg-white/60 border border-white rounded-[35px] hover:shadow-xl transition-all flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Requesting Expertise</div>
                          <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{req.skillTitle}</h4>
                        </div>
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] ${
                          req.status === 'accepted' ? 'bg-emerald-500 text-white shadow-lg glow-teal' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      {req.status === 'accepted' && (
                        <a 
                          href={`/workspace/${req._id}`} 
                          className="w-full py-4 bg-teal-50 text-teal-600 font-black rounded-3xl border border-teal-200 text-center hover:bg-teal-100 italic tracking-tighter"
                        >
                          Join Live Collaboration →
                        </a>
                      )}
                    </div>
                  ))}
                  {myRequests.length === 0 && <p className="text-center py-20 font-bold text-slate-300 italic text-2xl">Discovery queue empty.</p>}
                </div>
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="space-y-12">
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Radar <span className="text-teal-600 opacity-50 block text-xl not-italic">Matches</span></h3>
                
                {perfectMatches.length > 0 && (
                  <div>
                    <div className="text-[10px] font-black tracking-[0.3em] text-teal-600 mb-6 uppercase">Mutual Opportunities</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {perfectMatches.map(m => (
                        <div key={m._id} className="p-8 bg-slate-900 rounded-[40px] shadow-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-6 opacity-10 scale-150 rotate-12 group-hover:scale-125 transition-transform duration-500 group-hover:opacity-30">
                             <svg className="w-24 h-24 text-teal-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4(15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
                          </div>
                          <div className="flex gap-4 mb-6 relative z-10">
                            <div className="w-14 h-14 rounded-full bg-teal-500 border-2 border-white/20 p-0.5 overflow-hidden">
                              {m.profileImage ? <img src={m.profileImage} className="w-full h-full object-cover rounded-full" /> : <div className="text-white font-black text-2xl h-full flex items-center justify-center italic">{m.name?.charAt(0)}</div>}
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-white italic tracking-tight">{m.name}</h4>
                               <div className="bg-teal-500/20 text-teal-400 text-[9px] font-black px-2 py-0.5 rounded-full inline-block uppercase tracking-widest">Perfect Match</div>
                            </div>
                          </div>
                          <div className="space-y-2 mb-8 relative z-10">
                             <p className="text-xs text-slate-400 font-bold tracking-tight leading-tight uppercase">THEY NEED: <span className="text-white">{(m.skillsInterestedIn || []).join(', ')}</span></p>
                             <p className="text-xs text-slate-400 font-bold tracking-tight leading-tight uppercase">THEY OFFER: <span className="text-teal-400">{(m.skillsOffered || []).join(', ')}</span></p>
                          </div>
                          <button className="w-full py-4 bg-white text-slate-900 font-black rounded-3xl hover:bg-teal-400 transition-colors uppercase tracking-widest text-xs relative z-10">
                            Propose Exchange
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {partialMatches.length > 0 && perfectMatches.length === 0 && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {partialMatches.map(m => (
                        <div key={m._id} className="p-6 bg-white/60 border border-white rounded-[35px] hover:shadow-xl transition-all flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 italic">{m.name?.charAt(0)}</div>
                           <div>
                              <h4 className="font-black text-slate-800">{m.name}</h4>
                              <p className="text-[10px] font-black text-teal-600 uppercase">Offers: {(m.skillsOffered || []).join(', ')}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                )}

                {perfectMatches.length === 0 && partialMatches.length === 0 && (
                   <p className="text-center py-20 font-bold text-slate-300 italic text-2xl">Radar scanning... no signals found.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic mb-8">Swapper <span className="text-teal-600 opacity-50 block text-xl not-italic">Vibes</span></h3>
                <div className="space-y-4">
                  {myReviews.map(rev => (
                    <div key={rev._id} className="p-8 bg-white/60 border border-white rounded-[40px] flex flex-col sm:flex-row gap-6 group hover:shadow-xl transition-all">
                      <div className="w-16 h-16 bg-slate-900 rounded-full flex-shrink-0 overflow-hidden border-2 border-white group-hover:scale-110 transition-transform">
                        {rev.reviewer.profileImage ? <img src={rev.reviewer.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-black text-3xl italic">{rev.reviewer.name?.charAt(0)}</div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xl font-black text-slate-800 italic uppercase tracking-tighter">{rev.reviewer.name}</h4>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-5 h-5 ${i < rev.rating ? 'text-teal-500' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 font-bold italic leading-relaxed text-lg">"{rev.comment}"</p>
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mt-6">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {myReviews.length === 0 && <p className="text-center py-20 font-bold text-slate-300 italic text-2xl">No vibes shared yet.</p>}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </PageFade>
  );
}
