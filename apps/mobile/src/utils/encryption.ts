import * as Crypto from 'expo-crypto';
import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';
import { secureStorage } from '../adapters/secureStorage';

const ENCRYPTION_KEY_NAME = 'journal_encryption_key';
const KEY_DERIVATION_ITERATIONS = 100000;

/**
 * Get random bytes in a platform-agnostic way
 */
async function getRandomBytes(length: number): Promise<Uint8Array> {
  if (Platform.OS === 'web') {
    return crypto.getRandomValues(new Uint8Array(length));
  } else {
    return await Crypto.getRandomBytesAsync(length);
  }
}

/**
 * Generate random UUID in a platform-agnostic way
 */
function generateUUID(): string {
  if (Platform.OS === 'web') {
    return crypto.randomUUID();
  } else {
    return Crypto.randomUUID();
  }
}

export async function generateEncryptionKey(): Promise<string> {
  const randomBytes = await getRandomBytes(32);
  const randomString = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const salt = generateUUID();
  const derivedKey = CryptoJS.PBKDF2(randomString, salt, { keySize: 256 / 32, iterations: KEY_DERIVATION_ITERATIONS }).toString();
  await secureStorage.setItemAsync(ENCRYPTION_KEY_NAME, derivedKey);
  await secureStorage.setItemAsync(`${ENCRYPTION_KEY_NAME}_salt`, salt);
  return derivedKey;
}

export async function getEncryptionKey(): Promise<string | null> {
  return await secureStorage.getItemAsync(ENCRYPTION_KEY_NAME);
}

export async function encryptContent(content: string): Promise<string> {
  const key = await getEncryptionKey();
  if (!key) throw new Error('Encryption key not found');
  const ivBytes = await getRandomBytes(16);
  const iv = Array.from(ivBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const ivWordArray = CryptoJS.enc.Hex.parse(iv);
  const keyWordArray = CryptoJS.enc.Hex.parse(key);
  const encrypted = CryptoJS.AES.encrypt(content, keyWordArray, { iv: ivWordArray, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return `${iv}:${encrypted.toString()}`;
}

export async function decryptContent(encrypted: string): Promise<string> {
  const key = await getEncryptionKey();
  if (!key) throw new Error('Encryption key not found');
  const [iv, ciphertext] = encrypted.split(':');
  if (!iv || !ciphertext) throw new Error('Invalid format');
  const ivWordArray = CryptoJS.enc.Hex.parse(iv);
  const keyWordArray = CryptoJS.enc.Hex.parse(key);
  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyWordArray, { iv: ivWordArray, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  if (!plaintext) throw new Error('Decryption failed');
  return plaintext;
}

export async function deleteEncryptionKey(): Promise<void> {
  await secureStorage.deleteItemAsync(ENCRYPTION_KEY_NAME);
  await secureStorage.deleteItemAsync(`${ENCRYPTION_KEY_NAME}_salt`);
}

export async function hasEncryptionKey(): Promise<boolean> {
  const key = await getEncryptionKey();
  return key !== null && key.length > 0;
}
