/**
 * ID Utilities
 *
 * Provides a consistent ID generator with a crypto-first strategy.
 */

export function generateId(prefix?: string): string {
  const base =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `id_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  return prefix ? `${prefix}_${base}` : base;
}
