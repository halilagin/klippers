# CLAUDE.md - qSign Project Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Code Style Guidelines
- **Imports:** React first, then components, then CSS files
- **Component Format:** React functional components using arrow functions
- **Naming Conventions:** PascalCase for components, camelCase for variables
- **Component Files:** Each component has matching .jsx and .css files
- **Formatting:** 2-space indentation
- **Exports:** Default exports at end of file
- **Structure:** Organize related components in subdirectories
- **Components:** Keep components focused on single responsibility
- **State Management:** Use React hooks for state (useState, useEffect)

## Project Organization
- `/src/components` - React components
- `/public` - Static assets
- `/src/App.jsx` - Main application component

## Implementation Notes
- Document-based UI with filtering capabilities
- Uses Font Awesome for icons