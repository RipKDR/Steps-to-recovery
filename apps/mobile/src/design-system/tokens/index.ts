/**
 * Design System Tokens - Unified Token System
 *
 * A complete, unified token system for the Steps to Recovery app.
 * Combines Material Design 3 principles with warm, supportive aesthetics.
 *
 * Features:
 * - Material Design 3 color roles with warm palette
 * - WCAG AAA accessibility compliance
 * - Reduced motion support
 * - Runtime theme switching
 * - NativeWind v4 compatibility
 *
 * @example
 * ```typescript
 * import { tokens, useTheme } from './tokens';
 *
 * // Access theme colors
 * const theme = useTheme('light');
 * const bgColor = ds.semantic.surface.card;
 *
 * // Access motion tokens
 * const duration = tokens.motion.durations.normal;
 * ```
 */

// =============================================================================
// PRIMITIVES - Raw color values
// =============================================================================

export {
  amber,
  coral,
  error,
  gray,
  highContrast,
  neutral,
  neutralVariant,
  primitives,
  sageGreen,
  status,
} from "./primitives.ts";

export type {
  AmberTone,
  CoralTone,
  ErrorTone,
  GrayTone,
  NeutralTone,
  NeutralVariantTone,
  Primitives,
  SageGreenTone,
} from "./primitives.ts";

// =============================================================================
// SEMANTICS - Material Design 3 color roles
// =============================================================================

export {
  background,
  disabled,
  glow,
  inverse,
  outline,
  primary,
  scrim,
  secondary,
  semantics,
  shadow,
  stateOverlay,
  surface,
  surfaceContainer,
  tertiary,
} from "./semantics.ts";

export type {
  SemanticBackground,
  SemanticDisabled,
  SemanticGlow,
  SemanticInverse,
  SemanticOutline,
  SemanticPrimary,
  Semantics,
  SemanticScrim,
  SemanticSecondary,
  SemanticShadow,
  SemanticStateOverlay,
  SemanticSurface,
  SemanticSurfaceContainer,
  SemanticTertiary,
} from "./semantics.ts";

// =============================================================================
// THEMES - Complete theme definitions
// =============================================================================

export {
  darkTheme,
  getBaseThemeVariant,
  getTheme,
  highContrastDarkTheme,
  highContrastLightTheme,
  isDarkTheme,
  isHighContrastTheme,
  lightTheme,
  themeNames,
  themes,
  toggleTheme,
} from "./themes.ts";

export type { Theme, ThemeName } from "./themes.ts";

// =============================================================================
// MOTION - Animation specifications
// =============================================================================

export {
  celebration,
  duration,
  durations,
  easing,
  easings,
  loading,
  microInteraction,
  motion,
  motionSystem,
  opacity,
  reducedMotion,
  scale,
  spring,
  transitions,
} from "./motion.ts";

export type {
  CelebrationKey,
  DurationKey,
  DurationsKey,
  EasingKey,
  EasingsKey,
  MicroInteractionKey,
  MotionConfig,
  MotionKey,
  MotionSystem,
  OpacityKey,
  ScaleKey,
  SpringConfig,
  SpringKey,
  TransitionKey,
} from "./motion.ts";

// =============================================================================
// UNIFIED TOKENS OBJECT
// =============================================================================

import { primitives } from "./primitives.ts";
import { semantics } from "./semantics.ts";
import { type Theme, type ThemeName, themes } from "./themes.ts";
import { type MotionSystem, motionSystem } from "./motion.ts";

/**
 * Complete design token system
 * Access all tokens through this unified object
 */
export const tokens = {
  primitives,
  semantics,
  themes,
  motion: motionSystem,
} as const;

export type Tokens = typeof tokens;

// =============================================================================
// THEME HOOK HELPER
// =============================================================================

import { useCallback, useMemo, useState } from "react";
import {
  getTheme,
  isDarkTheme as checkIsDark,
  toggleTheme as toggleThemeFn,
} from "./themes.ts";

export interface UseThemeReturn {
  /** Current theme object */
  theme: Theme;
  /** Current theme name */
  themeName: ThemeName;
  /** Whether current theme is dark */
  isDark: boolean;
  /** Whether current theme is high contrast */
  isHighContrast: boolean;
  /** Set theme by name */
  setTheme: (name: ThemeName) => void;
  /** Toggle between light/dark */
  toggleTheme: () => void;
  /** Enable high contrast */
  enableHighContrast: () => void;
  /** Disable high contrast */
  disableHighContrast: () => void;
}

/**
 * React hook for theme management
 * @param initialTheme - Initial theme name (default: 'light')
 * @returns Theme state and controls
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { theme, isDark, toggleTheme } = useTheme('light');
 *
 *   return (
 *     <View style={{ backgroundColor: theme.surface }}>
 *       <Button title="Toggle" onPress={toggleTheme} />
 *     </View>
 *   );
 * }
 * ```
 */
export function useTheme(
  { initialTheme = "light" }: { initialTheme?: ThemeName } = {},
): UseThemeReturn {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);

  const theme = useMemo(() => getTheme(themeName), [themeName]);

  const isDark = useMemo(() => checkIsDark(themeName), [themeName]);

  const isHighContrast = useMemo(
    () => themeName === "highContrastLight" || themeName === "highContrastDark",
    [themeName],
  );

  const setTheme = useCallback((name: ThemeName) => {
    setThemeName(name);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeName((current) => toggleThemeFn(current));
  }, []);

  const enableHighContrast = useCallback(() => {
    setThemeName((
      current,
    ) => (checkIsDark(current) ? "highContrastDark" : "highContrastLight"));
  }, []);

  const disableHighContrast = useCallback((): void => {
    setThemeName((current) => (checkIsDark(current) ? "dark" : "light"));
  }, []);

  return {
    theme,
    themeName,
    isDark,
    isHighContrast,
    setTheme,
    toggleTheme,
    enableHighContrast,
    disableHighContrast,
  };
}

// =============================================================================
// NATIVEWIND V4 COMPATIBILITY
// =============================================================================

/**
 * CSS variables for NativeWind v4
 * These can be used in global.css or component styles
 */
export const nativeWindVars = {
  light: {
    "--color-primary": themes.light.primary,
    "--color-on-primary": themes.light.onPrimary,
    "--color-primary-container": themes.light.primaryContainer,
    "--color-on-primary-container": themes.light.onPrimaryContainer,
    "--color-secondary": themes.light.secondary,
    "--color-on-secondary": themes.light.onSecondary,
    "--color-secondary-container": themes.light.secondaryContainer,
    "--color-on-secondary-container": themes.light.onSecondaryContainer,
    "--color-surface": themes.light.surface,
    "--color-on-surface": themes.light.onSurface,
    "--color-surface-variant": themes.light.surfaceVariant,
    "--color-on-surface-variant": themes.light.onSurfaceVariant,
    "--color-background": themes.light.background,
    "--color-on-background": themes.light.onBackground,
    "--color-outline": themes.light.outline,
    "--color-outline-variant": themes.light.outlineVariant,
    "--color-error": themes.light.error,
    "--color-on-error": themes.light.onError,
    "--color-success": themes.light.success,
    "--color-warning": themes.light.warning,
    "--color-info": themes.light.info,
  },
  dark: {
    "--color-primary": themes.dark.primary,
    "--color-on-primary": themes.dark.onPrimary,
    "--color-primary-container": themes.dark.primaryContainer,
    "--color-on-primary-container": themes.dark.onPrimaryContainer,
    "--color-secondary": themes.dark.secondary,
    "--color-on-secondary": themes.dark.onSecondary,
    "--color-secondary-container": themes.dark.secondaryContainer,
    "--color-on-secondary-container": themes.dark.onSecondaryContainer,
    "--color-surface": themes.dark.surface,
    "--color-on-surface": themes.dark.onSurface,
    "--color-surface-variant": themes.dark.surfaceVariant,
    "--color-on-surface-variant": themes.dark.onSurfaceVariant,
    "--color-background": themes.dark.background,
    "--color-on-background": themes.dark.onBackground,
    "--color-outline": themes.dark.outline,
    "--color-outline-variant": themes.dark.outlineVariant,
    "--color-error": themes.dark.error,
    "--color-on-error": themes.dark.onError,
    "--color-success": themes.dark.success,
    "--color-warning": themes.dark.warning,
    "--color-info": themes.dark.info,
  },
} as const;

// =============================================================================
// ACCESSIBILITY UTILITIES
// =============================================================================

/**
 * Check if motion should be reduced based on user preference
 * Use this to select between normal and reduced motion tokens
 *
 * @example
 * ```typescript
 * const { reduceMotion } = useAccessibility();
 * const motion = reduceMotion ? tokens.motion.reducedMotion : tokens.motion;
 * ```
 */
export function getMotionForAccessibility(
  { reduceMotion }: { reduceMotion: boolean },
): MotionSystem | MotionSystem["reducedMotion"] {
  if (reduceMotion) {
    return motionSystem.reducedMotion;
  }
  return motionSystem;
}

// =============================================================================
// DEPRECATED EXPORTS (for backward compatibility)
// =============================================================================

// Re-export legacy tokens for backward compatibility
// These will be removed in a future version
export { md3DarkColors, md3LightColors } from "./md3-colors.ts";
export { darkColors, lightColors, md3Colors, md3ColorsDark } from "./colors.ts";
