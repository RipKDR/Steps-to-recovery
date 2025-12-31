/**
 * Centralized logout cleanup utility
 * Handles all cleanup operations when user logs out:
 * - Clears encryption keys from secure storage
 * - Clears local database
 * - Clears web secure storage session
 */

import { deleteEncryptionKey } from './encryption';
import { clearDatabase } from './database';
import { secureStorage } from '../adapters/secureStorage';
import type { StorageAdapter } from '../adapters/storage';
import { logger } from './logger';

export interface LogoutCleanupOptions {
  /**
   * Database instance (required for mobile, optional for web)
   */
  db?: StorageAdapter;
}

/**
 * Perform complete logout cleanup
 * MUST be called before signing out to prevent data leaks
 */
export async function performLogoutCleanup(options: LogoutCleanupOptions = {}): Promise<void> {
  const errors: Error[] = [];

  try {
    // Step 1: Delete encryption keys from secure storage
    logger.info('Logout cleanup: Deleting encryption keys');
    await deleteEncryptionKey();
  } catch (error) {
    logger.error('Failed to delete encryption key during logout', error);
    errors.push(error instanceof Error ? error : new Error('Failed to delete encryption key'));
  }

  try {
    // Step 2: Clear web secure storage session (no-op on mobile)
    logger.info('Logout cleanup: Clearing secure storage session');
    await secureStorage.clearSession();
  } catch (error) {
    logger.error('Failed to clear secure storage session during logout', error);
    errors.push(error instanceof Error ? error : new Error('Failed to clear session'));
  }

  try {
    // Step 3: Clear local database (if provided)
    if (options.db) {
      logger.info('Logout cleanup: Clearing local database');
      await clearDatabase(options.db);
    } else {
      logger.warn('Logout cleanup: No database instance provided, skipping database clear');
    }
  } catch (error) {
    logger.error('Failed to clear database during logout', error);
    errors.push(error instanceof Error ? error : new Error('Failed to clear database'));
  }

  if (errors.length > 0) {
    logger.error('Logout cleanup completed with errors', { errorCount: errors.length });
    // Don't throw - partial cleanup is better than no cleanup
    // Errors are already logged
  } else {
    logger.info('Logout cleanup completed successfully');
  }
}
