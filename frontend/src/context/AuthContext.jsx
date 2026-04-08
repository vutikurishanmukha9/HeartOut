import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../config/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No token check — cookies are sent automatically.
    // Just attempt to fetch the profile. If there's a valid cookie, it works.
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(getApiUrl('/api/auth/profile'), {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
        // Token expired — try to refresh via cookie
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl('/api/auth/refresh'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // New access_token cookie is set by the server automatically
        await fetchProfile();
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
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      // Cookies are set by the server — just store user in React state
      setUser(data.user);
      return { success: true };
    } else {
      const errorData = await response.json();
      let errorMessage = errorData.error || errorData.detail;
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.map(e => e.msg).join(', ');
      }
      return { success: false, error: errorMessage || 'Login failed' };
    }
  };

  const register = async (userData) => {
    const response = await fetch(getApiUrl('/api/auth/register'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      const data = await response.json();
      // Cookies are set by the server — just store user in React state
      setUser(data.user);
      return { success: true };
    } else {
      const errorData = await response.json();
      let errorMessage = errorData.error || errorData.detail;
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.map(e => e.msg).join(', ');
      }
      return { success: false, error: errorMessage || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch(getApiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      // Silently fail — cookies will be cleared by the server
    }

    setUser(null);
  };

  const isAuthenticated = !!user;

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return false;
  };

  const updateProfile = async (profileData) => {
    const response = await fetch(getApiUrl('/api/auth/profile'), {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Update failed' };
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
