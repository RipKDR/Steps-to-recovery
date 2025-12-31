/**
 * Platform-agnostic storage adapter interface
 * Allows SQLite (mobile) and IndexedDB (web) to use same API
 */

export interface StorageAdapter {
  /**
   * Execute query and return all matching rows
   */
  getAllAsync<T = any>(query: string, params?: any[]): Promise<T[]>;

  /**
   * Execute query and return first matching row
   */
  getFirstAsync<T = any>(query: string, params?: any[]): Promise<T | null>;

  /**
   * Execute query without returning rows (INSERT, UPDATE, DELETE)
   */
  runAsync(query: string, params?: any[]): Promise<void>;

  /**
   * Execute raw SQL (for schema creation, migrations)
   */
  execAsync(sql: string): Promise<void>;

  /**
   * Execute multiple statements in a transaction
   */
  withTransactionAsync(callback: () => Promise<void>): Promise<void>;
}
