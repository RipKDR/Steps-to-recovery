/**
 * IndexedDB storage adapter for web
 * Uses sql.js (SQLite compiled to WebAssembly) + IndexedDB for persistence
 */

import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { StorageAdapter } from './types';

const DB_NAME = 'StepsToRecovery';
const STORE_NAME = 'sqliteData';
const DB_VERSION = 1;

type SqlJsStatic = Awaited<ReturnType<typeof initSqlJs>>;

interface StepsToRecoveryDbSchema extends DBSchema {
  [STORE_NAME]: {
    key: 'database';
    // idb supports structured cloning of Uint8Array; allow ArrayBuffer for
    // forward/backward compatibility with older persisted formats.
    value: Uint8Array | ArrayBuffer;
  };
}

export interface IndexedDBAdapterOptions {
  /**
   * Base URL used by sql.js to load its wasm file.
   * Defaults to sql.js CDN. If you bundle the wasm locally, override this.
   */
  wasmBaseUrl?: string;
}

export class IndexedDBAdapter implements StorageAdapter {
  private db: Database | null = null;
  private idb: IDBPDatabase<StepsToRecoveryDbSchema> | null = null;

  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private persistQueue: Promise<void> = Promise.resolve();

  private transactionDepth = 0;

  private readonly wasmBaseUrl: string;

  constructor(options: IndexedDBAdapterOptions = {}) {
    const base = options.wasmBaseUrl ?? 'https://sql.js.org/dist/';
    this.wasmBaseUrl = base.endsWith('/') ? base : `${base}/`;
  }

  getDatabaseName(): string {
    return DB_NAME;
  }

  /**
   * Initialize sql.js and load database from IndexedDB
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      if (typeof indexedDB === 'undefined') {
        throw new Error('IndexedDB is not available in this environment');
      }

      // Initialize sql.js
      const SQL: SqlJsStatic = await initSqlJs({
        locateFile: (file: string) => `${this.wasmBaseUrl}${file}`,
      });

      // Open IndexedDB
      this.idb = await openDB<StepsToRecoveryDbSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });

      // Load existing database or create new one
      const savedData = await this.idb.get(STORE_NAME, 'database');
      if (savedData) {
        const bytes = savedData instanceof Uint8Array ? savedData : new Uint8Array(savedData);
        this.db = new SQL.Database(bytes);
      } else {
        this.db = new SQL.Database();
      }

      this.initialized = true;
    })()
      .catch((err) => {
        // Allow retry on next call if initialization fails.
        this.initialized = false;
        this.db = null;
        this.idb = null;
        throw err;
      })
      .finally(() => {
        this.initPromise = null;
      });

    return this.initPromise;
  }

  private async getReadyDb(): Promise<Database> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');
    return this.db;
  }

  private async getReadyIdb(): Promise<IDBPDatabase<StepsToRecoveryDbSchema>> {
    await this.initialize();
    if (!this.idb) throw new Error('IndexedDB not initialized');
    return this.idb;
  }

  /**
   * Save database to IndexedDB
   */
  private async persist(): Promise<void> {
    const db = this.db;
    const idb = this.idb;
    if (!db || !idb) return;

    const data = db.export();
    // Serialize writes to IndexedDB so the newest export always wins.
    await this.persistQueue;
    await idb.put(STORE_NAME, data, 'database');
  }
  /**
   * Close resources (optional; not required by StorageAdapter).
   * Useful for web teardown in tests or hot reload.
   */
  close(): void {
    try {
      this.db?.close();
    } finally {
      this.db = null;
      this.initialized = false;
    }

    try {
      this.idb?.close();
    } finally {
      this.idb = null;
    }
  }

  async getAllAsync<T = any>(query: string, params?: any[]): Promise<T[]> {
    const db = await this.getReadyDb();
    const stmt = db.prepare(query);
    try {
      if (params) stmt.bind(params);

      const results: T[] = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push(row as T);
      }
      return results;
    } finally {
      stmt.free();
    }
  }

  async getFirstAsync<T = any>(query: string, params?: any[]): Promise<T | null> {
    const db = await this.getReadyDb();
    const stmt = db.prepare(query);
    try {
      if (params) stmt.bind(params);

      if (stmt.step()) {
        return stmt.getAsObject() as T;
      }
      return null;
    } finally {
      stmt.free();
    }
  }

  async runAsync(query: string, params?: any[]): Promise<void> {
    const db = await this.getReadyDb();
    if (params) db.run(query, params);
    else db.run(query);

    // Don't persist mid-transaction; outermost commit will persist.
    if (this.transactionDepth === 0) {
      await this.persist();
    }
  }

  async execAsync(sql: string): Promise<void> {
    const db = await this.getReadyDb();
    db.exec(sql);

    // Don't persist mid-transaction; outermost commit will persist.
    if (this.transactionDepth === 0) {
      await this.persist();
    }
  }

  async withTransactionAsync(callback: () => Promise<void>): Promise<void> {
    const db = await this.getReadyDb();
    const idb = await this.getReadyIdb();

    // Ensure any prior queued persist completes before starting a new transaction,
    // so we don't end up with older exports overwriting a later commit.
    await this.persistQueue;

    const depth = this.transactionDepth;
    const savepoint:string = `sp_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    this.transactionDepth += 1;
    try {
      if (depth === 0) {
        db.run('BEGIN TRANSACTION');
      } else {
        db.run(`SAVEPOINT ${savepoint}`);
      }

      await callback();

      if (depth === 0) {
        db.run('COMMIT');
        // Persist only after a successful outermost commit.
        const data = db.export();
        this.persistQueue = this.persistQueue.then(() => {
          idb.put(STORE_NAME, data as Uint8Array, 'database');
        });
        await this.persistQueue;
      } else {
        db.run(`RELEASE SAVEPOINT ${savepoint}`);
      }
    } catch (error) {
      try {
        if (depth === 0) {
          db.run('ROLLBACK');
        } else {
          db.run(`ROLLBACK TO SAVEPOINT ${savepoint as unknown as string}`);
            db.run(`RELEASE SAVEPOINT ${savepoint as unknown as string}`);
        }
      } catch {
        // Ignore rollback failures; surface the original error.
      }
      throw error;
    } finally {
      this.transactionDepth = Math.max(0, this.transactionDepth - 1);
    }
  }
}
