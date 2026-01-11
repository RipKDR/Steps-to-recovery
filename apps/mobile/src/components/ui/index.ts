/**
 * UI Component Exports
 *
 * This barrel export combines shadcn/ui style components (React Native Reusables)
 * with app-specific components for a unified import experience.
 */

// shadcn-style components (React Native Reusables)
export * from './accordion';
export * from './alert-dialog';
export * from './avatar';
export * from './badge';
export * from './button';
export * from './card';
export * from './checkbox';
export * from './dialog';
export * from './input';
export * from './label';
export * from './progress';
export * from './separator';
export * from './switch';
export * from './tabs';
export * from './text';
export * from './textarea';

// Utility components
export * from './native-only-animated-view';

// App-specific components (kept from original)
export { Slider } from './Slider';

// Icon component (shadcn style - Lucide icons with NativeWind support)
export { Icon } from './icon';

// Legacy compatibility wrappers (use new components for new code)
export { LegacyCard } from './legacy-card';
export type { LegacyCardProps, LegacyCardVariant } from './legacy-card';
