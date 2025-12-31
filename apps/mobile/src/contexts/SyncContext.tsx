import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useSQLiteContext } from 'expo-sqlite';
import { processSyncQueue } from '../services/syncService';
import { useAuth } from './AuthContext';
import { logger } from '../utils/logger';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingCount: number;
  error: Error | null;
  isOnline: boolean;
}

interface SyncContextType extends SyncState {
  triggerSync: () => Promise<void>;
  clearError: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const { user } = useAuth();
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: null,
    pendingCount: 0,
    error: null,
    isOnline: false,
  });

  /**
   * Update pending count from sync_queue
   */
  const updatePendingCount = useCallback(async () => {
    if (!user) return;

    try {
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM sync_queue WHERE retry_count < 3'
      );
      setState((prev) => ({ ...prev, pendingCount: result?.count || 0 }));
    } catch (error) {
      logger.error('Failed to update pending count', error);
    }
  }, [db, user]);

  /**
   * Trigger sync operation
   */
  const triggerSync = useCallback(async () => {
    if (!user) {
      logger.warn('Cannot sync: no user logged in');
      return;
    }

    if (!state.isOnline) {
      logger.info('Cannot sync: device is offline');
      setState((prev) => ({
        ...prev,
        error: new Error('Cannot sync while offline'),
      }));
      return;
    }

    if (state.isSyncing) {
      logger.info('Sync already in progress, skipping');
      return;
    }

    setState((prev) => ({ ...prev, isSyncing: true, error: null }));

    try {
      logger.info('Starting sync process');
      const result = await processSyncQueue(db, user.id);

      logger.info('Sync complete', {
        synced: result.synced,
        failed: result.failed,
      });

      setState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        error: result.errors.length > 0 ? new Error(result.errors.join(', ')) : null,
      }));

      // Update pending count after sync
      await updatePendingCount();
    } catch (error) {
      logger.error('Sync failed', error);
      setState((prev) => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error : new Error('Sync failed'),
      }));
    }
  }, [db, user, state.isOnline, state.isSyncing, updatePendingCount]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Set up network listener
   */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected === true && state.isInternetReachable === true;

      setState((prev) => {
        const wasOffline = !prev.isOnline;
        const nowOnline = isOnline;

        logger.info('Network state changed', {
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
        });

        // Trigger sync when coming back online
        if (nowOnline && wasOffline && user) {
          logger.info('Device came online, triggering sync');
          triggerSync();
        }

        return { ...prev, isOnline };
      });
    });

    return () => unsubscribe();
  }, [user, triggerSync]);

  /**
   * Set up periodic background sync (every 5 minutes when online)
   */
  useEffect(() => {
    if (!user) return;

    // Initial pending count
    updatePendingCount();

    // Set up interval for periodic sync
    syncIntervalRef.current = setInterval(() => {
      if (state.isOnline && !state.isSyncing) {
        logger.info('Periodic sync triggered');
        triggerSync();
      }
    }, SYNC_INTERVAL_MS);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [user, state.isOnline, state.isSyncing, triggerSync, updatePendingCount]);

  /**
   * Set up AppState listener to sync when app comes to foreground
   */
  useEffect(() => {
    if (!user) return;

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && state.isOnline && !state.isSyncing) {
        logger.info('App foregrounded, triggering sync');
        triggerSync();
      }
    });

    return () => subscription.remove();
  }, [user, state.isOnline, state.isSyncing, triggerSync]);

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
