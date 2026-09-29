import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../config/api';

export const AuthContext = createContext(null);

const getLocalStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    return null;
  }
  return null;
};

const getSessionStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) return window.sessionStorage;
    if (typeof sessionStorage !== 'undefined') return sessionStorage;
  } catch {
    return null;
  }
  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt profile restoration if active session flag exists in localStorage or sessionStorage
    const local = getLocalStorage();
    const session = getSessionStorage();
    let hasSession = false;
    try {
      hasSession = (local?.getItem('has_session') === 'true') ||
                   (session?.getItem('has_session') === 'true');
    } catch {
      hasSession = false;
    }

    if (hasSession) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    const local = getLocalStorage();
    const session = getSessionStorage();
    try {
      const response = await apiFetch('/api/auth/profile');

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        try {
          if (session?.getItem('has_session') === 'true') {
            session?.setItem('has_session', 'true');
          } else {
            local?.setItem('has_session', 'true');
          }
        } catch {
          // Storage quota / access catch
        }
      } else if (response.status === 401) {
        // Token expired: attempt refresh
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          try {
            local?.removeItem('has_session');
            local?.removeItem('access_token');
            session?.removeItem('has_session');
            session?.removeItem('access_token');
          } catch {
            // Ignore storage clear error
          }
          setUser(null);
        }
      } else {
        try {
          local?.removeItem('has_session');
          local?.removeItem('access_token');
          session?.removeItem('has_session');
          session?.removeItem('access_token');
        } catch {
          // Ignore storage clear error
        }
        setUser(null);
      }
    } catch (error) {
      // Network or connection failure
      try {
        local?.removeItem('has_session');
        session?.removeItem('has_session');
      } catch {
        // Ignore storage clear error
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = useCallback(async () => {
    const local = getLocalStorage();
    const session = getSessionStorage();
    try {
      let token = null;
      try {
        token = local?.getItem('access_token') || session?.getItem('access_token');
      } catch {
        token = null;
      }

      const response = await apiFetch('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: token || undefined })
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.access_token) {
          try {
            if (session?.getItem('has_session') === 'true') {
              session?.setItem('access_token', data.access_token);
            } else {
              local?.setItem('access_token', data.access_token);
            }
          } catch {
            // Ignore storage write error
          }
        }
        const profileRes = await apiFetch('/api/auth/profile');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData.user);
          try {
            if (session?.getItem('has_session') === 'true') {
              session?.setItem('has_session', 'true');
            } else {
              local?.setItem('has_session', 'true');
            }
          } catch {
            // Ignore storage write error
          }
          return true;
        }
      }
    } catch (error) {
      // Refresh failed
    }
    return false;
  }, []);

  const login = async (email, password, rememberDevice = true) => {
    const local = getLocalStorage();
    const session = getSessionStorage();
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, remember_me: rememberDevice })
    });

    if (response.ok) {
      const data = await response.json();
      try {
        if (rememberDevice) {
          local?.setItem('has_session', 'true');
          if (data.access_token) {
            local?.setItem('access_token', data.access_token);
          }
          session?.removeItem('has_session');
          session?.removeItem('access_token');
        } else {
          session?.setItem('has_session', 'true');
          if (data.access_token) {
            session?.setItem('access_token', data.access_token);
          }
          local?.removeItem('has_session');
          local?.removeItem('access_token');
        }
      } catch {
        // Fallback if storage access is restricted
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
    const local = getLocalStorage();
    const response = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      const data = await response.json();
      try {
        local?.setItem('has_session', 'true');
        if (data.access_token) {
          local?.setItem('access_token', data.access_token);
        }
      } catch {
        // Fallback
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
    const local = getLocalStorage();
    const session = getSessionStorage();
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      // Cookies will still be cleared locally
    }

    try {
      local?.removeItem('has_session');
      local?.removeItem('access_token');
      session?.removeItem('has_session');
      session?.removeItem('access_token');
    } catch {
      // Ignore storage clear error
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
