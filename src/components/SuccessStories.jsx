import React from 'react';
import Reveal from './Reveal';

export default function SuccessStories() {
    const stories = [
        {
            name: "Alex Johnson",
            role: "Freelance Designer",
            quote: "I learned Python from a data scientist in exchange for teaching them UI/UX design. It was the best learning experience of my life!",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Sarah Lee",
            role: "Marketing Specialist",
            quote: "SkillSwap helped me master Spanish conversation by connecting me with a native speaker who wanted to learn digital marketing.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "David Chen",
            role: "Software Engineer",
            quote: "Found a guitar tutor who needed help with their website. We swapped skills and now I can play my favorite songs!",
            image: "https://randomuser.me/api/portraits/men/85.jpg"
        }
    ];

    return (
        <section id="stories" className="py-20 bg-emerald-50">
            <div className="max-w-6xl mx-auto px-6">
                <Reveal>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Real people, real skills, real connections. See how our community is growing together.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stories.map((story, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition card-hover relative">
                                <div className="absolute top-6 right-8 text-6xl text-emerald-100 font-serif">"</div>
                                <div className="flex items-center gap-4 mb-6">
                                    <img src={story.image} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{story.name}</h4>
                                        <p className="text-sm text-emerald-600">{story.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed relative z-10">{story.quote}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
