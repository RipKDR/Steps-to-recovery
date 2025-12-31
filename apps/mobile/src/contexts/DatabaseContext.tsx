import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import { createStorageAdapter, StorageAdapter } from '../adapters/storage';
import { initDatabase } from '../utils/database';

interface DatabaseContextValue {
  db: StorageAdapter | null;
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  isReady: false,
});

export function useDatabase(): DatabaseContextValue {
  return useContext(DatabaseContext);
}

interface DatabaseProviderProps {
  children: ReactNode;
}

/**
 * Platform-agnostic database provider
 * - Mobile: Uses SQLiteProvider with expo-sqlite
 * - Web: Uses IndexedDB adapter
 */
export function DatabaseProvider({ children }: DatabaseProviderProps): React.ReactElement {
  if (Platform.OS === 'web') {
    return <WebDatabaseProvider>{children}</WebDatabaseProvider>;
  }

  // Mobile: Use SQLiteProvider (lazy loaded)
  return <MobileDatabaseProvider>{children}</MobileDatabaseProvider>;
}

/**
 * Mobile database provider (uses SQLiteProvider from expo-sqlite)
 */
function MobileDatabaseProvider({ children }: DatabaseProviderProps): React.ReactElement {
  const [adapter, setAdapter] = useState<StorageAdapter | null>(null);
  const [SQLiteProviderComponent, setSQLiteProviderComponent] = useState<any>(null);

  useEffect(() => {
    async function loadSQLite() {
      // Dynamically import expo-sqlite (only works on mobile)
      const { SQLiteProvider } = await import('expo-sqlite');
      setSQLiteProviderComponent(() => SQLiteProvider);
    }
    loadSQLite();
  }, []);

  // Wait for SQLiteProvider to load
  if (!SQLiteProviderComponent) {
    return <></>;
  }

  const SQLiteProviderElement = SQLiteProviderComponent;

  return (
    <SQLiteProviderElement
      databaseName="recovery.db"
      onInit={async (db: any) => {
        const storageAdapter = await createStorageAdapter(db);
        await initDatabase(storageAdapter);
        setAdapter(storageAdapter);
      }}
    >
      <DatabaseContext.Provider value={{ db: adapter, isReady: adapter !== null }}>
        {children}
      </DatabaseContext.Provider>
    </SQLiteProviderElement>
  );
}

/**
 * Web database provider (creates IndexedDB adapter)
 */
function WebDatabaseProvider({ children }: DatabaseProviderProps): React.ReactElement {
  const [adapter, setAdapter] = useState<StorageAdapter | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function setupAdapter() {
      try {
        console.log('[DatabaseContext] Web: Initializing IndexedDB adapter...');
        const storageAdapter = await createStorageAdapter();
        console.log('[DatabaseContext] Web: Adapter created, initializing database schema...');
        await initDatabase(storageAdapter);
        console.log('[DatabaseContext] Web: Database initialized successfully');
        setAdapter(storageAdapter);
      } catch (err) {
        console.error('[DatabaseContext] Web: Failed to initialize database:', err);
        setError(err as Error);
        // Set a dummy adapter to unblock the app for now
        setAdapter({} as StorageAdapter);
      }
    }
    setupAdapter();
  }, []);

  if (error) {
    console.warn('[DatabaseContext] Web: Running with error, database operations may fail');
  }

  return (
    <DatabaseContext.Provider value={{ db: adapter, isReady: adapter !== null }}>
      {children}
    </DatabaseContext.Provider>
  );
}
