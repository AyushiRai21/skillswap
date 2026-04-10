import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Editor from '@monaco-editor/react';
import PageFade from '../components/PageFade';

const socket = io('http://localhost:5000');

export default function Workspace() {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [scratchpad, setScratchpad] = useState('');
    const chatEndRef = useRef(null);
    const [language, setLanguage] = useState('javascript');
    const [aiExplaining, setAiExplaining] = useState(false);
    const [aiExplanations, setAiExplanations] = useState([]);

    useEffect(() => {
        if (!requestId) return;
        
        socket.emit('join_room', requestId);

        socket.on('receive_message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on('receive_scratchpad', (content) => {
            setScratchpad(content);
        });

        socket.on('receive_language', (lang) => {
            setLanguage(lang);
        });

        return () => {
            socket.off('receive_message');
            socket.off('receive_scratchpad');
            socket.off('receive_language');
        }
    }, [requestId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        const msg = { roomId: requestId, sender: user.name || 'Anonymous', text: input.trim() };
        socket.emit('send_message', msg);
        setInput('');
    };

    const handleScratchpad = (val) => {
        setScratchpad(val);
        socket.emit('update_scratchpad', { roomId: requestId, content: val });
    };

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setLanguage(lang);
        socket.emit('update_language', { roomId: requestId, lang });
    };

    const explainCode = async () => {
        if (!scratchpad.trim()) return;
        setAiExplaining(true);
        // Simulated AI Insight
        setTimeout(() => {
            const explanation = {
                title: "Neural Analysis Complete",
                text: `Analyzing ${language} patterns... I found that your implementation of ${scratchpad.slice(0, 15)}... follows the Optimized Exchange Pattern. Recommendation: Scale the modular structure for efficiency.`,
                time: new Date().toLocaleTimeString()
            };
            setAiExplanations((prev) => [explanation, ...prev]);
            setAiExplaining(false);
        }, 1500);
    };

    return (
        <PageFade className="h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="p-4 px-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/dashboard')} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group active:scale-95 shadow-xl border border-white/10">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </button>
                    <div>
                        <h2 className="font-black text-xl tracking-tighter uppercase italic text-teal-400">Live <span className="text-white">Workspace</span></h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Neural Link ID: {requestId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                     <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-teal-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition shadow-lg glow-teal animate-pulse active:scale-95">
                        Explore Swappers
                     </button>
                     <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">LIVE</span>
                     </div>
                </div>
            </div>

            {/* Main Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Chat Column */}
                <div className="w-80 border-r border-gray-800 flex flex-col bg-gray-900/20">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex flex-col ${m.sender === user.name ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] text-gray-500 mb-1">{m.sender}</span>
                                <div className={`px-3 py-2 rounded-2xl text-sm max-w-[90%] ${m.sender === user.name ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-100 rounded-tl-none'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 p-4 mt-auto border-t border-gray-800 flex gap-2">
                        <input 
                            value={input} 
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            autoFocus
                            placeholder="Type message..." 
                            className="flex-1 bg-gray-800 border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 ring-teal-500" 
                        />
                        <button onClick={sendMessage} className="p-2 bg-teal-600 rounded-lg hover:bg-teal-700 transition">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>

                {/* Monaco Editor Column */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/40">
                        <div className="flex gap-4">
                            <select 
                                value={language} 
                                onChange={handleLanguageChange}
                                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest text-teal-400 outline-none"
                            >
                                <option value="javascript">Javascript</option>
                                <option value="python">Python</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="json">JSON</option>
                            </select>
                            <button 
                                onClick={explainCode}
                                disabled={aiExplaining}
                                className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all shadow-lg glow-teal disabled:opacity-30"
                            >
                                {aiExplaining ? 'Processing...' : 'AI Explain'}
                            </button>
                        </div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest italic group">Neural Live Editor v2.0 <span className="text-teal-500 animate-pulse">●</span></p>
                    </div>
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language={language}
                            theme="vs-dark"
                            value={scratchpad}
                            onChange={handleScratchpad}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontStyle: 'italic',
                                fontFamily: 'monospace',
                                smoothScrolling: true,
                                padding: { top: 20 }
                            }}
                        />
                    </div>
                    
                    {/* Floating AI Panel */}
                    {aiExplanations.length > 0 && (
                        <div className="absolute bottom-10 right-10 w-80 max-h-64 overflow-y-auto glass p-6 border-teal-500/20 text-xs animate-fade-in-up z-50">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-black uppercase tracking-widest text-teal-500 italic">Neural Assistant</h4>
                                <button onClick={() => setAiExplanations([])} className="text-gray-500">×</button>
                            </div>
                            <div className="space-y-4">
                                {aiExplanations.map((exp, i) => (
                                    <div key={i} className="pb-4 border-b border-white/5 last:border-b-0">
                                        <div className="font-black mb-1">{exp.title}</div>
                                        <div className="text-gray-400 leading-relaxed italic">{exp.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageFade>
    );
}
