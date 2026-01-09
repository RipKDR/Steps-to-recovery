import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { webAuthStorage } from './supabaseAuthStorage';

// Custom storage implementation for Supabase auth tokens
// Mobile: Uses expo-secure-store (device Keychain/Keystore - hardware encrypted)
// Web: Uses IndexedDB (better XSS isolation than localStorage)
//
// NOTE: Auth tokens don't need additional encryption because:
// 1. They're time-limited and automatically expire
// 2. Validated by Supabase RLS on every request
// 3. Already hashed/signed by Supabase
//
// BUT we use IndexedDB on web instead of localStorage for better security isolation
const ExpoSecureStoreAdapter = Platform.OS === 'web'
  ? {
      getItem: async (key: string) => {
        return await webAuthStorage.getItem(key);
      },
      setItem: async (key: string, value: string) => {
        await webAuthStorage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        await webAuthStorage.removeItem(key);
      },
    }
  : {
      getItem: async (key: string) => {
        return await SecureStore.getItemAsync(key);
      },
      setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
      },
      removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
      },
    };

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please create a .env file in apps/mobile/ with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
