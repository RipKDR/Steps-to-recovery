import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import { SQLiteProvider, SQLiteDatabase } from 'expo-sqlite';
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

  // Mobile: Use SQLiteProvider
  return (
    <SQLiteProvider
      databaseName="recovery.db"
      onInit={async (db: SQLiteDatabase) => {
        const adapter = await createStorageAdapter(db);
        await initDatabase(adapter);
      }}
    >
      <MobileDatabaseProvider>{children}</MobileDatabaseProvider>
    </SQLiteProvider>
  );
}

/**
 * Mobile database provider (wraps SQLiteProvider context)
 */
function MobileDatabaseProvider({ children }: DatabaseProviderProps): React.ReactElement {
  const [adapter, setAdapter] = useState<StorageAdapter | null>(null);

  useEffect(() => {
    async function setupAdapter() {
      // Get SQLite database from expo-sqlite context
      const { default: SQLite } = await import('expo-sqlite');
      const db = await SQLite.openDatabaseAsync('recovery.db');
      const storageAdapter = await createStorageAdapter(db);
      setAdapter(storageAdapter);
    }
    setupAdapter();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db: adapter, isReady: adapter !== null }}>
      {children}
    </DatabaseContext.Provider>
  );
}

/**
 * Web database provider (creates IndexedDB adapter)
 */
function WebDatabaseProvider({ children }: DatabaseProviderProps): React.ReactElement {
  const [adapter, setAdapter] = useState<StorageAdapter | null>(null);

  useEffect(() => {
    async function setupAdapter() {
      const storageAdapter = await createStorageAdapter();
      await initDatabase(storageAdapter);
      setAdapter(storageAdapter);
    }
    setupAdapter();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db: adapter, isReady: adapter !== null }}>
      {children}
    </DatabaseContext.Provider>
  );
}
