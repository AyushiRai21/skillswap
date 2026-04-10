import React, { useState } from 'react';

export default function ExploreSkills() {
    const [searchTerm, setSearchTerm] = useState('');
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/skills')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setSkills(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filtered = skills.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-page-fade">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 headline-reveal">Explore Skills</h1>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4 mb-10">
                <div className="relative flex-1">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                        placeholder="Search for skills (e.g., Piano, Spanish, React)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    Filters
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading skills...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No skills found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((skill, idx) => (
                        <div
                            key={skill._id || idx}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-hover animate-float"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-emerald-50 text-emerald-600 uppercase`}>
                                    {skill.category}
                                </span>
                                <span className="text-xs font-medium text-gray-500">{skill.level}</span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{skill.title}</h3>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2">{skill.desc}</p>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                <div className="flex items-center gap-3">
                                    <img src={skill.user?.profileImage || `https://i.pravatar.cc/150?u=${skill.user?._id}`} alt={skill.user?.name} className="w-8 h-8 rounded-full bg-gray-200" />
                                    <span className="text-sm font-medium text-gray-700">{skill.user?.name || 'Unknown User'}</span>
                                </div>
                                <button className="text-emerald-600 font-medium text-sm hover:underline flex items-center gap-1">
                                    Message
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
