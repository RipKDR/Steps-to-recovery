/**
 * iOS-style Card Component
 * Container with elevation variants and optional animations
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useFadeAndScaleIn, usePressAnimation } from '../hooks/useAnimation';

type CardVariant = 'default' | 'elevated' | 'interactive';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  animate?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function Card({
  children,
  variant = 'default',
  onPress,
  animate = false,
  style,
  testID,
}: CardProps) {
  const theme = useTheme();
  const { fadeAnim, scaleAnim } = useFadeAndScaleIn(0);
  const { scaleAnim: pressScale, animatePress } = usePressAnimation(theme.animations.scales.press);

  // Determine shadow based on variant
  const getShadow = () => {
    if (variant === 'default') return {};
    if (variant === 'elevated' || variant === 'interactive') {
      return theme.isDark ? theme.shadows.mdDark : theme.shadows.md;
    }
    return {};
  };

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.cardPadding,
    ...getShadow(),
  };

  // If animate is true, use fade and scale animations
  const animatedStyle = animate
    ? {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }
    : {};

  // If interactive variant, add press animation
  const interactiveStyle = variant === 'interactive' && onPress
    ? { transform: [{ scale: pressScale }] }
    : {};

  // Combine all styles
  const combinedAnimatedStyle = {
    ...animatedStyle,
    ...(variant === 'interactive' ? interactiveStyle : {}),
  };

  // If onPress is provided, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => variant === 'interactive' && animatePress(true)}
        onPressOut={() => variant === 'interactive' && animatePress(false)}
        activeOpacity={variant === 'interactive' ? 0.95 : 0.7}
        accessibilityRole="button"
        testID={testID}
      >
        <Animated.View style={[cardStyle, combinedAnimatedStyle, style]}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  // If no onPress, just render View
  return (
    <Animated.View style={[cardStyle, combinedAnimatedStyle, style]} testID={testID}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Placeholder for any static styles if needed
});
