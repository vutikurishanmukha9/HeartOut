/**
 * API Configuration
 * Uses environment variable in production, relative URL in development (with Vite proxy)
 */

// Get API URL from environment variable or use relative path for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Get full API URL for a given endpoint
 * @param {string} endpoint - API endpoint starting with /api
 * @returns {string} Full URL
 */
export function getApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
}

/**
 * Wrapper for fetch with API base URL
 * @param {string} endpoint - API endpoint starting with /api
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(endpoint, options = {}) {
    const url = getApiUrl(endpoint);

    // Add default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    return fetch(url, { ...options, headers });
}

export default API_BASE_URL;
