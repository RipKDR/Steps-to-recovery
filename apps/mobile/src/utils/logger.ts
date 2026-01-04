/**
 * Secure logger utility with data sanitization
 * In development: logs to console (sanitized)
 * In production: ready for Sentry integration (sanitized)
 *
 * SECURITY: Automatically redacts sensitive fields to prevent data leaks
 */

const isDevelopment = process.env.EXPO_PUBLIC_ENV === 'development';

/**
 * List of sensitive field names that should be redacted
 */
const SENSITIVE_FIELDS = new Set([
  'encrypted_title',
  'encrypted_body',
  'encrypted_answer',
  'encrypted_mood',
  'encrypted_craving',
  'encrypted_tags',
  'encrypted_intention',
  'encrypted_reflection',
  'title',
  'body',
  'answer',
  'content',
  'reflection',
  'intention',
  'password',
  'token',
  'key',
  'secret',
  'iv',
  'salt',
]);

/**
 * Sanitize data to remove sensitive information before logging
 * Recursively processes objects and arrays
 */
function sanitizeData(data: unknown, depth: number = 0): unknown {
  // Prevent infinite recursion
  if (depth > 10) return '[MAX_DEPTH]';

  // Null, undefined, primitives
  if (data === null || data === undefined) return data;
  if (typeof data === 'boolean' || typeof data === 'number') return data;

  // Strings
  if (typeof data === 'string') {
    // Redact long strings (likely encrypted data or sensitive content)
    if (data.length > 100) {
      return `[REDACTED_STRING_${data.length}_CHARS]`;
    }
    // Redact hex strings that look like keys/IVs (32+ hex characters)
    if (/^[0-9a-f]{32,}$/i.test(data)) {
      return `[REDACTED_HEX_${data.length}_CHARS]`;
    }
    return data;
  }

  // Arrays
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, depth + 1));
  }

  // Objects
  if (typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};

    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

      const value = (data as Record<string, unknown>)[key];

      // Check if field name is sensitive
      if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
        continue;
      }

      // Check if key contains sensitive keywords
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('encrypted') || lowerKey.includes('password') ||
          lowerKey.includes('token') || lowerKey.includes('secret')) {
        sanitized[key] = '[REDACTED]';
        continue;
      }

      // Recursively sanitize nested objects
      sanitized[key] = sanitizeData(value, depth + 1);
    }

    return sanitized;
  }

  return data;
}

/**
 * Sanitize error objects to remove sensitive stack trace information
 */
function sanitizeError(error: unknown): unknown {
  if (!(error instanceof Error)) {
    return sanitizeData(error);
  }

  return {
    name: error.name,
    message: error.message
      .replace(/encrypted_\w+/g, '[ENCRYPTED_FIELD]')
      .replace(/[0-9a-f]{32,}/gi, '[HASH]')
      .replace(/"[^"]{50,}"/g, '[LONG_STRING]'),
    // Only include stack in development
    ...(isDevelopment && {
      stack: error.stack
        ?.split('\n')
        .map(line => {
          // Redact file paths that might contain usernames
          return line.replace(/\/Users\/[^/]+/g, '/Users/[USER]')
                    .replace(/C:\\Users\\[^\\]+/g, 'C:\\Users\\[USER]');
        })
        .join('\n')
    }),
  };
}

export const logger = {
  error: (message: string, error?: unknown) => {
    const sanitized = error ? sanitizeError(error) : undefined;

    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, sanitized);
    } else {
      // Production: log without details (or send to Sentry with sanitization)
      console.error(`[ERROR] ${message}`);
      // TODO: Integrate Sentry here with sanitized error
      // Sentry.captureException(new Error(message), { extra: sanitized });
    }
  },

  warn: (message: string, data?: unknown) => {
    const sanitized = sanitizeData(data);

    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, sanitized);
    }
  },

  info: (message: string, data?: unknown) => {
    const sanitized = sanitizeData(data);

    if (isDevelopment) {
      console.log(`[INFO] ${message}`, sanitized);
    }
  },

  debug: (message: string, data?: unknown) => {
    const sanitized = sanitizeData(data);

    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, sanitized);
    }
  },
};
