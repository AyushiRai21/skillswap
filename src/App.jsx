import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import AuthSlider from './components/AuthSlider';
import Dashboard from './components/Dashboard';
import Login from "./components/Login";
import Signup from "./components/Signup";
import BrowseSkills from './components/BrowseSkills';
import Profile from './components/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/browse" element={<BrowseSkills />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
