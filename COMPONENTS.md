# Components API Documentation

This document describes the Components API that has been added to your Design System Manager. The Components API allows you to store, manage, and retrieve reusable UI components alongside your design tokens.

## Overview

The Components API provides a comprehensive system for managing UI components with the following features:

- **Component Storage**: Store component definitions with props, styles, and code examples
- **Multiple Framework Support**: Store code examples for React, Vue, Angular, and HTML
- **Version Control**: Track component versions and dependencies
- **Search & Filtering**: Find components by type, status, tags, or text search
- **Authentication**: Secure component creation, updates, and deletion
- **Status Management**: Track component lifecycle (draft, active, deprecated)

## Component Model

Each component includes the following properties:

### Required Fields
- `name`: Unique component name
- `type`: Component type (button, input, card, modal, navigation, form, layout, typography, icon, other)
- `createdBy`: User ID who created the component

### Optional Fields
- `description`: Component description
- `props`: Array of component properties with type, required status, and descriptions
- `styles`: CSS, SCSS, or CSS-in-JS code
- `code`: Framework-specific code examples (React, Vue, Angular, HTML)
- `examples`: Usage examples with descriptions and previews
- `tags`: Array of tags for categorization
- `status`: Component status (draft, active, deprecated)
- `version`: Component version (default: 1.0.0)
- `dependencies`: Array of component dependencies

## API Endpoints

### Get All Components
```
GET /api/components
```

**Query Parameters:**
- `type`: Filter by component type
- `status`: Filter by component status
- `search`: Text search across name, description, and tags
- `tags`: Filter by tags (comma-separated)
- `page`: Page number for pagination (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort direction (asc/desc, default: desc)

**Response:**
```json
{
  "components": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Component by ID
```
GET /api/components/:id
```

### Create Component
```
POST /api/components
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "PrimaryButton",
  "type": "button",
  "description": "A primary action button",
  "props": [
    {
      "name": "children",
      "type": "string",
      "required": true,
      "description": "Button text content"
    }
  ],
  "styles": {
    "css": ".primary-button { ... }"
  },
  "code": {
    "react": "const PrimaryButton = ({ children }) => { ... }"
  },
  "tags": ["button", "primary", "ui"],
  "status": "active"
}
```

### Update Component
```
PUT /api/components/:id
Authorization: Bearer <token>
```

### Delete Component
```
DELETE /api/components/:id
Authorization: Bearer <token>
```

### Get Components by Type
```
GET /api/components/type/:type
```

### Search Components
```
GET /api/components/search/:query
```

### Get Component Statistics
```
GET /api/components/stats/overview
```

## Usage Examples

### Creating a Button Component

```javascript
const componentData = {
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
      }
    `
  },
  code: {
    react: `
      const PrimaryButton = ({ children, onClick, disabled }) => {
        return (
          <button
            className="primary-button"
            onClick={onClick}
            disabled={disabled}
          >
            {children}
          </button>
        );
      };
    `
  },
  examples: [
    {
      name: 'Basic Usage',
      description: 'Simple primary button',
      code: '<PrimaryButton onClick={handleClick}>Submit</PrimaryButton>'
    }
  ],
  tags: ['button', 'primary', 'action'],
  status: 'active'
};

// Create the component
const response = await fetch('/api/components', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(componentData)
});
```

### Searching for Components

```javascript
// Search for button components
const response = await fetch('/api/components?type=button&status=active');

// Search by text
const searchResponse = await fetch('/api/components/search/primary');

// Get components by type
const buttonComponents = await fetch('/api/components/type/button');
```

## Sample Data

The API includes sample components that can be seeded into your database:

1. **PrimaryButton**: A primary action button component
2. **InputField**: A reusable input field with validation
3. **Card**: A flexible card component for content display

To seed the database with sample components:

```bash
npm run seed:components
```

## Testing

Run the component tests:

```bash
npm test tests/components.test.js
```

## Integration with Design Tokens

Components can reference design tokens for consistent styling. You can:

1. Store design tokens in the `/api/tokens` endpoint
2. Reference token values in component styles
3. Maintain consistency across your design system

## Best Practices

1. **Naming**: Use descriptive, consistent naming conventions
2. **Documentation**: Provide clear descriptions and usage examples
3. **Props**: Define all props with types and descriptions
4. **Examples**: Include multiple usage examples
5. **Tags**: Use relevant tags for easy discovery
6. **Versioning**: Update versions when making breaking changes
7. **Status**: Use appropriate status to track component lifecycle

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

Error responses include descriptive messages:

```json
{
  "error": "Component with this name already exists"
}
```

## Authentication

Most component operations require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by logging in through the `/api/auth/login` endpoint. 