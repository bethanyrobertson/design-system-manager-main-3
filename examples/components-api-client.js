/**
 * Components API Client
 * A simple client library for interacting with the Components API
 */

class ComponentsAPIClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || 'http://localhost:3000/api';
    this.token = config.token || localStorage.getItem('authToken');
    this.timeout = config.timeout || 10000;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // ============================================================================
  // COMPONENT OPERATIONS
  // ============================================================================

  // Get all components with optional filtering
  async getComponents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/components${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  // Get a specific component by ID
  async getComponent(id) {
    return this.request(`/components/${id}`);
  }

  // Create a new component
  async createComponent(componentData) {
    return this.request('/components', {
      method: 'POST',
      body: JSON.stringify(componentData)
    });
  }

  // Update a component
  async updateComponent(id, updates) {
    return this.request(`/components/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Delete a component
  async deleteComponent(id) {
    return this.request(`/components/${id}`, {
      method: 'DELETE'
    });
  }

  // Get components by type
  async getComponentsByType(type) {
    return this.request(`/components/type/${type}`);
  }

  // Search components
  async searchComponents(query) {
    return this.request(`/components/search/${encodeURIComponent(query)}`);
  }

  // Get component statistics
  async getComponentStats() {
    return this.request('/components/stats/overview');
  }

  // ============================================================================
  // DESIGN TOKEN OPERATIONS
  // ============================================================================

  // Get all design tokens
  async getTokens(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/tokens${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  // Get a specific token by ID
  async getToken(id) {
    return this.request(`/tokens/${id}`);
  }

  // Create a new token
  async createToken(tokenData) {
    return this.request('/tokens', {
      method: 'POST',
      body: JSON.stringify(tokenData)
    });
  }

  // Update a token
  async updateToken(id, updates) {
    return this.request(`/tokens/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Delete a token
  async deleteToken(id) {
    return this.request(`/tokens/${id}`, {
      method: 'DELETE'
    });
  }

  // ============================================================================
  // AUTHENTICATION OPERATIONS
  // ============================================================================

  // Login user
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Register user
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Get current user
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  // Generate CSS variables from design tokens
  async generateCSSVariables() {
    const tokens = await this.getTokens();
    let css = ':root {\n';
    
    (tokens.tokens || tokens).forEach(token => {
      const cssVariable = `--${token.category}-${token.name}`.toLowerCase();
      css += `  ${cssVariable}: ${token.value};\n`;
    });
    
    css += '}\n';
    return css;
  }

  // Generate component library CSS
  async generateComponentCSS() {
    const { components } = await this.getComponents({ status: 'active' });
    let css = '/* Component Library CSS */\n\n';
    
    components.forEach(component => {
      if (component.styles && component.styles.css) {
        css += `/* ${component.name} */\n`;
        css += component.styles.css;
        css += '\n\n';
      }
    });
    
    return css;
  }

  // Export components as JSON
  async exportComponents(filters = {}) {
    const { components } = await this.getComponents(filters);
    return {
      components,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  // Import components from JSON
  async importComponents(componentsData) {
    const results = [];
    
    for (const component of componentsData.components) {
      try {
        const result = await this.createComponent(component);
        results.push({ success: true, component: result });
      } catch (error) {
        results.push({ success: false, component: component.name, error: error.message });
      }
    }
    
    return results;
  }
}

// ============================================================================
// REACT HOOK (if React is available)
// ============================================================================

let useComponentsAPI = null;

// Check if React is available and create hook
if (typeof React !== 'undefined') {
  useComponentsAPI = (config = {}) => {
    const [components, setComponents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    
    const client = React.useMemo(() => new ComponentsAPIClient(config), []);
    
    const fetchComponents = React.useCallback(async (filters = {}) => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await client.getComponents(filters);
        setComponents(data.components || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, [client]);

    const createComponent = React.useCallback(async (componentData) => {
      try {
        const newComponent = await client.createComponent(componentData);
        setComponents(prev => [newComponent, ...prev]);
        return newComponent;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    }, [client]);

    const updateComponent = React.useCallback(async (id, updates) => {
      try {
        const updatedComponent = await client.updateComponent(id, updates);
        setComponents(prev => 
          prev.map(comp => comp._id === id ? updatedComponent : comp)
        );
        return updatedComponent;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    }, [client]);

    const deleteComponent = React.useCallback(async (id) => {
      try {
        await client.deleteComponent(id);
        setComponents(prev => prev.filter(comp => comp._id !== id));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    }, [client]);

    return {
      components,
      loading,
      error,
      fetchComponents,
      createComponent,
      updateComponent,
      deleteComponent,
      client
    };
  };
}

// ============================================================================
// VUE COMPOSABLE (if Vue is available)
// ============================================================================

let useComponentsAPIComposable = null;

if (typeof Vue !== 'undefined' && Vue.ref) {
  useComponentsAPIComposable = (config = {}) => {
    const components = Vue.ref([]);
    const loading = Vue.ref(false);
    const error = Vue.ref(null);
    
    const client = new ComponentsAPIClient(config);
    
    const fetchComponents = async (filters = {}) => {
      loading.value = true;
      error.value = null;
      
      try {
        const data = await client.getComponents(filters);
        components.value = data.components || data;
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    const createComponent = async (componentData) => {
      try {
        const newComponent = await client.createComponent(componentData);
        components.value.unshift(newComponent);
        return newComponent;
      } catch (err) {
        error.value = err.message;
        throw err;
      }
    };

    const updateComponent = async (id, updates) => {
      try {
        const updatedComponent = await client.updateComponent(id, updates);
        const index = components.value.findIndex(comp => comp._id === id);
        if (index !== -1) {
          components.value[index] = updatedComponent;
        }
        return updatedComponent;
      } catch (err) {
        error.value = err.message;
        throw err;
      }
    };

    const deleteComponent = async (id) => {
      try {
        await client.deleteComponent(id);
        const index = components.value.findIndex(comp => comp._id === id);
        if (index !== -1) {
          components.value.splice(index, 1);
        }
      } catch (err) {
        error.value = err.message;
        throw err;
      }
    };

    return {
      components: Vue.readonly(components),
      loading: Vue.readonly(loading),
      error: Vue.readonly(error),
      fetchComponents,
      createComponent,
      updateComponent,
      deleteComponent,
      client
    };
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

// CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComponentsAPIClient;
  module.exports.useComponentsAPI = useComponentsAPI;
  module.exports.useComponentsAPIComposable = useComponentsAPIComposable;
}

// ES6 Modules
if (typeof exports !== 'undefined') {
  exports.default = ComponentsAPIClient;
  exports.useComponentsAPI = useComponentsAPI;
  exports.useComponentsAPIComposable = useComponentsAPIComposable;
}

// Browser global
if (typeof window !== 'undefined') {
  window.ComponentsAPIClient = ComponentsAPIClient;
  window.useComponentsAPI = useComponentsAPI;
  window.useComponentsAPIComposable = useComponentsAPIComposable;
} 