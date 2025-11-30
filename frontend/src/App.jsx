import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import AuthRoutes from './routes/AuthRoutes';
import FeedRoutes from './routes/FeedRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProfileRoutes from './routes/ProfileRoutes';
import Navbar from './components/Navbar';

function App() {
  const auth = useContext(AuthContext);
  const theme = useContext(ThemeContext);
  const location = useLocation();

  // Safety check
  if (!auth || !theme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Error: Context not available</p>
        </div>
      </div>
    );
  }

  const { user, loading, isAuthenticated } = auth;

  // Apply theme class to document
  useEffect(() => {
    if (theme.theme === 'dark' || theme.effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.theme, theme.effectiveTheme]);

  // Show loading screen during initial load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading HeartOut...</p>
        </div>
      </div>
    );
  }

  const isAuthPage = location.pathname.startsWith('/auth');
  const showNavbar = isAuthenticated && !isAuthPage;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {showNavbar && <Navbar />}

      <main className={`${showNavbar ? 'pt-16' : ''} transition-all duration-200`}>
        <Routes>
          {/* Public routes */}
          <Route path="/auth/*" element={<AuthRoutes />} />

          {/* Redirect legacy auth routes */}
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />

          {/* Protected routes */}
          {isAuthenticated ? (
            <>
              <Route path="/feed/*" element={<FeedRoutes />} />
              <Route path="/profile/*" element={<ProfileRoutes />} />
              {user?.role === 'admin' && (
                <Route path="/admin/*" element={<AdminRoutes />} />
              )}

              {/* Default redirect for authenticated users */}
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </>
          ) : (
            <>
              {/* Redirect to auth for unauthenticated users */}
              <Route path="/" element={<Navigate to="/auth/login" replace />} />
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;