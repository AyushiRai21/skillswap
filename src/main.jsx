import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import Login from './components/Login'
import Signup from './components/Signup'
import BrowseSkills from './components/BrowseSkills'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
import HelpPage from './pages/HelpPage'
import Roadmap from './pages/Roadmap'
import Workspace from './pages/Workspace'
import NotFound from './pages/NotFound'
import GlobalError from './components/GlobalError'
import './index.css'

// TODO: Replace with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Outlet />,
      errorElement: <GlobalError />,
      children: [
        { index: true, element: <App /> },
        { path: 'login', element: <Login /> },
        { path: 'signup', element: <Signup /> },
        { path: 'browse', element: <BrowseSkills /> },
        { path: 'profile', element: <Profile /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'roadmap', element: <Roadmap /> },
        { path: 'workspace/:requestId', element: <Workspace /> },
        { path: 'help', element: <HelpPage /> },
        { path: '*', element: <NotFound /> },
      ]
    }
  ],
  { 
    future: { 
      v7_startTransition: true, 
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true
    } 
  }
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
