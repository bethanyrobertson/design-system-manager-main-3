// Sample components data for testing and demonstration
const sampleComponents = [
  {
    name: 'PrimaryButton',
    type: 'button',
    description: 'A primary action button with consistent styling',
    props: [
      {
        name: 'children',
        type: 'string',
        required: true,
        description: 'Button text content'
      },
      {
        name: 'onClick',
        type: 'function',
        required: false,
        description: 'Click handler function'
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Whether the button is disabled'
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
.primary-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #0056b3;
}

.primary-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.primary-button.small {
  padding: 4px 8px;
  font-size: 12px;
}

.primary-button.large {
  padding: 12px 24px;
  font-size: 16px;
}
      `,
      scss: `
.primary-button {
  background-color: $primary-color;
  color: white;
  border: none;
  border-radius: $border-radius;
  padding: $spacing-md $spacing-lg;
  font-size: $font-size-base;
  cursor: pointer;
  transition: background-color $transition-duration;
  
  &:hover {
    background-color: darken($primary-color, 10%);
  }
  
  &:disabled {
    background-color: $gray-500;
    cursor: not-allowed;
  }
  
  &.small {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-sm;
  }
  
  &.large {
    padding: $spacing-lg $spacing-xl;
    font-size: $font-size-lg;
  }
}
      `
    },
    code: {
      react: `
import React from 'react';
import './PrimaryButton.css';

const PrimaryButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  size = 'medium',
  className = '',
  ...props 
}) => {
  return (
    <button
      className={\`primary-button \${size} \${className}\`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
      `,
      html: `
<button class="primary-button medium" onclick="handleClick()">
  Click me
</button>
      `
    },
    examples: [
      {
        name: 'Basic Usage',
        description: 'Simple primary button with default styling',
        code: '<PrimaryButton onClick={handleClick}>Submit</PrimaryButton>',
        preview: 'A blue button with white text saying "Submit"'
      },
      {
        name: 'Disabled State',
        description: 'Primary button in disabled state',
        code: '<PrimaryButton disabled>Loading...</PrimaryButton>',
        preview: 'A grayed-out button with "Loading..." text'
      },
      {
        name: 'Different Sizes',
        description: 'Primary buttons in different sizes',
        code: `
<PrimaryButton size="small">Small</PrimaryButton>
<PrimaryButton size="medium">Medium</PrimaryButton>
<PrimaryButton size="large">Large</PrimaryButton>
        `,
        preview: 'Three buttons of different sizes'
      }
    ],
    tags: ['button', 'primary', 'action', 'ui'],
    status: 'active',
    version: '1.0.0',
    dependencies: [
      { name: 'react', version: '^18.0.0' }
    ]
  },
  {
    name: 'InputField',
    type: 'input',
    description: 'A reusable input field component with validation support',
    props: [
      {
        name: 'value',
        type: 'string',
        required: true,
        description: 'Input value'
      },
      {
        name: 'onChange',
        type: 'function',
        required: true,
        description: 'Change handler function'
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description: 'Placeholder text'
      },
      {
        name: 'type',
        type: 'string',
        required: false,
        defaultValue: 'text',
        description: 'Input type: text, email, password, etc.'
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description: 'Error message to display'
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Input label'
      }
    ],
    styles: {
      css: `
.input-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.input-field label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
}

.input-field input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input-field input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.input-field.error input {
  border-color: #dc3545;
}

.input-field .error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}
      `
    },
    code: {
      react: `
import React from 'react';
import './InputField.css';

const InputField = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  label,
  className = '',
  ...props
}) => {
  return (
    <div className={\`input-field \${error ? 'error' : ''} \${className}\`}>
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputField;
      `
    },
    examples: [
      {
        name: 'Basic Input',
        description: 'Simple text input with label',
        code: `
<InputField
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
/>
        `,
        preview: 'A labeled input field for email'
      },
      {
        name: 'With Error',
        description: 'Input field showing error state',
        code: `
<InputField
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error="Password must be at least 8 characters"
/>
        `,
        preview: 'A password input with red border and error message'
      }
    ],
    tags: ['input', 'form', 'validation', 'ui'],
    status: 'active',
    version: '1.0.0',
    dependencies: [
      { name: 'react', version: '^18.0.0' }
    ]
  },
  {
    name: 'Card',
    type: 'card',
    description: 'A flexible card component for displaying content',
    props: [
      {
        name: 'children',
        type: 'node',
        required: true,
        description: 'Card content'
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Card title'
      },
      {
        name: 'subtitle',
        type: 'string',
        required: false,
        description: 'Card subtitle'
      },
      {
        name: 'elevation',
        type: 'number',
        required: false,
        defaultValue: '1',
        description: 'Shadow elevation level (1-5)'
      },
      {
        name: 'padding',
        type: 'string',
        required: false,
        defaultValue: '16px',
        description: 'Card padding'
      }
    ],
    styles: {
      css: `
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.card.elevation-1 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card.elevation-2 {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.card.elevation-3 {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
}

.card.elevation-4 {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
}

.card.elevation-5 {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18);
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.card-subtitle {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
}

.card-content {
  padding: 16px;
}
      `
    },
    code: {
      react: `
import React from 'react';
import './Card.css';

const Card = ({
  children,
  title,
  subtitle,
  elevation = 1,
  padding = '16px',
  className = '',
  ...props
}) => {
  return (
    <div 
      className={\`card elevation-\${elevation} \${className}\`}
      style={{ '--card-padding': padding }}
      {...props}
    >
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content" style={{ padding }}>
        {children}
      </div>
    </div>
  );
};

export default Card;
      `
    },
    examples: [
      {
        name: 'Basic Card',
        description: 'Simple card with content',
        code: `
<Card title="Card Title" subtitle="Card subtitle">
  <p>This is the card content.</p>
</Card>
        `,
        preview: 'A white card with title, subtitle, and content'
      },
      {
        name: 'Card with Elevation',
        description: 'Card with higher elevation for emphasis',
        code: `
<Card title="Featured Content" elevation={3}>
  <p>This card has higher elevation for emphasis.</p>
</Card>
        `,
        preview: 'A card with deeper shadow for emphasis'
      }
    ],
    tags: ['card', 'layout', 'content', 'ui'],
    status: 'active',
    version: '1.0.0',
    dependencies: [
      { name: 'react', version: '^18.0.0' }
    ]
  }
];

module.exports = sampleComponents; 