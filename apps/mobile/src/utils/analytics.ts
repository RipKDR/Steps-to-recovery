/**
 * Analytics and performance monitoring utilities
 * Currently uses privacy-safe logging only
 * TODO: Configure Sentry DSN for production error tracking
 */

import { logger } from './logger';

/**
 * Track a user event (privacy-safe - no PII)
 */
export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  if (__DEV__) {
    logger.info(`Event: ${eventName}`, properties);
  }

  // TODO: Send to analytics service in production
  // Sentry.captureMessage(eventName, { extra: properties });
}

/**
 * Track screen views
 */
export function trackScreen(screenName: string): void {
  trackEvent('screen_view', { screen: screenName });
}

/**
 * Track app lifecycle events
 */
export function trackAppEvent(event: 'app_open' | 'app_background' | 'app_foreground'): void {
  trackEvent(event);
}

/**
 * Track feature usage (no sensitive data)
 */
export function trackFeatureUsage(
  feature: 'journal_created' | 'check_in_completed' | 'step_work_saved' | 'sync_triggered'
): void {
  trackEvent(feature);
}
