/**
 * Design System Barrel Export
 * Central export for all design system tokens, hooks, and components
 */

// Context & Provider
export { ThemeProvider, ThemeContext } from './context/ThemeContext';
export type { Theme } from './context/ThemeContext';

// Hooks
export { useTheme, useColors, useIsDark } from './hooks/useTheme';
export {
  useFadeIn,
  useScaleIn,
  usePressAnimation,
  useBounceAnimation,
  useSlideIn,
  useFadeAndScaleIn,
  useNumberAnimation,
} from './hooks/useAnimation';

// Tokens
export { lightColors, darkColors, categoryColors } from './tokens/colors';
export type { ColorPalette, CategoryColor } from './tokens/colors';

export { typography } from './tokens/typography';
export type { TypographyStyle } from './tokens/typography';

export { spacing } from './tokens/spacing';
export type { SpacingKey } from './tokens/spacing';

export { radius } from './tokens/radius';
export type { RadiusKey } from './tokens/radius';

export { shadows } from './tokens/shadows';
export type { ShadowKey } from './tokens/shadows';

export {
  springConfigs,
  timingDurations,
  easingCurves,
  scales,
  opacities,
  createTimingConfig,
  animationPresets,
} from './tokens/animations';
export type { SpringConfigKey, TimingDurationKey, EasingCurveKey } from './tokens/animations';

// Components
export { Badge, Button, Card, FloatingActionButton, Input } from './components';
export type { BadgeProps, ButtonProps, CardProps, FloatingActionButtonProps, InputProps } from './components';
