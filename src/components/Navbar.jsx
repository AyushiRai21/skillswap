import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null
  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
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
            <div className="flex gap-2 items-center">
              {user && <div className="text-sm text-gray-700 mr-2 hidden md:block">Hi, {user.name || user.email}</div>}
              <Link to="/dashboard" className="text-gray-700 hover:text-teal-600 hidden md:block">Dashboard</Link>
              <button onClick={() => navigate('/profile')} className="px-3 py-2 border rounded-md flex items-center gap-2 pulse-border">
                <img src={user && user.avatar ? user.avatar : 'https://via.placeholder.com/80'} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                <span className="hidden md:inline">Profile</span>
              </button>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md shimmer-cta">Logout</button>
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
