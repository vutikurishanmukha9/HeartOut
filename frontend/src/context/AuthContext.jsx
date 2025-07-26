import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '@services/auth'
import { apiService } from '@services/api'
import toast from 'react-hot-toast'

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  permissions: [],
  lastActivity: null,
  sessionTimeout: null
}

// Action types
const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_PERMISSIONS: 'UPDATE_PERMISSIONS',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_ACTIVITY: 'UPDATE_ACTIVITY',
  SESSION_TIMEOUT: 'SESSION_TIMEOUT'
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null
      }

    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false,
        error: null,
        permissions: action.payload.user?.permissions || [],
        lastActivity: Date.now()
      }

    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
        permissions: []
      }

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false
      }

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        lastActivity: Date.now()
      }

    case AUTH_ACTIONS.UPDATE_PERMISSIONS:
      return {
        ...state,
        permissions: action.payload
      }

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case AUTH_ACTIONS.UPDATE_ACTIVITY:
      return {
        ...state,
        lastActivity: Date.now()
      }

    case AUTH_ACTIONS.SESSION_TIMEOUT:
      return {
        ...initialState,
        loading: false,
        error: 'Session expired. Please login again.'
      }

    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken()
        const refreshToken = authService.getRefreshToken()
        
        if (token && refreshToken) {
          // Verify token validity
          const userData = await authService.verifyToken()
          if (userData) {
            dispatch({
              type: AUTH_ACTIONS.AUTH_SUCCESS,
              payload: {
                user: userData,
                token,
                refreshToken
              }
            })
            
            // Set up API interceptors
            apiService.setAuthToken(token)
          } else {
            // Token invalid, try refresh
            await refreshAuthToken()
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Session timeout monitoring
  useEffect(() => {
    if (state.isAuthenticated && state.lastActivity) {
      const timeout = setTimeout(() => {
        const now = Date.now()
        const timeSinceActivity = now - state.lastActivity
        const sessionTimeout = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 86400000 // 24 hours

        if (timeSinceActivity > sessionTimeout) {
          dispatch({ type: AUTH_ACTIONS.SESSION_TIMEOUT })
          toast.error('Session expired. Please login again.')
        }
      }, 60000) // Check every minute

      return () => clearTimeout(timeout)
    }
  }, [state.isAuthenticated, state.lastActivity])

  // Activity tracking
  useEffect(() => {
    if (state.isAuthenticated) {
      const trackActivity = () => {
        dispatch({ type: AUTH_ACTIONS.UPDATE_ACTIVITY })
      }

      const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
      events.forEach(event => {
        document.addEventListener(event, trackActivity, true)
      })

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, trackActivity, true)
        })
      }
    }
  }, [state.isAuthenticated])

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START })
      
      const response = await authService.login(credentials)
      const { user, token, refreshToken } = response

      // Store tokens
      authService.setToken(token)
      authService.setRefreshToken(refreshToken)
      
      // Set API auth header
      apiService.setAuthToken(token)

      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: { user, token, refreshToken }
      })

      toast.success(`Welcome back, ${user.username}!`)
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: errorMessage
      })
      toast.error(errorMessage)
      throw error
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START })
      
      const response = await authService.register(userData)
      const { user, token, refreshToken } = response

      // Store tokens
      authService.setToken(token)
      authService.setRefreshToken(refreshToken)
      
      // Set API auth header
      apiService.setAuthToken(token)

      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: { user, token, refreshToken }
      })

      toast.success(`Welcome to HeartOut, ${user.username}!`)
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: errorMessage
      })
      toast.error(errorMessage)
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens regardless of API response
      authService.removeToken()
      authService.removeRefreshToken()
      apiService.clearAuthToken()
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      toast.success('Logged out successfully')
    }
  }

  // Refresh token function
  const refreshAuthToken = async () => {
    try {
      const refreshToken = authService.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken(refreshToken)
      const { token: newToken, refreshToken: newRefreshToken, user } = response

      authService.setToken(newToken)
      authService.setRefreshToken(newRefreshToken)
      apiService.setAuthToken(newToken)

      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: {
          user,
          token: newToken,
          refreshToken: newRefreshToken
        }
      })

      return newToken
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      authService.removeToken()
      authService.removeRefreshToken()
      apiService.clearAuthToken()
      throw error
    }
  }

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await authService.updateProfile(userData)
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response.user
      })
      toast.success('Profile updated successfully')
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Update failed'
      toast.error(errorMessage)
      throw error
    }
  }

  // Update user permissions
  const updatePermissions = (permissions) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_PERMISSIONS,
      payload: permissions
    })
  }

  // Check permissions
  const hasPermission = (permission) => {
    return state.permissions.includes(permission) || state.user?.role === 'admin'
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword)
      toast.success('Password changed successfully')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed'
      toast.error(errorMessage)
      throw error
    }
  }

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email)
      toast.success('Password reset link sent to your email')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link'
      toast.error(errorMessage)
      throw error
    }
  }

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      await authService.resetPassword(token, newPassword)
      toast.success('Password reset successfully')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed'
      toast.error(errorMessage)
      throw error
    }
  }

  // Context value
  const value = {
    ...state,
    login,
    register,
    logout,
    refreshAuthToken,
    updateUser,
    updatePermissions,
    hasPermission,
    clearError,
    changePassword,
    forgotPassword,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext }