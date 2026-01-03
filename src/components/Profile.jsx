import React, { useEffect, useState } from 'react';
import PageFade from './PageFade';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchMe() {
      if (!token) return setLoading(false);
      try {
        const res = await fetch('http://localhost:5000/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          setName(data.user.name || '');
          setBio(data.user.bio || '');
          setProfileImage(data.user.profileImage || '');
        }
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    }
    fetchMe();
  }, [token]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!token) return alert('Not authenticated');
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, bio, profileImage }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        alert('Profile updated');
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally { setSaving(false); }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return (
    <div className="p-8">Not logged in. <a href="/login" className="text-teal-600">Sign in</a></div>
  );

  return (
    <PageFade className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-2 headline-reveal">Profile Settings</h2>
        <p className="text-sm text-gray-600 mb-4">Logged in as {user.email}</p>

        <div className="flex gap-6">
          <div>
            <div className="w-36 h-36 rounded-full bg-gray-100 overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleFile} className="mt-3" />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md mb-3 input-glow" />

            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full px-3 py-2 border rounded-md mb-3 input-glow" />

            <div className="flex gap-3">
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-teal-600 text-white rounded-md">{saving ? 'Saving...' : 'Save'}</button>
              <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/'; }} className="px-4 py-2 border rounded-md">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </PageFade>
  );
}
