import React from 'react';

export default function FAQ({ isOpen, onClose }) {
    if (!isOpen) return null;

    const faqs = [
        { q: "Is SkillSwap really free?", a: "Yes! SkillSwap is built on the principle of direct exchange. No money changes hands between users." },
        { q: "How do I trust my partner?", a: "We verify profiles and encourage reviews. We also recommend having an initial chat to see if you're a good match." },
        { q: "Can I offer multiple skills?", a: "Absolutely! You can list as many skills as you can teach." },
        { q: "What if I don't find a match?", a: "Our community is growing every day. You can also post a request for a specific skill you want to learn." },
        { q: "Is there a limit on sessions?", a: "No limits. You and your partner decide the schedule that works best for you." },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 animate-fade-in">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    <p className="mt-2 text-gray-600">Everything you need to know about SkillSwap.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-4">Still have questions?</p>
                    <a href="mailto:hello@skillswap.com" className="inline-block px-6 py-2 border border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50 transition" onClick={onClose}>Contact Support</a>
                </div>
            </div>
        </div>
    );
}
