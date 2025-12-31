/**
 * Native secure storage adapter (iOS/Android)
 * Uses expo-secure-store (iOS Keychain, Android Keystore)
 */

import * as SecureStore from 'expo-secure-store';
import type { SecureStorageAdapter } from './types';

export class NativeSecureStorageAdapter implements SecureStorageAdapter {
  async getItemAsync(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  async setItemAsync(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  async deleteItemAsync(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }
}
