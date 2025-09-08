import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Simple login form page. */
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate('/upload');
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card card">
      <div className="card-title">Login</div>
      {error && <div className="btn danger mb-16" role="alert">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="mb-16">
          <label className="label">Email</label>
          <input className="input" type="email" value={email} required onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-16">
          <label className="label">Password</label>
          <input className="input" type="password" value={password} required onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
