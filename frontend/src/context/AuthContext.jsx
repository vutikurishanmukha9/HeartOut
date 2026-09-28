import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../config/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only attempt profile restoration if an active session flag exists
    const hasSession = localStorage.getItem('has_session') === 'true';
    if (hasSession) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiFetch('/api/auth/profile');

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('has_session', 'true');
      } else if (response.status === 401) {
        // Token expired: attempt refresh
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          localStorage.removeItem('has_session');
          localStorage.removeItem('access_token');
          setUser(null);
        }
      } else {
        localStorage.removeItem('has_session');
        localStorage.removeItem('access_token');
        setUser(null);
      }
    } catch (error) {
      // Network or connection failure
      localStorage.removeItem('has_session');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await apiFetch('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: token || undefined })
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }
        const profileRes = await apiFetch('/api/auth/profile');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData.user);
          localStorage.setItem('has_session', 'true');
          return true;
        }
      }
    } catch (error) {
      // Refresh failed
    }
    return false;
  }, []);

  const login = async (email, password) => {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('has_session', 'true');
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      setUser(data.user);
      return { success: true };
    } else {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = errorData.error || errorData.detail;
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.map(e => e.msg || e.detail || JSON.stringify(e)).join(', ');
      }
      return { success: false, error: errorMessage || 'Login failed' };
    }
  };

  const register = async (userData) => {
    const response = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('has_session', 'true');
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      setUser(data.user);
      return { success: true };
    } else {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = errorData.error || errorData.detail;
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.map(e => e.msg || e.detail || JSON.stringify(e)).join(', ');
      }
      return { success: false, error: errorMessage || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      // Cookies will still be cleared locally
    }

    localStorage.removeItem('has_session');
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return false;
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setUser(data.user);
        return { success: true, user: data.user, message: data.message };
      } else {
        let errorMsg = data.error || data.detail;
        if (Array.isArray(errorMsg)) {
          errorMsg = errorMsg.map(e => e.msg || e.detail || JSON.stringify(e)).join(', ');
        } else if (typeof errorMsg === 'object' && errorMsg !== null) {
          errorMsg = errorMsg.error || errorMsg.message || JSON.stringify(errorMsg);
        }
        return { success: false, error: errorMsg || 'Failed to update profile' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Could not update profile.' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
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
