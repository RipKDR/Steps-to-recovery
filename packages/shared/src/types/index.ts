/**
 * Shared types for Steps to Recovery app
 *
 * Note: Database types (snake_case) are kept separate from application types (camelCase)
 * Import database types directly from './database' when needed for SQL operations
 */

// Export all database types (snake_case with encrypted_ fields)
export * from './database';

// Export decrypted models (used in UI after decryption)
export * from './models';

// Alias exports for backward compatibility - Milestone uses days, icon, key
export type { MilestoneDefinition as Milestone } from './models';
