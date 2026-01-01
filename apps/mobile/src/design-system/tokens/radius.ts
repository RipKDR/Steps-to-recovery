/**
 * Border radius scale for rounded corners
 */

export const radius = {
  // No rounding
  none: 0,

  // Small radius - small elements, badges
  sm: 4,

  // Medium radius - buttons, inputs, small cards
  md: 8,

  // Large radius - cards
  lg: 12,

  // Extra large radius - premium cards, modals
  xl: 16,

  // Double extra large radius
  xxl: 20,

  // Full circle - circular buttons, avatars
  full: 9999,

  // Component-specific
  button: 8,
  input: 8,
  card: 16,
  cardPremium: 20,
  modal: 20,
  badge: 9999,
} as const;

export type RadiusKey = keyof typeof radius;
