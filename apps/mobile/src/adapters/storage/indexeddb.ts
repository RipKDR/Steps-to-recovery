/**
 * IndexedDB storage adapter for web
 * Uses sql.js (SQLite compiled to WebAssembly) + IndexedDB for persistence
 */

// @ts-ignore - sql.js doesn't have proper TypeScript types
import initSqlJs, { Database } from 'sql.js';
import { openDB, IDBPDatabase } from 'idb';
import type { StorageAdapter } from './types';

const DB_NAME = 'StepsToRecovery';
const STORE_NAME = 'sqliteData';
const DB_VERSION = 1;

export class IndexedDBAdapter implements StorageAdapter {
  private db: Database | null = null;
  private idb: IDBPDatabase | null = null;
  private initialized = false;

  /**
   * Initialize sql.js and load database from IndexedDB
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize sql.js
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    });

    // Open IndexedDB
    this.idb = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });

    // Load existing database or create new one
    const savedData = await this.idb.get(STORE_NAME, 'database');
    if (savedData) {
      this.db = new SQL.Database(new Uint8Array(savedData));
    } else {
      this.db = new SQL.Database();
    }

    this.initialized = true;
  }

  /**
   * Save database to IndexedDB
   */
  private async persist(): Promise<void> {
    if (!this.db || !this.idb) return;

    const data = this.db.export();
    await this.idb.put(STORE_NAME, data, 'database');
  }

  async getAllAsync<T = any>(query: string, params?: any[]): Promise<T[]> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(query);
    if (params) {
      stmt.bind(params);
    }

    const results: T[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push(row as T);
    }
    stmt.free();

    return results;
  }

  async getFirstAsync<T = any>(query: string, params?: any[]): Promise<T | null> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(query);
    if (params) {
      stmt.bind(params);
    }

    let result: T | null = null;
    if (stmt.step()) {
      result = stmt.getAsObject() as T;
    }
    stmt.free();

    return result;
  }

  async runAsync(query: string, params?: any[]): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    if (params) {
      this.db.run(query, params);
    } else {
      this.db.run(query);
    }

    await this.persist();
  }

  async execAsync(sql: string): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec(sql);
    await this.persist();
  }

  async withTransactionAsync(callback: () => Promise<void>): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    this.db.run('BEGIN TRANSACTION');
    try {
      await callback();
      this.db.run('COMMIT');
      await this.persist();
    } catch (error) {
      this.db.run('ROLLBACK');
      throw error;
    }
  }
}
