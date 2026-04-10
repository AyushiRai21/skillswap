import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageFade from '../components/PageFade';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <PageFade className="min-h-screen mesh-gradient-premium py-24 px-4 flex items-center justify-center relative overflow-hidden">
             {/* Background Glows */}
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-200/30 blur-[120px] rounded-full animate-float-slow" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full animate-float-slow" style={{ animationDelay: '2s' }} />

             <div className="glass rounded-[50px] p-12 lg:p-20 shadow-2xl border-white/60 text-center max-w-4xl relative z-10 mx-4">
                 <div className="text-sm font-black text-teal-600 uppercase tracking-[1em] mb-8 animate-pulse">Protected Access</div>
                 
                 <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase leading-none">
                    Unlock <span className="text-teal-600 block text-3xl not-italic tracking-normal mt-2 lowercase">the SkillSwap Experience</span>
                 </h1>

                 <p className="mt-8 text-slate-500 font-bold max-w-lg mx-auto text-lg leading-relaxed italic mb-12">
                     "You've reached a secure area of the neural network. Sign in or initialize your ID to start swapping expertise."
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-slate-900 rounded-[40px] shadow-2xl group hover:scale-105 transition-all text-left">
                        <div className="text-teal-400 text-3xl mb-4">🔑</div>
                        <h3 className="text-xl font-black text-white italic mb-2">Existing Swapper</h3>
                        <p className="text-slate-400 text-sm mb-8 font-medium">Sync your neural id and rejoin the network.</p>
                        <Link to="/login" className="block w-full py-4 bg-teal-600 text-white text-center rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-500 transition-colors shadow-lg glow-teal">Login Now</Link>
                    </div>

                    <div className="p-8 bg-white/60 border-2 border-white rounded-[40px] group hover:scale-105 transition-all text-left">
                        <div className="text-slate-900 text-3xl mb-4">✨</div>
                        <h3 className="text-xl font-black text-slate-800 italic mb-2">New Recruit</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">Initialize your profile and start swapping value today.</p>
                        <Link to="/signup" className="block w-full py-4 bg-slate-900 text-white text-center rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-600 transition-colors shadow-lg">Initialize Account</Link>
                    </div>
                 </div>

                 <div className="mt-12 text-center">
                    <button 
                        onClick={() => navigate('/')} 
                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors"
                    >
                        ← Abort and Return Home
                    </button>
                 </div>
             </div>
        </PageFade>
    );
}
