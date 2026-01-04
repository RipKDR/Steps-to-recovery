/**
 * iOS-style color palette for Steps to Recovery
 * Supports light and dark modes
 */

export const lightColors = {
  // Primary colors - iOS blue
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',

  // Secondary colors - iOS green
  secondary: '#34C759',
  secondaryLight: '#52D769',
  secondaryDark: '#248A3D',

  // Semantic colors
  danger: '#FF3B30',
  dangerLight: '#FF6961',
  success: '#34C759',
  successMuted: 'rgba(52, 199, 89, 0.2)',
  warning: '#FF9500',
  info: '#5AC8FA',

  // Neutral colors
  muted: '#8E8E93',
  disabled: '#C7C7CC',

  // Background colors
  background: '#F2F2F7',      // iOS grouped background
  surface: '#FFFFFF',          // Card background
  surfaceElevated: '#FFFFFF',  // Elevated card
  surfaceVariant: '#F2F2F7',   // Variant surface color

  // Text colors
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textInverse: '#FFFFFF',

  // Border colors
  border: 'rgba(0, 0, 0, 0.1)',
  borderLight: 'rgba(0, 0, 0, 0.05)',
  divider: 'rgba(0, 0, 0, 0.1)',

  // Interactive states
  pressed: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export const darkColors = {
  // Primary colors - Reference app bright blue
  primary: '#5B9EFF',
  primaryLight: '#7DB3FF',
  primaryDark: '#3D7FE5',

  // Secondary colors - Reference app green/teal (streak color)
  secondary: '#00D4AA',
  secondaryLight: '#33DFC0',
  secondaryDark: '#00A888',

  // Semantic colors
  danger: '#FF453A',
  dangerLight: '#FF7A73',
  success: '#00D4AA',        // Match secondary for consistency
  successMuted: 'rgba(0, 212, 170, 0.2)',
  warning: '#FF9F0A',
  info: '#5B9EFF',           // Match primary

  // Neutral colors
  muted: '#8E8E93',
  disabled: '#48484A',

  // Background colors - Reference app dark navy theme
  background: '#0B1120',          // Dark navy-black
  surface: '#1A2332',             // Navy card background
  surfaceElevated: '#232F42',     // Elevated navy card
  surfaceVariant: '#141B28',      // Variant surface (darker)

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#5A6475',
  textInverse: '#000000',

  // Border colors
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.04)',
  divider: 'rgba(255, 255, 255, 0.08)',

  // Interactive states
  pressed: 'rgba(91, 158, 255, 0.15)',  // Blue tint on press
  overlay: 'rgba(0, 0, 0, 0.85)',
} as const;

/**
 * Category colors for recovery features
 * (Same in light and dark modes for consistency)
 */
export const categoryColors = {
  gratitude: '#FFD700',    // Gold
  reflection: '#007AFF',   // Blue
  action: '#34C759',       // Green
  connection: '#FF9500',   // Orange
  'self-care': '#AF52DE',  // Purple
  sponsor: '#FF3B30',      // Red
  meeting: '#5AC8FA',      // Cyan
} as const;

// Export a flexible color palette type that works for both light and dark
export type ColorPalette = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  danger: string;
  dangerLight: string;
  success: string;
  successMuted: string;
  warning: string;
  info: string;
  muted: string;
  disabled: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  borderLight: string;
  divider: string;
  pressed: string;
  overlay: string;
};

export type CategoryColor = keyof typeof categoryColors;
