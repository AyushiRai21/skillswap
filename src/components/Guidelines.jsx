import React from 'react';

export default function Guidelines({ isOpen, onClose }) {
    if (!isOpen) return null;

    const rules = [
        { title: "Respect Time", desc: "Be punctual for your sessions. If you can't make it, notify your partner in advance.", icon: "⏰" },
        { title: "Be Patient", desc: "Everyone learns at their own pace. Be supportive and encouraging.", icon: "🌱" },
        { title: "Safety First", desc: "Keep conversations on the platform. Don't share sensitive personal or financial info.", icon: "🛡️" },
        { title: "Fair Exchange", desc: "Ensure both parties get equal value. Teaching 1 hour should match learning 1 hour.", icon: "⚖️" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 animate-fade-in">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">Community Guidelines</h2>
                    <p className="mt-2 text-gray-600">Simple rules to keep SkillSwap safe and fun.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-3xl">{rule.icon}</div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{rule.title}</h3>
                                <p className="text-gray-600 text-sm">{rule.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button onClick={onClose} className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition shadow-md">Got it, I agree!</button>
                </div>
            </div>
        </div>
    );
}
