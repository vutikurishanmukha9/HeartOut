import React, { useContext, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import SupportFloatingButton from './components/SupportFloatingButton';
import ErrorBoundary, { RouteErrorBoundary } from './components/ErrorBoundary';

// Lazy load routes for better performance
const AuthRoutes = lazy(() => import('./routes/AuthRoutes'));
const FeedRoutes = lazy(() => import('./routes/FeedRoutes'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
const ProfileRoutes = lazy(() => import('./routes/ProfileRoutes'));
const Support = lazy(() => import('./pages/Support'));

// Loading component for Suspense fallback
function RouteLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

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
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {showNavbar && <Navbar />}

        <main className={`${showNavbar ? 'pt-16' : ''} transition-all duration-200`}>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/auth/*" element={
                <RouteErrorBoundary routeName="authentication">
                  <AuthRoutes />
                </RouteErrorBoundary>
              } />
              <Route path="/support" element={
                <RouteErrorBoundary routeName="support">
                  <Support />
                </RouteErrorBoundary>
              } />

              {/* Redirect legacy auth routes */}
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/register" element={<Navigate to="/auth/register" replace />} />

              {/* Protected routes */}
              {isAuthenticated ? (
                <>
                  <Route path="/feed/*" element={
                    <RouteErrorBoundary routeName="feed">
                      <FeedRoutes />
                    </RouteErrorBoundary>
                  } />
                  <Route path="/profile/*" element={
                    <RouteErrorBoundary routeName="profile">
                      <ProfileRoutes />
                    </RouteErrorBoundary>
                  } />
                  {user?.role === 'admin' && (
                    <Route path="/admin/*" element={
                      <RouteErrorBoundary routeName="admin">
                        <AdminRoutes />
                      </RouteErrorBoundary>
                    } />
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
          </Suspense>
        </main>

        {/* Floating Support Button - visible on all pages except auth */}
        {!isAuthPage && <SupportFloatingButton />}
      </div>
    </ErrorBoundary>
  );
}

export default App;