import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request queue for retry mechanism
const requestQueue = new Map()

// Rate limiting
const rateLimiter = {
  requests: new Map(),
  windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  maxRequests: parseInt(import.meta.env.VITE_RATE_LIMIT_MAX_REQUESTS) || 100,
  
  canMakeRequest(endpoint) {
    const now = Date.now()
    const requests = this.requests.get(endpoint) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(endpoint, validRequests)
    return true
  }
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // Rate limiting check
    const endpoint = `${config.method}:${config.url}`
    if (!rateLimiter.canMakeRequest(endpoint)) {
      return Promise.reject(new Error('Rate limit exceeded. Please try again later.'))
    }

    // Add request ID for tracking
    config.metadata = {
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: Date.now()
    }

    // Log request in development
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers
      })
    }

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      const duration = Date.now() - response.config.metadata.startTime
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, response.data)
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Log error in development
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.error(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, error)
    }

    // Handle different error types
    if (!error.response) {
      // Network error
      handleNetworkError(error)
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // Handle specific status codes
    switch (status) {
      case 401:
        return handleUnauthorized(error, originalRequest)
      case 403:
        handleForbidden(error)
        break
      case 404:
        handleNotFound(error)
        break
      case 409:
        handleConflict(error)
        break
      case 422:
        handleValidationError(error)
        break
      case 429:
        return handleRateLimit(error, originalRequest)
      case 500:
      case 502:
      case 503:
      case 504:
        return handleServerError(error, originalRequest)
      default:
        handleGenericError(error)
    }

    return Promise.reject(error)
  }
)

// Error handlers
const handleNetworkError = (error) => {
  if (navigator.onLine) {
    toast.error('Network error. Please check your connection.')
  } else {
    toast.error('You are offline. Please check your internet connection.')
  }
}

const handleUnauthorized = async (error, originalRequest) => {
  if (!originalRequest._retry) {
    originalRequest._retry = true
    
    try {
      // Try to refresh token
      const refreshToken = localStorage.getItem('heartout_refresh_token')
      if (refreshToken) {
        const response = await api.post('/auth/refresh', { refreshToken })
        const { token } = response.data
        
        // Update stored token
        localStorage.setItem('heartout_token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        originalRequest.headers['Authorization'] = `Bearer ${token}`
        
        return api(originalRequest)
      }
    } catch (refreshError) {
      // Refresh failed, redirect to login
      localStorage.removeItem('heartout_token')
      localStorage.removeItem('heartout_refresh_token')
      delete api.defaults.headers.common['Authorization']
      
      toast.error('Session expired. Please login again.')
      window.location.href = '/auth/login'
    }
  }
  
  return Promise.reject(error)
}

const handleForbidden = (error) => {
  toast.error('Access denied. You don\'t have permission to perform this action.')
}

const handleNotFound = (error) => {
  const message = error.response?.data?.message || 'Resource not found'
  toast.error(message)
}

const handleConflict = (error) => {
  const message = error.response?.data?.message || 'Conflict occurred'
  toast.error(message)
}

const handleValidationError = (error) => {
  const errors = error.response?.data?.errors || {}
  const message = error.response?.data?.message || 'Validation failed'
  
  if (Object.keys(errors).length > 0) {
    // Show first validation error
    const firstError = Object.values(errors)[0]
    toast.error(Array.isArray(firstError) ? firstError[0] : firstError)
  } else {
    toast.error(message)
  }
}

const handleRateLimit = async (error, originalRequest) => {
  const retryAfter = error.response?.headers['retry-after'] || 60
  toast.error(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`)
  
  // Optionally retry after delay
  if (!originalRequest._retryCount) {
    originalRequest._retryCount = 0
  }
  
  if (originalRequest._retryCount < 3) {
    originalRequest._retryCount++
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(api(originalRequest))
      }, retryAfter * 1000)
    })
  }
  
  return Promise.reject(error)
}

const handleServerError = async (error, originalRequest) => {
  const message = error.response?.data?.message || 'Server error occurred'
  
  // Retry logic for server errors
  if (!originalRequest._retryCount) {
    originalRequest._retryCount = 0
  }
  
  if (originalRequest._retryCount < 2) {
    originalRequest._retryCount++
    
    // Exponential backoff
    const delay = Math.pow(2, originalRequest._retryCount) * 1000
    
    toast.error(`Server error. Retrying in ${delay / 1000} seconds...`)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(api(originalRequest))
      }, delay)
    })
  }
  
  toast.error(message)
  return Promise.reject(error)
}

const handleGenericError = (error) => {
  const message = error.response?.data?.message || 'An error occurred'
  toast.error(message)
}

// API service class
class ApiService {
  constructor() {
    this.api = api
  }

  // Set auth token
  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete this.api.defaults.headers.common['Authorization']
    }
  }

  // Clear auth token
  clearAuthToken() {
    delete this.api.defaults.headers.common['Authorization']
  }

  // Generic request methods
  async get(url, config = {}) {
    const response = await this.api.get(url, config)
    return response.data
  }

  async post(url, data = {}, config = {}) {
    const response = await this.api.post(url, data, config)
    return response.data
  }

  async put(url, data = {}, config = {}) {
    const response = await this.api.put(url, data, config)
    return response.data
  }

  async patch(url, data = {}, config = {}) {
    const response = await this.api.patch(url, data, config)
    return response.data
  }

  async delete(url, config = {}) {
    const response = await this.api.delete(url, config)
    return response.data
  }

  // File upload with progress
  async uploadFile(url, file, onProgress = () => {}) {
    const formData = new FormData()
    formData.append('file', file)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress(percentCompleted)
      },
    }

    const response = await this.api.post(url, formData, config)
    return response.data
  }

  // Batch requests
  async batch(requests) {
    try {
      const promises = requests.map(({ method, url, data, config }) => {
        switch (method.toLowerCase()) {
          case 'get':
            return this.get(url, config)
          case 'post':
            return this.post(url, data, config)
          case 'put':
            return this.put(url, data, config)
          case 'patch':
            return this.patch(url, data, config)
          case 'delete':
            return this.delete(url, config)
          default:
            throw new Error(`Unsupported method: ${method}`)
        }
      })

      return Promise.allSettled(promises)
    } catch (error) {
      console.error('Batch request error:', error)
      throw error
    }
  }

  // Stream data (for real-time updates)
  createEventSource(url, options = {}) {
    const token = localStorage.getItem('heartout_token')
    const eventSourceUrl = `${this.api.defaults.baseURL}${url}?token=${token}`
    
    return new EventSource(eventSourceUrl, options)
  }

  // Cancel request
  createCancelToken() {
    return axios.CancelToken.source()
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.get('/health')
      return response
    } catch (error) {
      console.error('Health check failed:', error)
      return { status: 'error', message: 'Service unavailable' }
    }
  }

  // Get API metrics
  async getMetrics() {
    try {
      const response = await this.get('/metrics')
      return response
    } catch (error) {
      console.error('Failed to get metrics:', error)
      return null
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService()

// Export specific endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verify: '/auth/verify',
    profile: '/auth/profile',
    changePassword: '/auth/change-password',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  // User endpoints
  users: {
    profile: '/users/profile',
    update: '/users/profile',
    avatar: '/users/avatar',
    preferences: '/users/preferences',
    block: (userId) => `/users/${userId}/block`,
    unblock: (userId) => `/users/${userId}/unblock`,
    report: (userId) => `/users/${userId}/report`,
  },

  // Post endpoints
  posts: {
    list: '/posts',
    create: '/posts',
    get: (id) => `/posts/${id}`,
    update: (id) => `/posts/${id}`,
    delete: (id) => `/posts/${id}`,
    like: (id) => `/posts/${id}/like`,
    unlike: (id) => `/posts/${id}/unlike`,
    comment: (id) => `/posts/${id}/comments`,
    share: (id) => `/posts/${id}/share`,
    report: (id) => `/posts/${id}/report`,
    drafts: '/posts/drafts',
  },

  // Comment endpoints
  comments: {
    list: (postId) => `/posts/${postId}/comments`,
    create: (postId) => `/posts/${postId}/comments`,
    get: (postId, id) => `/posts/${postId}/comments/${id}`,
    update: (postId, id) => `/posts/${postId}/comments/${id}`,
    delete: (postId, id) => `/posts/${postId}/comments/${id}`,
    like: (postId, id) => `/posts/${postId}/comments/${id}/like`,
    unlike: (postId, id) => `/posts/${postId}/comments/${id}/unlike`,
    report: (postId, id) => `/posts/${postId}/comments/${id}/report`,
  },

  // Admin endpoints
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    posts: '/admin/posts',
    reports: '/admin/reports',
    analytics: '/admin/analytics',
    settings: '/admin/settings',
    moderation: '/admin/moderation',
  },

  // Support endpoints
  support: {
    emergency: '/support/emergency',
    resources: '/support/resources',
    helpline: '/support/helpline',
    crisis: '/support/crisis',
  },

  // Call endpoints
  calls: {
    create: '/calls',
    join: (id) => `/calls/${id}/join`,
    leave: (id) => `/calls/${id}/leave`,
    end: (id) => `/calls/${id}/end`,
    signal: (id) => `/calls/${id}/signal`,
  },

  // Upload endpoints
  uploads: {
    image: '/uploads/image',
    file: '/uploads/file',
    avatar: '/uploads/avatar',
  },

  // Search endpoints
  search: {
    posts: '/search/posts',
    users: '/search/users',
    global: '/search',
  },

  // Notification endpoints
  notifications: {
    list: '/notifications',
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    preferences: '/notifications/preferences',
  },
}

// Utility functions
export const createFormData = (data) => {
  const formData = new FormData()
  
  Object.keys(data).forEach(key => {
    const value = data[key]
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item)
      })
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, value)
    }
  })
  
  return formData
}

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item))
      } else {
        searchParams.append(key, value)
      }
    }
  })
  
  return searchParams.toString()
}

export default apiService