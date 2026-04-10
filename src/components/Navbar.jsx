import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token || !user) return;
    
    fetchNotifs();
    
    // Join private socket room
    socket.emit('join_user', user.id);
    
    // Listen for real-time hits
    socket.on('new_notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      // Optional: Play sound or toast
    });

    return () => {
        socket.off('new_notification');
    };
  }, [token, user]);

  async function fetchNotifs() {
    try {
      const res = await fetch('http://localhost:5000/api/notifications', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch (e) { console.error(e); }
  }

  async function markAllRead() {
    try {
      await fetch('http://localhost:5000/api/notifications/read-all', { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) { console.error(e); }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-teal-600 nav-logo flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold">SS</span>
          <span className="hidden sm:inline">SkillSwap</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#about" className="hover:text-teal-600 transition">
            About Us
          </a>
          <a href="#how" className="hover:text-teal-600 transition">
            How It Works
          </a>
          <Link to="/roadmap" className="hover:text-teal-600 transition flex items-center gap-1 font-bold text-blue-600">
            <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded-full">AI</span> Roadmap
          </Link>
          <a href="#contact" className="hover:text-teal-600 transition">
            Contact
          </a>
        </div>

        {/* Right Buttons */}
        <div className="flex gap-4 items-center">
          <Link
            to="/browse"
            className="hidden md:block text-gray-600 hover:text-teal-600 transition btn-glow"
          >
            Browse Skills
          </Link>

          {token ? (
            <div className="flex gap-4 items-center relative">
              <Link to="/dashboard" className="text-gray-700 hover:text-teal-600 hidden md:block">Dashboard</Link>

              {/* Notification Bell */}
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-gray-100 relative">
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50 origin-top-right">
                  <div className="p-3 border-b border-gray-50 bg-gray-50 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notifications</span>
                    {notifications.length > 0 && <button onClick={markAllRead} className="text-xs text-teal-600 hover:underline">Mark all read</button>}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition ${!n.read ? 'bg-teal-50/30' : ''}`}>
                          <p className="text-sm text-gray-800">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm overflow-hidden">
                    {user && user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-400">View Profile</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform origin-top-right z-50">
                  <div className="px-4 py-2 border-b border-gray-50 mb-2">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Account</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg">My Profile</Link>
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg md:hidden">Dashboard</Link>
                  <Link to="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg">Help Center</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-1">Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-teal-600 text-white px-5 py-2 rounded-xl hover:bg-teal-700 transition btn-glow shimmer-cta"
            >
              Log In / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
