import React, { createContext, useEffect, useState } from 'react';
import api from './axiosInterceptor';
import { useLocation } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/user/info');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname !== '/login') {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isLoggedIn');
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};