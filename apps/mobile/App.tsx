import React, { Suspense, useState, useMemo, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './src/design-system';
import { DatabaseProvider } from './src/contexts/DatabaseContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { SyncProvider } from './src/contexts/SyncContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}

function LoadingFallback(): React.ReactElement {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function App(): React.ReactElement {
  // Key used to force a full remount of the app tree on error recovery
  const [resetKey, setResetKey] = useState(0);

  // Create a fresh QueryClient whenever the app resets
  const queryClient = useMemo(() => createQueryClient(), [resetKey]);

  // Callback to trigger a full app remount
  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
  }, []);

  return (
    <ErrorBoundary key={resetKey} onReset={handleReset}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <Suspense fallback={<LoadingFallback />}>
              <DatabaseProvider>
                <AuthProvider>
                  <SyncProvider>
                    <NotificationProvider>
                      <RootNavigator />
                      <StatusBar style="auto" />
                    </NotificationProvider>
                  </SyncProvider>
                </AuthProvider>
              </DatabaseProvider>
            </Suspense>
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
