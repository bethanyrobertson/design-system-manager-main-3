# Components API Integration Guide

This guide shows you how to integrate the Components API into your applications, whether you're building a React app, Vue app, or any other type of application.

## Quick Start

### 1. Basic Setup

First, make sure your Components API server is running:

```bash
npm run dev
```

### 2. Install the Client Library

Copy the client library to your project:

```javascript
// Copy examples/components-api-client.js to your project
import ComponentsAPIClient from './components-api-client.js';
```

### 3. Initialize the Client

```javascript
const client = new ComponentsAPIClient({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
});
```

## Integration Examples

### React Integration

```jsx
import React, { useEffect, useState } from 'react';
import ComponentsAPIClient from './components-api-client.js';

const ComponentLibrary = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const client = new ComponentsAPIClient();

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      try {
        const data = await client.getComponents({ status: 'active' });
        setComponents(data.components);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  const createComponent = async (componentData) => {
    try {
      const newComponent = await client.createComponent(componentData);
      setComponents(prev => [newComponent, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Component Library</h1>
      {components.map(component => (
        <div key={component._id}>
          <h3>{component.name}</h3>
          <p>{component.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### Vue Integration

```vue
<template>
  <div>
    <h1>Component Library</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <div v-for="component in components" :key="component._id">
        <h3>{{ component.name }}</h3>
        <p>{{ component.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentsAPIClient from './components-api-client.js';

export default {
  data() {
    return {
      components: [],
      loading: false,
      error: null,
      client: new ComponentsAPIClient()
    };
  },
  
  async mounted() {
    await this.fetchComponents();
  },
  
  methods: {
    async fetchComponents() {
      this.loading = true;
      try {
        const data = await this.client.getComponents({ status: 'active' });
        this.components = data.components;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    
    async createComponent(componentData) {
      try {
        const newComponent = await this.client.createComponent(componentData);
        this.components.unshift(newComponent);
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>
```

### Vanilla JavaScript Integration

```javascript
import ComponentsAPIClient from './components-api-client.js';

class ComponentManager {
  constructor() {
    this.client = new ComponentsAPIClient();
    this.components = [];
  }

  async initialize() {
    try {
      const data = await this.client.getComponents({ status: 'active' });
      this.components = data.components;
      this.renderComponents();
    } catch (error) {
      console.error('Failed to load components:', error);
    }
  }

  renderComponents() {
    const container = document.getElementById('component-library');
    container.innerHTML = this.components.map(component => `
      <div class="component-card">
        <h3>${component.name}</h3>
        <p>${component.description}</p>
        <div class="component-code">
          <pre>${component.code?.react || ''}</pre>
        </div>
      </div>
    `).join('');
  }

  async createComponent(componentData) {
    try {
      const newComponent = await this.client.createComponent(componentData);
      this.components.unshift(newComponent);
      this.renderComponents();
    } catch (error) {
      console.error('Failed to create component:', error);
    }
  }
}

// Usage
const manager = new ComponentManager();
manager.initialize();
```

## Authentication

### Login and Token Management

```javascript
const client = new ComponentsAPIClient();

// Login
const login = async (email, password) => {
  try {
    const response = await client.login({ email, password });
    console.log('Logged in successfully:', response.user);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Check if user is authenticated
const checkAuth = async () => {
  try {
    const user = await client.getCurrentUser();
    console.log('Current user:', user);
    return user;
  } catch (error) {
    console.log('Not authenticated');
    return null;
  }
};

// Logout
const logout = () => {
  client.clearToken();
  console.log('Logged out');
};
```

## Advanced Usage

### Component Creation with Full Data

```javascript
const createButtonComponent = async () => {
  const componentData = {
    name: 'CustomButton',
    type: 'button',
    description: 'A custom button component with advanced styling',
    props: [
      {
        name: 'children',
        type: 'string',
        required: true,
        description: 'Button text content'
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        defaultValue: 'primary',
        description: 'Button variant: primary, secondary, danger'
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        defaultValue: 'medium',
        description: 'Button size: small, medium, large'
      }
    ],
    styles: {
      css: `
.custom-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.custom-button.primary {
  background-color: #007bff;
  color: white;
}

.custom-button.secondary {
  background-color: #6c757d;
  color: white;
}

.custom-button.danger {
  background-color: #dc3545;
  color: white;
}
      `
    },
    code: {
      react: `
import React from 'react';
import './CustomButton.css';

const CustomButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  ...props 
}) => {
  return (
    <button
      className={\`custom-button \${variant} \${size}\`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
      `
    },
    examples: [
      {
        name: 'Basic Usage',
        description: 'Simple button with default styling',
        code: '<CustomButton onClick={handleClick}>Click me</CustomButton>'
      },
      {
        name: 'Different Variants',
        description: 'Buttons with different variants',
        code: `
<CustomButton variant="primary">Primary</CustomButton>
<CustomButton variant="secondary">Secondary</CustomButton>
<CustomButton variant="danger">Danger</CustomButton>
        `
      }
    ],
    tags: ['button', 'custom', 'variants'],
    status: 'active'
  };

  try {
    const newComponent = await client.createComponent(componentData);
    console.log('Component created:', newComponent);
    return newComponent;
  } catch (error) {
    console.error('Failed to create component:', error);
  }
};
```

### Search and Filtering

```javascript
// Search for components
const searchComponents = async (query) => {
  try {
    const components = await client.searchComponents(query);
    console.log('Search results:', components);
    return components;
  } catch (error) {
    console.error('Search failed:', error);
  }
};

// Filter by type
const getButtonComponents = async () => {
  try {
    const data = await client.getComponents({ type: 'button', status: 'active' });
    console.log('Button components:', data.components);
    return data.components;
  } catch (error) {
    console.error('Failed to get button components:', error);
  }
};

// Advanced filtering
const getFilteredComponents = async () => {
  try {
    const data = await client.getComponents({
      type: 'button',
      status: 'active',
      tags: 'primary,ui',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    console.log('Filtered components:', data);
    return data;
  } catch (error) {
    console.error('Failed to get filtered components:', error);
  }
};
```

### Design System Integration

```javascript
// Generate CSS variables from design tokens
const generateDesignSystem = async () => {
  try {
    // Get CSS variables from tokens
    const cssVariables = await client.generateCSSVariables();
    
    // Get component CSS
    const componentCSS = await client.generateComponentCSS();
    
    // Combine into design system
    const designSystem = `
${cssVariables}

${componentCSS}
    `;
    
    // Save to file or inject into page
    const styleElement = document.createElement('style');
    styleElement.textContent = designSystem;
    document.head.appendChild(styleElement);
    
    console.log('Design system loaded');
  } catch (error) {
    console.error('Failed to generate design system:', error);
  }
};
```

### Build Tool Integration

```javascript
// Webpack plugin example
const ComponentsAPIPlugin = require('./components-api-plugin.js');

module.exports = {
  // ... other webpack config
  plugins: [
    new ComponentsAPIPlugin({
      apiBase: 'http://localhost:3000/api',
      outputPath: './src/components-library'
    })
  ]
};
```

### CMS Integration

```javascript
// WordPress plugin example
class WordPressComponentsManager {
  constructor() {
    this.client = new ComponentsAPIClient({
      baseURL: 'https://your-api.com/api'
    });
  }

  async registerComponents() {
    try {
      const components = await this.client.getComponentsForCMS();
      
      components.forEach(component => {
        // Register as WordPress block
        wp.blocks.registerBlockType(`components/${component.name}`, {
          title: component.name,
          description: component.description,
          category: 'components',
          attributes: this.mapPropsToAttributes(component.props),
          edit: this.createEditComponent(component),
          save: this.createSaveComponent(component)
        });
      });
    } catch (error) {
      console.error('Failed to register components:', error);
    }
  }

  mapPropsToAttributes(props) {
    const attributes = {};
    props.forEach(prop => {
      attributes[prop.name] = {
        type: this.mapTypeToWordPress(prop.type),
        default: prop.defaultValue
      };
    });
    return attributes;
  }

  mapTypeToWordPress(type) {
    const typeMap = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'array': 'array',
      'object': 'object'
    };
    return typeMap[type] || 'string';
  }
}
```

## Error Handling

```javascript
const handleAPIErrors = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error.message.includes('401')) {
      // Handle authentication error
      console.log('Please log in again');
      // Redirect to login
    } else if (error.message.includes('404')) {
      // Handle not found
      console.log('Component not found');
    } else if (error.message.includes('timeout')) {
      // Handle timeout
      console.log('Request timed out, please try again');
    } else {
      // Handle other errors
      console.error('API Error:', error.message);
    }
    throw error;
  }
};

// Usage
const safeGetComponents = () => handleAPIErrors(() => client.getComponents());
```

## Performance Optimization

```javascript
// Caching components
class CachedComponentManager {
  constructor() {
    this.client = new ComponentsAPIClient();
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async getComponents(filters = {}) {
    const cacheKey = JSON.stringify(filters);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const data = await this.client.getComponents(filters);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

## Testing

```javascript
// Jest test example
import ComponentsAPIClient from './components-api-client.js';

describe('Components API Client', () => {
  let client;

  beforeEach(() => {
    client = new ComponentsAPIClient({
      baseURL: 'http://localhost:3000/api'
    });
  });

  test('should fetch components', async () => {
    const data = await client.getComponents();
    expect(data.components).toBeDefined();
    expect(Array.isArray(data.components)).toBe(true);
  });

  test('should create component', async () => {
    const componentData = {
      name: 'TestComponent',
      type: 'button',
      description: 'Test component'
    };

    const component = await client.createComponent(componentData);
    expect(component.name).toBe('TestComponent');
    expect(component.type).toBe('button');
  });
});
```

## Deployment

### Environment Configuration

```javascript
// config.js
const config = {
  development: {
    apiBase: 'http://localhost:3000/api'
  },
  staging: {
    apiBase: 'https://staging-api.yourcompany.com/api'
  },
  production: {
    apiBase: 'https://api.yourcompany.com/api'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const apiConfig = config[environment];
```

### Production Setup

```javascript
// production-setup.js
const client = new ComponentsAPIClient({
  baseURL: process.env.COMPONENTS_API_URL,
  timeout: 15000
});

// Add retry logic for production
const retryRequest = async (request, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await request();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

This integration guide covers the most common use cases. The Components API is designed to be flexible and can be integrated into any application that can make HTTP requests. The client library provides a clean, consistent interface regardless of your technology stack. 

## 🎉 **Unified Design System Manager**

### **✅ What's New:**

1. **Tab System**: Switch between "Components" and "Tokens" tabs
2. **Components Tab**: All your original component functionality
3. **Tokens Tab**: Complete token management with import/export
4. **Unified Interface**: Everything in one place

### **🔧 How to Use:**

#### **Access**: `http://localhost:3000/components`

#### **Components Tab**:
- Create, view, edit, delete components
- Search and filter components
- View component statistics
- All your original component functionality

#### **Tokens Tab**:
- Create design tokens (colors, typography, spacing)
- **Import JSON files** with token data
- **Export tokens to JSON** files
- Search and filter tokens
- View token statistics

### **📁 Import/Export Features:**

#### **Import Tokens**:
1. Click the "Tokens" tab
2. In the sidebar, you'll see the "📁 Import/Export JSON" section
3. Click "Choose File" and select a JSON file
4. Click "📁 Upload Tokens"
5. View the results

#### **Export Tokens**:
1. Click the "Tokens" tab
2. Click "📁 Export as JSON"
3. File downloads automatically

#### **JSON Format**:
```json
{
  "tokens": [
    {
      "name": "primary-blue",
      "category": "color",
      "value": "#007bff",
      "description": "Primary brand color",
      "tags": ["primary", "brand"]
    }
  ]
}
```

### **🎨 Features:**

- **Tab Navigation**: Easy switching between components and tokens
- **Visual Previews**: Color swatches, typography samples, spacing indicators
- **Search & Filter**: Find items by name, category, or description
- **Statistics**: Real-time counts for both components and tokens
- **Import/Export**: Bulk operations for tokens
- **Responsive Design**: Works on all devices

### **🔐 Login**:
- Email: `tokenadmin@example.com`
- Password: `admin123`

Now you have everything in one place - components AND tokens with full import/export functionality! The interface is clean, organized, and uses your original design system colors. 

## ✅ **Global Theme Mode Implementation:**

### **🎯 Consistent Theme Management Across All Pages:**

#### **1. Home Page (`/`) - ✅ Added**
- **CSS Variables** - Light/dark theme support
- **Theme Toggle Button** - Top-right corner
- **localStorage Persistence** - Theme saved across sessions
- **Lucide Icons** - Sun/moon icons for theme toggle

#### **2. Components Manager (`/components`) - ✅ Already Had**
- **Complete theme support** - All elements adapt to theme
- **Sidebar theme toggle** - In settings section
- **Consistent implementation** - Matches other pages

#### **3. Documentation (`/docs`) - ✅ Updated**
- **Fixed theme button text** - Now updates properly
- **Consistent function signatures** - Matches other pages
- **Proper theme initialization** - Uses saved theme on load

### **🔧 Technical Implementation:**

#### **CSS Variables (All Pages):**
```css
:root {
    /* Light theme */
    --bg-primary: #FBFAF4;
    --bg-secondary: #FBFAF8;
    --text-primary: #333;
    --text-secondary: #666;
    --accent-color: #02514E;
    --accent-hover: #CCE6C8;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --card-bg: #FCFCF9;
}

[data-theme="dark"] {
    /* Dark theme */
    --bg-primary: #1a1a1a;
    --bg-secondary: #031B20;
    --text-primary: #EAEEEF;
    --text-secondary: #b0b0b0;
    --accent-color: #4ade80;
    --accent-hover: #22c55e;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    --card-bg: #031B20;
}
```

#### **JavaScript Functions (All Pages):**
```javascript
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    
    if (theme === 'dark') {
        icon.setAttribute('data-lucide', 'sun');
        text.textContent = 'Light Mode';
    } else {
        icon.setAttribute('data-lucide', 'moon');
        text.textContent = 'Dark Mode';
    }
    
    lucide.createIcons();
}
```

### **🎨 Global Persistence:**

#### **localStorage Key:**
- **`theme`** - Stores 'light' or 'dark'
- **Shared across all pages** - Same browser session
- **Persists across sessions** - Remembers user preference

#### **Theme Application:**
- **`data-theme` attribute** - Applied to `<html>` element
- **CSS variables** - Automatically adapt based on theme
- **Instant switching** - No page reload required

### **🎨 Theme Elements:**

#### **Home Page:**
- **Background** - Primary/secondary colors
- **Text** - Primary/secondary text colors
- **Buttons** - Accent colors and hover states
- **Cards** - Background and shadow colors
- **Icons** - Accent color backgrounds

#### **Components Manager:**
- **Sidebar** - Background and border colors
- **Content areas** - Background and text colors
- **Forms** - Input backgrounds and borders
- **Modals** - Background and border colors
- **Tables** - Background and border colors

#### **Documentation:**
- **Content sections** - Background and border colors
- **Code blocks** - Background colors
- **Navigation** - Text and hover colors
- **Headers** - Text colors

### **✨ Benefits:**
- **Consistent experience** - Same theme across all pages
- **User preference** - Remembers theme choice
- **Professional appearance** - Cohesive design system
- **Accessibility** - Supports user preferences
- **Modern UX** - Smooth theme transitions

The theme mode is now applied globally across all pages with consistent implementation and persistence! 