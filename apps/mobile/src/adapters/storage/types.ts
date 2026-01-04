/**
 * Platform-agnostic storage adapter interface
 * Allows SQLite (mobile) and IndexedDB (web) to use same API
 */

export interface StorageAdapter {
  /**
   * Execute query and return all matching rows
   * @template T - The type of rows returned. Use explicit type parameter for type safety.
   */
  getAllAsync<T = unknown>(query: string, params?: unknown[]): Promise<T[]>;

  /**
   * Execute query and return first matching row
   * @template T - The type of row returned. Use explicit type parameter for type safety.
   */
  getFirstAsync<T = unknown>(query: string, params?: unknown[]): Promise<T | null>;

  /**
   * Execute query without returning rows (INSERT, UPDATE, DELETE)
   */
  runAsync(query: string, params?: unknown[]): Promise<void>;

  /**
   * Execute raw SQL (for schema creation, migrations)
   */
  execAsync(sql: string): Promise<void>;

  /**
   * Execute multiple statements in a transaction
   */
  withTransactionAsync(callback: () => Promise<void>): Promise<void>;
}
