import React, { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import UploadPage from './pages/UploadPage';
import DocumentsPage from './pages/DocumentsPage';
import SearchPage from './pages/SearchPage';
import VersionsPage from './pages/VersionsPage';
import JobsPage from './pages/JobsPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import { ThemeToggle } from './components/ThemeToggle';

// PUBLIC_INTERFACE
function AppShell() {
  /** AppShell renders top navigation and route outlet with auth-gated routes. */
  const { isAuthenticated, logout, user } = useAuth();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <div className="logo" />
            <span>Intelligent Receipt Processing</span>
          </div>
          <div className="nav-links">
            <NavLink className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} to="/upload">Upload</NavLink>
            <NavLink className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} to="/documents">Documents</NavLink>
            <NavLink className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} to="/search">Search</NavLink>
            <NavLink className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} to="/versions">Versions</NavLink>
            <NavLink className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} to="/jobs">Jobs</NavLink>
            <NavLink className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} to="/admin">Admin</NavLink>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
            {isAuthenticated ? (
              <>
                <span className="nav-link" title={user?.email || ''}>Hi, {user?.name || 'User'}</span>
                <button className="btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <NavLink className="btn" to="/login">Login</NavLink>
            )}
          </div>
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<RequireAuth><UploadPage /></RequireAuth>} />
          <Route path="/documents" element={<RequireAuth><DocumentsPage /></RequireAuth>} />
          <Route path="/search" element={<RequireAuth><SearchPage /></RequireAuth>} />
          <Route path="/versions" element={<RequireAuth><VersionsPage /></RequireAuth>} />
          <Route path="/jobs" element={<RequireAuth><JobsPage /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function RequireAuth({ children }) {
  /** Protects a route, redirecting to login if unauthenticated. */
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// PUBLIC_INTERFACE
function App() {
  /** Top-level app with providers and BrowserRouter. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
