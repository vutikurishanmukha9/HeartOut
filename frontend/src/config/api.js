/**
 * API Configuration
 * Uses environment variable in production, relative URL in development (with Vite proxy)
 */

// Get API URL from environment variable or use relative path for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Get full API URL for a given endpoint, ensuring standard /api prefix
 * @param {string} endpoint - API endpoint
 * @returns {string} Full URL
 */
export function getApiUrl(endpoint) {
    if (!endpoint) return API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/api') 
        ? endpoint 
        : `/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Wrapper for fetch with API base URL and automatic auth token attachment
 * @param {string} endpoint - API endpoint
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    let token = null;
    try {
        const local = typeof window !== 'undefined' && window.localStorage ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null);
        const session = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : (typeof sessionStorage !== 'undefined' ? sessionStorage : null);
        if (local) {
            token = local.getItem('access_token') || local.getItem('token');
        }
        if (!token && session) {
            token = session.getItem('access_token') || session.getItem('token');
        }
    } catch {
        // Storage might be restricted
    }

    // Add default headers including anti-CSRF identifier and Bearer token if available
    const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    return fetch(url, {
        credentials: options.credentials || 'include',
        ...options,
        headers
    });
}

export default API_BASE_URL;
