import type { StorageAdapter } from '../adapters/storage';

// Guard against duplicate/concurrent initialization (common in dev StrictMode and fast refresh)
const initializedAdapters = new WeakSet<object>();
const initPromises = new WeakMap<object, Promise<void>>();

/**
 * Initialize database with schema for offline-first storage
 * Creates tables for journal entries, step work, and user profile
 * Works with both SQLite (mobile) and IndexedDB (web) via StorageAdapter
 */
export async function initDatabase(db: StorageAdapter): Promise<void> {
  const key = db as unknown as object;
  if (initializedAdapters.has(key)) return;

  const existing = initPromises.get(key);
  if (existing) return existing;

  const initPromise = (async () => {
    // Some Android sqlite bindings can throw opaque native errors (e.g. NPE) when executing
    // very large multi-statement strings via execAsync. Execute pragmas and schema statements
    // in smaller chunks to be more reliable.

    // Pragmas
    try {
      await db.execAsync('PRAGMA journal_mode = WAL;');
    } catch {
      // Some platforms may not support WAL; ignore and continue.
    }
    try {
      await db.execAsync('PRAGMA busy_timeout = 5000;');
    } catch {
      // Ignore; best-effort.
    }
    try {
      await db.execAsync('PRAGMA foreign_keys = ON;');
    } catch {
      // Ignore; best-effort.
    }

    const statements: string[] = [
      `CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        sobriety_start_date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        encrypted_title TEXT,
        encrypted_body TEXT NOT NULL,
        encrypted_mood TEXT,
        encrypted_craving TEXT,
        encrypted_tags TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        sync_status TEXT DEFAULT 'pending',
        supabase_id TEXT,
        FOREIGN KEY (user_id) REFERENCES user_profile(id)
      );`,
      `CREATE TABLE IF NOT EXISTS daily_checkins (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        check_in_type TEXT NOT NULL CHECK(check_in_type IN ('morning','evening')),
        check_in_date TEXT NOT NULL,
        encrypted_intention TEXT,
        encrypted_reflection TEXT,
        encrypted_mood TEXT,
        encrypted_craving TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        sync_status TEXT DEFAULT 'pending',
        supabase_id TEXT,
        FOREIGN KEY (user_id) REFERENCES user_profile(id)
      );`,
      `CREATE TABLE IF NOT EXISTS step_work (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        step_number INTEGER NOT NULL CHECK(step_number >= 1 AND step_number <= 12),
        question_number INTEGER NOT NULL,
        encrypted_answer TEXT,
        is_complete INTEGER DEFAULT 0,
        completed_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        sync_status TEXT DEFAULT 'pending',
        UNIQUE(user_id, step_number, question_number),
        FOREIGN KEY (user_id) REFERENCES user_profile(id)
      );`,
      `CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        achievement_key TEXT NOT NULL,
        achievement_type TEXT NOT NULL,
        earned_at TEXT NOT NULL,
        is_viewed INTEGER DEFAULT 0,
        UNIQUE(user_id, achievement_key),
        FOREIGN KEY (user_id) REFERENCES user_profile(id)
      );`,
      `CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        operation TEXT NOT NULL CHECK(operation IN ('insert','update','delete')),
        created_at TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0,
        last_error TEXT,
        UNIQUE(table_name, record_id, operation)
      );`,
      `CREATE INDEX IF NOT EXISTS idx_journal_user ON journal_entries(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_journal_created ON journal_entries(created_at);`,
      `CREATE INDEX IF NOT EXISTS idx_checkin_user ON daily_checkins(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_checkin_date ON daily_checkins(check_in_date);`,
      `CREATE INDEX IF NOT EXISTS idx_step_user ON step_work(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_step_number ON step_work(step_number);`,
      `CREATE INDEX IF NOT EXISTS idx_achievement_user ON achievements(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_sync_queue_table ON sync_queue(table_name);`,
    ];

    for (const sql of statements) {
      await db.execAsync(sql);
    }

    // Run migrations for existing databases (add columns that may be missing)
    // These use try-catch because ALTER TABLE ADD COLUMN fails if column exists
    const migrations: string[] = [
      // Add supabase_id to daily_checkins for sync tracking
      `ALTER TABLE daily_checkins ADD COLUMN supabase_id TEXT;`,
      // Add updated_at to daily_checkins for conflict resolution
      `ALTER TABLE daily_checkins ADD COLUMN updated_at TEXT NOT NULL DEFAULT (datetime('now'));`,
    ];

    for (const migration of migrations) {
      try {
        await db.execAsync(migration);
      } catch {
        // Column likely already exists, ignore
      }
    }
  })();

  initPromises.set(key, initPromise);
  try {
    await initPromise;
    initializedAdapters.add(key);
  } finally {
    initPromises.delete(key);
  }
}

/**
 * Clear all local data (used for logout or account deletion)
 */
export async function clearDatabase(db: StorageAdapter): Promise<void> {
  await db.execAsync(`
    DELETE FROM sync_queue;
    DELETE FROM achievements;
    DELETE FROM step_work;
    DELETE FROM daily_checkins;
    DELETE FROM journal_entries;
    DELETE FROM user_profile;
  `);
}
