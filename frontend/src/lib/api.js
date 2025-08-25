// Determine API base URL dynamically so the app works on any backend port.
// In development, use the backend server on port 3001
const API_BASE_URL = (typeof window !== 'undefined' && window.location)
  ? (window.location.port === '5175' || window.location.port === '5176' || window.location.port === '5179' || window.location.port === '5178' || window.location.port === '5173'
     ? 'http://localhost:3000/api' 
     : `${window.location.origin}/api`)
  : 'http://localhost:3000/api';

// Generic API helper
const apiCall = async (endpoint, options = {}) => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    console.log('API call to:', endpoint, 'Token exists:', !!token);
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header added');
    }

    console.log('Making API call with headers:', headers);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    console.log('API response status:', response.status, response.ok);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    console.log('API response data type:', typeof data);
    console.log('API response data keys:', Object.keys(data));
    if (Array.isArray(data)) {
      console.log('API response is an array with length:', data.length);
    }
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Components API
export const componentsAPI = {
  // Get all components
  getAll: () => apiCall('/components'),
  
  // Get component by ID
  getById: (id) => apiCall(`/components/${id}`),
  
  // Create new component
  create: (componentData) => apiCall('/components', {
    method: 'POST',
    body: JSON.stringify(componentData),
  }),
  
  // Update component
  update: (id, componentData) => apiCall(`/components/${id}`, {
    method: 'PUT',
    body: JSON.stringify(componentData),
  }),
  
  // Delete component
  delete: (id) => apiCall(`/components/${id}`, {
    method: 'DELETE',
  }),
};

// Tokens API
export const tokensAPI = {
  // Get all tokens
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/tokens?${queryString}` : '/tokens';
    return apiCall(endpoint);
  },
  
  // Get token by ID
  getById: (id) => apiCall(`/tokens/${id}`),
  
  // Create new token
  create: (tokenData) => apiCall('/tokens', {
    method: 'POST',
    body: JSON.stringify(tokenData),
  }),
  
  // Update token
  update: (id, tokenData) => apiCall(`/tokens/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tokenData),
  }),
  
  // Delete token
  deleteToken: (id) => apiCall(`/tokens/${id}`, {
    method: 'DELETE',
  }),
  
  // Search tokens
  search: (query) => apiCall(`/tokens/search?q=${encodeURIComponent(query)}`),
};

// Auth API
export const authAPI = {
  // Login
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  // Register
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Get current user
  getCurrentUser: () => apiCall('/auth/me'),
};
