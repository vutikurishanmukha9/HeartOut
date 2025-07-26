import { apiService, endpoints } from './api'
import { jwtDecode } from 'jwt-decode'

// Token storage keys
const TOKEN_KEY = 'heartout_token'
const REFRESH_TOKEN_KEY = 'heartout_refresh_token'
const USER_KEY = 'heartout_user'

class AuthService {
  constructor() {
    this.currentUser = null
    this.tokenCheckInterval = null
    this.setupTokenRefresh()
  }

  // Token management
  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      apiService.setAuthToken(token)
    }
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
    apiService.clearAuthToken()
  }

  setRefreshToken(refreshToken) {
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  // User data management
  setUser(user) {
    if (user) {
      this.currentUser = user
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  }

  getUser() {
    if (this.currentUser) {
      return this.currentUser
    }

    const stored = localStorage.getItem(USER_KEY)
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored)
        return this.currentUser
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem(USER_KEY)
      }
    }

    return null
  }

  removeUser() {
    this.currentUser = null
    localStorage.removeItem(USER_KEY)
  }

  // Token validation
  isTokenValid(token = null) {
    const authToken = token || this.getToken()
    
    if (!authToken) {
      return false
    }

    try {
      const decoded = jwtDecode(authToken)
      const currentTime = Date.now() / 1000

      // Check if token is expired (with 5 minute buffer)
      return decoded.exp > (currentTime + 300)
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  // Get token expiration time
  getTokenExpiration(token = null) {
    const authToken = token || this.getToken()
    
    if (!authToken) {
      return null
    }

    try {
      const decoded = jwtDecode(authToken)
      return new Date(decoded.exp * 1000)
    } catch (error) {
      console.error('Error getting token expiration:', error)
      return null
    }
  }

  // Setup automatic token refresh
  setupTokenRefresh() {
    // Clear existing interval
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval)
    }

    // Check token every minute
    this.tokenCheckInterval = setInterval(() => {
      const token = this.getToken()
      if (token && !this.isTokenValid(token)) {
        this.refreshToken()
      }
    }, 60000) // 1 minute
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await apiService.post(endpoints.auth.login, credentials)
      const { user, token, refreshToken } = response

      // Store tokens and user data
      this.setToken(token)
      this.setRefreshToken(refreshToken)
      this.setUser(user)

      // Track login event
      this.trackAuthEvent('login', { userId: user.id, method: 'email' })

      return response
    } catch (error) {
      this.trackAuthEvent('login_failed', { 
        error: error.response?.data?.message || error.message 
      })
      throw error
    }
  }

  async register(userData) {
    try {
      const response = await apiService.post(endpoints.auth.register, userData)
      const { user, token, refreshToken } = response

      // Store tokens and user data
      this.setToken(token)
      this.setRefreshToken(refreshToken)
      this.setUser(user)

      // Track registration event
      this.trackAuthEvent('register', { userId: user.id })

      return response
    } catch (error) {
      this.trackAuthEvent('register_failed', { 
        email: userData.email,
        error: error.response?.data?.message || error.message 
      })
      throw error
    }
  }

  async logout() {
    try {
      const token = this.getToken()
      if (token) {
        await apiService.post(endpoints.auth.logout)
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Clear all stored data
      this.removeToken()
      this.removeRefreshToken()
      this.removeUser()
      
      // Clear token refresh interval
      if (this.tokenCheckInterval) {
        clearInterval(this.tokenCheckInterval)
        this.tokenCheckInterval = null
      }

      // Track logout event
      this.trackAuthEvent('logout')
    }
  }

  async refreshToken(refreshToken = null) {
    try {
      const token = refreshToken || this.getRefreshToken()
      
      if (!token) {
        throw new Error('No refresh token available')
      }

      const response = await apiService.post(endpoints.auth.refresh, {
        refreshToken: token
      })

      const { token: newToken, refreshToken: newRefreshToken, user } = response

      // Update stored tokens and user data
      this.setToken(newToken)
      this.setRefreshToken(newRefreshToken)
      this.setUser(user)

      return response
    } catch (error) {
      // If refresh fails, clear all auth data
      this.removeToken()
      this.removeRefreshToken()
      this.removeUser()
      
      this.trackAuthEvent('refresh_failed', { 
        error: error.response?.data?.message || error.message 
      })
      
      throw error
    }
  }

  async verifyToken(token = null) {
    try {
      const authToken = token || this.getToken()
      
      if (!authToken || !this.isTokenValid(authToken)) {
        return null
      }

      const response = await apiService.get(endpoints.auth.verify)
      const { user } = response

      // Update user data
      this.setUser(user)

      return user
    } catch (error) {
      console.error('Token verification failed:', error)
      return null
    }
  }

  // Profile management
  async updateProfile(userData) {
    try {
      const response = await apiService.put(endpoints.auth.profile, userData)
      const { user } = response

      // Update stored user data
      this.setUser(user)

      this.trackAuthEvent('profile_updated')

      return response
    } catch (error) {
      this.trackAuthEvent('profile_update_failed', { 
        error: error.response?.data?.message || error.message 
      })
      throw error
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.post(endpoints.auth.changePassword, {
        currentPassword,
        newPassword
      })

      this.trackAuthEvent('password_changed')

      return response
    } catch (error) {
      this.trackAuthEvent('password_change_failed', { 
        error: error.response?.data?.message || error.message 
      })
      throw error
    }
  }

  async forgotPassword(email) {
    try {
      const response = await apiService.post(endpoints.auth.forgotPassword, {
        email
      })

      this.trackAuthEvent('password_reset_requested', { email })

      return response
    } catch (error) {
      this.trackAuthEvent('password_reset_request_failed', { 
        email,
        error: error.response?.data?.message || error.message 
      })
      throw error
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post(endpoints.auth.resetPassword, {
        token,
        newPassword
      })

      this.trackAuthEvent('password_reset_completed')

      return response
    } catch (error) {
      this.trackAuthEvent('password_reset_failed', { 
        error: error.response?.data?.message || error.message 
      })
      throw error
    }
  }

  // Social authentication (if implemented)
  async socialLogin(provider, credentials) {
    try {
      const response = await apiService.post(`/auth/${provider}`, credentials)
      const { user, token, refreshToken } = response

      this.setToken(token)
      this.setRefreshToken(refreshToken)
      this.setUser(user)

      this.trackAuthEvent('social_login', { provider, userId: user.id })

      return response
    } catch (error) {
      this.trackAuthEvent('social_login_failed', { 
        provider,
        error: error.response?.data?.message || error.message 
      })
      throw error
    }
  }

  // Two-factor authentication
  async enableTwoFactor() {
    try {
      const response = await apiService.post('/auth/2fa/enable')
      this.trackAuthEvent('2fa_enabled')
      return response
    } catch (error) {
      this.trackAuthEvent('2fa_enable_failed', { 
        error: error.response?.data?.message || error.message 
      })
      throw error
    }
  }

  async disableTwoFactor(code) {
    try {
      const response = await apiService.post('/auth/2fa/disable', { code })
      this.trackAuthEvent('2fa_disabled')
      return response
    } catch (error) {
      this.trackAuthEvent('2fa_disable_failed', { 
        error: error.response?.data?.message || error.message 
      })
      throw error
    }
  }

  async verifyTwoFactor(code) {
    try {
      const response = await apiService.post('/auth/2fa/verify', { code })
      this.trackAuthEvent('2fa_verified')
      return response
    } catch (error) {
      this.trackAuthEvent('2fa_verification_failed', { 
        error: error.response?.data?.message || error.message 
      })
      throw error
    }
  }

  // Device management
  async getDevices() {
    try {
      const response = await apiService.get('/auth/devices')
      return response
    } catch (error) {
      console.error('Failed to get devices:', error)
      throw error
    }
  }

  async revokeDevice(deviceId) {
    try {
      const response = await apiService.delete(`/auth/devices/${deviceId}`)
      this.trackAuthEvent('device_revoked', { deviceId })
      return response
    } catch (error) {
      console.error('Failed to revoke device:', error)
      throw error
    }
  }

  // Session management
  async getSessions() {
    try {
      const response = await apiService.get('/auth/sessions')
      return response
    } catch (error) {
      console.error('Failed to get sessions:', error)
      throw error
    }
  }

  async revokeSession(sessionId) {
    try {
      const response = await apiService.delete(`/auth/sessions/${sessionId}`)
      this.trackAuthEvent('session_revoked', { sessionId })
      return response
    } catch (error) {
      console.error('Failed to revoke session:', error)
      throw error
    }
  }

  async revokeAllSessions() {
    try {
      const response = await apiService.delete('/auth/sessions')
      this.trackAuthEvent('all_sessions_revoked')
      return response
    } catch (error) {
      console.error('Failed to revoke all sessions:', error)
      throw error
    }
  }

  // Utility methods
  isAuthenticated() {
    const token = this.getToken()
    return token && this.isTokenValid(token)
  }

  hasRole(role) {
    const user = this.getUser()
    return user && user.role === role
  }

  hasPermission(permission) {
    const user = this.getUser()
    return user && (
      user.permissions?.includes(permission) || 
      user.role === 'admin'
    )
  }

  getCurrentUserId() {
    const user = this.getUser()
    return user?.id
  }

  // Analytics and tracking
  trackAuthEvent(event, data = {}) {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      // Send to analytics service
      console.log(`Auth Event: ${event}`, data)
      
      // You can integrate with services like Google Analytics, Mixpanel, etc.
      if (window.gtag) {
        window.gtag('event', event, {
          event_category: 'authentication',
          ...data
        })
      }
    }
  }

  // Cleanup
  destroy() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval)
      this.tokenCheckInterval = null
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService()

// Export utility functions
export const tokenUtils = {
  decode: jwtDecode,
  isExpired: (token) => {
    try {
      const decoded = jwtDecode(token)
      return decoded.exp < Date.now() / 1000
    } catch {
      return true
    }
  },
  getExpiration: (token) => {
    try {
      const decoded = jwtDecode(token)
      return new Date(decoded.exp * 1000)
    } catch {
      return null
    }
  },
  getClaims: (token) => {
    try {
      return jwtDecode(token)
    } catch {
      return null
    }
  }
}

export default authService