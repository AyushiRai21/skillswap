import React, { useState } from 'react';

const sampleCategories = [
  'Programming',
  'Design',
  'Music',
  'Cooking',
  'Language',
  'Photography',
  'Marketing',
  'Fitness',
];

const sampleSkills = [
  { title: 'React Basics', category: 'Programming', tutor: 'Anita', tutorEmail: 'anita@example.com', desc: 'Intro to React, hooks and components.' },
  { title: 'Photoshop for Beginners', category: 'Design', tutor: 'Rohit', tutorEmail: 'rohit@example.com', desc: 'Learn essential photo editing.' },
  { title: 'Guitar 101', category: 'Music', tutor: 'Sam', tutorEmail: 'sam@example.com', desc: 'Chords, strumming and practice tips.' },
  { title: 'Italian Cooking', category: 'Cooking', tutor: 'Lucia', tutorEmail: 'lucia@example.com', desc: 'Pasta, sauces and simple desserts.' },
  { title: 'Spanish Conversation', category: 'Language', tutor: 'Maria', tutorEmail: 'maria@example.com', desc: 'Practical speaking lessons.' },
  { title: 'DSLR Fundamentals', category: 'Photography', tutor: 'Amit', tutorEmail: 'amit@example.com', desc: 'Camera basics and composition.' },
  { title: 'SEO Basics', category: 'Marketing', tutor: 'Priya', tutorEmail: 'priya@example.com', desc: 'Intro to on-page SEO.' },
  { title: 'Home Workouts', category: 'Fitness', tutor: 'Nina', tutorEmail: 'nina@example.com', desc: 'No-equipment routines.' },
];

export default function BrowseSkills() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
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
    const tutorName = s.user ? (s.user.name || 'Unknown') : 'Unknown';
    const matchesQuery = s.title.toLowerCase().includes(query.toLowerCase()) || tutorName.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Browse Skills</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills, tutors, topics..."
              className="w-72 px-3 py-2 rounded-md border-gray-200 shadow-sm"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-md border-gray-200 shadow-sm"
            >
              <option>All</option>
              {sampleCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 flex-wrap">
            {sampleCategories.slice(0, 6).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full ${category === c ? 'bg-teal-600 text-white' : 'bg-white border'}`}
              >
                {c}
              </button>
            ))}
            <button onClick={() => { setCategory('All'); setQuery(''); }} className="px-3 py-1 rounded-full bg-gray-100">Reset</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s, i) => (
            <div key={s._id || i} style={{ animationDelay: `${i * 80}ms` }} className="card-animate bg-white p-5 rounded-2xl shadow card-hover">
              <h3 className="text-xl font-semibold text-gray-800">{s.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Category: {s.category}</p>
              <p className="mt-3 text-gray-700">{s.desc}</p>
              <p className="mt-2 text-gray-600">Tutor: <span className="font-medium">{s.user ? s.user.name : 'Unknown'}</span></p>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">30–60 min • Remote</div>
                <button
                  onClick={() => { setSelectedSkill(s); setShowModal(true); setSuccessMsg(''); }}
                  className="px-3 py-1 bg-teal-600 text-white rounded-md btn-glow"
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <h3 className="text-xl font-bold mb-2">Request: {selectedSkill.title}</h3>
              <p className="text-sm text-gray-600 mb-4">Tutor: {selectedSkill.tutor} — Category: {selectedSkill.category}</p>

              {successMsg && <div className="mb-3 text-green-600">{successMsg}</div>}

              <div className="space-y-3">
                <input value={requesterName} onChange={e => setRequesterName(e.target.value)} placeholder="Your name" className="w-full px-3 py-2 border rounded-md" />
                <input value={requesterEmail} onChange={e => setRequesterEmail(e.target.value)} placeholder="Your email" className="w-full px-3 py-2 border rounded-md" />
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message (optional)" className="w-full px-3 py-2 border rounded-md" />

                <div className="flex gap-2 justify-end mt-2">
                  <button onClick={() => { setShowModal(false); setSelectedSkill(null); }} className="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
                  <button
                    disabled={loading}
                    onClick={async () => {
                      if (!requesterName || !requesterEmail) return alert('Please enter name and email');
                      setLoading(true);
                      try {
                        const res = await fetch('http://localhost:5000/api/requests', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            skillTitle: selectedSkill.title,
                            skillCategory: selectedSkill.category,
                            tutor: selectedSkill.tutor,
                            tutorEmail: selectedSkill.tutorEmail,
                            requesterName,
                            requesterEmail,
                            message,
                          }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setSuccessMsg('Request sent — tutor will be notified.');
                          setRequesterName(''); setRequesterEmail(''); setMessage('');
                        } else {
                          alert(data.error || data.message || 'Failed to send request');
                        }
                      } catch (err) {
                        console.error(err);
                        alert('Network error');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md disabled:opacity-60"
                  >
                    {loading ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
