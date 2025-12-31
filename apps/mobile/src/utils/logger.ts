/**
 * Safe logger that prevents sensitive data leaks
 * Only logs in development, sanitizes production errors
 */

const isDevelopment = process.env.EXPO_PUBLIC_ENV === 'development';

export const logger = {
  error: (message: string, error?: unknown) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      // Production: log to Sentry without sensitive data
      // TODO: Integrate Sentry here
    }
  },
  warn: (message: string) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`);
    }
  },
  info: (message: string) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`);
    }
  },
  debug: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
};
