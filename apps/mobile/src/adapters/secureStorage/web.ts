/**
 * Web secure storage adapter
 * Uses Web Crypto API for encryption + localStorage for persistence
 *
 * ⚠️ SECURITY LIMITATIONS ON WEB PLATFORM:
 * 
 * 1. **No Hardware-Backed Keystore**: Unlike native platforms (iOS Keychain, Android Keystore),
 *    the web has no access to hardware-backed secure storage. All encryption keys must be
 *    stored in browser storage (localStorage/IndexedDB).
 * 
 * 2. **Salt Storage**: The encryption salt is stored in localStorage alongside encrypted data.
 *    While this reduces security compared to truly separate storage, it's the best available
 *    option on web. The salt is still valuable as it prevents rainbow table attacks.
 * 
 * 3. **Session Token Derivation**: Master key is derived from the session token, meaning
 *    anyone with access to the session can decrypt stored data. This is acceptable because:
 *    - Session tokens are already sensitive and protected
 *    - Web apps fundamentally cannot hide secrets from client-side code
 *    - RLS (Row Level Security) on Supabase provides server-side protection
 * 
 * 4. **XSS Vulnerability**: If an attacker gains XSS access, they can read localStorage
 *    and decrypt data. This is an inherent limitation of web security.
 * 
 * **RECOMMENDATION**: For maximum security, use native mobile apps. Web version should
 * be considered a convenience feature with reduced security guarantees.
 * 
 * **What This Implementation Provides**:
 * - Protection against casual browsing of localStorage (data is encrypted)
 * - Defense against database dumps (encrypted at rest)
 * - Per-user encryption keys (users can't decrypt each other's data)
 * 
 * **What It Cannot Provide**:
 * - Protection against sophisticated XSS attacks
 * - Hardware-backed key storage
 * - Protection if session token is compromised
 */

import type { SecureStorageAdapter } from './types';
import { logger } from '../../utils/logger';

const STORAGE_PREFIX = 'secure_';
const CRYPTO_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const SALT_STORAGE_KEY = '_master_key_salt';

export class WebSecureStorageAdapter implements SecureStorageAdapter {
  private masterKey: CryptoKey | null = null;
  private userId: string | null = null;
  private sessionToken: string | null = null;

  /**
   * Initialize storage with user session (REQUIRED before use)
   * Derives a user-specific master key from the session token
   */
  async initializeWithSession(userId: string, sessionToken: string): Promise<void> {
    // Clear old key if switching users
    if (this.userId !== userId) {
      this.masterKey = null;
    }

    this.userId = userId;
    this.sessionToken = sessionToken;

    // Derive new master key immediately
    await this.getMasterKey();
  }

  /**
   * Clear session and master key (call on logout)
   * Also clears the stored salt for the user
   */
  clearSession(): void {
    // Clear stored salt for this user
    if (this.userId) {
      const saltKey = `${STORAGE_PREFIX}${this.userId}${SALT_STORAGE_KEY}`;
      localStorage.removeItem(saltKey);
    }

    this.masterKey = null;
    this.userId = null;
    this.sessionToken = null;
  }

  /**
   * Get or generate a random salt for key derivation
   * 
   * Salt is stored in localStorage alongside encrypted data. While this means
   * an attacker with localStorage access also has the salt, it still provides
   * value by preventing rainbow table attacks and ensuring each user has unique
   * key derivation.
   * 
   * NOTE: This is a necessary trade-off for web platform - there is no separate
   * secure storage available in browsers.
   */
  private async getSalt(): Promise<Uint8Array> {
    if (!this.userId) {
      throw new Error('UserId required to get salt');
    }

    const saltKey = `${STORAGE_PREFIX}${this.userId}${SALT_STORAGE_KEY}`;
    const storedSalt = localStorage.getItem(saltKey);

    if (storedSalt) {
      // Reconstruct Uint8Array from stored JSON array
      return new Uint8Array(JSON.parse(storedSalt));
    }

    // Generate new random salt (32 bytes)
    const salt = window.crypto.getRandomValues(new Uint8Array(32));

    // Store as JSON array
    localStorage.setItem(saltKey, JSON.stringify(Array.from(salt)));

    return salt;
  }

  /**
   * Derive master encryption key from user's session token
   * Each user gets a unique key derived from their session + random salt
   */
  private async getMasterKey(): Promise<CryptoKey> {
    if (this.masterKey) return this.masterKey;

    if (!this.sessionToken || !this.userId) {
      throw new Error('SecureStorage not initialized. Call initializeWithSession() first.');
    }

    // Import session token as key material
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.sessionToken),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // Use random salt (generated once per user, then stored)
    const saltArray = await this.getSalt();
    const salt = saltArray.buffer as ArrayBuffer;

    this.masterKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
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
      const data = JSON.parse(encrypted) as { iv: number[]; ciphertext: number[] };
      const iv = new Uint8Array(data.iv);
      const ciphertext = new Uint8Array(data.ciphertext);

      // Decrypt
      const masterKey = await this.getMasterKey();
      const decrypted = await window.crypto.subtle.decrypt(
        { name: CRYPTO_ALGORITHM, iv },
        masterKey,
        ciphertext.buffer as ArrayBuffer
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      // Use sanitized logger to prevent data leaks
      logger.error('Failed to decrypt secure storage item', error);
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
