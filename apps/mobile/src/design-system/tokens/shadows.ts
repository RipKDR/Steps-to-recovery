/**
 * Shadow definitions for elevation
 * Platform-specific: iOS uses shadowColor/shadowOffset, Android uses elevation
 */

import { Platform, ViewStyle } from 'react-native';

interface ShadowStyle {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

/**
 * Small shadow - subtle elevation
 */
export const shadowSm: ShadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  android: {
    elevation: 1,
  },
  default: {},
}) as ShadowStyle;

/**
 * Medium shadow - standard elevation for cards
 */
export const shadowMd: ShadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 3,
  },
  default: {},
}) as ShadowStyle;

/**
 * Large shadow - prominent elevation
 */
export const shadowLg: ShadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  android: {
    elevation: 6,
  },
  default: {},
}) as ShadowStyle;

/**
 * Extra large shadow - modal, FAB
 */
export const shadowXl: ShadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  android: {
    elevation: 10,
  },
  default: {},
}) as ShadowStyle;

/**
 * Dark mode shadow adjustments
 * (Higher opacity for visibility on dark backgrounds)
 */
export const shadowSmDark: ShadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  android: {
    elevation: 1,
  },
  default: {},
}) as ShadowStyle;

export const shadowMdDark: ShadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  android: {
    elevation: 3,
  },
  default: {},
}) as ShadowStyle;

export const shadowLgDark: ShadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  android: {
    elevation: 6,
  },
  default: {},
}) as ShadowStyle;

export const shadowXlDark: ShadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  android: {
    elevation: 10,
  },
  default: {},
}) as ShadowStyle;

export const shadows = {
  sm: shadowSm,
  md: shadowMd,
  lg: shadowLg,
  xl: shadowXl,
  smDark: shadowSmDark,
  mdDark: shadowMdDark,
  lgDark: shadowLgDark,
  xlDark: shadowXlDark,
} as const;

export type ShadowKey = keyof typeof shadows;
