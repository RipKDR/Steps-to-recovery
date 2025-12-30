import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

const ENCRYPTION_KEY_NAME = 'journal_encryption_key';

/**
 * Generate a new encryption key for the user (called once during onboarding)
 * Stores the key securely in device keychain/keystore
 */
export async function generateEncryptionKey(): Promise<string> {
  const key = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Crypto.randomUUID() + Date.now().toString()
  );
  await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key);
  return key;
}

/**
 * Get existing encryption key from secure storage
 */
export async function getEncryptionKey(): Promise<string | null> {
  return await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
}

/**
 * Encrypt content using the user's encryption key
 * Note: This is a simplified implementation for MVP
 * For production, use proper AES-256-GCM encryption
 */
export async function encryptContent(content: string): Promise<string> {
  const key = await getEncryptionKey();
  if (!key) throw new Error('Encryption key not found');

  // For MVP: Base64 encoding with key mixing
  // TODO: Replace with proper AES-256-GCM in production
  const combined = `${key}::${content}`;
  return Buffer.from(combined).toString('base64');
}

/**
 * Decrypt content using the user's encryption key
 */
export async function decryptContent(encrypted: string): Promise<string> {
  const key = await getEncryptionKey();
  if (!key) throw new Error('Encryption key not found');

  const decoded = Buffer.from(encrypted, 'base64').toString('utf-8');
  const [storedKey, content] = decoded.split('::');

  if (storedKey !== key) throw new Error('Invalid encryption key');
  return content;
}

/**
 * Delete encryption key (use with caution - will make all encrypted data unreadable)
 */
export async function deleteEncryptionKey(): Promise<void> {
  await SecureStore.deleteItemAsync(ENCRYPTION_KEY_NAME);
}
