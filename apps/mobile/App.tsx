import React, { Suspense } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SQLiteProvider } from 'expo-sqlite';
import { AuthProvider } from './src/contexts/AuthContext';
import { SyncProvider } from './src/contexts/SyncContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initDatabase } from './src/utils/database';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function LoadingFallback(): React.ReactElement {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function App(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <PaperProvider>
          <Suspense fallback={<LoadingFallback />}>
            <SQLiteProvider databaseName="recovery.db" onInit={initDatabase}>
              <AuthProvider>
                <SyncProvider>
                  <RootNavigator />
                  <StatusBar style="auto" />
                </SyncProvider>
              </AuthProvider>
            </SQLiteProvider>
          </Suspense>
        </PaperProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
