/**
 * Secure storage adapter for Supabase auth tokens on web platform
 * Uses IndexedDB for better security isolation than localStorage
 *
 * NOTE: Auth tokens themselves don't need encryption because:
 * 1. They're time-limited and automatically expire
 * 2. Supabase validates them with RLS on every request
 * 3. They're already hashed/signed by Supabase
 *
 * BUT we use IndexedDB instead of localStorage because:
 * 1. Better isolation from XSS attacks
 * 2. Not directly accessible via document.cookie or localStorage APIs
 * 3. More secure storage mechanism in modern browsers
 */

import { openDB, type IDBPDatabase } from 'idb';
import { logger } from '../utils/logger';

const DB_NAME = 'supabase_auth_storage';
const STORE_NAME = 'auth_tokens';
const DB_VERSION = 1;

class SupabaseAuthStorage {
  private db: IDBPDatabase | null = null;

  /**
   * Initialize IndexedDB connection
   */
  private async getDB(): Promise<IDBPDatabase> {
    if (this.db) return this.db;

    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Create object store for auth tokens
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });
      return this.db;
    } catch (error) {
      logger.error('Failed to initialize IndexedDB for auth storage', error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const db = await this.getDB();
      const value = await db.get(STORE_NAME, key);
      return value ?? null;
    } catch (error) {
      logger.error('Failed to get auth token from IndexedDB', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const db = await this.getDB();
      await db.put(STORE_NAME, value, key);
    } catch (error) {
      logger.error('Failed to set auth token in IndexedDB', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const db = await this.getDB();
      await db.delete(STORE_NAME, key);
    } catch (error) {
      logger.error('Failed to remove auth token from IndexedDB', error);
      throw error;
    }
  }
}

// Singleton instance
const webAuthStorage = new SupabaseAuthStorage();

export { webAuthStorage };
