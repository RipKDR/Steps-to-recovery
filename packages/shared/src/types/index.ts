/**
 * Shared types for Steps to Recovery app
 *
 * Note: Database types (snake_case) are kept separate from application types (camelCase)
 * Import database types directly from './database' when needed for SQL operations
 */

// Only export non-conflicting database types
export type { SyncStatus, CheckInType, SyncOperation, SyncQueueItem } from './database';
export type { UserProfile as DbUserProfile } from './database';
export type { DailyCheckIn as DbDailyCheckIn } from './database';
export type { StepWork as DbStepWork } from './database';

// Export decrypted models
export * from './models';

// Alias exports for backward compatibility
export type { MilestoneDefinition as Milestone } from './models';

// Database types for hooks (have encrypted_* fields)
export type { JournalEntry, DailyCheckIn, StepWork, UserProfile } from './database';