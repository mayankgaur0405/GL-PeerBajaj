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
    try {
      const res = await api.post('/auth/login', { emailOrUsername, password }, { withCredentials: true });
      setUser(res.data.user);
      return res;
    } catch (error) {
      // Re-throw the error to be handled by the component
      throw error;
    }
  };

  const signup = async (payload) => {
    try {
      // Backwards compatibility: keep old endpoint if provided with full payload
      if (payload?.name && payload?.username && payload?.password) {
        const res = await api.post('/auth/register', payload, { withCredentials: true });
        setUser(res.data.user);
        return res;
      }
      return Promise.reject(new Error('Use OTP signup flow.'));
    } catch (error) {
      // Re-throw the error to be handled by the component
      throw error;
    }
  };

  // OTP-based signup flow
  const startSignup = async (email) => {
    const res = await api.post('/auth/signup/start', { email }, { withCredentials: true });
    return res.data;
  };

  const verifySignupOtp = async ({ email, otp }) => {
    const res = await api.post('/auth/signup/verify', { email, otp }, { withCredentials: true });
    return res.data; // { completeToken }
  };

  const completeSignup = async ({ completeToken, name, username, password }) => {
    const res = await api.post('/auth/signup/complete', { completeToken, name, username, password }, { withCredentials: true });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser, startSignup, verifySignupOtp, completeSignup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
