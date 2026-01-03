import React, { useState, useEffect, useRef } from 'react';

export default function Chat({ user }) {
    const [conversations, setConversations] = useState({});
    const [activePartnerId, setActivePartnerId] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 5000); // Polling every 5s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversations, activePartnerId]);

    async function loadMessages() {
        try {
            const res = await fetch('http://localhost:5000/api/messages', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();

            // Group by partner
            const groups = {};
            data.forEach(msg => {
                const partner = msg.sender._id === user._id ? msg.recipient : msg.sender;
                const pid = partner._id;
                if (!groups[pid]) {
                    groups[pid] = { partner, msgs: [] };
                }
                groups[pid].msgs.push(msg);
            });
            setConversations(groups);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    }

    async function sendMessage(e) {
        e.preventDefault();
        if (!messageText.trim() || !activePartnerId) return;

        try {
            const res = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ recipientId: activePartnerId, content: messageText })
            });
            if (res.ok) {
                setMessageText('');
                loadMessages(); // Refresh immediately
            }
        } catch (err) {
            console.error(err);
        }
    }

    const activeThread = activePartnerId ? conversations[activePartnerId] : null;
    const partnerIds = Object.keys(conversations);

    if (loading && partnerIds.length === 0) return <div className="p-8 text-center text-gray-500">Loading chats...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex h-[600px] animate-page-fade">
            {/* Sidebar: List of people */}
            <div className="w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-bold text-gray-700">Messages</h2>
                </div>
                <div className="overflow-y-auto flex-1">
                    {partnerIds.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center mt-10">No messages yet.</div>
                    ) : (
                        partnerIds.map(pid => {
                            const group = conversations[pid];
                            const lastMsg = group.msgs[group.msgs.length - 1];
                            return (
                                <div
                                    key={pid}
                                    onClick={() => setActivePartnerId(pid)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-white transition ${activePartnerId === pid ? 'bg-white border-l-4 border-l-emerald-500' : ''}`}
                                >
                                    <div className="font-semibold text-gray-800">{group.partner.name}</div>
                                    <div className="text-xs text-gray-500 truncate mt-1">{lastMsg.content}</div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {activeThread ? (
                    <>
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                            <h3 className="font-bold text-gray-800">{activeThread.partner.name}</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" ref={scrollRef}>
                            {activeThread.msgs.map((msg, idx) => {
                                const isMe = msg.sender._id === user._id;
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
                            <input
                                value={messageText}
                                onChange={e => setMessageText(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-emerald-500 transition"
                            />
                            <button type="submit" className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 hover:scale-105 transition shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
