import React, { useContext, useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthContext } from '@context/AuthContext'
import { ThemeContext } from '@context/ThemeContext'
import AuthRoutes from '@routes/AuthRoutes'
import FeedRoutes from '@routes/FeedRoutes'
import AdminRoutes from '@routes/AdminRoutes'
import ProfileRoutes from '@routes/ProfileRoutes'
import Navbar from '@components/Navbar'
import { Loader2, Wifi, WifiOff } from 'lucide-react'
import toast from 'react-hot-toast'

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Loading HeartOut
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Preparing your safe space...
        </p>
      </div>
    </div>
  </div>
)

// Network status component
const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Connection restored', {
        icon: <Wifi className="w-4 h-4" />,
        duration: 2000
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error('Connection lost', {
        icon: <WifiOff className="w-4 h-4" />,
        duration: 5000
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-warning-500 text-white px-4 py-2 text-center text-sm font-medium"
    >
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <span>You're currently offline. Some features may not work.</span>
      </div>
    </motion.div>
  )
}

// Main App component
function App() {
  const { user, loading, isAuthenticated } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const location = useLocation()
  const [initialLoading, setInitialLoading] = useState(true)

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      // Simulate initialization time
      await new Promise(resolve => setTimeout(resolve, 1000))
      setInitialLoading(false)
    }

    initializeApp()
  }, [])

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }
  }, [])

  // Show loading screen during initial load
  if (initialLoading || loading) {
    return <LoadingScreen />
  }

  const isAuthPage = ['/login', '/register'].includes(location.pathname)
  const showNavbar = isAuthenticated && !isAuthPage

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <NetworkStatus />
      
      {showNavbar && <Navbar />}
      
      <main className={`${showNavbar ? 'pt-16' : ''} transition-all duration-200`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
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
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Global modals and overlays */}
      <div id="modal-root" />
      <div id="tooltip-root" />
    </div>
  )
}

export default App