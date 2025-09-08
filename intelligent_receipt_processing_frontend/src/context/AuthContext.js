/* Simple authentication context and provider */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state, login/logout methods. */
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setBootstrapped(true);
      return;
    }
    api.me()
      .then((me) => setUser(me))
      .catch(() => {
        localStorage.removeItem('auth_token');
        setUser(null);
      })
      .finally(() => setBootstrapped(true));
  }, []);

  const login = async (email, password) => {
    const resp = await api.login(email, password);
    if (resp?.token) {
      localStorage.setItem('auth_token', resp.token);
    }
    setUser(resp?.user || { email, name: resp?.user?.name || email });
    return resp;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user]
  );

  if (!bootstrapped) {
    return <div className="container"><div className="card">Loading...</div></div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Returns the auth context value. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
