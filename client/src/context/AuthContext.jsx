import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get('/auth/me', { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        // If unauthorized, clear user
        if (err.response?.status === 401) setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (emailOrUsername, password) => {
    const res = await api.post('/auth/login', { emailOrUsername, password }, { withCredentials: true });
    setUser(res.data.user);
    return res;
  };

  const signup = async (payload) => {
    const res = await api.post('/auth/register', payload, { withCredentials: true });
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
