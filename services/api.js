/**
 * NEC Faculty Mobile Application - API Client Foundation
 *
 * Configurable REST client connecting to the Node.js / Express backend.
 * Uses EXPO_PUBLIC_API_URL environment variable with fallback to local development port.
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

/**
 * Core HTTP Request Wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = data?.code;
      error.details = data?.details;
      throw error;
    }

    return data;
  } catch (error) {
    // Network errors or API errors
    throw error;
  }
}

export const api = {
  get: (endpoint, headers = {}) => request(endpoint, { method: 'GET', headers }),

  post: (endpoint, body, headers = {}) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    }),

  put: (endpoint, body, headers = {}) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    }),

  patch: (endpoint, body, headers = {}) =>
    request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers,
    }),

  delete: (endpoint, headers = {}) => request(endpoint, { method: 'DELETE', headers }),

  getBaseUrl: () => BASE_URL,
};

export default api;
