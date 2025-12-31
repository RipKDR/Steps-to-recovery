/**
 * Platform-agnostic storage adapter
 * Automatically selects SQLite (mobile) or IndexedDB (web)
 */

import { Platform } from 'react-native';
import type { StorageAdapter } from './types';

// Export types
export type { StorageAdapter } from './types';

/**
 * Create storage adapter for current platform
 *
 * NOTE: On mobile, this expects SQLiteDatabase to be passed
 * On web, IndexedDB adapter initializes automatically
 */
export async function createStorageAdapter(nativeDb?: any): Promise<StorageAdapter> {
  if (Platform.OS === 'web') {
    const { IndexedDBAdapter } = await import('./indexeddb');
    return new IndexedDBAdapter();
  } else {
    // Mobile: Use provided SQLite database
    if (!nativeDb) {
      throw new Error('SQLite database required for mobile platform');
    }
    const { SQLiteAdapter } = await import('./sqlite');
    return new SQLiteAdapter(nativeDb);
  }
}
