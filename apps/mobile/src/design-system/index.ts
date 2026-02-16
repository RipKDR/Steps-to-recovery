// Unified exports for the design system
export {
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  EmptySearch,
  EmptyJournal,
  Input,
  ListItem,
  Modal,
  ProgressBar,
  SobrietyCounter,
  TextArea,
  Text,
  Toast,
  Toggle,
  AnimatedCheckmark,
  GlassCard,
  GradientButton,
  CircularProgress,
  BreathingCircle,
  Skeleton,
  SkeletonCard,
  SkeletonListItem,
  SkeletonStats,
  SkeletonHome,
  SkeletonList,
  AsyncImage,
  Avatar,
  ZoomableImage,
  ScreenReaderText,
  AccessibleButton,
  Focusable,
  AccessibleField,
  AccessibleProgress,
  LiveRegion,
  SkipLink,
  Heading,
  AccessibleList,
  AccessibleListItem,
  announce,
  isScreenReaderEnabled,
  AmberButton,
  // Illustration System
  Illustration,
  OnboardingIllustration,
  BadgeIllustration,
  EmptyStateIllustration,
  // Material Design 3 Recovery Components
  DailyCheckInCard,
  AchievementBadge,
  AchievementGrid,
} from './components/index.ts';

export { ThemeProvider } from './context/ThemeContext.tsx';
export { useTheme, useColors, useIsDark } from './hooks/useTheme.ts';
export { useMotionPress } from './hooks/useMotionPress.ts';
export { useThemedStyles } from './hooks/useThemedStyles.ts';
export { Action, useActionMotion } from './primitives/index.ts';
export { ScreenAnimations } from './tokens/screen-animations.ts';
export {
  serene,
  sereneGlow,
  serenePillRow,
  sereneRing,
  premiumTypographyAliases,
  backgroundTexture,
  getSereneProgressBarStyles,
  getSereneRingMetrics,
  getSereneTextureOverlay,
} from './tokens/serene.ts';
// Legacy motion exports
export {
  MotionTransitions,
  motionDuration,
  motionSpring,
  motionScale,
  motionTiming,
  motionShimmer,
} from './tokens/motion.ts';

// Material Design 3 Motion System
export {
  md3Duration,
  md3Easing,
  md3Motion,
  md3Spring,
  md3Transitions,
  motionSystem,
} from './tokens/motion.ts';
export type {
  MD3DurationKey,
  MD3EasingKey,
  MD3MotionKey,
  MD3SpringKey,
  MD3TransitionKey,
} from './tokens/motion.ts';
export { glass, glow, glassGradients } from './tokens/glass.ts';
export {
  aestheticColors,
  gradients,
  atmosphericShadows,
  aestheticTypography,
  aestheticSpacing,
  aestheticRadius,
  calmingMotion,
  premiumEffects,
  componentPatterns,
} from './tokens/aesthetic.ts';
export {
  useTheme as useThemeTokens,
  darkColors,
  lightColors,
  spacing as themeSpacing,
  typography as themeTypography,
  borderRadius as themeBorderRadius,
} from './tokens/theme.ts';
export type { Theme } from './tokens/theme.ts';

// Material Design 3 Token System
export { md3Colors, md3ColorsDark } from './tokens/colors.ts';
export type { MD3Colors, MD3ColorsDark } from './tokens/colors.ts';

export { md3Typography, typographySystem } from './tokens/typography.ts';
export type { MD3TypographyStyle } from './tokens/typography.ts';

export {
  md3Spacing,
  md3ComponentSpacing,
  md3Elevation,
  spacingSystem,
  getSpacing,
} from './tokens/spacing.ts';
export type { MD3SpacingKey, MD3ComponentSpacingKey, MD3ElevationKey } from './tokens/spacing.ts';

export {
  md3Shadows,
  md3ShadowLevel0,
  md3ShadowLevel1,
  md3ShadowLevel2,
  md3ShadowLevel3,
  md3ShadowLevel4,
  md3ShadowLevel5,
  md3ComponentShadows,
  md3ComponentShadowsDark,
  shadowSystem,
} from './tokens/shadows.ts';
export type { MD3ShadowLevel, MD3ComponentShadowKey } from './tokens/shadows.ts';
export type { ActionRootProps, UseActionMotionOptions } from './primitives/index.ts';
export {
  pressAnimation,
  hoverAnimation,
  successAnimation,
  attentionAnimation,
  loadingAnimation,
  breathingAnimation,
  usePressAnimation,
  useHoverAnimation,
  useSuccessAnimation,
  useAttentionAnimation,
  useShimmerAnimation,
  useBreathingAnimation,
  useStaggerAnimation,
} from './tokens/micro-animations.ts';

export type {
  BadgeProps,
  ButtonProps,
  CardProps,
  DividerProps,
  EmptyStateProps,
  InputProps,
  ListItemProps,
  ModalAction,
  ModalProps,
  ModalVariant,
  ProgressBarProps,
  SobrietyCounterProps,
  TextAreaProps,
  TextProps,
  ToastProps,
  ToastVariant,
  ToggleProps,
  AnimatedCheckmarkProps,
  GlassCardProps,
  GradientButtonProps,
  CircularProgressProps,
  BreathingCircleProps,
  SkeletonProps,
  AsyncImageProps,
  AvatarProps,
  ZoomableImageProps,
  AmberButtonProps,
  IllustrationProps,
  // Material Design 3 Recovery Component Types
  DailyCheckInCardProps,
  CheckInSection,
  CheckInState,
  AchievementBadgeProps,
  Achievement,
  AchievementGridProps,
} from './components/index.ts';

// Material Design 3 Warm Theme Tokens
export {
  sageGreen,
  amber,
  coral,
  error,
  neutral,
  neutralVariant,
  md3LightColors,
  md3DarkColors,
  elevationOverlayOpacity,
} from './tokens/md3-colors.ts';
export type { MD3LightColors, MD3DarkColors } from './tokens/md3-colors.ts';

export {
  md3ElevationLight,
  md3ElevationDark,
  stateLayerOpacity,
  md3RippleConfig,
  md3Shape,
  md3Motion as md3MotionElevation,
  md3Typography as md3TypographyElevation,
  md3Tokens,
} from './tokens/md3-elevation.ts';
export type { ElevationStyle } from './tokens/md3-elevation.ts';

// Micro-Interactions and Animation System
export * from './animations/index.ts';

export * from './review/index.ts';

// Theme-aware design system tokens
export { DsProvider, useDs, useDsIsDark } from    './DsProvider.tsx';
export { ds, createDs, paletteLight, colorsLight, semanticLight, shadowsLight } from  './tokens/ds.ts';
export type { DS } from './tokens/ds.ts';
