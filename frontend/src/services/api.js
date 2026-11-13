// frontend/src/services/api.js
import { supabase, isSupabaseConfigured } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Returns auth headers with Supabase bearer token or demo token.
 */
async function getAuthHeaders() {
  const headers = {};

  if (isSupabaseConfigured() && supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
      return headers;
    }
  }

  // Check for local stored demo session token
  const demoToken = localStorage.getItem('agripulse_demo_token');
  if (demoToken) {
    headers['Authorization'] = `Bearer ${demoToken}`;
    headers['X-Demo-Mode'] = 'true';
  } else {
    headers['X-Demo-Mode'] = 'true';
  }

  return headers;
}

async function request(endpoint, options = {}) {
  const authHeaders = await getAuthHeaders();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers
    }
  };

  // Do not set Content-Type if FormData is used (browser sets boundary automatically)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
    const err = new Error(errorMessage);
    err.details = data?.details;
    err.status = response.status;
    throw err;
  }

  return data;
}

export const api = {
  // System Health
  getHealth: () => request('/health'),

  // Farms
  getFarms: () => request('/farms'),
  getFarm: (id) => request(`/farms/${id}`),
  createFarm: (farmData) => request('/farms', {
    method: 'POST',
    body: JSON.stringify(farmData)
  }),
  updateFarm: (id, farmData) => request(`/farms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(farmData)
  }),
  deleteFarm: (id) => request(`/farms/${id}`, {
    method: 'DELETE'
  }),

  // Advisories
  getAdvisories: (params = {}) => {
    const query = new URLSearchParams();
    if (params.cropName) query.append('cropName', params.cropName);
    if (params.severity) query.append('severity', params.severity);
    if (params.farmId) query.append('farmId', params.farmId);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/advisories${queryString}`);
  },
  getAdvisory: (id) => request(`/advisories/${id}`),
  createAdvisory: (formData) => request('/advisories', {
    method: 'POST',
    body: formData
  }),
  deleteAdvisory: (id) => request(`/advisories/${id}`, {
    method: 'DELETE'
  }),

  // Weather & Agro-Guidance
  getWeather: (location, soilType) => {
    const query = new URLSearchParams();
    if (location) query.append('location', location);
    if (soilType) query.append('soilType', soilType);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/weather${queryString}`);
  }
};

