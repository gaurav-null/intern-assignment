import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await api.post('/api/v1/auth/me');
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/v1/auth/login', { email, password });
    setUser(res.data.user);
  };

  const register = async (name, email, password) => {
    const res = await api.post('/api/v1/auth/register', { name, email, password });
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post('/api/v1/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);