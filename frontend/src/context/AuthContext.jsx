import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../config/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const response = await fetch(getApiUrl('/api/auth/profile'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
        // Token expired - try to refresh
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(getApiUrl('/api/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        // Fetch profile with new token
        await fetchProfile(data.access_token);
        return true;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
    return false;
  }, []);

  const login = async (email, password) => {
    const response = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      // Store refresh token for session persistence
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      setUser(data.user);
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.error || error.detail };
    }
  };

  const register = async (userData) => {
    const response = await fetch(getApiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      // Store refresh token for session persistence
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      setUser(data.user);
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.error || error.detail };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('access_token');

    // Call backend to invalidate token (fire and forget)
    if (token) {
      try {
        await fetch(getApiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        // Silently fail - we'll clear local storage anyway
      }
    }

    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const isAuthenticated = !!user && !!localStorage.getItem('access_token');

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return false;
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(getApiUrl('/api/auth/profile'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.error || error.detail };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
      hasPermission,
      updateProfile,
      refreshAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}
