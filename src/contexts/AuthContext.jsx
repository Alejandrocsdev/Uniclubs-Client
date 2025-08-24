import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, axiosPrivate } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState('/booking');

  const fetchUserData = async () => {
    try {
      console.log('Fetching user data...');
      await api(axiosPrivate.get('/api/auth/me'), {
        onSuccess: (data) => {
          console.log('Auth data received:', data);
          // Extract user data from the response
          if (data && data.user) {
            console.log('Setting user:', data.user);
            setUser(data.user);
          } else {
            console.log('No valid user data found in response:', data);
            setUser(null);
          }
        },
        onError: (error) => {
          console.error('Failed to fetch user data:', error);
          setUser(null);
        },
        onFinally: () => {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(null);
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Optionally call sign out API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
    }
  };

  // Set redirect path for after sign in
  const setLoginRedirect = (path) => {
    setRedirectPath(path);
  };

  // Get and clear redirect path
  const getAndClearRedirect = () => {
    const path = redirectPath;
    setRedirectPath('/booking'); // Reset to default
    return path;
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    refetchUser: fetchUserData,
    setLoginRedirect,
    getAndClearRedirect,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 