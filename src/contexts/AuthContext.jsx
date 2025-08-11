import React, { createContext, useContext, useState, useEffect } from 'react';

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
      console.log('Current cookies:', document.cookie);
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Auth response:', response);

      if (response.ok) {
        const data = await response.json();
        console.log('Auth data received:', data);
        
        // Handle different possible response structures
        let userData = null;
        if (data && data.user) {
          userData = data.user;
        } else if (data && data.id) {
          // In case the response directly contains user data
          userData = data;
        } else if (data && typeof data === 'object') {
          // Log the structure to understand the format
          console.log('Unexpected data structure:', Object.keys(data));
        }
        
        if (userData) {
          console.log('Setting user:', userData);
          setUser(userData);
        } else {
          console.log('No valid user data found in response:', data);
          setUser(null);
        }
      } else {
        console.log('Auth response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(null);
    } finally {
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

  // Development mock sign in function
  const mockLogin = () => {
    const mockUser = {
      id: 2,
      username: "user",
      email: "user@gmail.com",
      roles: ["user"]
    };
    setUser(mockUser);
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

  // Test function for debugging
  const testApiCall = async () => {
    console.log('Testing API call...');
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Test response:', response);
      const data = await response.json();
      console.log('Test data:', data);
      return data;
    } catch (error) {
      console.error('Test API call failed:', error);
      return null;
    }
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
    mockLogin, // Only for development testing
    setLoginRedirect,
    getAndClearRedirect,
    testApiCall, // For debugging
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 