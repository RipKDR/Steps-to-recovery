/**
 * SQLite storage adapter for mobile (iOS/Android)
 * Wraps expo-sqlite with StorageAdapter interface
 */

import type { SQLiteDatabase } from 'expo-sqlite';
import type { StorageAdapter } from './types';

export class SQLiteAdapter implements StorageAdapter {
  constructor(private db: SQLiteDatabase) {}

  getDatabaseName(): string {
    return 'recovery.db';
  }

  async getAllAsync<T = any>(query: string, params?: any[]): Promise<T[]> {
    return params ? this.db.getAllAsync<T>(query, params) : this.db.getAllAsync<T>(query);
  }

  async getFirstAsync<T = any>(query: string, params?: any[]): Promise<T | null> {
    return params ? this.db.getFirstAsync<T>(query, params) : this.db.getFirstAsync<T>(query);
  }

  async runAsync(query: string, params?: any[]): Promise<void> {
    await (params ? this.db.runAsync(query, params) : this.db.runAsync(query));
  }

  async execAsync(sql: string): Promise<void> {
    await this.db.execAsync(sql);
  }

  async withTransactionAsync(callback: () => Promise<void>): Promise<void> {
    await this.db.withTransactionAsync(callback);
  }
}
