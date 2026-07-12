import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password });

    if (response.data && response.data.token) {
      const storage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      storage.setItem('user', JSON.stringify(response.data));
      otherStorage.removeItem('user');

      setUser(response.data);
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};