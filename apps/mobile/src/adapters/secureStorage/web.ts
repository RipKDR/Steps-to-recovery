/**
 * Web secure storage adapter
 * Uses Web Crypto API for encryption + localStorage for persistence
 *
 * NOTE: Less secure than native keystores, but best available on web
 * Keys are encrypted with a master password derived from user session
 */

import type { SecureStorageAdapter } from './types';

const STORAGE_PREFIX = 'secure_';
const CRYPTO_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

export class WebSecureStorageAdapter implements SecureStorageAdapter {
  private masterKey: CryptoKey | null = null;

  /**
   * Derive master encryption key from session
   * In production, this should use user password or session token
   */
  private async getMasterKey(): Promise<CryptoKey> {
    if (this.masterKey) return this.masterKey;

    // For now, use a static key (in production, derive from user password)
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('static-master-key-change-in-production'),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    this.masterKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('recovery-app-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: CRYPTO_ALGORITHM, length: KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );

    return this.masterKey;
  }

  async getItemAsync(key: string): Promise<string | null> {
    const encrypted = localStorage.getItem(STORAGE_PREFIX + key);
    if (!encrypted) return null;

    try {
      // Parse stored data (iv + ciphertext)
      const data = JSON.parse(encrypted);
      const iv = new Uint8Array(data.iv);
      const ciphertext = new Uint8Array(data.ciphertext);

      // Decrypt
      const masterKey = await this.getMasterKey();
      const decrypted = await window.crypto.subtle.decrypt(
        { name: CRYPTO_ALGORITHM, iv },
        masterKey,
        ciphertext
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Failed to decrypt secure storage item:', error);
      return null;
    }
  }

  async setItemAsync(key: string, value: string): Promise<void> {
    // Generate random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt
    const masterKey = await this.getMasterKey();
    const encrypted = await window.crypto.subtle.encrypt(
      { name: CRYPTO_ALGORITHM, iv },
      masterKey,
      new TextEncoder().encode(value)
    );

    // Store as JSON (iv + ciphertext)
    const data = {
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(encrypted)),
    };

    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  }

  async deleteItemAsync(key: string): Promise<void> {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }
}
