# Task 1.1: Preserve & Restructure Existing PoC

## Task Overview
**Estimated Time:** 2-3 hours  
**Priority:** High  
**Dependencies:** None

**Description:** Restructure the existing PoC code into a proper project structure while preserving all current calendar functionality.

## AI Implementation Prompts

### Prompt 1: Analyze Current PoC Structure
```
Please analyze the current travel planner PoC codebase and identify:

1. All existing files and their current locations
2. The main calendar component and its dependencies
3. Current styling and CSS structure
4. Existing event handling and user interactions
5. Any hardcoded test data or configurations

Create a detailed inventory of what needs to be preserved during restructuring.
```

### Prompt 2: Create New Project Structure
```
Create a proper React project structure for the travel planner application:

1. Create the following directory structure:
   - src/
   - src/components/
   - src/components/ui/
   - src/components/calendar/
   - src/components/layout/
   - src/pages/
   - src/services/
   - src/hooks/
   - src/utils/
   - src/styles/
   - src/tests/

2. Move existing files to appropriate locations:
   - Move current App.jsx to src/App.jsx
   - Move current App.css to src/styles/App.css
   - Move current index.css to src/styles/index.css
   - Move current main.jsx to src/main.jsx

3. Ensure all import paths are updated correctly
4. Verify the application still runs after restructuring
```

### Prompt 3: Update Package.json and Dependencies
```
Update the package.json file to include all necessary dependencies for the travel planner:

1. Preserve existing dependencies (react, react-dom, react-big-calendar, date-fns, vite)
2. Add new dependencies:
   - react-router-dom (for routing)
   - better-sqlite3 (for database)
   - express (for backend)
   - cors (for CORS handling)
   - multer (for file uploads)
   - @types/node (if using TypeScript)

3. Add development dependencies:
   - @types/react
   - @types/react-dom
   - @vitejs/plugin-react
   - eslint
   - prettier

4. Update scripts section with:
   - dev: "vite"
   - build: "vite build"
   - preview: "vite preview"
   - server: "node server/app.js"

5. Ensure the application still runs with updated dependencies
```

### Prompt 4: Configure Vite and Build Tools
```
Set up Vite configuration and build tools:

1. Create vite.config.js with:
   - React plugin enabled
   - Port 3000 for development
   - Auto-open browser
   - Proper alias configuration for src/ directory

2. Create .gitignore file with:
   - node_modules/
   - dist/
   - .env files
   - database files
   - uploads/
   - logs/

3. Set up ESLint configuration:
   - React and JSX rules
   - Import/export rules
   - Basic formatting rules

4. Set up Prettier configuration:
   - Consistent code formatting
   - 2-space indentation
   - Single quotes
   - Trailing commas

5. Test that the build process works correctly
```

### Prompt 5: Verify Calendar Functionality
```
After restructuring, verify that the existing calendar PoC still works:

1. Test that the calendar renders correctly
2. Verify hourly view is displayed properly
3. Test event creation by clicking on time slots
4. Verify event editing functionality
5. Test event deletion
6. Check that all styling is preserved
7. Verify date navigation works
8. Test responsive behavior

If any functionality is broken, identify the issue and fix it immediately.
```

### Prompt 6: Create Documentation
```
Create documentation for the current PoC features:

1. Create README.md documenting:
   - Current calendar functionality
   - How to use the calendar
   - Existing features and interactions
   - Current styling and layout
   - Test data and examples

2. Document the restructuring changes made
3. Create a setup guide for new developers
4. Document any known issues or limitations
5. Create a feature roadmap for future development
```

## Acceptance Criteria Checklist
- [ ] Move existing `src/App.jsx` to preserve current calendar implementation
- [ ] Create proper folder structure (`src/`, `src/components/`, `src/services/`, etc.)
- [ ] Update `package.json` with all required dependencies (preserve existing ones)
- [ ] Set up Vite configuration (`vite.config.js`) - ensure calendar still works
- [ ] Create `.gitignore` file
- [ ] Verify existing calendar renders correctly after restructuring
- [ ] Document current PoC features and functionality
- [ ] Preserve all existing calendar styling and behavior

## Files to Create/Modify
- `package.json` (extend existing)
- `vite.config.js` (new, but preserve functionality)
- `.gitignore` (new)
- `README.md` (document current PoC features)
- Move existing files to new structure

## Important Notes
- **Test that the existing timeline calendar with hourly events still works after restructuring**
- **Preserve all existing functionality and styling**
- **Update all import paths correctly**
- **Verify the application runs without errors**
- **Document everything for future development**
