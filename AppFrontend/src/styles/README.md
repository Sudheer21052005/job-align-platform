# JobAlign Theme System

This document explains the theme system and styling approach used in the JobAlign project.

## Overview

The JobAlign application uses a white and light purple color scheme implemented through a centralized theme system. The theme is designed for maintainability, consistency, and flexibility across the application.

## Theme Architecture

The theme system consists of several key files:

### 1. themeTokens.js

Contains all design tokens - colors, spacing, shadows, etc. This is the single source of truth for all design values.

```js
// Example usage
import { colors, spacing } from './styles/themeTokens';

console.log(colors.primary.main); // "#8A4FFF"
console.log(spacing.md); // 16
```

### 2. theme.js

Creates the Material UI theme using the tokens defined in themeTokens.js.

```js
// Example usage
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return <div style={{ color: theme.palette.primary.main }}>Themed text</div>;
}
```

### 3. designSystem.js

Provides reusable style presets and composition helpers for consistent styling.

```js
// Example usage
import { stylePresets } from './styles/designSystem';

const styles = {
  card: stylePresets.card.interactive,
  button: stylePresets.button.primary
};
```

### 4. themeUtils.js

Helper functions for working with the theme, like creating colors with opacity, gradients, etc.

```js
// Example usage
import { withOpacity, linearGradient } from './styles/themeUtils';

const styles = {
  background: withOpacity('primary.main', 0.2),
  gradient: linearGradient('#8A4FFF', '#B794F6')
};
```

### 5. index.css

Global CSS styles and utility classes that use CSS variables derived from the theme tokens.

```css
/* Example usage */
<div className="card bg-primary text-white">
  This uses theme-based utility classes
</div>
```

### 6. ThemeProvider.jsx

A wrapper component that provides the theme to the entire application.

```jsx
// Example usage (already done in App.jsx)
import ThemeProvider from './styles/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Best Practices

1. **Always use theme values** - Don't hardcode colors or spacing values.
2. **Use the correct approach** for the situation:
   - Use Material UI's `sx` prop for component-specific styling
   - Use utility classes for simple styling needs
   - Use style presets from designSystem.js for common patterns
3. **Maintain consistency** by leveraging existing tokens and patterns

## Color Palette

The application uses a white and light purple color scheme:

- **Primary**: Medium purple (#8A4FFF)
- **Secondary**: Very light purple (#F0E6FF)
- **Background**: White (#FFFFFF) and Very light purple paper (#FCFAFF)
- **Text**: Dark purple (#2D2747) and Medium purple (#584D7E)

## Responsive Design

The theme is built with responsiveness in mind:

- Use the breakpoints defined in the theme (xs, sm, md, lg, xl)
- Leverage Material UI's responsive utilities in the `sx` prop
- Utilize responsive utility classes for breakpoint-specific styling

## Theme Customization

To modify the theme:

1. Update the values in `themeTokens.js`
2. The changes will propagate throughout the application

## Accessibility

The theme is designed with accessibility in mind:

- Color contrasts meet WCAG AA standards
- Focus states are clearly visible
- Text sizes are appropriate for readability 