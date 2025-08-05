// Integration Examples for Components API
// This file shows how to integrate the Components API into different applications

// ============================================================================
// 1. FRONTEND INTEGRATION (React, Vue, Angular, Vanilla JS)
// ============================================================================

// React Hook for Components API
const useComponentsAPI = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const API_BASE = 'http://localhost:3000/api';

  const fetchComponents = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE}/components?${queryParams}`);
      const data = await response.json();
      setComponents(data.components);
      setError(null);
    } catch (err) {
      setError('Failed to fetch components');
    } finally {
      setLoading(false);
    }
  };

  const createComponent = async (componentData) => {
    try {
      const response = await fetch(`${API_BASE}/components`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(componentData)
      });
      
      if (!response.ok) throw new Error('Failed to create component');
      
      const newComponent = await response.json();
      setComponents(prev => [newComponent, ...prev]);
      return newComponent;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateComponent = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/components/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error('Failed to update component');
      
      const updatedComponent = await response.json();
      setComponents(prev => 
        prev.map(comp => comp._id === id ? updatedComponent : comp)
      );
      return updatedComponent;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteComponent = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/components/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete component');
      
      setComponents(prev => prev.filter(comp => comp._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    components,
    loading,
    error,
    fetchComponents,
    createComponent,
    updateComponent,
    deleteComponent
  };
};

// ============================================================================
// 2. COMPONENT LIBRARY BUILDER
// ============================================================================

class ComponentLibraryBuilder {
  constructor(apiBase = 'http://localhost:3000/api') {
    this.apiBase = apiBase;
    this.token = localStorage.getItem('authToken');
  }

  async buildComponentLibrary() {
    try {
      // Fetch all active components
      const response = await fetch(`${this.apiBase}/components?status=active`);
      const { components } = await response.json();

      // Generate CSS bundle
      const cssBundle = this.generateCSSBundle(components);
      
      // Generate JavaScript bundle
      const jsBundle = this.generateJSBundle(components);
      
      // Generate documentation
      const docs = this.generateDocumentation(components);

      return {
        css: cssBundle,
        js: jsBundle,
        docs: docs,
        components: components
      };
    } catch (error) {
      console.error('Failed to build component library:', error);
      throw error;
    }
  }

  generateCSSBundle(components) {
    let css = '/* Component Library CSS Bundle */\n\n';
    
    components.forEach(component => {
      if (component.styles && component.styles.css) {
        css += `/* ${component.name} */\n`;
        css += component.styles.css;
        css += '\n\n';
      }
    });
    
    return css;
  }

  generateJSBundle(components) {
    let js = '// Component Library JavaScript Bundle\n\n';
    
    components.forEach(component => {
      if (component.code && component.code.react) {
        js += `// ${component.name}\n`;
        js += component.code.react;
        js += '\n\n';
      }
    });
    
    return js;
  }

  generateDocumentation(components) {
    let docs = '# Component Library Documentation\n\n';
    
    components.forEach(component => {
      docs += `## ${component.name}\n\n`;
      docs += `${component.description}\n\n`;
      
      if (component.props && component.props.length > 0) {
        docs += '### Props\n\n';
        docs += '| Name | Type | Required | Default | Description |\n';
        docs += '|------|------|----------|---------|-------------|\n';
        
        component.props.forEach(prop => {
          docs += `| ${prop.name} | ${prop.type} | ${prop.required ? 'Yes' : 'No'} | ${prop.defaultValue || '-'} | ${prop.description} |\n`;
        });
        docs += '\n';
      }
      
      if (component.examples && component.examples.length > 0) {
        docs += '### Examples\n\n';
        component.examples.forEach(example => {
          docs += `#### ${example.name}\n\n`;
          docs += `${example.description}\n\n`;
          docs += '```jsx\n';
          docs += example.code;
          docs += '\n```\n\n';
        });
      }
    });
    
    return docs;
  }
}

// ============================================================================
// 3. DESIGN SYSTEM INTEGRATION
// ============================================================================

class DesignSystemManager {
  constructor(apiBase = 'http://localhost:3000/api') {
    this.apiBase = apiBase;
    this.token = localStorage.getItem('authToken');
  }

  async getDesignSystem() {
    try {
      // Fetch both tokens and components
      const [tokensResponse, componentsResponse] = await Promise.all([
        fetch(`${this.apiBase}/tokens`),
        fetch(`${this.apiBase}/components?status=active`)
      ]);

      const tokens = await tokensResponse.json();
      const { components } = await componentsResponse.json();

      return {
        tokens: tokens.tokens || tokens,
        components: components,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch design system:', error);
      throw error;
    }
  }

  async generateDesignTokensCSS() {
    try {
      const response = await fetch(`${this.apiBase}/tokens`);
      const tokens = await response.json();
      
      let css = ':root {\n';
      
      (tokens.tokens || tokens).forEach(token => {
        const cssVariable = `--${token.category}-${token.name}`.toLowerCase();
        css += `  ${cssVariable}: ${token.value};\n`;
      });
      
      css += '}\n';
      return css;
    } catch (error) {
      console.error('Failed to generate CSS variables:', error);
      throw error;
    }
  }

  async generateComponentLibrary() {
    const builder = new ComponentLibraryBuilder(this.apiBase);
    return await builder.buildComponentLibrary();
  }
}

// ============================================================================
// 4. BUILD TOOL INTEGRATION (Webpack, Vite, etc.)
// ============================================================================

// Webpack Plugin Example
class ComponentsAPIPlugin {
  constructor(options = {}) {
    this.apiBase = options.apiBase || 'http://localhost:3000/api';
    this.outputPath = options.outputPath || './src/components-library';
  }

  apply(compiler) {
    compiler.hooks.beforeRun.tapAsync('ComponentsAPIPlugin', async (compilation, callback) => {
      try {
        console.log('Fetching components from API...');
        
        const response = await fetch(`${this.apiBase}/components?status=active`);
        const { components } = await response.json();
        
        // Generate component files
        await this.generateComponentFiles(components);
        
        console.log(`Generated ${components.length} component files`);
        callback();
      } catch (error) {
        console.error('Failed to fetch components:', error);
        callback();
      }
    });
  }

  async generateComponentFiles(components) {
    const fs = require('fs').promises;
    const path = require('path');

    // Ensure output directory exists
    await fs.mkdir(this.outputPath, { recursive: true });

    // Generate index file
    let indexContent = '// Auto-generated component library\n\n';
    
    for (const component of components) {
      if (component.code && component.code.react) {
        const fileName = `${component.name}.jsx`;
        const filePath = path.join(this.outputPath, fileName);
        
        // Write component file
        await fs.writeFile(filePath, component.code.react);
        
        // Add to index
        indexContent += `export { default as ${component.name} } from './${fileName}';\n`;
      }
    }
    
    // Write index file
    await fs.writeFile(path.join(this.outputPath, 'index.js'), indexContent);
  }
}

// ============================================================================
// 5. CMS INTEGRATION
// ============================================================================

class CMSComponentsManager {
  constructor(apiBase = 'http://localhost:3000/api') {
    this.apiBase = apiBase;
    this.token = localStorage.getItem('authToken');
  }

  async getComponentsForCMS() {
    try {
      const response = await fetch(`${this.apiBase}/components?status=active`);
      const { components } = await response.json();
      
      // Format components for CMS consumption
      return components.map(component => ({
        id: component._id,
        name: component.name,
        type: component.type,
        description: component.description,
        props: component.props,
        examples: component.examples,
        code: component.code,
        tags: component.tags
      }));
    } catch (error) {
      console.error('Failed to fetch components for CMS:', error);
      throw error;
    }
  }

  async createComponentFromCMS(cmsData) {
    try {
      const componentData = {
        name: cmsData.name,
        type: cmsData.type,
        description: cmsData.description,
        props: cmsData.props || [],
        styles: {
          css: cmsData.css || '',
          scss: cmsData.scss || ''
        },
        code: {
          react: cmsData.reactCode || '',
          html: cmsData.htmlCode || ''
        },
        examples: cmsData.examples || [],
        tags: cmsData.tags || [],
        status: 'active'
      };

      const response = await fetch(`${this.apiBase}/components`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(componentData)
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to create component from CMS:', error);
      throw error;
    }
  }
}

// ============================================================================
// 6. USAGE EXAMPLES
// ============================================================================

// Example 1: React Component Library
const ReactComponentLibrary = () => {
  const { components, loading, error, fetchComponents } = useComponentsAPI();

  useEffect(() => {
    fetchComponents({ status: 'active', type: 'button' });
  }, []);

  if (loading) return <div>Loading components...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="component-library">
      <h1>Component Library</h1>
      <div className="components-grid">
        {components.map(component => (
          <div key={component._id} className="component-card">
            <h3>{component.name}</h3>
            <p>{component.description}</p>
            <div className="component-preview">
              {/* Render component preview */}
            </div>
            <div className="component-code">
              <pre>{component.code?.react}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 2: Build-time Integration
const buildDesignSystem = async () => {
  const designSystem = new DesignSystemManager();
  
  try {
    // Generate CSS variables from design tokens
    const cssVariables = await designSystem.generateDesignTokensCSS();
    
    // Generate component library
    const componentLibrary = await designSystem.generateComponentLibrary();
    
    // Write files
    const fs = require('fs').promises;
    await fs.writeFile('./src/styles/design-tokens.css', cssVariables);
    await fs.writeFile('./src/styles/component-library.css', componentLibrary.css);
    await fs.writeFile('./src/components/index.js', componentLibrary.js);
    
    console.log('Design system built successfully!');
  } catch (error) {
    console.error('Failed to build design system:', error);
  }
};

// Example 3: CMS Integration
const cmsIntegration = async () => {
  const cmsManager = new CMSComponentsManager();
  
  try {
    // Get components for CMS
    const components = await cmsManager.getComponentsForCMS();
    
    // Use in CMS
    components.forEach(component => {
      console.log(`Available component: ${component.name}`);
      console.log(`Props:`, component.props);
      console.log(`Examples:`, component.examples);
    });
  } catch (error) {
    console.error('CMS integration failed:', error);
  }
};

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    useComponentsAPI,
    ComponentLibraryBuilder,
    DesignSystemManager,
    ComponentsAPIPlugin,
    CMSComponentsManager,
    ReactComponentLibrary,
    buildDesignSystem,
    cmsIntegration
  };
} 