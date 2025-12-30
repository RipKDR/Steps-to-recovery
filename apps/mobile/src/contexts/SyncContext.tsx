import React, { createContext, useContext, useState } from 'react';

interface SyncContextType {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingCount: number;
  triggerSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      // Sync logic will be implemented in Phase 2
      // For now, just update the last sync time
      setLastSyncTime(new Date());
      setPendingCount(0);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const value = {
    isSyncing,
    lastSyncTime,
    pendingCount,
    triggerSync,
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
