/**
 * Platform-agnostic secure storage
 * Automatically selects native (mobile) or web implementation
 */

import { Platform } from 'react-native';
import type { SecureStorageAdapter } from './types';

// Export types
export type { SecureStorageAdapter } from './types';

let adapter: SecureStorageAdapter | null = null;

/**
 * Get secure storage adapter for current platform
 */
async function getAdapter(): Promise<SecureStorageAdapter> {
  if (adapter) return adapter;

  if (Platform.OS === 'web') {
    const { WebSecureStorageAdapter } = await import('./web');
    adapter = new WebSecureStorageAdapter();
  } else {
    const { NativeSecureStorageAdapter } = await import('./native');
    adapter = new NativeSecureStorageAdapter();
  }

  return adapter;
}

/**
 * Platform-agnostic secure storage API
 */
export const secureStorage = {
  async getItemAsync(key: string): Promise<string | null> {
    const adapter = await getAdapter();
    return adapter.getItemAsync(key);
  },

  async setItemAsync(key: string, value: string): Promise<void> {
    const adapter = await getAdapter();
    return adapter.setItemAsync(key, value);
  },

  async deleteItemAsync(key: string): Promise<void> {
    const adapter = await getAdapter();
    return adapter.deleteItemAsync(key);
  },
};
