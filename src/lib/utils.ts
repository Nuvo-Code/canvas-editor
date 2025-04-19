import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ucwords = (str: string): string => {
  return str && str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

/**
 * Generates a unique ID for shapes
 * @returns {string} A unique identifier
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Converts degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Converts radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Clamps a number between a minimum and maximum value
 * @param {number} value - The value to clamp
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} The clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Checks if two objects have the same properties and values
 * @param {object} obj1 - First object to compare
 * @param {object} obj2 - Second object to compare
 * @returns {boolean} True if objects are equal
 */
export const areObjectsEqual = (obj1: object, obj2: object): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Creates a debounced version of a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} The debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Formats a color string to a valid hex color
 * @param {string} color - The color string to format
 * @returns {string} A valid hex color string
 */
export const formatColor = (color: string): string => {
  if (color.startsWith('#')) {
    return color;
  }
  return `#${color}`;
};

/**
 * Gets the center point of a shape based on its position and dimensions
 * @param {{x: number, y: number, width?: number, height?: number, radius?: number}} shape
 * @returns {{x: number, y: number}} The center point coordinates
 */
export const getShapeCenter = (shape: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
}): { x: number; y: number } => {
  if (shape.radius) {
    return {
      x: shape.x + shape.radius,
      y: shape.y + shape.radius,
    };
  }

  if (shape.width && shape.height) {
    return {
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 2,
    };
  }

  return { x: shape.x, y: shape.y };
};

/**
 * Gets the export pixel ratio from environment variables
 * @returns {number} The pixel ratio to use for exports
 */
export const getExportPixelRatio = (): number => {
  const envRatio = import.meta.env.VITE_EXPORT_PIXEL_RATIO;
  if (envRatio && !isNaN(Number(envRatio))) {
    return Number(envRatio);
  }
  return 2; // Default fallback value
};

/**
 * Gets the designable area configuration from environment variables
 * @returns {Object} The designable area configuration
 */
export const getDesignableAreaConfig = () => {
  return {
    x: Number(import.meta.env.VITE_DESIGNABLE_AREA_X) || 150,
    y: Number(import.meta.env.VITE_DESIGNABLE_AREA_Y) || 150,
    width: Number(import.meta.env.VITE_DESIGNABLE_AREA_WIDTH) || 300,
    height: Number(import.meta.env.VITE_DESIGNABLE_AREA_HEIGHT) || 300,
    visible: import.meta.env.VITE_DESIGNABLE_AREA_VISIBLE !== 'false'
  };
};