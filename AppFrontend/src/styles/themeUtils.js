import { alpha } from '@mui/material/styles';
import { colors } from './themeTokens';

/**
 * Creates a color with opacity
 * @param {string} color - The base color (either a direct color value or a key from the theme)
 * @param {number} opacity - Opacity level (0-1)
 * @returns {string} - RGBA color string
 */
export const withOpacity = (color, opacity = 0.1) => {
  // Check if color is a key in our colors object
  if (typeof color === 'string' && color.includes('.')) {
    const [category, shade] = color.split('.');
    if (colors[category] && colors[category][shade]) {
      return alpha(colors[category][shade], opacity);
    }
  }
  
  // Use the color directly
  return alpha(color, opacity);
};

/**
 * Generates a linear gradient between two colors
 * @param {string} startColor - Starting color
 * @param {string} endColor - Ending color
 * @param {string} direction - Direction of gradient (to right, to bottom, etc.)
 * @returns {string} - CSS gradient string
 */
export const linearGradient = (startColor, endColor, direction = 'to right') => {
  return `linear-gradient(${direction}, ${startColor}, ${endColor})`;
};

/**
 * Generates a responsive style object for different breakpoints
 * @param {string} property - CSS property name
 * @param {Object} values - Values for different breakpoints (xs, sm, md, lg, xl)
 * @returns {Object} - Responsive style object
 */
export const responsive = (property, values) => {
  const result = {};
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    if (breakpoint === 'xs') {
      result[property] = value;
    } else {
      result[`@media (min-width: ${breakpoint}px)`] = {
        [property]: value,
      };
    }
  });
  
  return result;
};

/**
 * Creates a focus ring style
 * @param {string} color - Color of the focus ring
 * @param {number} size - Size of the focus ring in pixels
 * @returns {Object} - Focus ring style object
 */
export const focusRing = (color = colors.primary.main, size = 3) => ({
  outline: 'none',
  boxShadow: `0 0 0 ${size}px ${alpha(color, 0.2)}`,
});

/**
 * Truncates text with ellipsis
 * @param {number} lines - Number of lines to show before truncating
 * @returns {Object} - CSS properties for text truncation
 */
export const truncateText = (lines = 1) => {
  if (lines === 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
  }
  
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
  };
};

export default {
  withOpacity,
  linearGradient,
  responsive,
  focusRing,
  truncateText,
}; 