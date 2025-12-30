import React, { createContext, useContext, useState, useCallback } from 'react';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingCount: number;
  error: Error | null;
}

interface SyncContextType extends SyncState {
  triggerSync: () => Promise<void>;
  clearError: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: null,
    pendingCount: 0,
    error: null,
  });

  const triggerSync = useCallback(async () => {
    setState(prev => ({ ...prev, isSyncing: true, error: null }));
    try {
      // Sync logic will be implemented in Phase 2
      // For now, simulate a sync operation
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        pendingCount: 0,
      }));
    } catch (error) {
      console.error('Sync failed:', error);
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error : new Error('Sync failed'),
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const value: SyncContextType = {
    ...state,
    triggerSync,
    clearError,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
