import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { DatabaseProvider } from './src/contexts/DatabaseContext';
import { SyncProvider } from './src/contexts/SyncContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <AuthProvider>
          <SyncProvider>
            <RootNavigator />
            <StatusBar style="auto" />
          </SyncProvider>
        </AuthProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}
