/**
 * Text Component
 * Semantic text component that uses design system typography
 */

import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export interface TextProps extends RNTextProps {
  /**
   * Typography variant to use
   */
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodyLarge' | 'caption' | 'label';
  /**
   * Text color from theme
   */
  color?: 'text' | 'textSecondary' | 'primary' | 'success' | 'warning' | 'danger';
  /**
   * Font weight
   */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right';
}

export function Text({
  variant = 'body',
  color = 'text',
  weight,
  align,
  style,
  children,
  ...props
}: TextProps): React.ReactElement {
  const theme = useTheme();

  const typographyStyle = theme.typography[variant];
  const textColor = theme.colors[color];

  const weightStyle = weight
    ? {
        fontWeight:
          weight === 'normal'
            ? '400'
            : weight === 'medium'
            ? '500'
            : weight === 'semibold'
            ? '600'
            : '700',
      }
    : undefined;

  const alignStyle = align ? { textAlign: align } : undefined;

  return (
    <RNText
      style={[
        typographyStyle,
        { color: textColor },
        weightStyle,
        alignStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
