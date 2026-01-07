import React, { useContext, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import SupportFloatingButton from './components/SupportFloatingButton';
import MobileBottomNav from './components/MobileBottomNav';
import ErrorBoundary, { RouteErrorBoundary } from './components/ErrorBoundary';
import InnovativeLoader, { RouteLoader } from './components/InnovativeLoader';
import { ServerWarmupToast } from './components/ServerWarmup';
import SkipToContent from './components/Accessibility';
import { WebSocketProvider } from './hooks/useWebSocket.jsx';
import NotificationToast from './components/NotificationToast';

// Lazy load routes for better performance
const AuthRoutes = lazy(() => import('./routes/AuthRoutes'));
const FeedRoutes = lazy(() => import('./routes/FeedRoutes'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
const ProfileRoutes = lazy(() => import('./routes/ProfileRoutes'));
const Support = lazy(() => import('./pages/Support'));

// RouteLoader is now imported from InnovativeLoader

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

  // Show innovative loading screen during initial load
  if (loading) {
    return <InnovativeLoader />;
  }

  const isAuthPage = location.pathname.startsWith('/auth');
  const showNavbar = isAuthenticated && !isAuthPage;

  return (
    <ErrorBoundary>
      <>
        {/* Skip to main content link for keyboard/screen reader users */}
        <SkipToContent targetId="main-content" />

        <div className="min-h-screen bg-transparent transition-colors duration-200">
          {/* WebSocket Provider for real-time features */}
          <WebSocketProvider userId={user?.id}>
            {showNavbar && <Navbar />}

            <main
              id="main-content"
              tabIndex={-1}
              className={`${showNavbar ? 'pt-16' : ''} transition-all duration-200 focus:outline-none`}
            >
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

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />

            {/* Server Cold Start Toast */}
            <ServerWarmupToast />

            {/* Real-time Notification Toast */}
            <NotificationToast />
          </WebSocketProvider>
        </div>
      </>
    </ErrorBoundary>
  );
}

export default App;