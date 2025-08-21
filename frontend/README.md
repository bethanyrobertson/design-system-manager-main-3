# Design System Manager - React Frontend

A modern React application for managing design systems, components, and design tokens.

## Features

- **Dashboard**: Overview of your design system with stats and quick actions
- **Component Library**: Manage and organize design system components
- **Design Tokens**: Centralized management of colors, typography, spacing, and more
- **Documentation**: Comprehensive guides and references
- **Settings**: User preferences and account management
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes
- **Collapsible Sidebar**: Space-efficient navigation

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Beautiful & consistent icon toolkit

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── app-sidebar.jsx # Main navigation sidebar
├── pages/              # Page components
│   ├── Dashboard.jsx   # Dashboard page
│   ├── Components.jsx  # Component library
│   ├── Tokens.jsx      # Design tokens
│   ├── Documentation.jsx # Documentation
│   └── Settings.jsx    # Settings page
├── lib/                # Utility functions
│   └── utils.js        # Class name utilities
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles and Tailwind
```

## Backend Integration

This frontend is designed to work with the existing Express.js backend. The backend provides:

- REST API endpoints for components and tokens
- MongoDB database for data persistence
- Authentication and user management
- File uploads and management

## Customization

### Colors and Themes

The design system uses CSS custom properties for theming. You can customize:

- Primary colors
- Background colors
- Text colors
- Border colors
- Accent colors

### Adding New Components

1. Create a new component in `src/components/`
2. Add it to the appropriate page
3. Update the navigation if needed

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add it to the navigation in `AppSidebar`
3. Update the routing logic in `App.jsx`

## Contributing

1. Follow the existing code style
2. Use Tailwind CSS classes for styling
3. Keep components small and focused
4. Add proper TypeScript types if migrating to TS

## License

MIT License - see the main project license for details.
