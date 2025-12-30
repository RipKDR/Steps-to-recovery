/**
 * Centralized theme configuration
 * Provides consistent colors, spacing, typography, and border radius
 * Following privacy-first, calming design principles
 */

export const theme = {
  colors: {
    // Primary brand colors - calm blues and greens
    primary: '#4F8FC0',      // Calm blue
    secondary: '#68B684',    // Soft green
    background: '#F5F7FA',   // Light gray background
    surface: '#FFFFFF',      // White surface
    text: '#333333',         // Dark gray text
    textSecondary: '#666666', // Medium gray text
    error: '#E63946',        // Red for errors
    success: '#06D6A0',      // Green for success
    warning: '#F4A261',      // Orange for warnings
    border: '#E0E0E0',       // Light gray border

    // Dark mode (for future implementation)
    backgroundDark: '#1A1A1A',
    surfaceDark: '#2C2C2C',
    textDark: '#FFFFFF',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 'bold' as const,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal' as const,
    },
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};
