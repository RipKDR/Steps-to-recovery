import * as SQLite from 'expo-sqlite';

/**
 * Initialize SQLite database with schema for offline-first storage
 * Creates tables for journal entries, step work, and user profile
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('recovery.db');

  // Create tables for offline storage
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      mood TEXT,
      tags TEXT,
      is_shared INTEGER DEFAULT 0,
      shared_with TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      sync_status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS step_work (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      step_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      sync_status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      sobriety_start_date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_journal_user ON journal_entries(user_id);
    CREATE INDEX IF NOT EXISTS idx_journal_created ON journal_entries(created_at);
    CREATE INDEX IF NOT EXISTS idx_step_user ON step_work(user_id);
  `);

  return db;
}

/**
 * Clear all local data (used for logout or account deletion)
 */
export async function clearDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    DELETE FROM journal_entries;
    DELETE FROM step_work;
    DELETE FROM user_profile;
  `);
}
