import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Login from './components/Login'
import Signup from './components/Signup'
import BrowseSkills from './components/BrowseSkills'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
import './index.css'

const router = createBrowserRouter(
  [
    { path: '/', element: <App /> },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '/browse', element: <BrowseSkills /> },
    { path: '/profile', element: <Profile /> },
    { path: '/dashboard', element: <Dashboard /> },
  ],
  { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
