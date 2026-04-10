import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageFade from '../components/PageFade';

export default function HelpPage() {
    return (
        <PageFade>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Help Center & Blog</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to know about SkillSwap, plus tips to make the most of your learning journey.
                        </p>
                    </div>

                    {/* Blog Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-emerald-600">✍️</span> Latest from the Blog
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Blog Post 1 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 card-hover group">
                                <div className="h-48 bg-indigo-50 flex items-center justify-center overflow-hidden">
                                    <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🚀</span>
                                </div>
                                <div className="p-8">
                                    <div className="text-xs font-bold text-indigo-600 mb-2 tracking-wider">PLATFORM UPDATE</div>
                                    <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">Getting Started with SkillSwap</h3>
                                    <p className="text-gray-600 mb-6 line-clamp-3">New to SkillSwap? Learn how to set up your profile, list your first skill, and find the perfect tutor in less than 5 minutes. We cover everything from profile optimization to sending your first request.</p>
                                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                        Read Guide <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Blog Post 2 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 card-hover group">
                                <div className="h-48 bg-emerald-50 flex items-center justify-center overflow-hidden">
                                    <span className="text-6xl group-hover:scale-110 transition-transform duration-500">💡</span>
                                </div>
                                <div className="p-8">
                                    <div className="text-xs font-bold text-emerald-600 mb-2 tracking-wider">TIPS & TRICKS</div>
                                    <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors">How to be a Great Tutor</h3>
                                    <p className="text-gray-600 mb-6 line-clamp-3">Teaching is an art. Discover 5 simple techniques to engage your students and get 5-star reviews every time. From active listening to structuring your lessons effectively.</p>
                                    <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                        Read Article <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                                <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
                            </div>
                            <div className="relative z-10 max-w-3xl">
                                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                                <p className="text-slate-300">Can't find what you're looking for? Reach out to our support team.</p>
                            </div>
                        </div>

                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-lg text-gray-900 mb-2">Is SkillSwap really free?</h4>
                                <p className="text-gray-600 leading-relaxed">Yes! SkillSwap is built on the philosophy of mutual exchange. You teach a skill you know, and in return, you learn something new from others. There are no mandatory fees for skill exchanges.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-900 mb-2">How do I verify a tutor?</h4>
                                <p className="text-gray-600 leading-relaxed">We recommend checking user profiles for reviews and ratings from previous sessions. You can also chat with them beforehand to check compatibility.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-900 mb-2">Can I offer multiple skills?</h4>
                                <p className="text-gray-600 leading-relaxed">Absolutely! You can list as many skills as you are proficient in. The more you offer, the more opportunities you have to match with others.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-900 mb-2">What if I have an issue with a user?</h4>
                                <p className="text-gray-600 leading-relaxed">Safety is our priority. You can report any suspicious or inappropriate behavior directly through the chat or profile page, and our team will investigate immediately.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                            <p className="text-gray-600">Still have questions?</p>
                            <a href="mailto:support@skillswap.com" className="inline-block mt-2 font-bold text-emerald-600 hover:text-emerald-700 hover:underline">Contact Support</a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </PageFade>
    );
}
