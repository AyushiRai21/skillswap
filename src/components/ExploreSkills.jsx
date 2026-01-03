import React, { useState } from 'react';

export default function ExploreSkills() {
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data simulating a "database" of skills
    const skills = [
        {
            id: 1,
            category: 'LANGUAGE',
            level: 'Expert',
            title: 'Spanish Language Tutoring',
            desc: 'Native Spanish speaker offering conversational practice and grammar lessons.',
            wants: 'Web Development',
            user: 'Maria Garcia',
            img: 'https://i.pravatar.cc/150?u=1',
            color: 'bg-emerald-50 text-emerald-600'
        },
        {
            id: 2,
            category: 'PROGRAMMING',
            level: 'Expert',
            title: 'React Development',
            desc: 'Senior frontend developer offering mentorship in React, Redux, and modern JS.',
            wants: 'Spanish',
            user: 'James Wilson',
            img: 'https://i.pravatar.cc/150?u=2',
            color: 'bg-indigo-50 text-indigo-600'
        },
        {
            id: 3,
            category: 'BUSINESS',
            level: 'Intermediate',
            title: 'Digital Marketing Strategy',
            desc: 'Help with SEO, social media marketing, and content strategy.',
            wants: 'Graphic Design',
            user: 'Sarah Chen',
            img: 'https://i.pravatar.cc/150?u=3',
            color: 'bg-orange-50 text-orange-600'
        },
        {
            id: 4,
            category: 'MUSIC',
            level: 'Expert',
            title: 'Piano Lessons',
            desc: 'Classical piano lessons for beginners to intermediate players.',
            wants: 'Accounting',
            user: 'David Kim',
            img: 'https://i.pravatar.cc/150?u=4',
            color: 'bg-rose-50 text-rose-600'
        },
        {
            id: 5,
            category: 'DESIGN',
            level: 'Advanced',
            title: 'UI/UX Design Review',
            desc: 'I will critique your designs and help you improve accessibility and flow.',
            wants: 'Python',
            user: 'Emily Davis',
            img: 'https://i.pravatar.cc/150?u=5',
            color: 'bg-purple-50 text-purple-600'
        },
        {
            id: 6,
            category: 'FITNESS',
            level: 'Trainer',
            title: 'Yoga & Meditation',
            desc: 'Guided sessions to reduce stress and improve flexibility.',
            wants: 'Video Editing',
            user: 'Michael Brown',
            img: 'https://i.pravatar.cc/150?u=6',
            color: 'bg-teal-50 text-teal-600'
        }
    ];

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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((skill, idx) => (
                    <div
                        key={skill.id}
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-hover animate-float"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${skill.color}`}>
                                {skill.category}
                            </span>
                            <span className="text-xs font-medium text-gray-500">{skill.level}</span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{skill.title}</h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2">{skill.desc}</p>

                        {/* "Wants to learn" section */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Wants to learn:</div>
                                <div className="text-sm font-semibold text-gray-900 truncate">{skill.wants}</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                            <div className="flex items-center gap-3">
                                <img src={skill.img} alt={skill.user} className="w-8 h-8 rounded-full bg-gray-200" />
                                <span className="text-sm font-medium text-gray-700">{skill.user}</span>
                            </div>
                            <button className="text-emerald-600 font-medium text-sm hover:underline flex items-center gap-1">
                                Message
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
