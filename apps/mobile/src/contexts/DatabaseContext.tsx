import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import { initDatabase, clearDatabase } from '../utils/database';

interface DatabaseState {
  db: SQLite.SQLiteDatabase | null;
  isReady: boolean;
  error: Error | null;
}

interface DatabaseContextType extends DatabaseState {
  reinitialize: () => Promise<void>;
  clear: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DatabaseState>({
    db: null,
    isReady: false,
    error: null,
  });

  const setupDatabase = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isReady: false, error: null }));
      const database = await initDatabase();
      setState({ db: database, isReady: true, error: null });
    } catch (error) {
      console.error('Failed to initialize database:', error);
      setState(prev => ({
        ...prev,
        isReady: false,
        error: error instanceof Error ? error : new Error('Database initialization failed'),
      }));
    }
  }, []);

  useEffect(() => {
    setupDatabase();
  }, [setupDatabase]);

  const reinitialize = useCallback(async () => {
    await setupDatabase();
  }, [setupDatabase]);

  const clear = useCallback(async () => {
    if (!state.db) {
      throw new Error('Database not initialized');
    }
    await clearDatabase(state.db);
  }, [state.db]);

  const value: DatabaseContextType = {
    ...state,
    reinitialize,
    clear,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
