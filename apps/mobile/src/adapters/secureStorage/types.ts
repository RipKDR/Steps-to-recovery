/**
 * Platform-agnostic secure storage interface
 * Mobile: expo-secure-store (hardware keystore)
 * Web: Web Crypto API + encrypted localStorage
 */

export interface SecureStorageAdapter {
  /**
   * Get securely stored value
   */
  getItemAsync(key: string): Promise<string | null>;

  /**
   * Set securely stored value
   */
  setItemAsync(key: string, value: string): Promise<void>;

  /**
   * Delete securely stored value
   */
  deleteItemAsync(key: string): Promise<void>;
}
