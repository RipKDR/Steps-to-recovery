/**
 * Sentry Error Tracking Configuration
 *
 * Initializes Sentry for crash reporting and error tracking.
 *
 * **Security Notes**:
 * - Breadcrumbs are filtered to prevent capturing decrypted content
 * - User data is anonymized (uses auth ID, not email)
 * - Only enabled in production builds
 *
 * @module lib/sentry
 */

import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { logger } from '../utils/logger';

/**
 * List of sensitive keys that should never appear in Sentry data
 */
const SENSITIVE_KEYS = [
  'encrypted_body',
  'encrypted_title',
  'encrypted_content',
  'encrypted_answer',
  'encrypted_intention',
  'encrypted_reflection',
  'encrypted_mood',
  'encrypted_craving',
  'encrypted_notes',
  'encrypted_tags',
  'decrypted',
  'plaintext',
  'password',
  'token',
  'key',
  'secret',
  'journal',
  'entry',
  'reflection',
  'intention',
];

/**
 * Check if a string might contain sensitive data
 */
function mightContainSensitiveData(str: string): boolean {
  const lowerStr = str.toLowerCase();
  return SENSITIVE_KEYS.some((key) => lowerStr.includes(key));
}

/**
 * Sanitize breadcrumb data to prevent sensitive data leakage
 */
function sanitizeBreadcrumb(breadcrumb: Sentry.Breadcrumb): Sentry.Breadcrumb | null {
  // Skip breadcrumbs that might contain sensitive data
  if (breadcrumb.message && mightContainSensitiveData(breadcrumb.message)) {
    return null;
  }

  // Sanitize data object
  if (breadcrumb.data) {
    const sanitizedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(breadcrumb.data)) {
      if (mightContainSensitiveData(key)) {
        sanitizedData[key] = '[REDACTED]';
      } else if (typeof value === 'string' && mightContainSensitiveData(value)) {
        sanitizedData[key] = '[REDACTED]';
      } else {
        sanitizedData[key] = value;
      }
    }
    breadcrumb.data = sanitizedData;
  }

  return breadcrumb;
}

/**
 * Initialize Sentry error tracking
 *
 * Should be called early in app startup, before other providers.
 * Only initializes in production to avoid noise during development.
 */
export function initSentry(): void {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  // Only initialize if DSN is configured and not in development
  if (!dsn) {
    if (__DEV__) {
      logger.info('[Sentry] Skipping initialization: No DSN configured');
    }
    return;
  }

  if (__DEV__) {
    logger.info('[Sentry] Skipping initialization: Development mode');
    return;
  }

  Sentry.init({
    dsn,
    debug: false,

    // Environment and release tracking
    environment: process.env.EXPO_PUBLIC_ENV || 'production',
    release: Constants.expoConfig?.version || '1.0.0',

    // Performance monitoring (low sample rate for privacy)
    tracesSampleRate: 0.1,

    // Enable native crash reporting
    enableNative: true,
    enableNativeCrashHandling: true,

    // Automatically capture unhandled errors
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,

    // Security: Filter sensitive data from breadcrumbs
    beforeBreadcrumb(breadcrumb) {
      return sanitizeBreadcrumb(breadcrumb);
    },

    // Security: Filter sensitive data from events
    beforeSend(event) {
      // Remove any potentially sensitive extra data
      if (event.extra) {
        const sanitizedExtra: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(event.extra)) {
          if (mightContainSensitiveData(key)) {
            sanitizedExtra[key] = '[REDACTED]';
          } else if (typeof value === 'string' && mightContainSensitiveData(value)) {
            sanitizedExtra[key] = '[REDACTED]';
          } else {
            sanitizedExtra[key] = value;
          }
        }
        event.extra = sanitizedExtra;
      }

      return event;
    },

    // Integrations
    integrations: [Sentry.reactNativeTracingIntegration()],
  });
}

/**
 * Set the current user for Sentry context
 *
 * @param userId - The user's auth ID (NOT email or personal info)
 */
export function setSentryUser(userId: string | null): void {
  if (userId) {
    Sentry.setUser({ id: userId });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Capture an exception with optional context
 *
 * @param error - The error to capture
 * @param context - Optional context (will be sanitized)
 */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  // Sanitize context before sending
  const sanitizedContext: Record<string, unknown> = {};
  if (context) {
    for (const [key, value] of Object.entries(context)) {
      if (mightContainSensitiveData(key)) {
        sanitizedContext[key] = '[REDACTED]';
      } else if (typeof value === 'string' && mightContainSensitiveData(value)) {
        sanitizedContext[key] = '[REDACTED]';
      } else {
        sanitizedContext[key] = value;
      }
    }
  }

  Sentry.captureException(error, {
    extra: sanitizedContext,
  });
}

/**
 * Add a breadcrumb for debugging
 *
 * @param category - Breadcrumb category
 * @param message - Breadcrumb message
 * @param data - Optional data (will be sanitized)
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>,
): void {
  const breadcrumb: Sentry.Breadcrumb = {
    category,
    message,
    level: 'info',
    data,
  };

  const sanitized = sanitizeBreadcrumb(breadcrumb);
  if (sanitized) {
    Sentry.addBreadcrumb(sanitized);
  }
}

// Re-export Sentry.wrap for App.tsx
export const wrap = Sentry.wrap;
